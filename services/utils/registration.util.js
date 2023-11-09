
function transformInputToRegistration({ registration }) {
    return {
        title: registration.title,
        description: registration.description,
        images: registration.images,
    }
}

module.exports = {
    transformInputToRegistration,
};