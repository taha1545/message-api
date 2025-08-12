const socketAuth = require('../app/Middlewares/SocketAuth');
const onlineUsers = require('./userMap');

module.exports = (io) => {
    const onlineUserNamespace = io.of('/User');

    onlineUserNamespace.use(socketAuth);

    onlineUserNamespace.on('connection', (socket) => {
        const userId = socket.user.id;

        // 
        onlineUsers.set(userId, {
            socketId: socket.id,
            lastSeen: null
        });

        console.log(`✅ User ${userId} connected`);

        socket.on('disconnect', () => {
            onlineUsers.set(userId, {
                socketId: null,
                lastSeen: new Date().toISOString()
            });
            console.log(`❌ User ${userId} disconnected`);
        });
    });
};
