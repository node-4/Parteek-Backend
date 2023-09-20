const mongoose = require("mongoose");
const feedbackSchema = new mongoose.Schema({
        type: {
                type: String,
                enum: ['Program Contents', "Venue", "Food", "Hospitality", "Registration", "App"]
        },
        rating: [{
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
        }],
        averageRating: {
                type: Number,
                min: 1,
                max: 5,
        },
}, { timestamps: true });

module.exports = mongoose.model("feedback", feedbackSchema);
