const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema({
	cover_letter: {
		type: Schema.Types.String,
	},
	individual: {
		type: Schema.Types.ObjectId,
		ref: "Individual",
		required: [true, "Individual is required"],
	},
	job_profile: {
		type: Schema.Types.ObjectId,
		ref: "JobProfile",
		required: [true, "Job profile is required"],
	},
	status: {
		type: Schema.Types.String,
		enum: ["pending", "accepted", "rejected"],
		default: "pending",
	},
});

JobApplicationSchema.index({ individual: 1, job_profile: 1 }, { unique: true });

const JobApplicationModel =
	mongoose.models["JobApplication"] ??
	mongoose.model("JobApplication", JobApplicationSchema);
module.exports = JobApplicationModel;
