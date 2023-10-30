const MessageModel = require("../models/message.model");
const { ForbiddenError } = require("../errors");

async function createMessage({ role, connectionId, message: { content } }) {
    return await MessageModel.create({
        connection: connectionId,
        direction: role == "from" ? "from-to" : "to-from",
        content,
        status: "draft",
        timestamp: Date.now(),
    });
};

async function getMessagesForConnection({ connectionId }) {
    const messages = await MessageModel.find({ connection: connectionId }).exec();
    return messages;
};

async function readMessage({ role, messageId }) {
    const { direction } = await MessageModel.findById(messageId, {
        direction: 1,
    }).exec();
    if (role != direction.split("-")[1]) throw new ForbiddenError("You are not authorized to read this message");
    return await MessageModel.findByIdAndUpdate(messageId, {
        status: "read",
    }, { new: true }).exec();
};

async function deleteMessage({ role, messageId }) {
    const { direction } = await MessageModel.findById(messageId, {
        direction: 1,
    }).exec();
    if (role != direction.split("-")[0]) throw new ForbiddenError("You are not authorized to read this message");
    return await MessageModel.findByIdAndDelete(messageId).exec();
};

async function sendMessage({ role, messageId }) {
    const { direction } = await MessageModel.findById(messageId, {
        direction: 1,
    }).exec();
    if (role != direction.split("-")[0]) throw new ForbiddenError("You are not authorized to read this message");
    return await MessageModel.findByIdAndUpdate(messageId, {
        status: "sent",
    }, { new: true }).exec();
};

module.exports = {
    createMessage,
    getMessagesForConnection,
    readMessage,
    deleteMessage,
    sendMessage,
};

