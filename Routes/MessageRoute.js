const express = require("express");
const router = express.Router();

const MessageController = require('../Controllers/MessageController');
const AuthMiddleware = require('../app/Middlewares/Auth');
const MessageValidator = require('../app/Validators/MessageValidator');
const Validate = require('../app/Middlewares/validate');



router.get('/', AuthMiddleware.checkAuth, MessageController.All);

router.post('/', AuthMiddleware.checkAuth, MessageValidator.createMessageValidation, Validate, MessageController.Create);

router.put('/:id', AuthMiddleware.checkAuth, MessageController.Update);

router.delete('/:id', AuthMiddleware.checkAuth, MessageController.Delete);




module.exports = router;