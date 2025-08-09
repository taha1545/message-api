const db = require('../db/models');
const notfoundError = require('../app/Error/NotFoundError');
const crypto = require('crypto');
const VerifyEmail = require('../app/Services/VerifyEmail');


const otpVerify = async (req, res, next) => {
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
        VerifyEmail.sendMail(user.email, otp).catch(() => {
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

const Verify = async (req, res, next) => {
    try {
        const { otp, email } = req.body;
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
        user.IsVerify = true;
        await user.save();
        //
        return res.status(200).json({
            success: true,
            message: "email  has been verified  successfully",
        });
    } catch (err) {
        err.message = "email verify  error: " + err.message;
        next(err);
    }
};

module.exports = {
    otpVerify,
    Verify
}