const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    title: {
        type: Schema.Types.String,
        required: [true, "Title required"],
        minlength: [1, "Title cannot be empty"],
        maxlength: [255, "Title cannot be more than 255 characters"],
        index: true,
    },
    subject: {
        type: Schema.Types.String,
        required: [true, "Subject required"],
        minlength: [1, "Subject cannot be empty"],
        maxlength: [400, "Subject cannot be more than 400 characters"],
    },
    description: {
        type: Schema.Types.String,
        required: [true, "Description required"],
        minlength: [100, "Description cannot be less than 100 characters"],
        maxlength: [4096, "Description cannot be more than 4096 characters"],
    },
    time: {
        type: Schema.Types.Date,
        default: Date.now(),
    },
    image: {
        type: Schema.Types.String,
    },
    likes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }]
    },
});

PostSchema.index({
    title: "text",
    subject: "text",
    description: "text",
}, {
    name: "post_text_index",
    weights: {
        title: 10,
        subject: 7,
        description: 3,
    },
});

const PostModel = mongoose.models["Post"] ?? mongoose.model("Post", PostSchema);

module.exports = PostModel;
