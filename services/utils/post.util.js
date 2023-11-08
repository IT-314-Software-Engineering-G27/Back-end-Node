const { BadRequestError, InternalServerError } = require("../../errors");

function validatePost({ post }) {
    if (!post) throw new BadRequestError("Post not provided");
};

function transformInputToPost({ post }) {
    if (!post) throw new InternalServerError("Post is not defined");
    return {
        title: post.title,
        subject: post.subject,
        description: post.description,
        image: post.image,
    };
}

module.exports = {
    validatePost,
    transformInputToPost,
};