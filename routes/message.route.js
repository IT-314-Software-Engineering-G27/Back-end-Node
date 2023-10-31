const express = require('express');
const messageRouter = express.Router();
const MessageController = require('../controllers/message.controller');
const { messageMiddleware } = require('../middlewares/message.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

messageRouter.get('/:id', tokenToIDMiddleware,  messageMiddleware, MessageController.get);
messageRouter.post('/:id/send', tokenToIDMiddleware, messageMiddleware, MessageController.send);
messageRouter.delete('/:id', tokenToIDMiddleware, messageMiddleware, MessageController.delete);

module.exports = messageRouter;
