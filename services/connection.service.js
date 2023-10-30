const ConnectionModel = require('../models/connection.model');
const UserModel = require('../models/user.model');

const { ForbiddenError } = require('../errors');
const { getIndividualBasic } = require('./individual.service');

async function createConnection({ connection }) {
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

async function getConnection({ connectionId }) {
    const connection = await ConnectionModel.findById(connectionId, {
        from: 1,
        to: 1,
        messages: 1,
        status: 1,
    }).exec();
    return connection;
};

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
    getConnection,
    getConnectionBasic,
    acceptConnection,
    rejectConnection,
    deleteConnection,
};
