const { BadRequestError } = require('../errors');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const { removeFile } = require('./file.service');

async function listUsers() {
    return (await UserModel.find({}, {
        _id: 1
    }).exec()).map((user) => user._id);
}

async function createUser({ user }) {
    if (user.password)
        user.password = await bcrypt.hash(user.password, 10);
    try {
        return await UserModel.create(user);
    }
    catch (error) {
        if (error.code === 11000)
            throw new BadRequestError('User already exists');
        throw error;
    }
}

async function updateProfileImage({ userId, fileId }) {
    const { profile_image } = await UserModel.findById(userId, {
        profile_image: 1
    }).exec();
    if (profile_image)
        removeFile({ fileId: profile_image });
    return await UserModel.findByIdAndUpdate(userId, {
        profile_image: fileId
    }, { new: true }).exec();
}

async function getUser({ userId }) {
    return await UserModel.findById(userId, {
        password: 0
    }).exec();
}

async function updateUser({ userId, user }) {
    if (user.password)
        user.password = await bcrypt.hash(user.password, 10);
    try {
        return await UserModel.findByIdAndUpdate(userId, user, { new: true }).exec();
    }
    catch (error) {
        if (error.code === 11000)
            throw new BadRequestError('User already exists');
        throw error;
    }
}

async function deleteUser({ userId }) {
    return await UserModel.findByIdAndDelete(userId).exec();
}

module.exports = {
    listUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
    updateProfileImage, 
};
