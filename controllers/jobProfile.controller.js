const LIMIT_PER_PAGE = 10;
const { getJobProfile } = require("../services/jobProfile.service");
const { listJobProfiles, listApplications, deleteJobProfile, createJobProfile, getJobProfileBasic, updateJobProfile, } = require("../services/jobProfile.service");
const { createJobApplication } = require("../services/jobApplication.service");
const { transformInputToJobProfile } = require("../services/utils/jobProfile.util");
const { ForbiddenError, BadRequestError } = require("../errors");

const JobProfileController = {
    list: async (req, res, next) => {
        try {
            const { query, page } = req.query;
            const job_profiles = await listJobProfiles({ query: query ?? "", page: page ?? 0, limit: LIMIT_PER_PAGE });
            res.json({
                message: "Fetched job profiles successfully",
                payload: {
                    job_profiles,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            if(req.user.role !== 'organization') throw new ForbiddenError('You are not authorized to access this resource');
            const { jobProfile } = req.body;
            if(!jobProfile) throw new BadRequestError('Job profile is required');
            const newJobProfile = await createJobProfile({ jobProfile: transformInputToJobProfile({ jobProfile }), organizationId: req.user.organization });
            res.json({
                message: "Job profile created successfully",
                payload: {
                    jobProfile: newJobProfile,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const jobProfile = await getJobProfile({ jobProfileId: req.params.id });
            res.json({
                message: "Fetched job profile successfully",
                payload: {
                    jobProfile,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getBasic: async (req, res, next) => {
        try {
            const jobProfile = await getJobProfileBasic({ jobProfileId: req.params.id });
            res.json({
                message: "Fetched job profile successfully",
                payload: {
                    jobProfile,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getApplications: async (req, res, next) => {
        try {
            const applications = await listApplications({ jobProfileId: req.params.id });
            res.json({
                message: "Fetched applicants successfully",
                payload: {
                    applications,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    apply: async (req, res, next) => {
        try {
            if(req.user.role !== 'individual') throw new ForbiddenError('You are not authorized to access this resource');
            const { cover_letter } = req.body;
            const newJobApplication = await createJobApplication({ jobApplication: { cover_letter: cover_letter ?? "" }, individualId: req.user.individual, jobProfileId: req.params.id });
            res.json({
                message: "Job application created successfully",
                payload: {
                    application: newJobApplication,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { jobProfile } = req.body;
            if(!jobProfile) throw new BadRequestError('Job profile is required');
            const newJobProfile = await updateJobProfile({ jobProfileId: req.params.id, jobProfile: transformInputToJobProfile({ jobProfile }) });
            res.json({
                message: "Job profile updated successfully",
                payload: {
                    jobProfile: newJobProfile,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await deleteJobProfile({ id: req.params.id });
            res.json({
                message: "Job profile deleted successfully",
                payload: {}
            });
        } catch (error) {
            next(error);
        }
    },
}

module.exports = JobProfileController;