const dayjs = require('dayjs');
const UserResource = require('./UserResource');

module.exports = (friend, currentUserId) => ({
    id: friend.id,
    userId: friend.userId,
    friendId: friend.friendId,
    status: friend.status,
    createdAt: dayjs(friend.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    friend: UserResource(
        friend.userId === currentUserId ? friend.receiverFriend : friend.senderFriend
    ),
    astMessage:
        friend.userId === currentUserId
            ? friend.receiverFriend?.sentMessages?.[0] || null
            : friend.senderFriend?.sentMessages?.[0] || null

});
