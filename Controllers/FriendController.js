const { Op } = require('sequelize');
const db = require('../db/models');
const FriendResource = require('../app/Resource/FriendResource');
const NotFoundError = require('../app/Error/NotFoundError');
const AuthorizeError = require('../app/Error/AuthorizeError');


const All = async (req, res, next) => {
    //
    try {
        const userId = req.user.id;
        const status = req.query.status || 'accepted';
        //
        if (!['accepted', 'pending', 'rejected'].includes(status)) {
            return next(new NotFoundError('Invalid status provided'));
        }
        //
        const friends = await db.Friend.findAll({
            where: {
                [Op.or]: [
                    { userId, status: 'accepted' },
                    { friendId: userId, status: 'accepted' }
                ]
            },
            include: [
                {
                    model: db.User,
                    as: 'senderFriend',
                    include: [
                        {
                            model: db.Message,
                            as: 'sentMessages',
                            where: {
                                toId: userId
                            },
                            required: false,
                            limit: 1,
                            order: [['createdAt', 'DESC']]
                        },
                        {
                            model: db.Message,
                            as: 'receivedMessages',
                            where: {
                                fromId: userId
                            },
                            required: false,
                            limit: 1,
                            order: [['createdAt', 'DESC']]
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'receiverFriend',
                    include: [
                        {
                            model: db.Message,
                            as: 'sentMessages',
                            where: {
                                toId: userId
                            },
                            required: false,
                            limit: 1,
                            order: [['createdAt', 'DESC']]
                        },
                        {
                            model: db.Message,
                            as: 'receivedMessages',
                            where: {
                                fromId: userId
                            },
                            required: false,
                            limit: 1,
                            order: [['createdAt', 'DESC']]
                        }
                    ]
                }
            ]
        });
        //
        return res.status(200).json({
            success: true,
            message: "Friends retrieved successfully",
            data: friends.map(friend => FriendResource(friend, userId))
        });

    } catch (err) {
        err.message = "Error fetching friends: " + err.message;
        next(err);
    }
};

const Create = async (req, res, next) => {
    try {
        const requesterId = req.user.id;
        const { friendId } = req.body;
        //
        const friendRequest = await db.Friend.create({
            userId: requesterId,
            friendId: friendId,
            status: 'pending'
        });
        //    
        req.io.of('/friend')
            .to(`user_${friendId}`)
            .emit('friendRequestReceived', (friendRequest));
        //
        return res.status(201).json({
            success: true,
            message: "Friend request sent successfully",
            data: (friendRequest)
        });
        //
    } catch (err) {
        err.message = "Error creating friend request: " + err.message;
        next(err);
    }
};

const UpdateStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status } = req.body;
        const friendId = parseInt(req.params.id);
        //
        const request = await db.Friend.findByPk(friendId);
        if (!request) {
            return next(new NotFoundError('Friend request not found'));
        }
        //
        if (request.friendId !== userId) {
            return next(new AuthorizeError('You are not authorized to update this request'));
        }
        //
        request.status = status;
        await request.save();
        //
        if (status === 'accepted') {
            req.io.of('/friend')
                .to(`user_${request.userId}`)
                .emit('friendRequestUpdated', (request));
        }
        //
        return res.status(200).json({
            success: true,
            message: `Friend request ${status} successfully`,
            data: (request)
        });
        //
    } catch (err) {
        err.message = "Error updating friend request: " + err.message;
        next(err);
    }
};

const Delete = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const friendId = parseInt(req.params.id);
        //
        const friend = await db.Friend.findByPk(friendId);
        if (!friend) {
            return next(new NotFoundError('Friend not found'));
        }
        //
        if (![friend.requesterId, friend.addresseeId].includes(userId)) {
            return next(new AuthorizeError('You are not authorized to delete this friend'));
        }
        //
        await friend.destroy();
        //
        return res.status(200).json({
            success: true,
            message: "Friend deleted successfully"
        });

    } catch (err) {
        err.message = "Error deleting friend: " + err.message;
        next(err);
    }
};

module.exports = {
    All,
    Create,
    UpdateStatus,
    Delete
};
