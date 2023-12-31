const UserModel = require("../models/user.model");
const ResetModel = require("../models/reset.model");
const { NotFoundError, UnauthorizedError, ForbiddenError } = require("../errors");
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
	try {
		const user = await UserModel.findOne({ email });
		if (!user) throw new NotFoundError("User not found");
		const otp = crypto.randomBytes(32).toString("hex");
		const reset = await ResetModel.create({ userId: user._id, otp });
		await transporter.sendMail({
			from: `${process.env.NODEMAILER_EMAIL}`,
			to: email,
			subject: "StartApp Password Reset/Verification",
			html: `<p>Use this OTP to reset set a new password: <b>${otp}</b></p>
        <p>This OTP will expire in 1 hour</p>
        <p>Follow this Link: <a href="https://startapp-for-startups-g27.vercel.app/password-reset/${reset._id}">Click Here </a></p>`,
		});
		return reset;
	}
	catch (err) {
		if (err.code === 11000) throw new ForbiddenError("Reset already requested");
		throw new Error(err);
	}
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
