const { BadRequestError } = require("../errors");
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { createReset } = require("./reset.service");

async function createUser({ user }) {
	try {
		const newUser = await UserModel.create(user);
		await createReset({ email: newUser.email });
		return newUser;
	} catch (error) {
		if (error.code === 11000)
			throw new BadRequestError("User already exists");
		throw error;
	}
}

async function updateProfileImage({ userId, fileId, host }) {
	const url = `${host}/files/${fileId}`;
	return await UserModel.findByIdAndUpdate(
		userId,
		{ profile_image: url },
		{ new: true }
	).exec();
}

async function getUserBasic({ userId }) {
	return await UserModel.findById(userId, {
		username: 1,
		profile_image: 1,
		email: 1,
	}).exec();
};

async function getUser({ userId }) {
	return await UserModel.findById(userId, {
		password: 0,
	}).exec();
}

async function updateUser({ userId, user }) {
	delete user.password;
	try {
		return await UserModel.findByIdAndUpdate(userId, user, {
			new: true,
		}).exec();
	} catch (error) {
		if (error.code === 11000)
			throw new BadRequestError("User already exists");
		throw error;
	}
}

async function deleteUser({ userId }) {
	return await UserModel.findByIdAndDelete(userId).exec();
}

module.exports = {
	createUser,
	getUser,
	getUserBasic,
	updateUser,
	deleteUser,
	updateProfileImage,
};
