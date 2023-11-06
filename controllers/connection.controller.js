const { createConnection, getConnectionsForUser, getConnection, getConnectionMessages, rejectConnection, acceptConnection, deleteConnection } = require('../services/connection.service');
const { createMessage } = require('../services/message.service');
const { getUserBasic } = require('../services/user.service');
const { ForbiddenError, BadRequestError } = require('../errors');
const LIMIT_PER_PAGE = 10;
const ConnectionController = {
    list: async (req, res, next) => {
        try {
            const connections = await getConnectionsForUser({ userId: req.user._id });
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
            const role = req.user.connection.role;
            const connection = (await getConnection({ connectionId: req.params.id, role })).toJSON();
            const recipient = await getUserBasic({ userId: connection.recipient });
            connection.recipient = recipient;
            res.json({
                message: 'Connection retrieved successfully',
                payload: {
                    connection
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    listMessages: async (req, res, next) => {
        try {
            const { page } = req.query;
            const messages = await getConnectionMessages({ connectionId: req.params.id, page: page ?? 0, limit: LIMIT_PER_PAGE });
            res.json({
                message: 'Messages retrieved successfully',
                payload: {
                    messages,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    accept: async (req, res, next) => {
        try {
            const connection = await acceptConnection({ role: req.user.connection.role, connectionId: req.params.id });
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
            const connection = await rejectConnection({ role: req.user.connection.role, connectionId: req.params.id });
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
            await deleteConnection({ connectionId: req.params.id });
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
            if (req.user.connection.status !== 'accepted') throw new ForbiddenError('Connection is not accepted yet');
            const { content } = req.body;
            if (!content) throw new BadRequestError('Message content is required');
            const message = await createMessage({
                role: req.user.connection.role, connectionId: req.params.id, message: {
                    content,
                }
            });
            res.json({
                message: 'Message saved successfully',
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