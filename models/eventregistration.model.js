const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventRegistrationSchema = new Schema({
    registration: {
        type: Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, "Organization details required"],
        index: true,
    },

    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, "Event Details are required"],
    },

    title: {
        type: Schema.Types.String,
        required: [true, "Title of the idea is required"],
        minlength: [1, "Title cannot be empty"],
        maxlength: [255, "Title cannot be more than 255 characters"],
        index: true,
    },

    description: {
        type: Schema.Types.String,
        maxlength: [4096, "Description of the idea cannot be more than 4096 characters"],
    },

    image: {
		type: Schema.Types.ObjectId, 
		ref: "Storage.Files",
	}, 
    
});



EventRegistrationSchema.index({
    title: "text",
    description: "text",
}, {
    name: "event_registration_text_index",
    weights: {
        title: 10,
        description: 7,
    },
});

const EventRegistrationModel = mongoose.models["EventRegistration"] ?? mongoose.model("EventRegistration", EventRegistrationSchema);

module.exports = EventRegistrationModel;