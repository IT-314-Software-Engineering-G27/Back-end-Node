const express = require('express');
const postRouter = express.Router();
const PostController = require('../controllers/post.controller');
const { postMiddleware } = require('../middlewares/post.middleware');
const { tokenToIDMiddleware } = require('../middlewares/auth.middleware');

postRouter.get('/', PostController.list);
postRouter.get('/:id', PostController.get);
postRouter.get('/:id/basic', PostController.getBasic);

postRouter.post('/', tokenToIDMiddleware, PostController.create);

postRouter.get('/:id/status', tokenToIDMiddleware, PostController.getStatus);
postRouter.post('/:id/like', tokenToIDMiddleware, PostController.like);
postRouter.delete('/:id/like', tokenToIDMiddleware, PostController.unlike);

postRouter.put('/:id', tokenToIDMiddleware, postMiddleware, PostController.update);
postRouter.delete('/:id', tokenToIDMiddleware, postMiddleware, PostController.delete);

module.exports = postRouter;
