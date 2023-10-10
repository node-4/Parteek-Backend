const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
        user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
        },
        message: {
                type: String,
                required: true,
        },
        rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
        programContents: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
        venue: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
        food: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
        hospitality: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
        registration: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
        app: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
        },
}, { timestamps: true });

module.exports = mongoose.model("feedback", feedbackSchema);
