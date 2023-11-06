const express = require('express');
const postRouter = express.Router();
const PostController = require('../controllers/post.controller');
const { postMiddleware } = require('../middlewares/post.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

postRouter.post('/', tokenToIDMiddleware, postMiddleware, PostController.create);
postRouter.get('/:id', tokenToIDMiddleware, postMiddleware, PostController.get);
postRouter.put('/:id', tokenToIDMiddleware, postMiddleware, PostController.update);
postRouter.delete('/:id', tokenToIDMiddleware, postMiddleware, PostController.delete);

module.exports = postRouter;
