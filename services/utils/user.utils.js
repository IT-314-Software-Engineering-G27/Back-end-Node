const { BadRequestError, InternalServerError } = require('../../errors');

function validateUser({ user }) {
    if (!user)
        throw new BadRequestError('User not provided');
    if (!validatePhoneNumber(user.phone_number))
        throw new BadRequestError('Phone number is not valid');
    if (!validateEmail(user.email))
        throw new BadRequestError('Email is not valid');
    if (!validatePassword(user.password))
        throw new BadRequestError('Password is not valid');
    return true;
}

function transformInputToUser({ user }) {
    if (!user)
        throw new InternalServerError('User is not defined');
    return {
        email: user.email,
        password: user.password,
        username: user.username,
        role: user.role,
        phone_number: user.phone_number,
    };
}

function validatePhoneNumber(phone_number) {
    if (!phone_number)
        return true;
    return /^\+\d{3} \d{3}-\d{3}-\d{4}$/.test(phone_number);
}

function validateEmail(email) {
    if (!email)
        return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    if (!password)
        return true;
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

module.exports = {
    validateUser,
    transformInputToUser,
};