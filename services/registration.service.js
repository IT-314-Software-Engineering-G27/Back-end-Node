
const { ForbiddenError } = require('../errors');
const RegistrationModel = require('../models/registration.model');

async function getRegistration({ registrationId }) {
    return await RegistrationModel.findById(registrationId);
};

async function getRegistrationBasic({ registrationId }) {
    return await RegistrationModel.findById(registrationId, {
        title: 1,
        event: 1,
        organization: 1,
    });
};

async function updateRegistrationImage({ registrationId, fileId, host, organizationId }) {
    const { organization } = await getRegistrationBasic({ registrationId });
    if (!organizationId.toString() || organization.toString() !== organizationId.toString()) {
        throw new ForbiddenError('You are not allowed to update this registration');
    };
    return await RegistrationModel.findByIdAndUpdate(registrationId, {
        $addToSet: {
            images: `${host}/files/${fileId}`,
        },
    });
};

module.exports = {
    getRegistration,
    getRegistrationBasic,
    updateRegistrationImage,
};