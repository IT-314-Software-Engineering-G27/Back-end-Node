const LIMIT_PER_PAGE = 10;
const {
    listJobProfiles,
    findJobProfiles,
    listApplicants,
    deleteJobProfile,
} = require("../services/job_profile.service");

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
    findProfile: async (req, res, next) => {
        try {
            const { id } = req.id;
            const profile = await findJobProfiles({ id: req.id });
            res.json({
                message: "Fetched job profile successfully",
                payload: {
                    profile,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    listApplicants: async (req, res, next) => {
        try {
            const { id } = req.id;
            const applicants = await listApplicants({ id: req.id });
            res.json({
                message: "Fetched applicants successfully",
                payload: {
                    applicants,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            const { id } = req.id;
            const profile = await deleteJobProfile({ id: req.id });
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