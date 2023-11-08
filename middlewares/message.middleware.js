const { ForbiddenError, NotFoundError } = require('../errors');
const { getMessageBasic } = require('../services/message.service');
const { getConnectionBasic } = require('../services/connection.service');

async function messageMiddleware(req, res, next) {
    try {
        const userId = req.user._id;
        const message = await getMessageBasic({ messageId: req.params.id });
        if (!message)
            throw new NotFoundError('Message not found.');
        const connection = await getConnectionBasic({ connectionId: message.connection });
        req.user.message = {};
        if (connection.from == userId) {
            if (message.direction == 'from-to')
                req.user.message.direction = 'outgoing';
            else
                req.user.message.direction = 'incoming';
        }
        else if (connection.to == userId) {
            if (message.direction == 'from-to')
                req.user.message.direction = 'incoming';
            else
                req.user.message.direction = 'outgoing';
        }
        else
            throw new ForbiddenError('You are not allowed to access this message.');
        req.user.message.status = message.status;
        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    messageMiddleware,
}