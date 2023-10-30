const express = require('express');
const connectionRouter = express.Router();
const ConnectionController = require('../controllers/connection.controller');
const { connectionRoleMiddleware } = require('../middlewares/connection.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

connectionRouter.get('/', tokenToIDMiddleware, ConnectionController.list);
connectionRouter.post('/:id', tokenToIDMiddleware, ConnectionController.create);
connectionRouter.get('/:id/', tokenToIDMiddleware, connectionRoleMiddleware, ConnectionController.get);
connectionRouter.post('/:id/accept', tokenToIDMiddleware, connectionRoleMiddleware, ConnectionController.accept);
connectionRouter.post('/:id/reject', tokenToIDMiddleware, connectionRoleMiddleware, ConnectionController.reject);
connectionRouter.post('/:id/message', tokenToIDMiddleware, connectionRoleMiddleware, ConnectionController.message);
connectionRouter.delete('/:id/', tokenToIDMiddleware, connectionRoleMiddleware, ConnectionController.delete);

module.exports = connectionRouter;
