const { body } = require('express-validator');
const db = require('../../db/models');

const createMessageValidation = [
    body('toId')
        .notEmpty().withMessage('Receiver ID (toId) is required')
        .isInt().withMessage('Receiver ID must be an integer')
        .custom(async (toId, { req }) => {
            if (parseInt(toId) === parseInt(req.body.fromId)) {
                throw new Error('Sender and receiver cannot be the same');
            }
            const receiver = await db.User.findByPk(toId);
            if (!receiver) {
                throw new Error('Receiver does not exist');
            }
        }),

    body('message')
        .notEmpty().withMessage('Message content is required')
        .isString().withMessage('Message must be a string')
        .isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
];

module.exports = {
    createMessageValidation,
};
