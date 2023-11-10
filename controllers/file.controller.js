const { uploadFile, retrieveFile } = require('../services/file.service');
const { updateProfileImage } = require('../services/user.service');
const { updatePostImage } = require('../services/post.service');
const { updateRegistrationImage} = require('../services/registration.service');

const FileController = {
    get: async (req, res) => {
        try {
            await retrieveFile({ fileId: req.params.id, stream: res });
        }
        catch (error) {
            next(error);
        }
    },
    post: async (req, res) => {
        const fileId = await uploadFile({ file: req.file });
        res.json({
            message: 'File uploaded successfully',
            payload: {
                fileId,
            }
        });
    },
    updateProfile: async (req, res) => {
        try {
            const url = `${req.protocol}://${req.get('host')}`;
            const newUser = await updateProfileImage({
                userId: req.user._id,
                fileId: req.file._id,
                host: url,
            });
            res.json({
                message: 'Profile image updated successfully',
                payload: {
                    user: newUser,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    updatePostImage: async (req, res, next) => {
        try {
            const url = `${req.protocol}://${req.get('host')}`;
            const newPost = await updatePostImage({
                postId: req.params.id,
                fileId: req.file._id,
                host: url,
            });
            res.json({
                message: 'Post image updated successfully',
                payload: {
                    post: newPost,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    updateRegistrationImage: async (req, res, next) => {
        try {
            const url = `${req.protocol}://${req.get('host')}`;
            const newRegistration = await updateRegistrationImage({
                registrationId: req.params.id,
                fileId: req.file._id,
                host: url,
                organizationId: req.user.organization,
            });
            res.json({
                message: 'Registration image updated successfully',
                payload: {
                    registration: newRegistration,
                }
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = FileController;