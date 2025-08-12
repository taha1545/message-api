const express = require("express");
const Router = express.Router();

const AuthController = require('../Controllers/AuthController');
const Upload = require('../app/Services/Storage');
const AuthMiddleware = require('../app/Middlewares/Auth');
const UserValidation = require('../app/Validators/UserValidator');
const Validate = require('../app/Middlewares/validate');
const UserController = require('../Controllers/UserController');
const VerifyController = require('../Controllers/VerifyController');

//
Router.post('/signup', Upload.single('image'), UserValidation.signupValidation, Validate, AuthController.signUp);

Router.post('/login', UserValidation.loginValidation, Validate, AuthController.login);

Router.post('/sendOtp', AuthController.sendOtp);

Router.put('/reset-password-otp', UserValidation.resetPasswordValidation, Validate, AuthController.ResetOTP);

Router.patch('/reset-password', AuthMiddleware.checkAuth, UserValidation.updatePasswordValidation, Validate, AuthController.resetPassword);

// 

Router.get('/me', AuthMiddleware.checkAuth, UserController.getUserByToken);

Router.put('/update', AuthMiddleware.checkAuth, UserValidation.updateUserValidation, Validate, UserController.updateUserByToken);

// 

Router.get('/', AuthMiddleware.checkAuth, AuthMiddleware.checkAdmin, UserController.getAllUsers);

Router.get('/search', UserController.search);

Router.get('/:id', AuthMiddleware.checkAuth, AuthMiddleware.checkAdmin, UserController.getUserById);

Router.delete('/:id', AuthMiddleware.checkAuth, AuthMiddleware.checkAdmin, UserController.deleteUserById);

//

Router.post('/send-verify-otp', VerifyController.otpVerify);

Router.put('/verify-email', VerifyController.Verify);


module.exports = Router;