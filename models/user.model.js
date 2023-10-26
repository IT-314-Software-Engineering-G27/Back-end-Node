const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: Schema.Types.String,
        required: [true, "Email is required"],
        unique: true,
        maxlength: 255,
    },
    password: {
        type: Schema.Types.String,
        required: [true, "Password is required"],
        minlength: 8,
        maxlength: 1024,
    },
});

const UserModel = mongoose.models["User"] ?? mongoose.model("User", UserSchema);

module.exports = UserModel;