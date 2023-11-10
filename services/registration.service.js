
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

module.exports = {
    getRegistration,
    getRegistrationBasic
};