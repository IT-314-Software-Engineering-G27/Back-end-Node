const LIMIT_PER_PAGE = 10;
const {
    listOrganizations,
    createOrganization,
    getOrganization,
    getOrganizationBasic,
    getOrganizationProfile,
    getEvents,
    getJobProfiles,
    deleteOrganization,
    updateOrganization,
} = require("../services/organization.service");
const {
    validateOrganization,
    transformInputToOrganization,
} = require("../services/utils/organization.util");

const OrganizationController = {
    list: async (req, res, next) => {
        try {
            const { query, page } = req.query;
            const organizations = await listOrganizations({ query: query ?? "", page: page ?? 0, limit: LIMIT_PER_PAGE });
            res.json({
                message: "Fetched organizations successfully",
                payload: {
                    organizations,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { organization } = req.body;
            validateOrganization({ organization });
            const transformedOrganization = transformInputToOrganization({ organization });
            const newOrganization = await createOrganization({ organization: transformedOrganization });
            res.json({
                message: "Created organization successfully",
                payload: {
                    organization: newOrganization,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.params;
            const organization = await getOrganization({ organizationId: id });
            res.json({
                message: "Fetched organization successfully",
                payload: {
                    organization,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getBasic: async (req, res, next) => {
        try {
            const { id } = req.params;
            const organization = await getOrganizationBasic({ organizationId: id });
            res.json({
                message: "Fetched organization successfully",
                payload: {
                    organization,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
            const { id } = req.user;
            const organization = await getOrganizationProfile({ organizationId: req.user.organization });
            res.json({
                message: "Fetched organization successfully",
                payload: {
                    organization,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getEvents: async (req, res, next) => {
        try {
            const events = await getEvents(({ organizationId: req.user.organization }));
            res.json({
                message: "Fetched events successfully",
                payload: {
                    events: events,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getJobProfiles: async (req, res, next) => {
        try {
            const profiles = await getJobProfiles(({ organizationId: req.user.organization }));
            res.json({
                message: "Fetched job profiles successfully",
                payload: {
                    profiles: profiles,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { organization } = req.body;
            validateOrganization({ organization });
            const transformedOrganization = transformInputToOrganization({ organization });
            const updatedOrganization = await updateOrganization({ user: req.user, organization: transformedOrganization });
            res.json({
                message: "Updated organization successfully",
                payload: {
                    organization: updatedOrganization,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await deleteOrganization({ user: req.user });
            res.json({
                message: "Deleted organization successfully",
                payload: {}
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = OrganizationController;