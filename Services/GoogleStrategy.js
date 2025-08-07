require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('../db/models');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const welcomeMail = require('./WelcomeMail');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            //
            let user = await db.User.findOne({ where: { googleId: profile.id } });
            //
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            //
            if (!user) {
                user = await db.User.create({
                    googleId: profile.id,
                    password: hashedPassword,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    IsVerify: true
                });
                //
                welcomeMail.sendMail(user.email)
                    .catch(err => {
                        console.error("Email send failed:", err.message);
                    });
                //
            }
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await db.User.findByPk(id);
    done(null, user);
});
