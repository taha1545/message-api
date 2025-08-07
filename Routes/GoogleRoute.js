
require('dotenv').config();

const express = require('express');
const Router = express.Router();

const passport = require('passport');
const Auth = require('../Services/Auth');
const session = require('express-session');

require('../Services/GoogleStrategy');

// Session
Router.use(
    session({
        secret: process.env.SESSION_SECRET || 'defaultsecret',
        resave: false,
        saveUninitialized: false,
    })
);
// Middleware
Router.use(passport.initialize());
Router.use(passport.session());

//
Router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// 
Router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // 
        const token = Auth.CreateToken({
            id: req.user.id,
            role: req.user.role || "client"
        });
        //
        res.redirect(`${process.env.FRONT_URL_CALLBACK}?token=${token}`);
    }
);

module.exports = Router;
