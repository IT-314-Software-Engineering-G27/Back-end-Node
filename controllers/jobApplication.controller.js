const {  getJobApplicationsForIndividual, getJobApplication, getJobApplicationBasic, updateJobApplication, deleteJobApplication, rejectJobApplication, acceptJobApplication, } = require('../services/jobApplication.service');

const JobApplicationController = {
    list: async (req, res, next) => {
        try {
            const jobApplications = await getJobApplicationsForIndividual({ individualId: req.user.individual });
            res.json({
                message: "Job applications retrieved successfully",
                payload: {
                    jobApplications,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const jobApplication = await getJobApplication({ jobApplicationId: req.params.id });
            res.json({
                message: "Job application retrieved successfully",
                payload: {
                    jobApplication,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    getBasic: async (req, res, next) => {
        try {
            const jobApplication = await getJobApplicationBasic({ jobApplicationId: req.params.id });
            res.json({
                message: "Job application retrieved successfully",
                payload: {
                    jobApplication,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            if (req.user.role !== 'individual')
                throw new ForbiddenError('You are not authorized to access this resource');
            const { cover_letter } = req.body;
            if (!cover_letter)
                throw new BadRequestError('Cover letter is required');
            const jobApplication = await updateJobApplication({
                jobApplicationId: req.params.id, jobApplication: {
                    cover_letter,
                }
            });
            res.json({
                message: "Job application updated successfully",
                payload: {
                    jobApplication,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    accept: async (req, res, next) => {
        try {
            if (req.user.role !== 'organization')
                throw new ForbiddenError('You are not authorized to access this resource');
            const jobApplication = await acceptJobApplication({ jobApplicationId: req.params.id });
            res.json({
                message: "Job application accepted successfully",
                payload: {
                    jobApplication,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    reject: async (req, res, next) => {
        try {
            if (req.user.role !== 'organization')
                throw new ForbiddenError('You are not authorized to access this resource');
            const jobApplication = await rejectJobApplication({ jobApplicationId: req.params.id });
            res.json({
                message: "Job application rejected successfully",
                payload: {
                    jobApplication,
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            if (req.user.role !== 'individual')
                throw new ForbiddenError('You are not authorized to access this resource');
            await deleteJobApplication({ jobApplicationId: req.params.id });
            res.json({
                message: "Job application deleted successfully",
            });
        }
        catch (error) {
            next(error);
        }
    }
};

module.exports = JobApplicationController;