const ConnectionModel = require("../models/connection.model");
const MessageModel = require("../models/message.model");

async function createMessage({ role, connectionId, message: { content } }) {
    const newMessage = (await MessageModel.create({
        connection: connectionId,
        direction: role == "from" ? "from-to" : "to-from",
        content,
    })).toJSON();
    await ConnectionModel.findByIdAndUpdate(connectionId, {
        $push: { messages: newMessage._id },
    }).exec();
    return newMessage;
};

async function getMessage({ messageId }) {
    return (await MessageModel.findById(messageId).exec()).toJSON();
}

async function updateMessage({ messageId, content }) {
    return (await MessageModel.findByIdAndUpdate(messageId, {
        content,
        sent_timestamp: Date.now(),
    }, { new: true }).exec()).toJSON();
}

async function getMessageBasic({ messageId }) {
    return (await MessageModel.findById(messageId, {
        connection: 1,
        direction: 1,
        status: 1,
    })).toJSON();
}

async function readMessage({ messageId }) {
    return (await MessageModel.findByIdAndUpdate(messageId, {
        status: "read",
        read_timestamp: Date.now(),
    }, { new: true }).exec()).toJSON();
};

async function deleteMessage({ messageId }) {
    return await MessageModel.findByIdAndDelete(messageId).exec();
};

module.exports = {
    createMessage,
    getMessage,
    updateMessage,
    getMessageBasic,
    readMessage,
    deleteMessage,
};

