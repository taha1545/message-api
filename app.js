require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const db = require('./db/models');
const ErrorHandler = require('./app/Middlewares/Handle');
const UserRouter = require('./Routes/AuthRoute');
const GoogleRouter = require('./Routes/GoogleRoute');
const contactRoutes = require('./Routes/ContactRoute');
//
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Routes
app.use('/users', UserRouter);
app.use('/auth', GoogleRouter);
app.use('/api/contacts', contactRoutes);
// 
app.get('/', (req, res) => { res.json({ message: 'Welcome to the user + contact template API', token: req.query.token || null, }); });
app.use((req, res) => { res.status(404).json({ message: 'No endpoint found for this request', }); });

// error handler
app.use(ErrorHandler);

//   
const PORT = process.env.APP_PORT;
db.sequelize
    .sync()
    .then(() => {
        console.log(' Database connected ');
        app.listen(PORT, () => {
            console.log(` Server is running `);
        });
    })
    .catch((err) => {
        console.error(' err to DB:', err);
    });
