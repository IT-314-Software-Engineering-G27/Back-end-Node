const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobProfileSchema = new Schema({
    organization: {
        type: Schema.Types.ObjectId,
        required: [true, "Organization required"],
        unique: true,
        ref: 'Organization',
    },
    title: {
        type: Schema.Types.String,
        required: [true, "Title required"],
        minlength: [1, "Title cannot be empty"],
        maxlength: [255, "Title cannot be more than 255 characters"],
        index: true,
    },
    description: {
        type: Schema.Types.String,
        required: [true, "Description required"],
        minlength: [100, "Description cannot be less than 100 characters"],
        maxlength: [4096, "Description cannot be more than 4096 characters"],
    },
    posting_location: {
        type: Schema.Types.String,
        required: [true, "Posting location required"],
        minlength: [1, "Posting location cannot be empty"],
        maxlength: [1024, "Posting location cannot be more than 1024 characters"],
        index: true,
    },
    requirements: [{
        type: Schema.Types.String,
    }],
    salary: {
        type: Schema.Types.Number,
        required: [true, "Salary required"],
    },
    compensations: {
        type: Schema.Types.String,
    },
    posted: {
        type: Schema.Types.Date,
        default: Date.now(),
    },
    duration: {
        type: Schema.Types.String,
        required: [true, "Duration required"],
        enum: ["full-time", "part-time", "internship", "contract"],
        default: "full-time",
    },
    job_applications: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'JobApplication',
        }],
        default: [],
    }
});


JobProfileSchema.index({
    title: "text",
    description: "text",
    posting_location: "text",
    compensations: "text",
}, {
    name: "job_profile_text_index",
    weights: {
        title: 10,
        description: 3,
        posting_location: 8,
        compensations: 8,
    },
});

const JobProfileModel = mongoose.models["JobProfile"] ?? mongoose.model("JobProfile", JobProfileSchema);

module.exports = JobProfileModel;