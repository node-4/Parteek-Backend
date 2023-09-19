const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        feedbackParamTitle: {
                type: String,
                required: false,
        },
        feedbackParamDesc: {
                type: String,
                required: false,
        },
        isPublished: {
                type: Boolean,
                default: false,
        },
        showInOrder: {
                type: Number,
                required: true,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('feedbackParameter', companyCategorySchema);
module.exports = CompanyCategory;
