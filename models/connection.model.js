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
    from_last_seen: {
        type: Schema.Types.Date,
        default: Date.now(),
    },
    to_last_seen: {
        type: Schema.Types.Date,
        default: Date.now(),
    },
    status: {
        type: Schema.Types.String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    messages: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Message",
        }],
        default: [],
    }
});

ConnectionSchema.index({
    from: 1,
    to: 1,
}, {
    unique: true,
});

const ConnectionModel = mongoose.models["Connection"] ?? mongoose.model("Connection", ConnectionSchema);

module.exports = ConnectionModel;
