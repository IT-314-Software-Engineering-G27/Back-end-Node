const express = require('express');
const eventRouter = express.Router();
const { eventMiddleware } = require('../middlewares/event.middleware');
const eventController = require('../controllers/event.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

eventRouter.post('/', tokenToIDMiddleware, eventMiddleware, eventController.create);
eventRouter.get('/', eventController.list);
eventRouter.get('/:id', eventController.get);
eventRouter.get('/:id/status', tokenToIDMiddleware, eventController.getStatus);
eventRouter.get('/:id/registrations', eventController.getRegistrations);
eventRouter.post('/:id/registrations', tokenToIDMiddleware, eventController.register);
eventRouter.delete('/:id/registrations', tokenToIDMiddleware, eventController.deregister);
eventRouter.put('/:id', tokenToIDMiddleware, eventMiddleware, eventController.update);
eventRouter.delete('/:id', tokenToIDMiddleware, eventMiddleware, eventController.delete);

module.exports = eventRouter;
