const { createReset, applyReset } = require("../services/reset.service");
const { BadRequestError } = require("../errors");
const { validatePassword } = require("../services/utils/user.utils");
const ResetController = {
	create: async (req, res, next) => {
		try {
			const reset = await createReset({ email: req.body.email });
			res.json({
				message: "Reset created successfully",
				payload: {
					reset,
				},
			});
		} catch (error) {
			next(error);
		}
	},
	apply: async (req, res, next) => {
		try {
			const resetId = req.params.id;
			const { otp, password } = req.body;
			if (!otp || !password) {
				throw new BadRequestError("OTP and password are required");
			}
			if (!validatePassword(password)) {
				throw new BadRequestError("Password is not valid");
			}
			const user = await applyReset({
				otp,
				resetId,
				password,
			});
			res.json({
				message: "Password updated successfully",
				payload: {
					user,
				},
			});
		} catch (error) {
			next(error);
		}
	},
};

module.exports = ResetController;
