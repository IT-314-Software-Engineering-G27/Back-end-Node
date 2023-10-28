const { BadRequestError } = require('../errors');
const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');

async function listUsers() {
    return (await UserModel.find({}, {
        _id: 1
    }).exec()).map((user) => user._id);
}

async function createUser({ user }) {
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

async function getUser({ id }) {
    return await UserModel.findById(id, {
        password: 0
    }).exec();
}

async function updateUser({ id, user }) {
    if (user.password)
        user.password = await bcrypt.hash(user.password, 10);
    try {
        return await UserModel.findByIdAndUpdate(id, user, { new: true }).exec();
    }
    catch (error) {
        if (error.code === 11000)
            throw new BadRequestError('User already exists');
        throw error;
    }
}

async function deleteUser({ id }) {
    return await UserModel.findByIdAndDelete(id).exec();
}

module.exports = {
    listUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser,
};
