const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    connection: {
        type: Schema.Types.ObjectId,
        ref: "Connection",
        required: [true, "Connection is required"],
    },
    direction: {
        type: Schema.Types.String,
        enum: ["from-to", "to-from"],
        required: [true, "Direction is required"],
    },
    content: {
        type: Schema.Types.String,
        required: [true, "Content is required"],
        minlength: [1, "Content must be at least 1 character"],
    },
    status: {
        type: Schema.Types.String,
        enum: ["sent", "read"],
        default: "sent",
    },
    sent_timestamp: {
        type: Schema.Types.Date,
        default: Date.now,
    },
    read_timestamp: {
        type: Schema.Types.Date,
    },
});

const MessageModel = mongoose.models["Message"] ?? mongoose.model("Message", MessageSchema);

module.exports = MessageModel;
