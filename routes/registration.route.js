const express = require('express');
const registrationRouter = express.Router();
const RegistrationController = require('../controllers/registration.controller');

registrationRouter.get('/:id', RegistrationController.get);
registrationRouter.get('/:id/basic', RegistrationController.getBasic);

module.exports = registrationRouter;

