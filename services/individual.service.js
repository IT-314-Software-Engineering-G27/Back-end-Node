
const { createUser, getUser, updateUser, deleteUser } = require('../services/user.service');
const { BadRequestError } = require('../errors');
const IndividualModel = require('../models/individual.model');
const UserModel = require('../models/user.model');

async function listIndividuals({ query, page, limit }) {
    return (await IndividualModel.find({ $text: { $search: query } }, {
        score: {
            $meta: 'textScore',
        },
        _id: 1,
    }).sort({
        score: {
            $meta: 'textScore',
        },
    }).skip(page * limit).limit(limit).exec()).map((individual) => individual._id);
}

async function createIndividual({ individual }) {
    const user = await createUser({ user: individual.user });
    individual.user = user._id;
    try {
        const newIndividual = await IndividualModel.create(individual);
        await UserModel.findByIdAndUpdate(user._id, { individual: newIndividual._id }).exec();
        return individual;
    }
    catch (error) {
        await deleteUser({ id: user._id });
        if (error.code === 11000)
            throw new BadRequestError('User already exists');
        else
            throw new BadRequestError(error.message);
    }
}

async function getIndividual({ id }) {
    return await IndividualModel.findById(id, {
        job_applications: 0,
    }).populate({
        path: 'user',
        select: {
            password: 0,
            role: 0,
            reports: 0,
        },
    }).exec();
};

async function getIndividualBasic({ id }) {
    return await IndividualModel.findById(id, {
        first_name: 1,
        last_name: 1,
        user: 1,
    }).populate({
        path: 'user',
        select: {
            email: 1,
            username: 1,
            profile_image: 1,
        },
    }).exec();
}

async function getIndividualProfile({ id }) {
    return await IndividualModel.findById(id).populate({
        path: 'user',
        select: {
            password: 0,
            role: 0,
            reports: 0,
        },
    }).exec();
}

async function updateIndividual({ user, individual }) {
    try {
        if (individual.user) 
            await updateUser({ id: user._id, user: individual.user });
        individual.user = user._id;
        return await IndividualModel.findByIdAndUpdate(user.individual, individual, { new: true }).exec();
    } catch (error) {
        throw error;
    }
}

async function deleteIndividual({ user }) {
    await deleteUser({ id: user._id });
    return await IndividualModel.findByIdAndDelete(user.individual).exec();
}

module.exports = {
    listIndividuals,
    createIndividual,
    getIndividual,
    getIndividualBasic,
    getIndividualProfile,
    updateIndividual,
    deleteIndividual,
};
