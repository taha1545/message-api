const Auth = require('../app/Services/Auth');
const welcomeMail = require('../app/Services/WelcomeMail');
const UserResource = require('../app/Resource/UserResource');
const AuthError = require('../app/Error/AuthError');
const db = require('../db/models');
const bcrypt = require('bcrypt');
const notfoundError = require('../app/Error/NotFoundError');
const crypto = require('crypto');
const OtpMail = require('../app/Services/OtpMail');


const signUp = async (req, res, next) => {
    try {
        //
        const { name, email, password } = req.body;
        const imagePath = req.file ? req.file.path : null;
        const hashedPassword = await bcrypt.hash(password, 10);
        //
        const user = await db.User.create({
            name,
            email,
            password: hashedPassword,
            imagePath
        });
        //
        const token = Auth.CreateToken({
            id: user.id,
            role: "client"
        });
        //
        welcomeMail.sendMail(user.email)
            .catch(err => {
                console.error("Email send failed:", err.message);
            });
        //
        return res.status(201).json({
            success: true,
            message: "user created succsesfully",
            data: UserResource(user),
            token
        });
        //
    } catch (err) {
        err.message = "Signup error: " + err.message;
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        //
        const { email, password } = req.body;
        //
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            throw new notfoundError('User not found with this email');
        }
        // 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new AuthError("Invalid password");
        }
        //
        const token = Auth.CreateToken({
            id: user.id,
            role: user.role
        });
        //
        return res.status(200).json({
            success: true,
            message: "user login succsesfully",
            data: UserResource(user),
            token
        });
        //
    } catch (err) {
        err.message = "login error: " + err.message;
        next(err);
    }
};

const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        //
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            throw new notfoundError('No user found with this email');
        }
        // 
        const otp = crypto.randomInt(100000, 999999).toString();
        // 
        user.otpCode = otp;
        user.otpAt = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();
        // 
        OtpMail.sendMail(user.email, otp).catch(() => {
            console.log("send otp mail fail" + user.email);
        });
        //
        return res.status(200).json({
            success: true,
            message: "OTP has been sent to your email"
        });
        //
    } catch (err) {
        err.message = "Send OTP error: " + err.message;
        next(err);
    }
};

const ResetOTP = async (req, res, next) => {
    try {
        const { otp, email, password } = req.body;
        //
        const user = await db.User.findOne({ where: { email } });
        if (!user) {
            throw new notfoundError('No user found with this email');
        }
        // 
        if (!user.otpCode || user.otpCode !== otp) {
            throw new AuthError("Invalid OTP");
        }
        // 
        if (new Date() > new Date(user.otpAt)) {
            throw new AuthError("OTP has expired");
        }
        // 
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.otpCode = null;
        user.otpAt = null;
        await user.save();
        //
        return res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
        });
    } catch (err) {
        err.message = "Reset password with OTP error: " + err.message;
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { oldPassword, newPassword } = req.body;
        //
        const user = await db.User.findByPk(userId);
        if (!user) {
            throw new notfoundError('User not found');
        }
        //
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new AuthError("Old password is incorrect");
        }
        //
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        //
        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (err) {
        err.message = "Reset password error: " + err.message;
        next(err);
    }
};

const VerifyEmail = (req, res, next) => {
    try {


    } catch (err) {
        next(err);
    }
}

module.exports = {
    signUp,
    login,
    sendOtp,
    ResetOTP,
    resetPassword
};