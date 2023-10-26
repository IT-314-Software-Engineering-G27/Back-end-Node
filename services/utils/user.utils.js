const { BadRequestError, InternalServerError } = require('../../errors');

function validateUser({ user }) {
    if (!user)
        throw new InternalServerError('User is not defined');
    if (!validateEmail(user.email))
        throw new BadRequestError('Email is not valid');
    if (!validatePassword(user.password))
        throw new BadRequestError('Password is not valid');
    return true;
}

function validateEmail(email) {
    if (!email)
        return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    if (!password)
        return false;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

module.exports = {
    validateUser,
};