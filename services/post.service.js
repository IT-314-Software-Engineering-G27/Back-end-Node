const { BadRequestError, NotFoundError } = require('../errors');
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');

async function listPosts({ query, page, limit }) {
  return (await PostModel.find({
    $or: [
      { title: { $regex: `${query}`, $options: 'i', }, },
    ]
  }, {
    _id: 1,
  }).sort({ likes: -1 }).skip(page * limit).limit(limit).exec()).map((post) => post._id);
};

async function deepSearchPosts({ query, page, limit }) {
  return (await PostModel.find({ $text: { $search: query } }, {
    score: {
      $meta: 'textScore',
    },
    _id: 1,
  }).sort({
    score: {
      $meta: 'textScore',
    },
  }).skip(page * limit).limit(limit).exec()).map((post) => post._id);
};

async function createPost({ post, userId }) {
  const newPost = await PostModel.create({
    ...post,
    user: userId,
  });
  await UserModel.findByIdAndUpdate(userId, { $push: { posts: newPost._id } }).exec();
  return newPost;
}

async function updatePostImage({ postId, fileId, host }) {
  const url = `${host}/files/${fileId}`;
  return await PostModel.findByIdAndUpdate(
    postId,
    { image: url },
    { new: true }
  ).exec();
}

async function updatePost({ postId, post }) {
  const updatedPost = await PostModel.findByIdAndUpdate(postId, post, {
    new: true,
  }).exec();
  if (!updatedPost)
    throw new NotFoundError('Post not found');
  return updatedPost;
}

async function getPostBasic({ postId }) {
  return await PostModel.findById(postId, {
    description: 0,
    likes: 0,
  }).populate({
    path: 'user',
    select: {
      username: 1,
      profile_image: 1,
      role: 1,
    }
  }).exec();
};

async function getPost({ postId }) {
  const post = await PostModel.findById(postId, {
    likes: 0,
  }).populate({
    path: 'user',
    select: {
      username: 1,
      profile_image: 1,
      role: 1,
      individual: 1,
      organization: 1,
    }
  }).exec();
  if (!post) {
    throw new NotFoundError('Post not found');
  }
  return post;
};

async function deletePost({ postId, userId }) {
  await PostModel.findByIdAndDelete(postId).exec();
  await UserModel.findByIdAndUpdate(userId, { $pull: { posts: postId } }).exec();
  return true;
};

async function getPostStatus({ postId, userId }) {
  const { likes, user } = await PostModel.findById(postId, {
    likes: 1,
    user: 1,
  });

  const isLiked = likes.filter((like) => like.toString() === userId.toString());
  return {
    isLiked: isLiked.length > 0,
    likes: likes.length,
    editable: user.toString() === userId.toString(),
  };
};

async function likePost({ postId, userId }) {
  return await PostModel.findByIdAndUpdate(
    postId,
    { $addToSet: { likes: userId } },
    { new: true }
  ).exec();
};

async function unlikePost({ postId, userId }) {
  return await PostModel.findByIdAndUpdate(
    postId,
    { $pull: { likes: userId } },
    { new: true }
  ).exec();
};



module.exports = {
  createPost,
  updatePost,
  updatePostImage,
  getPost,
  getPostBasic,
  deletePost,
  listPosts,
  deepSearchPosts,
  getPostStatus,
  likePost,
  unlikePost,
};
