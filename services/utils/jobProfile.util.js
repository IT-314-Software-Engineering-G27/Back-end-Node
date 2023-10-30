

function transformInputToJobProfile({ jobProfile }) {
    return {
        title: jobProfile.title,
        description: jobProfile.description,
        posting_location: jobProfile.posting_location,
        requirements: jobProfile.requirements,
        wages: jobProfile.wages,
    }
}

module.exports = {
    transformInputToJobProfile,
};