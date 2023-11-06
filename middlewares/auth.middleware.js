const { UnauthorizedError } = require("../errors");
const { verifyToken } = require("../services/auth.service");

async function tokenToIDMiddleware(req, res, next) {
    try {
        if (!req.headers.authorization) {
            throw new UnauthorizedError("Authorization header is required");
        }
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            throw new UnauthorizedError("No token provided");
        }
        const authServiceResponse = await verifyToken({ token });
        req.user = authServiceResponse.user;
        next();
    }
    catch (error) {
        next(error);
    }
};

module.exports = {
    tokenToIDMiddleware,
};