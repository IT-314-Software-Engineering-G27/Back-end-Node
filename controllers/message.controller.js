const { readMessage, getMessage, deleteMessage, updateMessage, } = require("../services/message.service");
const { ForbiddenError } = require("../errors");
const MessageController = {
    get: async (req, res, next) => {
        try {
            const { direction, status } = req.user.message;
            if (direction == 'incoming') {
                if (status == 'sent') {
                    await readMessage({ messageId: req.params.id });
                }
            }
            const message = await getMessage({ messageId: req.params.id });
            message.direction = direction;
            res.json({
                message: 'Message retrieved Successfully',
                payload: {
                    message
                },
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { direction, status } = req.user.message;
            const { content } = req.body;
            if (direction != 'outgoing')
                throw new ForbiddenError('You are not allowed to update this message.');
            if (status == 'read')
                throw new ForbiddenError('You can not update a read message.');
            const message = await updateMessage({ messageId: req.params.id, content });
            message.direction = direction;
            res.json({
                message: 'Message updated Successfully.',
                payload: {
                    message,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const { direction, status } = req.user.message;
            if (direction != 'outgoing')
                throw new ForbiddenError('You are not allowed to delete this message.');
            if (status == 'read')
                throw new ForbiddenError('You can not delete a read message.');
            await deleteMessage({ messageId: req.params.id });
            res.json({
                message: 'Message deleted Successfully.',
                payload: {
                },
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = MessageController;