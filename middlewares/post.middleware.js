const { UnauthorizedError, NotFoundError, ForbiddenError } = require('../errors');
const { getPostBasic } = require('../services/post.service');

async function postMiddleware(req, res, next) {
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const { user } = await getPostBasic({ postId });
        if (!user) throw new NotFoundError('Post not found');
        if (user._id.toString() !== userId.toString())
            throw new ForbiddenError('You are not allowed to edit this post');
        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    postMiddleware,
};
