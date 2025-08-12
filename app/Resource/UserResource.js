const onlineUsers = require('../../socket/userMap');
module.exports = (user) => {

    const onlineUserData = onlineUsers.get(user.id);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        imagePath: user.imagePath || "",
        IsVerify: user.IsVerify,
        isOnline: onlineUserData && onlineUserData.socketId ? true : false,
        lastSeen: onlineUserData ? onlineUserData.lastSeen : null
    }
};