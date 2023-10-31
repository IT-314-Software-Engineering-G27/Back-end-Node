const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IndividualSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        unique: true,
        required: [true, "User is required"],
    },
    first_name: {
        type: Schema.Types.String,
        required: [true, "First name is required"],
        minlength: [1, "First name cannot be empty"],
        maxlength: [255, "First name cannot be more than 255 characters"],
    },
    last_name: {
        type: Schema.Types.String,
        required: [true, "Last name is required"],
        minlength: [1, "Last name cannot be empty"],
        maxlength: [255, "Last name cannot be more than 255 characters"],
    },
    college: {
        type: Schema.Types.String,
    },
    country: {
        type: Schema.Types.String,
    },
    age: {
        type: Schema.Types.Number,
        min: [0, "Age cannot be less than 0"],
        max: [200, "Age cannot be more than 200"],
        required: [true, "Age is required"],
    },
    bio: {
        type: Schema.Types.String,
    },
    degree: {
        type: Schema.Types.String,
    },
    skills: [{
        type: Schema.Types.String,
    }],
    job_applications: [{
        type: Schema.Types.ObjectId,
        ref: "JobApplication",
    }],
});

IndividualSchema.index({
    first_name: "text",
    last_name: "text",
    college: "text",
    country: "text",
    degree: "text",
    skills: "text",
    bio: "text",
}, {
    name: "individual_text_index",
    weights: {
        first_name: 8,
        last_name: 10,
        college: 6,
        country: 3,
        degree: 6,
        skills: 7,
        bio: 3,
    },
});

const IndividualModel = mongoose.models["Individual"] ?? mongoose.model("Individual", IndividualSchema);

module.exports = IndividualModel;