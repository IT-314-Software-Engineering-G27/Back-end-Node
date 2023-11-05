const { createReset, applyReset } = require("../services/reset.service");
const { BadRequestError } = require("../errors");

const ResetController = {
	create: async (req, res, next) => {
		try {
			const url = `${req.protocol}://${req.get("host")}`;
			const reset = await createReset({ email: req.body.email, host: url });
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
