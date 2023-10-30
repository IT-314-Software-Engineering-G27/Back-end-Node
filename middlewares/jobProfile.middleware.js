const { ForbiddenError } = require('../errors');
const { getJobProfileBasic } = require('../services/jobProfile.service');
async function jobProfileMiddleware(req, res, next) {
    try {
        const organization = req.user.organization;
        const jobProfile = await getJobProfileBasic({ jobProfileId: req.params.id });
        if (jobProfile.organization.toString() !== organization) {
            throw new ForbiddenError("You are not allowed to access this resource");
        }
        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    jobProfileMiddleware,
}