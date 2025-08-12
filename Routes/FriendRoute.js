const express = require("express");
const router = express.Router();

const FriendController = require('../Controllers/FriendController');
const AuthMiddleware = require('../app/Middlewares/Auth');
const FriendValidator = require('../app/Validators/FriendValidator');
const Validate = require('../app/Middlewares/validate');


router.get('/', AuthMiddleware.checkAuth, FriendController.All);

router.post('/', AuthMiddleware.checkAuth, FriendValidator.createFriendValidation, Validate, FriendController.Create);

router.put('/:id', AuthMiddleware.checkAuth, FriendValidator.updateStatusValidation, Validate, FriendController.UpdateStatus);

router.delete('/:id', AuthMiddleware.checkAuth, FriendController.Delete);



module.exports = router;