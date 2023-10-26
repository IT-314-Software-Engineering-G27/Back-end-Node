const { BadRequestError } = require('../errors');
const { verifyToken, createToken } = require('../services/auth.service');

const AuthController = {
    get: async (req, res, next) => {
        try {
            if (!req.headers.authorization) throw new BadRequestError("No authorization header");
            const token = req.headers.authorization.split(" ")[1];
            if (!token) {
                throw new BadRequestError("No token provided");
            }
            const { user } = await verifyToken({ token });
            res.json({
                message: "User retrieved successfully",
                payload: {
                    user,
                }
            });
        } catch (error) {
            next(error);
        }
    },

    post: async (req, res, next) => {
        try {
            const { auth } = req.body;
            if (!auth) throw new BadRequestError("No auth object provided");
            const { email, password } = auth;
            if (!email || !password) {
                throw new BadRequestError("Email or password not provided");
            }
            const { token, expires_in } = await createToken({ email, password });
            res.json({
                message: "User authenticated successfully",
                payload: {
                    token,
                    expires_in,
                }
            });
        } catch (error) {
            next(error);
        }
    },
};

module.exports = AuthController;
