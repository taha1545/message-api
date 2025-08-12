const socketAuth = require('../app/Middlewares/SocketAuth');
const onlineUsers = require('./userMap');

module.exports = (io) => {
    //
    const callNamespace = io.of('/call');

    callNamespace.use(socketAuth);

    callNamespace.on('connection', (socket) => {
        const userId = socket.user.id;

        socket.on('callUser', ({ toUserId, offer }) => {
            // 
            callNamespace.to(onlineUsers.get(toUserId)?.socketId).emit('incomingCall', {
                fromUserId: userId,
                offer,
            });
        });

        socket.on('answerCall', ({ toUserId, answer }) => {
            // 
            callNamespace.to(onlineUsers.get(toUserId)?.socketId).emit('callAnswered', {
                fromUserId: userId,
                answer,
            });
        });

        socket.on('iceCandidate', ({ toUserId, candidate }) => {
            // 
            callNamespace.to(onlineUsers.get(toUserId)?.socketId).emit('iceCandidate', {
                fromUserId: userId,
                candidate,
            });
        });

        socket.on('endCall', ({ toUserId }) => {
            // 
            callNamespace.to(onlineUsers.get(toUserId)?.socketId).emit('callEnded', {
                fromUserId: userId,
            });
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected from call namespace`);
        });
    });
};
