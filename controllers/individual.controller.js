const LIMIT_PER_PAGE = 10;
const { listIndividuals, createIndividual, getIndividualBasic, deleteIndividual, updateIndividual, getIndividual, getIndividualProfile } = require("../services/individual.service");
const { transformInputToIndividual, validateIndividual } = require("../services/utils/individual.util");

const IndividualController = {
    list: async (req, res, next) => {
        try {
            const { query, page } = req.query;
            const individuals = await listIndividuals({ query: query ?? "", page: page ?? 0, limit: LIMIT_PER_PAGE });
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
            const individual = await getIndividual({ id });
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
            const individual = await getIndividualBasic({ id });
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
            const { id } = req.user;
            const individual = await getIndividualProfile({ id: req.user.individual });
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