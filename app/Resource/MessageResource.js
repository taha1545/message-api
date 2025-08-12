const dayjs = require('dayjs');

module.exports = (message) => {
    return {
        id: message.id,
        fromId: message.fromId,
        toId: message.toId,
        message: message.message,
        createdAt: dayjs(message.createdAt).format('YYYY-MM-DD HH:mm:ss'),
    }
};