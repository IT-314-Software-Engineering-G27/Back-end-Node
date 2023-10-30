const IndividualModel = require("../models/individual.model");
const JobApplicationModel = require("../models/jobApplication.model");
const { ForbiddenError } = require("../errors");


async function createJobApplication({ jobApplication }) {
    const newJobApplication = await JobApplicationModel.create(jobApplication);
    return newJobApplication;
};

async function getJobApplicationsForIndividual({ id }) {
    const { job_applications } = await IndividualModel.findById(id, {
        job_applications: 1,
    }).exec();
    return job_applications.map((jobApplication) => jobApplication.toString());
};

async function getJobApplicationsForJobProfile({ jobProfile }) {
    return [];
};

async function getJobApplication({ id }) {
    const jobApplication = await JobApplicationModel.findById(id).exec();
    return jobApplication;
};

async function updateJobApplication({ id, jobApplication: {
    cover_letter,
} }) {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(id, {
        cover_letter,
    }, {
        new: true,
    }).exec();
    return jobApplication;
};

async function deleteJobApplication({ id, individual }) {
    const jobApplication = await JobApplicationModel.findById(id).exec();
    if (jobApplication.individual.toString() !== individual) {
        throw new ForbiddenError("You are not authorized to delete this job application");
    }
    JobApplicationModel.findByIdAndDelete(id).exec();
    return jobApplication;
}

async function rejectJobApplication({ id, }) {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(id, {
        status: "rejected",
    }, {
        new: true,
    }).exec();
    return jobApplication;
};

async function acceptJobApplication({ id }) {
    const jobApplication = await JobApplicationModel.findByIdAndUpdate(id, {
        status: "accepted",
    }, {
        new: true,
    }).exec();
    return jobApplication;
};


module.exports = {
    createJobApplication,
    getJobApplicationsForIndividual,
    getJobApplicationsForJobProfile,
    getJobApplication,
    updateJobApplication,
    deleteJobApplication,
    rejectJobApplication,
    acceptJobApplication,
};

