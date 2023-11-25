const { BadRequestError } = require("../../errors");

function transformInputToJobProfile({ jobProfile }) {
    if (new Date(jobProfile.deadline) <= new Date()) {
        throw new BadRequestError("Deadline must be in the future");
    }

    return {
        title: jobProfile.title,
        description: jobProfile.description,
        posting_location: jobProfile.posting_location,
        requirements: jobProfile.requirements,
        salary: jobProfile.salary,
        deadline: jobProfile.deadline,
        compensations: jobProfile.compensations,
        duration: jobProfile.duration,
    }
}

module.exports = {
    transformInputToJobProfile,
};