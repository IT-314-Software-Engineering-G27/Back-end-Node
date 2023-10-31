const express = require('express');
const fileRouter = express.Router();
const FileController = require('../controllers/file.controller');
const { upload, gridFSMiddleware } = require('../middlewares/file.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

fileRouter.get('/:id', FileController.get);
fileRouter.post('/profile', upload.single('file'), tokenToIDMiddleware, gridFSMiddleware, FileController.updateProfile);

module.exports = fileRouter;

