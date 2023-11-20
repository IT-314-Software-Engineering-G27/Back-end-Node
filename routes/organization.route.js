const express = require('express');
const organizationRouter = express.Router();
const OrganizationController = require('../controllers/organization.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

organizationRouter.post('/', OrganizationController.create);
organizationRouter.get('/', OrganizationController.list);
organizationRouter.get('/profile', tokenToIDMiddleware, OrganizationController.getProfile);
organizationRouter.get('/events', tokenToIDMiddleware, OrganizationController.getEvents);
organizationRouter.get('/:id', OrganizationController.get);
organizationRouter.get('/:id/basic', OrganizationController.getBasic);
organizationRouter.put('/', tokenToIDMiddleware, OrganizationController.update);
organizationRouter.delete('/', tokenToIDMiddleware, OrganizationController.delete);
module.exports = organizationRouter;