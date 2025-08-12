const socketAuth = require('../app/Middlewares/SocketAuth');
const { getRoomId } = require('../app/Services/roomUtils');

module.exports = (io) => {
    //
    const chatNamespace = io.of('/chat');
    //
    chatNamespace.use(socketAuth);
    //
    chatNamespace.on('connection', (socket) => {
        // 
        socket.on('joinRoom', ({ otherUserId }) => {
            const roomId = getRoomId(socket.user.id, otherUserId);
            socket.join(roomId);
        });

        // 
        socket.on('disconnect', () => {

        });
    });
};
