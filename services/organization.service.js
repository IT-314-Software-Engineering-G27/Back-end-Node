const { createUser, getUser, updateUser, deleteUser } = require('../services/user.service');
const { BadRequestError } = require('../errors');
const OrganizationModel = require('../models/organization.model');
const UserModel = require('../models/user.model');

async function listOrganizations({ query, page, limit }) {
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

async function createOrganization({organization}){
    const user = await createUser({ user: organization.user });
    organization.user = user._id;
    try {
        const newOrganization = await OrganizationModel.create(organization);
        await UserModel.findByIdAndUpdate(user._id, { organization: newOrganization._id }).exec();
        return organization;
    }
    catch (error) {
        await deleteUser({ id: user._id });
        if (error.code === 11000)
            throw new BadRequestError('User already exists');
        else
            throw new BadRequestError(error.message);
    }
}

async function getOrganization({id}){
    return await OrganizationModel.findById(id, {
        job_profiles: 0,
        events:0,
    }).populate({
        path: 'user',
        select: {
            password: 0,
            role: 0,
            reports: 0,
        },
    }).exec();
}

async function getOrganizationBasic({ id }) {
    return await OrganizationModel.findById(id, {
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

async function getOrganizationProfile({ id }) {
    return await OrganizationModel.findById(id).populate({
        path: 'user',
        select: {
            password: 0,
            role: 0,
            reports: 0,
        },
    }).exec();
}

async function deleteOrganization({ user }) {
    await deleteUser({ id: user._id });
    return await OrganizationModel.findByIdAndDelete(user.organization).exec();
}

async function updateOrganization({ user, organization }) {
    try {
        if (organization.user) 
            await updateUser({ id: user._id, user: organization.user });
        organization.user = user._id;
        return await OrganizationModel.findByIdAndUpdate(user.organization, organization, { new: true }).exec();
    } catch (error) {
        throw error;
    }
}

async function getEvents({id}){
    return await OrganizationModel.findById(id, {
        events:1,
    }).exec();
}

async function getJobProfiles({id}){
    return await OrganizationModel.findById(id, {
        job_profiles:1,
    }).exec();
}

async function addEvent({id,event_id}){
    org_events=OrganizationModel.findById(id,{
        events:1
    }).exec();

    org_events.unshift(event_id);
    console.log("Event added");
}

async function addJobProfile({id,job_id}){
    org_job_profile=OrganizationModel.findById(id,{
        job_profiles:1
    }).exec();

    org_job_profile.unshift(job_id);
    console.log("Job profile added");
}


module.exports = {
    listOrganizations,
    createOrganization,
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
