const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { BadRequestError, InternalServerError, UnauthorizedError } = require("../errors");
const UserModel = require("../models/user.model");

const secret = process.env.JWT_SECRET;

const expiresIn = "2h";

const verifyToken = ({ token }) => {
    if (secret === undefined) throw new InternalServerError("JWT_SECRET is not defined");
    const payload = jwt.verify(token, secret, (error, decoded) => {
        if (error) throw new UnauthorizedError("Token is invalid");
        return decoded;
    });
    return {
        user: payload.user,
    };
};

const createToken = async ({ email, password }) => {
    if (secret === undefined) throw new InternalServerError("JWT_SECRET is not defined");
    const user = await UserModel.findOne({ email }, {
        _id: 1,
        email: 1,
        password: 1,
        individual: 1,
        organization: 1,
    });

    if (user === null) throw new BadRequestError("User does not exist");

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        throw new UnauthorizedError("Password is incorrect");
    } else {
        const access_token = jwt.sign({
            user: {
                _id: user._id,
                email: user.email,
                individual: user.individual ?? null,
                organization: user.organization ?? null,
            }
        }, secret, {
            expiresIn
        });
        return {
            token: access_token,
            expires_in: expiresIn,
        }
    }
};

module.exports = {
    verifyToken,
    createToken,
};
