const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/event.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

eventRouter.post('/', eventController.create);
eventRouter.get('/', eventController.list);
eventRouter.get('/details', tokenToIDMiddleware, eventController.getDetails);
eventRouter.get('/:id', eventController.get);
eventRouter.put('/', tokenToIDMiddleware, eventController.update);
eventRouter.delete('/', tokenToIDMiddleware, eventController.delete);

module.exports = eventRouter;
