const express = require("express");
const router = express.Router();

const ContactController = require('../Controllers/ContactController');
const AuthMiddleware = require('../Middlewares/Auth');

//
router.post('/', ContactController.Create);
//
router.get('/', ContactController.All);
router.get('/:id', ContactController.Show);
router.delete('/:id', ContactController.Delete);


module.exports = router;