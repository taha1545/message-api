const socketAuth = require('../app/Middlewares/SocketAuth');

module.exports = (io) => {
    const FriendNamespace = io.of('/friend');

    FriendNamespace.use(socketAuth);

    FriendNamespace.on('connection', (socket) => {
        // 
        socket.join(`user_${socket.user.id}`);

        socket.on('disconnect', () => {

        });
    });
};
