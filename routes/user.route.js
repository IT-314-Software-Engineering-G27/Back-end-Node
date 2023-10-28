const express = require('express');
const userRouter = express.Router();
const UserController = require('../controllers/user.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

userRouter.post('/', UserController.create);
userRouter.get('/', UserController.list);
userRouter.get('/:id', UserController.get);
userRouter.put('/', tokenToIDMiddleware, UserController.update);
userRouter.delete('/', tokenToIDMiddleware, UserController.delete);

module.exports = userRouter;
