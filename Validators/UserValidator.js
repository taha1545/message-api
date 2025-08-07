const { body } = require('express-validator');
const db = require('../db/models');

const loginValidation = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .custom(async (email) => {
            const existingUser = await db.User.findOne({ where: { email } });
            if (!existingUser) {
                throw new Error('Email does not existe');
            }
        }),
    body('password').notEmpty().withMessage('Password is required'),
];

const signupValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    //
    body('email')
        .isEmail().withMessage('Valid email is required')
        .custom(async (email) => {
            const existingUser = await db.User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('Email is already in use');
            }
        }),
    //
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];


const resetPasswordValidation = [
    body('email')
        .isEmail().withMessage('Valid email is required')
        .custom(async (email) => {
            const existingUser = await db.User.findOne({ where: { email } });
            if (!existingUser) {
                throw new Error('Email does not existe');
            }
        }),
    //
    body('otp').notEmpty().withMessage('OTP is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
];

const updatePasswordValidation = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters'),
];

const updateUserValidation = [
    body('name')
        .optional()
        .notEmpty()
        .withMessage('Name cannot be empty'),
    //
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email address')
        .custom(async (email, { req }) => {
            //
            const userId = req.user?.id;
            //
            const existingUser = await db.User.findOne({ where: { email } });
            //
            if (existingUser && existingUser.id !== userId) {
                throw new Error('Email is already in use');
            }
        }),
];

module.exports = {
    loginValidation,
    signupValidation,
    resetPasswordValidation,
    updatePasswordValidation,
    updateUserValidation,
};
