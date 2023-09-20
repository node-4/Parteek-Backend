const mongoose = require("mongoose");
const faqSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("bookCabs", faqSchema);