const express = require('express');
const authRouter = express.Router();
const AuthController = require('../controllers/auth.controller');

authRouter.get('/', AuthController.get);
authRouter.post('/', AuthController.post);

module.exports = authRouter;
