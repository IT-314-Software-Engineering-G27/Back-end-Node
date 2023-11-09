const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    title: {
        type: Schema.Types.String,
        required: [true, "Title is required"],
        minlength: [1, "Title cannot be empty"],
        maxlength: [255, "Title cannot be more than 255 characters"],
        index: true,
    },
    description: {
        type: Schema.Types.String,
        minlength: [100, "Description cannot be less than 100 characters"],
        maxlength: [4096, "Description cannot be more than 4096 characters"],
    },
    start_time: {
        type: Schema.Types.Date,
        required: [true, "Start time needs to be defined"],
        index: true,
    },
    end_time: {
        type: Schema.Types.Date,
        required: [true, "End time needs to be defined"],
        index: true,
    },
    last_registration_date: {
        type: Schema.Types.Date,
        required: [true, "Last registration date is required"],
    },
    frequency: {
        type: Schema.Types.String,
        enum: ["once", "weekly", "monthly", "yearly"],
        default: "once",
    },
    requirements: {
        type: Schema.Types.String,
        default: "",
    },
    registrations: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Registration",
            },
        ],
        default: [],
    },
});


EventSchema.index({
    title: "text",
    description: "text",
    requirements: "text",
}, {
    name: "event_text_index",
    weights: {
        title: 10,
        requirements: 4,
        description: 3,
    },
});

const EventModel = mongoose.models["Event"] ?? mongoose.model("Event", EventSchema);

module.exports = EventModel;