const { BadRequestError, NotFoundError } = require('../errors');
const { createPost, updatePost, getPost, deletePost, listPosts, likePost, unlikePost, getPostBasic, deepSearchPosts, getPostStatus } = require('../services/post.service');
const { validatePost, transformInputToPost } = require('../services/utils/post.util');

const LIMIT_PER_PAGE = 5;

const PostController = {
    list: async (req, res, next) => {
        try {
            const { page, query, deep } = req.query;
            const posts = deep === "true" ? await deepSearchPosts({ query: query ?? '', page: Number(page) ?? 0, limit: LIMIT_PER_PAGE }) : await listPosts({ query: query ?? '', page: Number(page) ?? 0, limit: LIMIT_PER_PAGE });
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
            validatePost({ post });
            const transformedPost = transformInputToPost({ post });
            const newPost = await createPost({ post: transformedPost, userId: req.user._id });
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
            const post = await getPost({ postId: req.params.id });
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
    getBasic: async (req, res, next) => {
        try {
            const post = await getPostBasic({ postId: req.params.id });
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
    getStatus: async (req, res, next) => {
        try {
            const status = await getPostStatus({ postId: req.params.id, userId: req.user._id });
            res.json({
                message: 'Fetched post status successfully',
                payload: {
                    status,
                },
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { post } = req.body;
            validatePost({ post });
            const transformedPost = transformInputToPost({ post });
            const updatedPost = await updatePost({ postId: req.params.id, post: transformedPost });
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
            await deletePost({ postId: id, userId: req.user._id });
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
            const post = await likePost({ postId: id, userId: req.user._id });
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
            const post = await unlikePost({ postId: id, userId: req.user._id });
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
