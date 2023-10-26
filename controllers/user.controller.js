const { ForbiddenError } = require('../errors');
const {
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} = require('../services/user.service');
const { validateUser } = require('../services/utils/user.utils');

const UserController = {
    list: async (req, res, next) => {
        try {
            const users = await listUsers();
            res.json({
                message: "Fetched users successfully",
                payload: {
                    users,
                }
            });
        } catch (error) {
            next(error);
        }
    },

    get: async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await getUser({ id });
            res.json({
                message: `Fetched user ${id} successfully`,
                payload: {
                    user,
                }
            });
        } catch (error) {
            next(error);
        }
    },

    create: async (req, res, next) => {
        try {
            const { user } = req.body;
            validateUser({ user });
            const newUser = await createUser({ user });
            res.status(200).json({
                message: "User created successfully",
                payload: {
                    user: newUser,
                }
            });
        } catch (error) {
            next(error);
        }
    },

    update: async (req, res, next) => {
        try {
            const id = req.user._id;
            if (!id) throw new ForbiddenError("You are not allowed to update this user");
            const { user } = req.body;
            validateUser({ user });
            const updatedUser = await updateUser({ id, user });
            res.json({
                message: `Updated user ${id} successfully`,
                payload: {
                    user: updatedUser,
                }
            });
        } catch (error) {
            next(error);
        }
    },

    delete: async (req, res, next) => {
        try {
            const id = req.user._id;
            if (!id) throw new ForbiddenError("You are not allowed to delete this user");
            await deleteUser({ id });
            res.status(204).json({
                message: `Deleted user ${id} successfully`,
                payload: {}
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = UserController;
