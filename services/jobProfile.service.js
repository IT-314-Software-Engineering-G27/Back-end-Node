const { BadRequestError } = require('../errors');
const JobProfileModel = require('../models/jobProfile.model');
const OrganizationModel = require('../models/organization.model');

async function listJobProfiles({ query, page, limit }) {
    return (await JobProfileModel.find({
        $or: [
            { title: { $regex: `${query}`, $options: 'i', }, },
            { posting_location: { $regex: `^${query}`, $options: 'i', }, },
        ]
    }, {
        _id: 1,
    }).skip(page * limit).limit(limit).exec()).map((jobProfile) => jobProfile._id);
}

async function deepSearchJobProfiles({ query, page, limit }) {
    return (await JobProfileModel.find({ $text: { $search: query } }, {
        score: {
            $meta: 'textScore',
        },
        _id: 1,
    }).sort({
        score: {
            $meta: 'textScore',
        },
    }).skip(page * limit).limit(limit).exec()).map((jobProfile) => jobProfile._id);
}

async function createJobProfile({ jobProfile, organizationId }) {
    try {
        jobProfile.organization = organizationId;
        const newJobProfile = await JobProfileModel.create(jobProfile);
        await OrganizationModel.findByIdAndUpdate(organizationId, {
            $push: {
                job_profiles: newJobProfile._id,
            },
        }).exec();
        return newJobProfile;
    }
    catch (error) {
        if (error.code === 11000)
            throw new BadRequestError('Job profile already exists');
        else
            throw new BadRequestError(error.message);
    }
}

async function updateJobProfile({ jobProfileId, jobProfile }) {
    const newJobProfile = await JobProfileModel.findByIdAndUpdate(jobProfileId, {
        ...jobProfile,
    }, {
        new: true,
    }).exec();
    return newJobProfile;
}

async function getJobProfileBasic({ jobProfileId }) {
    return await JobProfileModel.findById(jobProfileId, {
        organization: 1,
        title: 1,
        posting_location: 1,
        salary: 1,
        posted: 1,
        duration: 1,
    }).exec();
};

async function listApplications({ jobProfileId, query, page, limit }) {
    const { job_applications } = await JobProfileModel.findById(jobProfileId, {
        job_applications: 1,
    }).populate({
        path: 'job_applications',
        select: {
            cover_letter: 1,
        }
    }).exec();
    return job_applications.filter((job_application) => {
        if(!query) return true;
        return String(job_application.cover_letter).test(`^${query}/i`);
    }).slice(page * limit, (page + 1) * limit).map((job_application) => job_application._id);
}

async function getJobProfile({ jobProfileId }) {
    return await JobProfileModel.findById(jobProfileId, {
        job_applications: 0,
    }).exec();
}

async function deleteJobProfile({ jobProfileId }) {
    return await JobProfileModel.findByIdAndDelete(jobProfileId).exec();
}

module.exports = {
    listJobProfiles,
    getJobProfileBasic,
    deepSearchJobProfiles,
    updateJobProfile,
    listApplications,
    getJobProfile,
    createJobProfile,
    deleteJobProfile,
};