const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ConnectionSchema = new Schema({
    from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "From is required"],
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "To is required"],
    },
    status: {
        type: Schema.Types.String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    messages: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
    }],
});

const ConnectionModel = mongoose.models["Connection"] ?? mongoose.model("Connection", ConnectionSchema);