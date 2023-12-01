const { BadRequestError, InternalServerError } = require("../../errors");

function validateUser({ user }) {
	if (!user) throw new BadRequestError("User not provided");
	if (user.phone_number && !validatePhoneNumber(user.phone_number))
		throw new BadRequestError("Phone number is not valid");
	if (user.email && !validateEmail(user.email))
		throw new BadRequestError("Email is not valid");
	return true;
}

function transformInputToUser({ user }) {
	if (!user) throw new InternalServerError("User is not defined");
	return {
		email: String(user.email).toLowerCase(),
		username: user.username,
		role: user.role,
		profile_image: user.profile_image,
		phone_number: user.phone_number,
	};
}

function validatePhoneNumber(phone_number) {
	return /^\+\d{1,3} \d{3}-\d{3}-\d{4}$/.test(phone_number);
}

function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
		password
	);
}

module.exports = {
	validateUser,
	validateEmail,
	validatePassword,
	transformInputToUser,
};
