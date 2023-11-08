const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EXPIRATION_TIME = 60 * 60;

const ResetSchema = new Schema({
	otp: {
		type: Schema.Types.String,
		required: [true, "Code is required"],
		maxlength: 255,
	},
	userId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		unique: true,
	},
	createdAt: {
		type: Schema.Types.Date,
		default: Date.now(),
		expires: EXPIRATION_TIME,
	},
});

const ResetModel =
	mongoose.models["Reset"] ?? mongoose.model("Reset", ResetSchema);

module.exports = ResetModel;
