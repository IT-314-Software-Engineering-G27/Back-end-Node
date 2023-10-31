const ConnectionModel = require('../models/connection.model');
const UserModel = require('../models/user.model');
const { ForbiddenError } = require('../errors');

async function createConnection({ connection }) {
    try {
        const newConnection = await ConnectionModel.create(connection);
        await UserModel.findByIdAndUpdate(newConnection.from, {
            $push: {
                connections: newConnection._id,
            }
        }, {
            throw: true,
        }).exec();
        await UserModel.findByIdAndUpdate(newConnection.to, {
            $push: {
                connections: newConnection._id,
            }
        }).exec();
        return newConnection;
    }
    catch (error) {
        if (error.code === 11000)
            throw new BadRequestError('Connection already exists');
        else
            throw new BadRequestError(error.message);
    };
};

async function getConnectionsForUser({ userId }) {
    const { connections } = await UserModel.findById(userId, {
        connections: 1,
    }).exec();
    return connections.map((connection) => connection.toString());
};

async function getConnection({ connectionId }) {
    const connection = await ConnectionModel.findById(connectionId, {
        from: 1,
        to: 1,
        status: 1,
    }).exec();
    return connection;
}

async function getConnectionMessages({ connectionId, page, limit }) {
    const { messages } = await ConnectionModel.findById(connectionId, {
        messages: {
            $slice: [- page * limit - 1, limit],
        },
    }).exec();
    return messages;
}

async function rejectConnection({ role, connectionId }) {
    if (role != 'to') throw new ForbiddenError("You are not authorized to reject this connection");
    return await ConnectionModel.findByIdAndUpdate(connectionId, {
        status: 'rejected',
    }, { new: true }).exec();
};

async function acceptConnection({ role, connectionId }) {
    if (role != 'to') throw new ForbiddenError("You are not authorized to accept this connection");
    return await ConnectionModel.findByIdAndUpdate(connectionId, {
        status: 'accepted',
    }).exec();
};

async function deleteConnection({ connectionId }) {
    await ConnectionModel.findByIdAndDelete(connectionId).exec();
};

module.exports = {
    createConnection,
    getConnectionsForUser,
    getConnectionMessages,
    getConnection,
    acceptConnection,
    rejectConnection,
    deleteConnection,
};
