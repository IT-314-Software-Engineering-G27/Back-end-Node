const express = require('express');
const individualRouter = express.Router();
const IndividualController = require('../controllers/individual.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

individualRouter.post('/', IndividualController.create);
individualRouter.get('/', IndividualController.list);
individualRouter.get('/profile', tokenToIDMiddleware, IndividualController.getProfile);
individualRouter.get('/:id', IndividualController.get);
individualRouter.get('/:id/basic', IndividualController.getBasic);
individualRouter.put('/', tokenToIDMiddleware, IndividualController.update);
individualRouter.delete('/', tokenToIDMiddleware, IndividualController.delete);

module.exports = individualRouter;
