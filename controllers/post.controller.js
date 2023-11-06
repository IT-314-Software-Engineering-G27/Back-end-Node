const { BadRequestError, NotFoundError } = require('../errors');
const { createPost, updatePost, getPost, deletePost, listPosts, likePost, unlikePost } = require('../services/post.service');

const LIMIT_PER_PAGE = 5;

const PostController = {
    list: async (req, res, next) => {
        try {
            const { page } = req.query;
            const posts = await listPosts({ page: page ?? 0, limit: LIMIT_PER_PAGE });
            res.json({
                message: 'Fetched posts successfully',
                payload: {
                    posts,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const { post } = req.body;
            
            if (!post || !post.title || !post.content) {
                throw new BadRequestError('Title and content are required for creating a post.');
            }
    
            const newPost = await createPost({ post });
            res.json({
                message: 'Created post successfully',
                payload: {
                    post: newPost,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    

    get: async (req, res, next) => {
        try {
            const { id } = req.params;
            const post = await getPost({ postId: id });
            res.json({
                message: 'Fetched post successfully',
                payload: {
                    post,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const { post } = req.body;
            const { id } = req.params;
            const updatedPost = await updatePost({ postId: id, post });
            res.json({
                message: 'Updated post successfully',
                payload: {
                    post: updatedPost,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params;
            await deletePost({ postId: id });
            res.json({
                message: 'Deleted post successfully',
                payload: {},
            });
        } catch (error) {
            next(error);
        }
    },

    like: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { userId } = req.body;
            const post = await likePost({ postId: id, userId });
            res.json({
                message: 'Liked post successfully',
                payload: {
                    post,
                },
            });
        } catch (error) {
            next(error);
        }
    },

    unlike: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { userId } = req.body; // Adjust to get user ID
            const post = await unlikePost({ postId: id, userId });
            res.json({
                message: 'Unliked post successfully',
                payload: {
                    post,
                },
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = PostController;
