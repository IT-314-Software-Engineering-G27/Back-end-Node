const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

router.get('/', AuthController.get);
router.post('/', AuthController.post);

module.exports = router;
