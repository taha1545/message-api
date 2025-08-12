const { body, param } = require('express-validator');
const db = require('../../db/models');
const { Op } = require('sequelize');

// 
const createFriendValidation = [
    body('friendId')
        .notEmpty().withMessage('friendId is required')
        .isInt({ min: 1 }).withMessage('friendId must be a valid integer')
        .custom(async (friendId, { req }) => {
            const userId = req.user.id;

            if (userId === parseInt(friendId, 10)) {
                throw new Error('You cannot send a friend request to yourself');
            }

            const userExists = await db.User.findByPk(friendId);
            if (!userExists) {
                throw new Error('Recipient user does not exist');
            }

            const existingFriend = await db.Friend.findOne({
                where: {
                    [Op.or]: [
                        { userId, friendId },
                        { userId: friendId, friendId: userId }
                    ]
                }
            });

            if (existingFriend) {
                throw new Error('Friend request already exists or you are already friends');
            }
        })
];

// 
const updateStatusValidation = [
    param('id')
        .isInt({ min: 1 }).withMessage('Friend request ID must be a valid integer')
        .custom(async (id) => {
            const request = await db.Friend.findByPk(id);
            if (!request) {
                throw new Error('Friend request not found');
            }
        }),
    body('status')
        .notEmpty().withMessage('Status is required')
        .isIn(['accepted', 'declined']).withMessage('Status must be accepted or declined')
];

module.exports = {
    createFriendValidation,
    updateStatusValidation
};
