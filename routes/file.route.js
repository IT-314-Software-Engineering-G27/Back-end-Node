const express = require('express');
const fileRouter = express.Router();
const FileController = require('../controllers/file.controller');
const { upload, gridFSMiddleware } = require('../middlewares/file.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');
const { postMiddleware } = require('../middlewares/post.middleware');

fileRouter.get('/:id', FileController.get);
fileRouter.post('/profile', upload.single('file'), tokenToIDMiddleware, gridFSMiddleware, FileController.updateProfile);
fileRouter.post('/posts/:id', upload.single('file'), tokenToIDMiddleware, gridFSMiddleware, postMiddleware ,FileController.updatePostImage);
fileRouter.post('/registrations/:id', upload.single('file'), tokenToIDMiddleware, gridFSMiddleware, FileController.updateRegistrationImage);

module.exports = fileRouter;

