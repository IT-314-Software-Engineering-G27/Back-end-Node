const {  ForbiddenError } = require('../errors');

async function eventMiddleware(req, res, next) {
    try {
        if (req.user.email !== process.env.NODEMAILER_EMAIL)
            throw new ForbiddenError('You are not allowed access to this resource');
        next();
    } catch (error) {
        next(error);
    }
}


module.exports = {
    eventMiddleware,
};
