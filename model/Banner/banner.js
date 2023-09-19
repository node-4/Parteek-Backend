const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        bannerTitle: {
                type: String,
                required: true,
        },
        bannerDescription: {
                type: String,
                required: false,
        },
        bannerImage: {
                type: String,
                required: false,
        },
        bannerRedirectUrl: {
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
const CompanyCategory = mongoose.model('banner', companyCategorySchema);
module.exports = CompanyCategory;
