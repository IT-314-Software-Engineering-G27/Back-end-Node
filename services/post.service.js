const { BadRequestError, NotFoundError } = require('../errors');
const PostModel = require('../models/post.model');
const { uploadFile, removeFile } = require('./file.service');

async function createPost({ post, imageFile }) {
    try {
      if (imageFile) {
        const imageFileId = await uploadFile(imageFile);
        post.image = imageFileId; // Attach the image file's ID to the post
      }
  
      return await PostModel.create(post);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
}

async function updatePost({ postId, post, imageFile }) {
    const updatedPost = await PostModel.findByIdAndUpdate(postId, post, {
      new: true,
    }).exec();
    if (!updatedPost) {
      throw new NotFoundError('Post not found');
    }
  
    if (imageFile) {
      if (updatedPost.image) {
        await removeFile(updatedPost.image); // Remove the previous image
      }
      const imageFileId = await uploadFile(imageFile);
      updatedPost.image = imageFileId; // Update the image file's ID
    }
  
    return updatedPost;
}

async function getPost({ postId }) {
    const post = await PostModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundError('Post not found');
    }
    return post;
}

async function deletePost({ postId }) {
  const post = await PostModel.findByIdAndDelete(postId).exec();
  if (!post) {
    throw new NotFoundError('Post not found');
  }
  return post;
}

async function listPosts({ page, limit }) {
  return PostModel.find({}, { _id: 1 })
    .skip(page * limit)
    .limit(limit)
    .exec();
}

async function createLike({ postId, userId }) {
    const post = await PostModel.findById(postId).exec();
    if (!post) {
      throw new NotFoundError('Post not found');
    }
  
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
    }
  
    return post;
}

async function likePost({ postId, userId }) {
  const post = await PostModel.findById(postId).exec();
  if (!post) {
    throw new NotFoundError('Post not found');
  }

  if (!post.likes.includes(userId)) {
    post.likes.push(userId);
    await post.save();
  }

  return post;
}

async function unlikePost({ postId, userId }) {
  const post = await PostModel.findById(postId).exec();
  if (!post) {
    throw new NotFoundError('Post not found');
  }

  const index = post.likes.indexOf(userId);
  if (index !== -1) {
    post.likes.splice(index, 1);
    await post.save();
  }

  return post;
}

module.exports = {
  createPost,
  updatePost,
  getPost,
  deletePost,
  listPosts,
  createLike,
  likePost,
  unlikePost,
};
