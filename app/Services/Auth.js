require('dotenv').config();

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;
const JWT_LIFETIME = process.env.JWT_LIFETIME || '30d';

const AuthError = require('../Error/AuthError');

const CreateToken = (payload) => {
    try {
        return jwt.sign(payload, SECRET, { expiresIn: JWT_LIFETIME });
    } catch (err) {
        //
        throw new Error("AUTH SIGN TOKEN ERROR: " + err.message);
    }
};

const ValidateToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
        //
    } catch (err) {
        throw new AuthError("INVALID TOKEN: " + err.message);
    }
};


module.exports = {
    CreateToken,
    ValidateToken
};



