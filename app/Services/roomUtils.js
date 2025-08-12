

function getRoomId(userId1, userId2) {
    const sorted = [userId1, userId2].sort((a, b) => a - b);
    return `room-${sorted[0]}_${sorted[1]}`;
}

module.exports = { getRoomId };
