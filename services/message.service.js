const ConnectionModel = require("../models/connection.model");
const MessageModel = require("../models/message.model");

async function createMessage({ role, connectionId, message: { content } }) {
    const newMessage = await MessageModel.create({
        connection: connectionId,
        direction: role == "from" ? "from-to" : "to-from",
        content,
        status: "draft",
    });
    await ConnectionModel.findByIdAndUpdate(connectionId, {
        $push: { messages: newMessage._id },
    }).exec();
    return newMessage;
};

async function getMessage({ messageId }) {
    return await MessageModel.findById(messageId).exec();
}

async function getMessageBasic({ messageId }) {
    return await MessageModel.findById(messageId, {
        connection: 1,
        direction: 1,
        status: 1,
    });
}

async function readMessage({ messageId }) {
    return await MessageModel.findByIdAndUpdate(messageId, {
        status: "read",
    }, { new: true }).exec();
};

async function deleteMessage({ messageId }) {
    return await MessageModel.findByIdAndDelete(messageId).exec();
};

async function sendMessage({ messageId }) {
    return await MessageModel.findByIdAndUpdate(messageId, {
        status: "sent",
    }, { new: true }).exec();
};

module.exports = {
    createMessage,
    getMessage,
    getMessageBasic,
    readMessage,
    deleteMessage,
    sendMessage,
};

