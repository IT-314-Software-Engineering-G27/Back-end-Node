const UserModel = require("../models/user.model");
const ResetModel = require("../models/reset.model");
const { NotFoundError, UnauthorizedError } = require("../errors");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	auth: {
		user: process.env.NODEMAILER_EMAIL,
		pass: process.env.NODEMAILER_PASS,
	},
});

async function createReset({ email }) {
	const user = await UserModel.findOne({ email });
	if (!user) throw new NotFoundError("User not found");
	const otp = crypto.randomBytes(32).toString("hex");
	const reset = await ResetModel.create({ userId: user._id, otp });
	await transporter.sendMail({
		from: `${process.env.NODEMAILER_EMAIL}`,
		to: email,
		subject: "StartApp Password Reset",
		html: `<p>Use this OTP to reset your password: <b>${otp}</b></p>
        <p>This OTP will expire in 1 hour</p>
        <p>Password Reset Link: <a href="${process.env.CLIENT_URL}/reset/${reset._id}">Click Here</a></p>`,
	});
	return reset;
}

async function applyReset({ otp, resetId, password }) {
	const reset = await ResetModel.findById(resetId).exec();
	if (!reset) throw new NotFoundError("Reset expired");
	if (reset.otp !== otp) throw new UnauthorizedError("Invalid OTP");
	password = await bcrypt.hash(password, 10);
	const user = await UserModel.findByIdAndUpdate(reset.userId, {
		password,
	});
	if (!user) throw new NotFoundError("User not found");
	await ResetModel.findByIdAndDelete(resetId);
	return user;
}

module.exports = {
	createReset,
	applyReset,
};
