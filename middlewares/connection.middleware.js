const { UnauthorizedError, NotFoundError } = require("../errors");
const { getConnectionBasic } = require("../services/connection.service");

async function connectionRoleMiddleware(req, res, next) {
    try {
        const user = req.user;
        const connectionId = req.params.id;
        const connection = await getConnectionBasic({ connectionId });
        if (!connection)
            throw new NotFoundError("No connection found");
        req.user.connection = { status: connection.status };
       if (connection.from.toString() == user._id)
            req.user.connection.role = "from";
        else if (connection.to.toString() == user._id)
            req.user.connection.role = "to";
        else
            throw new UnauthorizedError("You are not authorized to access this connection");
        next();
    }
    catch (err) {
        next(err);
    }
};

module.exports = {
    connectionRoleMiddleware,
};