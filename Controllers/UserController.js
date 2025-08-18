const UserResource = require('../app/Resource/UserResource');
const db = require('../db/models');
const notfoundError = require('../app/Error/NotFoundError');
const { Op } = require('sequelize');
const handleJsonImage = require("../app/Services/handleJsonImage");


const getUserByToken = async (req, res, next) => {
    try {
        const user = await db.User.findByPk(req.user.id);
        //
        if (!user) throw new notfoundError('User not found');
        //
        res.status(200).json({
            success: true,
            user: UserResource(user)
        });
        //
    } catch (err) {
        next(err);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        //
        if (!user) throw new notfoundError('User not found');
        //
        res.status(200).json({
            success: true,
            user: UserResource(user)
        });
        //
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const offset = (page - 1) * limit;
        //
        const { count, rows } = await db.User.findAndCountAll({
            limit,
            offset,
        });
        //
        res.status(200).json({
            success: true,
            users: rows.map(data => UserResource(data)),
            pagination: {
                total: count,
                page,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};


const updateUserByToken = async (req, res, next) => {
    try {
        const user = await db.User.findByPk(req.user.id);
        if (!user) throw new notfoundError('User not found');
        //
        const allowedUpdates = ['name', 'email'];
        allowedUpdates.forEach((field) => {
            if (req.body[field]) user[field] = req.body[field];
        });
       if (req.body.image) {
            await handleJsonImage(user, req.body.image);
        }
        //
        await user.save();
        //
        res.status(200).json({
            success: true,
            message: 'User updated',
            user: UserResource(user)
        });
        //
    } catch (err) {
        next(err);
    }
};

const deleteUserById = async (req, res, next) => {
    try {
        //
        const { id } = req.params;
        const user = await db.User.findByPk(id);
        if (!user) throw new notfoundError('User not found');
        //
        await user.destroy();
        return res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
        //
    } catch (err) {
        next(err);
    }
};

const search = async (req, res, next) => {
    try {
        let { query } = req.query;
        if (!query) return next(new NotFoundError('Query parameter is required'));
        //
        query = query.trim();
        //
        const users = await db.User.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${query}%` } },
                    { email: { [Op.iLike]: `%${query}%` } }
                ]
            },
            limit: 10
        });
        //
        res.status(200).json({
            success: true,
            users: users.map(user => UserResource(user))
        });
    } catch (err) {
        next(err);
    }
};



module.exports = {
    getUserById,
    getUserByToken,
    getAllUsers,
    updateUserByToken,
    deleteUserById,
    search
};
