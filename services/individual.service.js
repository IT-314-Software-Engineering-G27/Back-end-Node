const { createUser, getUser, updateUser, deleteUser, } = require("../services/user.service");
const { BadRequestError } = require("../errors");
const IndividualModel = require("../models/individual.model");
const UserModel = require("../models/user.model");

async function listIndividuals({ query, page, limit }) {
	return (await IndividualModel.find({
		$or: [
			{ first_name: { $regex: `^${query}`, $options: "i" } },
			{ last_name: { $regex: `^${query}`, $options: "i" } },
		],
	}, {
		_id: 1,
	}).skip(page * limit).limit(limit).exec()).map((individual) => individual._id);
}

async function deepSearchIndividuals({ query, page, limit }) {
	return (await IndividualModel.find({ $text: { $search: query } },
		{
			score: { $meta: "textScore", },
			_id: 1,
		}).sort({
			score: {
				$meta: "textScore",
			},
		})
		.skip(page * limit)
		.limit(limit)
		.exec()).map((individual) => individual._id);
}

async function createIndividual({ individual }) {
	const user = await createUser({ user: individual.user });
	individual.user = user._id;
	try {
		const newIndividual = await IndividualModel.create(individual);
		await UserModel.findByIdAndUpdate(user._id, {
			individual: newIndividual._id,
		}).exec();
		return newIndividual;
	} catch (error) {
		await deleteUser({ userId: user._id });
		if (error.code === 11000)
			throw new BadRequestError("User already exists");
		else throw new BadRequestError(error.message);
	}
}

async function getIndividual({ individualId }) {
	return await IndividualModel.findById(individualId, {
		job_applications: 0,
	})
		.populate({
			path: "user",
			select: {
				password: 0,
				role: 0,
				reports: 0,
				connections: 0,
			},
		})
		.exec();
}

async function getIndividualBasic({ individualId }) {
	return await IndividualModel.findById(individualId, {
		first_name: 1,
		last_name: 1,
		user: 1,
		country: 1,
	}).populate({
		path: "user",
		select: {
			email: 1,
			username: 1,
			profile_image: 1,
		},
	})
		.exec();
}

async function getIndividualProfile({ individualId }) {
	return await IndividualModel.findById(individualId)
		.populate({
			path: "user",
			select: {
				password: 0,
				role: 0,
				reports: 0,
			},
		})
		.exec();
}

async function updateIndividual({ user, individual }) {
	try {
		if (individual.user)
			await updateUser({ userId: user._id, user: individual.user });
		individual.user = user._id;
		return await IndividualModel.findByIdAndUpdate(
			user.individual,
			individual,
			{ new: true }
		).exec();
	} catch (error) {
		throw error;
	}
}

async function deleteIndividual({ user }) {
	await deleteUser({ userId: user._id });
	return await IndividualModel.findByIdAndDelete(user.individual).exec();
}

module.exports = {
	listIndividuals,
	createIndividual,
	deepSearchIndividuals,
	getIndividual,
	getIndividualBasic,
	getIndividualProfile,
	updateIndividual,
	deleteIndividual,
};
