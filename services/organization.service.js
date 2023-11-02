const { createUser, getUser, updateUser, deleteUser } = require('../services/user.service');
const { BadRequestError } = require('../errors');
const OrganizationModel = require('../models/organization.model');
const UserModel = require('../models/user.model');

async function listOrganizations({ query, page, limit }) {
    return (await OrganizationModel.find({
        $or: [
            { company_name: { $regex: `^${query}`, $options: 'i', } },
            { CEOname: { $regex: `^${query}`, $options: 'i', }, },
        ],
    }, {
        _id: 1,
    }).skip(page * limit).limit(limit).exec()).map((organization) => organization._id);
}

async function deepSearchOrganizations({ query, page, limit }) {
    return (await OrganizationModel.find({ $text: { $search: query } }, {
        score: {
            $meta: 'textScore',
        },
        _id: 1,
    }).sort({
        score: {
            $meta: 'textScore',
        },
    }).skip(page * limit).limit(limit).exec()).map((organization) => organization._id);
}

async function createOrganization({ organization }) {
    const user = await createUser({ user: organization.user });
    organization.user = user._id;
    try {
        const newOrganization = await OrganizationModel.create(organization);
        await UserModel.findByIdAndUpdate(user._id, { organization: newOrganization._id }).exec();
        return newOrganization;
    }
    catch (error) {
        await deleteUser({ userId: user._id });
        if (error.code === 11000)
            throw new BadRequestError('User already exists');
        else
            throw new BadRequestError(error.message);
    }
}

async function getOrganization({ organizationId }) {
    return await OrganizationModel.findById(organizationId, {
        job_profiles: 0,
        events: 0,
    }).populate({
        path: 'user',
        select: {
            password: 0,
            role: 0,
            reports: 0,
        },
    }).exec();
}

async function getOrganizationBasic({ organizationId }) {
    return await OrganizationModel.findById(organizationId, {
        company_name: 1,
        CEOname: 1,
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

async function getOrganizationProfile({ organizationId }) {
    return await OrganizationModel.findById(organizationId).populate({
        path: 'user',
        select: {
            password: 0,
            role: 0,
            reports: 0,
        },
    }).exec();
}

async function deleteOrganization({ user }) {
    await deleteUser({ userId: user._id });
    return await OrganizationModel.findByIdAndDelete(user.organization).exec();
}

async function updateOrganization({ user, organization }) {
    try {
        if (organization.user)
            await updateUser({ userId: user._id, user: organization.user });
        organization.user = user._id;
        return await OrganizationModel.findByIdAndUpdate(user.organization, organization, { new: true }).exec();
    } catch (error) {
        throw error;
    }
}

async function getEvents({ organizationId }) {
    const { events } = await OrganizationModel.findById(organizationId, {
        events: 1,
    }).exec();
    return events.map((event) => event.toString());
}

async function getJobProfiles({ organizationId }) {
    const { job_profiles } = await OrganizationModel.findById(organizationId, {
        job_profiles: 1,
    }).exec();
    return job_profiles.map((job_profile) => job_profile.toString());
}

async function addEvent({ organizationId, eventId }) {
    return await OrganizationModel.findByIdAndUpdate(organizationId, {
        $push: {
            events: eventId,
        },
    }, {
        new: true,
    }).exec();
}

async function addJobProfile({ organizationId, jobProfileId }) {
    await OrganizationModel.findByIdAndUpdate(organizationId, {
        $push: {
            job_profiles: jobProfileId,
        },
    }, {
        new: true,
    }).exec();
    console.log("Job profile added");
}


module.exports = {
    listOrganizations,
    createOrganization,
    deepSearchOrganizations,
    getOrganization,
    getOrganizationBasic,
    getOrganizationProfile,
    getEvents,
    getJobProfiles,
    addEvent,
    addJobProfile,
    deleteOrganization,
    updateOrganization,
};
