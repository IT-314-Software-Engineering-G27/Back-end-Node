const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegistrationSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Event is required"],
    },
    organization: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: [true, "Organization is required"],
    },
    title: {
        type: Schema.Types.String,
        required: [true, "Title is required"],
        minlength: [1, "Title cannot be empty"],
        maxlength: [255, "Title cannot be more than 255 characters"],
    },
    description: {
        type: Schema.Types.String,
        default: "",
    },
    time: {
        type: Schema.Types.Date,
        default: Date.now,
    },
    images: {
        type: [{
            type: Schema.Types.String,
        }],
        default: [],
    },
});

RegistrationSchema.index({
    title: "text",
    description: "text",
}, {
    name: "registration_text_index",
    weights: {
        title: 10,
        description: 3,
    },
});

RegistrationSchema.index({
    event: 1,
    organization: 1,
}, {
    name: "registration_event_organization_index",
    unique: true,
});


const RegistrationModel = mongoose.models["Registration"] ?? mongoose.model("Registration", RegistrationSchema);

module.exports = RegistrationModel;