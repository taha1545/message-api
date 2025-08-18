require('dotenv').config();
//
const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
const helmet = require('helmet');
const bodyParser = require('body-parser');   // ✅ fixed import
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
//
const db = require('./db/models');
const ErrorHandler = require('./app/Middlewares/Handle');
const UserRouter = require('./Routes/AuthRoute');
const GoogleRouter = require('./Routes/GoogleRoute');
const contactRoutes = require('./Routes/ContactRoute');
const MessageRoutes = require('./Routes/MessageRoute');
const FriendRoute = require('./Routes/FriendRoute');
const getCorsOptions = require('./app/Services/corsOptions');
//
const socketInit = require('./socket');
const app = express();
const server = http.createServer(app);
//
const { Server } = require('socket.io');
const { get } = require('./socket/userMap');
const io = new Server(server, {
  cors: {
    origin: ["http://127.0.0.1:3000", "https://your-frontend-domain.com"], // ✅ explicit origins
    methods: ["GET", "POST"],
    credentials: true  // ✅ allow credentials
  }
});

socketInit(io);
//
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});

// Middleware
app.use(cors(getCorsOptions()));
app.use(helmet());

// ✅ increase payload limit (change to 20mb, 50mb if needed)
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);
app.use((req, res, next) => { req.io = io; next(); });
app.use(limiter);
app.use(morgan('combined'));

// Routes
app.use('/users', UserRouter);
app.use('/auth', GoogleRouter);
app.use('/api/contacts', contactRoutes);
app.use('/api/message', MessageRoutes);
app.use('/api/friends', FriendRoute);

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the message API',
        token: req.query.token || null,
        io: !!req.io
    });
});

app.use((req, res) => {
    res.status(404).json({ message: 'No endpoint found for this request' });
});

// Error handler
app.use(ErrorHandler);

// Start Server
const PORT = process.env.APP_PORT || 5000;
db.sequelize.sync()
    .then(() => {
        console.log('✅ Database connected');
        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Error to DB:', err);
    });
