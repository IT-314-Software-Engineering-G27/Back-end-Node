const express = require('express');
const registrationRouter = express.Router();
const RegistrationController = require('../controllers/registration.controller');

registrationRouter.get('/:id', registrationController.get);
registrationRouter.getBasic('/:id/basic', registrationController.getBasic);

module.exports = registrationRouter;

