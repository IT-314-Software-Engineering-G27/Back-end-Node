const { ForbiddenError } = require('../errors');
const { getJobApplicationBasic } = require('../services/jobApplication.service');
const { getJobProfileBasic } = require('../services/jobProfile.service');
async function jobApplicationMiddleware(req, res, next) {
    try {
        const organization = req.user.organization;
        const individual = req.user.individual;
        const jobApplication = await getJobApplicationBasic({ jobApplicationId: req.params.id });
        const jobProfile = await getJobProfileBasic({ jobProfileId: jobApplication.job_profile });
        if (jobProfile.organization == organization)
            req.user.role = 'organization';
        else if (jobApplication.individual == individual)
            req.user.role = 'individual';
        else
            throw new ForbiddenError('You are not authorized to access this resource');
        next();
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    jobApplicationMiddleware,
}