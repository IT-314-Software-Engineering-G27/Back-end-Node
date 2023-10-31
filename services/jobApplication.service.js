const IndividualModel = require("../models/individual.model");
const JobApplicationModel = require("../models/jobApplication.model");
const JobProfileModel = require("../models/jobProfile.model");

async function createJobApplication({ jobApplication: { cover_letter }, individualId, jobProfileId }) {
    const newJobApplication = await JobApplicationModel.create({
        cover_letter: cover_letter,
        individual: individualId,
        job_profile: jobProfileId,
    });

    await IndividualModel.findByIdAndUpdate(individualId, {
        $push: {
            job_applications: newJobApplication._id,
        },
    }).exec();

    await JobProfileModel.findByIdAndUpdate(jobProfileId, {
        $push: {
            job_applications: newJobApplication._id,
        },
    }).exec();

    return newJobApplication;
};

async function getJobApplicationsForIndividual({ individualId }) {
    const { job_applications } = await IndividualModel.findById(individualId, {
        job_applications: 1,
    }).exec();
    return job_applications.map((jobApplication) => jobApplication.toString());
};

async function getJobApplication({ jobApplicationId }) {
    const jobApplication = await JobApplicationModel.findById(jobApplicationId).exec();
    return jobApplication;
};

async function getJobApplicationBasic({ jobApplicationId }) {
    const jobApplication = await JobApplicationModel.findById(jobApplicationId, {
        cover_letter: 0,
    }).exec();
    return jobApplication;
};

async function updateJobApplication({ jobApplicationId, jobApplication: {
    cover_letter
} }) {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(jobApplicationId, {
        cover_letter,
    }, {
        new: true,
    }).exec();
    return jobApplication;
};

async function deleteJobApplication({ jobApplicationId }) {
    const { job_profile, individual } = await JobApplicationModel.findById(jobApplicationId, {
        job_profile: 1,
        individual: 1,
    }).exec();
    await IndividualModel.findByIdAndUpdate(individual, {
        $pull: {
            job_applications: jobApplicationId,
        },
    }).exec();

    await JobProfileModel.findByIdAndUpdate(job_profile, {
        $pull: {
            job_applications: jobApplicationId,
        },
    }).exec();
    JobApplicationModel.findByIdAndDelete(jobApplicationId).exec();
    return;
}

async function rejectJobApplication({ jobApplicationId }) {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(jobApplicationId, {
        status: "rejected",
    }, {
        new: true,
    }).exec();
    return jobApplication;
};

async function acceptJobApplication({ jobApplicationId }) {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(jobApplicationId, {
        status: "accepted",
    }, {
        new: true,
    }).exec();
    return jobApplication;
};


module.exports = {
    createJobApplication,
    getJobApplicationsForIndividual,
    getJobApplication,
    getJobApplicationBasic,
    updateJobApplication,
    deleteJobApplication,
    rejectJobApplication,
    acceptJobApplication,
};

