const { getRegistration, getRegistrationBasic } = require('../services/registration.service');

const RegistrationController = {
    get: async (req, res) => {
        const registration = await getRegistration({ registrationId: req.params.id });
        res.json({
            message: 'Registration found',
            payload: {
                registration
            }
        });
    },
    getBasic: async (req, res) => {
        const registration = await getRegistrationBasic({ registrationId: req.params.id });
        res.json({
            message: 'Registration found',
            payload: {
                registration
            }
        });
    }
};

module.exports = RegistrationController;