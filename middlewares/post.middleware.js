const { UnauthorizedError, NotFoundError } = require('../errors');
const { getUser } = require('../services/user.service');

async function postValidationMiddleware(req, res, next) {
    try {
        const userId = req.user._id;
        const user = await getUser({ userId });
        if (!user) {
            throw new NotFoundError('User not found');
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    postValidationMiddleware,
};
