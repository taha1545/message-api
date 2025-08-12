
require('dotenv').config();

const express = require('express');
const Router = express.Router();

const passport = require('passport');
const Auth = require('../app/Services/Auth');
const session = require('express-session');

require('../app/Services/GoogleStrategy');

// 
Router.use(
    session({
        secret: process.env.SESSION_SECRET,
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
