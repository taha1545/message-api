const messageSocket = require('./MessageSocket');
const FriendSocket = require('./FriendSocket');
const onlineUserSocket = require('./OnlineUserSocket');
const callSocket = require('./callSocket');

module.exports = (io) => {

    messageSocket(io);
    FriendSocket(io);
    onlineUserSocket(io);
    callSocket(io);

    io.on('connection', (socket) => {
        //
        socket.on('disconnect', () => {
        });
    });
};
