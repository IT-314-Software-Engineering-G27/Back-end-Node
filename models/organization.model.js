const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrganizationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: [true, "user_id required"],
        unique: true,
        ref: 'User',
    },
    company_name: {
        type: Schema.Types.String,
        required: [true, "Company name required"],
        minlength: [1, "Company name cannot be empty"],
        maxlength: [255, "Company name cannot be more than 255"],
    },
    CEOname: {
        type: Schema.Types.String,
        required: [true, "CEO name required"],
        minlength: [1, "CEO name cannot be empty"],
        maxlength: [255, "CEO name cannot be more than 255"],
    },
    description: {
        type: Schema.Types.String,
        maxlength: 1024,
    },
    headquarter_location: {
        type: Schema.Types.String,
        required: [true, "Headquarter location required"],
        minlength: [1, "Headquarter location cannot be empty"],
        maxlength: [1024, "Headquarter location cannot be more than 1024"],
    },
    year_of_establishment: {
        type: Schema.Types.Number,
        required: [true, "Establishment year required"],
        min: [1800, "Establishment year cannot be less than 1800"],
        max: [2023, "Establishment year cannot be more than 2023"],
    },
    job_profiles: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'JobProfile',
        }],
        default: [],
    },
    events: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Event',
        }],
        default: [],
    }
});

OrganizationSchema.index({
    company_name: "text",
    CEOname: "text",
    description: "text",
    headquarter_location: "text",
}, {
    name: "organization_text_index",
    weights: {
        company_name: 10,
        CEOname: 6,
        description: 3,
        headquarter_location: 8,
    },
});

const OrganizationModel = mongoose.models["Organization"] ?? mongoose.model("Organization", OrganizationSchema);

module.exports = OrganizationModel;