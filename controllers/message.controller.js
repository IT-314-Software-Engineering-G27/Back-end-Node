const { readMessage, getMessage, deleteMessage, sendMessage, } = require("../services/message.service");
const { ForbiddenError } = require("../errors");
const MessageController = {
    get: async (req, res, next) => {
        try {
            const { direction, status } = req.user.message;
            if (direction == 'incoming') {
                if (status == 'draft') {
                    res.json({
                        message: 'Message is not sent yet.',
                        payload: {
                            draft: true,
                        },
                    });
                }
                else
                    await readMessage({ messageId: req.params.id });
            }
            const message = await getMessage({ messageId: req.params.id });
            res.json({
                message: 'Message retrieved Successfully',
                payload: {
                    message,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    send: async (req, res, next) => {
        try {
            const { direction } = req.user.message;
            if (direction != 'outgoing')
                throw new ForbiddenError('You are not allowed to send this message.');
            const message = await sendMessage({ messageId: req.params.id });
            res.json({
                message: 'Message sent Successfully.',
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