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
        required: [True, "Start time needs to be defined"],
    },

    end_time: {
        type: Schema.Types.Date,
        required: [True, "End time needs to be defined"],
    },

    last_registration_date: {
        type: Schema.Types.Date,
    },

    frequency: {  //some attributes are yet to be added
    },

    image: {
		type: Schema.Types.ObjectId,  //is it correct?
		ref: "Storage.Files",
	},

    requirements: {
        type: [Schema.Types.String],    //is type correct
    },

    registrations: {
        type: [
			{
				type: Schema.Types.ObjectId,
				ref: "Event_Registration",
			},
		],
		default: [],
    },

});


EventSchema.index({
    title: "text" ,
}, {
    name: "event_text_index",
    weights: {
        title: 10 ,
    },
});

const EventModel = mongoose.models["Event"] ?? mongoose.model("Event", EventSchema);

module.exports = EventModel;