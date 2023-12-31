const ConnectionModel = require('../models/connection.model');
const UserModel = require('../models/user.model');
const { ForbiddenError, BadRequestError } = require('../errors');

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

async function getConnectionStatus({ recipient, sender }) {
    const { connections } = await UserModel.findById(sender, {
        connections: 1,
    }).populate({
        path: 'connections',
        select: {
            _id: 1,
            status: 1,
            from: 1,
            to: 1,
        },
    }).exec();
    const connection = connections.find((connection) => {
        return connection.from.toString() == recipient || connection.to.toString() == recipient;
    });

    if (!connection) return {
        status: 'none',
    }
    return {
        _id: connection._id,
        status: connection.status,
    }
};

async function getConnectionsForUser({ userId }) {
    const { connections } = await UserModel.findById(userId, {
        connections: 1,
    }).exec();
    return connections.map((connection) => connection.toString());
};

async function getConnectionBasic({ connectionId }) {
    const connection = await ConnectionModel.findById(connectionId, {
        from: 1,
        to: 1,
        status: 1,
    }).exec();
    return connection;
}

async function getConnection({ connectionId, role }) {
    if (role == 'from') {
        return await ConnectionModel.findByIdAndUpdate(connectionId, {
            from_last_seen: Date.now(),
        }, { new: true }).select({
            last_seen: "$to_last_seen",
            recipient: "$to",
            status: 1,
        }).exec();
    }
    else if (role == 'to') {
        return await ConnectionModel.findByIdAndUpdate(connectionId, {
            to_last_seen: Date.now(),
        }, { new: true, }).select({
            last_seen: "$from_last_seen",
            recipient: "$from",
            status: 1,
        }).exec();
    }
}

async function getConnectionMessages({ connectionId, page, limit }) {
    const { messages } = await ConnectionModel.findById(connectionId, {
        messages: 1,
    }).exec();
    if (!messages) return [];
    if (page * limit >= messages.length) return [];
    return messages.reverse().slice(page * limit, (page + 1) * limit);
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
    getConnectionBasic,
    getConnectionStatus,
    getConnectionsForUser,
    getConnectionMessages,
    getConnection,
    acceptConnection,
    rejectConnection,
    deleteConnection,
};
