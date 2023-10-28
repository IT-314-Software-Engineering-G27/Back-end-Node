const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: [true, "Email is required"],
        unique: true,
        maxlength: 255,
        index: true,
    },
    password: {
        type: Schema.Types.String,
        required: [true, "Password is required"],
        minlength: 8,
        maxlength: 1024,
    },
    username: {
        type: Schema.Types.String,
        required: [true, "Username is required"],
        unique: true,
        minlength: [3, "Username is too short"],
        maxlength: [255, "Username is too long"],
        index: true,
    },
    role: {
        type: Schema.Types.String,
        enum: ["individual", "organization"],
        default: "individual",
    },
    individual: {
        type: Schema.Types.ObjectId,
        ref: "Individual",
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
    },
    phone_number: {
        type: Schema.Types.String,
    },
    profile_image: {
        type: Schema.Types.String,
    },
    posts: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Post",
        }],
        default: [],
    },
    reports: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        default: [],
    },
    connections: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Connection",
        }],
        default: [],
    },
});

const UserModel = mongoose.models["User"] ?? mongoose.model("User", UserSchema);

module.exports = UserModel;