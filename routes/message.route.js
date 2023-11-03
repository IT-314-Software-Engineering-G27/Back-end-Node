const express = require('express');
const messageRouter = express.Router();
const MessageController = require('../controllers/message.controller');
const { messageMiddleware } = require('../middlewares/message.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

messageRouter.get('/:id', tokenToIDMiddleware,  messageMiddleware, MessageController.get);
messageRouter.delete('/:id', tokenToIDMiddleware, messageMiddleware, MessageController.delete);
messageRouter.put('/:id', tokenToIDMiddleware, messageMiddleware, MessageController.update);
module.exports = messageRouter;
