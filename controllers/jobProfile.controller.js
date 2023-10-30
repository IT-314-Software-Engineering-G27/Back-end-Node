const LIMIT_PER_PAGE = 10;
const { getJobProfile } = require("../services/jobProfile.service");
const { listJobProfiles, listApplications, deleteJobProfile, createJobProfile, getJobProfileBasic, updateJobProfile, } = require("../services/jobProfile.service");
const { transformInputToJobProfile } = require("../services/utils/jobProfile.util");

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
            const { jobProfile } = req.body;
            const newJobProfile = await createJobProfile({ jobProfile: transformInputToJobProfile({ jobProfile }), organizationId: req.user.organization });
            res.json({
                message: "Job profile created successfully",
                payload: {
                    profile: newJobProfile,
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
    update: async (req, res, next) => {
        try {
            const { jobProfile } = req.body;
            const newJobProfile = await updateJobProfile({ jobProfileId: req.params.id, jobProfile: transformInputToJobProfile({ jobProfile: jobProfile }) });
            res.json({
                message: "Job profile updated successfully",
                payload: {
                    profile: newJobProfile,
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