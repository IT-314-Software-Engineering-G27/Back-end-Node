const LIMIT_PER_PAGE = 10;
const { BadRequestError } = require("../errors");
const { listIndividuals, createIndividual, getIndividualBasic, deleteIndividual, updateIndividual, getIndividual, getIndividualProfile, deepSearchIndividuals } = require("../services/individual.service");
const { transformInputToIndividual, validateIndividual } = require("../services/utils/individual.util");

const IndividualController = {
    list: async (req, res, next) => {
        try {
            const { query, page, deep } = req.query;
            const individuals = deep === "true" ? await deepSearchIndividuals({ query: query ?? "", page: Number(page) ?? 0, limit: LIMIT_PER_PAGE }) :
                await listIndividuals({ query: query ?? "", page: Number(page) ?? 0, limit: LIMIT_PER_PAGE });
            res.json({
                message: "Fetched individuals successfully",
                payload: {
                    individuals,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    create: async (req, res, next) => {
        try {
            const { individual } = req.body;
            if (!individual?.user) throw new BadRequestError("User is required");
            validateIndividual({ individual });
            const transformedIndividual = transformInputToIndividual({ individual });
            const newIndividual = await createIndividual({ individual: transformedIndividual });
            res.json({
                message: "Created individual successfully",
                payload: {
                    individual: newIndividual,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    get: async (req, res, next) => {
        try {
            const { id } = req.params;
            const individual = await getIndividual({ individualId: id });
            res.json({
                message: "Fetched individual successfully",
                payload: {
                    individual,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getBasic: async (req, res, next) => {
        try {
            const { id } = req.params;
            const individual = await getIndividualBasic({ individualId: id });
            res.json({
                message: "Fetched individual successfully",
                payload: {
                    individual,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    getProfile: async (req, res, next) => {
        try {
            const individual = await getIndividualProfile({ individualId: req.user.individual });
            res.json({
                message: "Fetched individual successfully",
                payload: {
                    individual,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    update: async (req, res, next) => {
        try {
            const { individual } = req.body;
            validateIndividual({ individual });
            const transformedIndividual = transformInputToIndividual({ individual });
            const updatedIndividual = await updateIndividual({ user: req.user, individual: transformedIndividual });
            res.json({
                message: "Updated individual successfully",
                payload: {
                    individual: updatedIndividual,
                }
            });
        } catch (error) {
            next(error);
        }
    },
    delete: async (req, res, next) => {
        try {
            await deleteIndividual({ user: req.user });
            res.json({
                message: "Deleted individual successfully",
                payload: {}
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = IndividualController;