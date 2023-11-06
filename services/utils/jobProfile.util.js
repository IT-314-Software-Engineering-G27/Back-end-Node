

function transformInputToJobProfile({ jobProfile }) {
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