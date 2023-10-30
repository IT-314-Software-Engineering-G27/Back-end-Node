const { createConnection, getConnectionsForUser, getConnection, rejectConnection, acceptConnection, deleteConnection } = require('../services/connection.service');
const { createMessage } = require('../services/message.service');
const { ForbiddenError, BadRequestError } = require('../errors');
const ConnectionController = {
    list: async (req, res, next) => {
        try {
            const id = req.user._id;
            const connections = await getConnectionsForUser({ userId: id });
            res.json({
                message: 'Connections retrieved successfully',
                payload: {
                    connections,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const to = req.params.id;
            const from = req.user._id;
            const connection = await createConnection({
                connection: {
                    from,
                    to,
                }
            });
            res.json({
                message: 'Connection created successfully',
                payload: {
                    connection,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const id = req.params.id;
            const connection = await getConnection({ connectionId: id });
            res.json({
                message: 'Connection retrieved successfully',
                payload: {
                    connection,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    accept: async (req, res, next) => {
        try {
            const id = req.params.id;
            const connection = await acceptConnection({ role: req.user.connection.role, connectionId: id });
            res.json({
                message: 'Connection accepted successfully',
                payload: {
                    connection,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    reject: async (req, res, next) => {
        try {
            const id = req.params.id;
            const connection = await rejectConnection({ role: req.user.connection.role, connectionId: id });
            res.json({
                message: 'Connection rejected successfully',
                payload: {
                    connection,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const id = req.params.id;
            await deleteConnection({ connectionId: id });
            res.json({
                message: 'Connection deleted successfully',
            });
        }
        catch (error) {
            next(error);
        }
    },
    message: async (req, res, next) => {
        try {
            if (req.user.connection.status !== 'accepted') throw new ForbiddenError('You are not authorized to send messages to this connection');
            const { content } = req.body;
            if (!content) throw new BadRequestError('Message content is required');
            const message = await createMessage({
                role: req.user.connection.role, connectionId: req.params.id, message: {
                    content,
                }
            });
            res.json({
                message: 'Message sent successfully',
                payload: {
                    message,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
};

module.exports = ConnectionController;