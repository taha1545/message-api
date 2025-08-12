const { Op } = require('sequelize');
const db = require('../db/models');
const MessageResource = require('../app/Resource/MessageResource');
const NotFoundError = require('../app/Error/NotFoundError');
const AuthorizeError = require('../app/Error/AuthorizeError');
const { getRoomId } = require('../app/Services/roomUtils');


const All = async (req, res, next) => {
    try {
        //
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        //
        const userId = req.user.id;
        const profileId = parseInt(req.query.userId);
        if (!profileId) {
            return next(new NotFoundError('Profile userId is required'));
        }
        //
        const { count, rows } = await db.Message.findAndCountAll({
            offset,
            limit,
            where: {
                [Op.or]: [
                    { fromId: userId, toId: profileId },
                    { fromId: profileId, toId: userId }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        //
        return res.status(200).json({
            success: true,
            message: "Messages retrieved successfully",
            data: rows.map(msg => MessageResource(msg)),
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });
        //
    } catch (err) {
        err.message = "Error fetching messages: " + err.message;
        next(err);
    }
};


const Create = async (req, res, next) => {
    try {
        const fromId = req.user.id;
        const { toId, message } = req.body;
        //
        const newMessage = await db.Message.create({ fromId, toId, message });
        //
        const roomId = getRoomId(fromId, toId);
        req.io.of('/chat')
            .to(roomId)
            .emit('newMessage', MessageResource(newMessage));
        //
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: MessageResource(newMessage)
        });

    } catch (err) {
        err.message = "Error creating message: " + err.message;
        next(err);
    }
};


const Update = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { message } = req.body;
        const messageId = parseInt(req.params.id);
        //
        const msg = await db.Message.findByPk(messageId);
        if (!msg) {
            return next(new NotFoundError('Message not found'));
        }
        //
        if (msg.fromId !== userId) {
            return next(new AuthorizeError('You can only edit your own messages'));
        }
        //
        msg.message = message || msg.message;
        await msg.save();
        //
        return res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: MessageResource(msg)
        });

    } catch (err) {
        err.message = "Error updating message: " + err.message;
        next(err);
    }
};


const Delete = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const messageId = parseInt(req.params.id);
        //
        const msg = await db.Message.findByPk(messageId);
        if (!msg) {
            return next(new NotFoundError('Message not found'));
        }
        //
        if (msg.fromId !== userId) {
            return next(new AuthorizeError('You can only delete your own messages'));
        }
        //
        await msg.destroy();
        //
        return res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
        //
    } catch (err) {
        err.message = "Error deleting message: " + err.message;
        next(err);
    }
};

module.exports = {
    All,
    Create,
    Update,
    Delete
};
