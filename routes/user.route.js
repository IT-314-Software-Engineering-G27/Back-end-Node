const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

router.post('/', UserController.create);
router.get('/', UserController.list);
router.get('/:id', UserController.get);
router.put('/', tokenToIDMiddleware, UserController.update);
router.delete('/', tokenToIDMiddleware, UserController.delete);

module.exports = router;
