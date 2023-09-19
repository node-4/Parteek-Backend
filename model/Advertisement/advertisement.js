const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        shortName: {
                type: String,
                required: false,
        },
        adTitle: {
                type: String,
                required: false,
        },
        address: {
                type: String,
                required: false,
        },
        adLogoPath: {
                type: String,
                required: false,
        },
        adDescription: {
                type: String,
                required: false,
        },
        adCity: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        adAddress: {
                type: String,
                required: false,
        },
        adFromDate: {
                type: String,
                required: false,
        },
        adToDate: {
                type: String,
                required: false,
        },
        adWebUrl: {
                type: String,
                required: false,
        },
        contactPerson: {
                type: String,
                required: false,
        },
        contactPersonNo: {
                type: String,
                required: false,
        },
        location: {
                type: {
                        type: String,
                        default: "Point"
                },
                coordinates: {
                        type: [Number],
                        default: [0, 0]
                },
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
const CompanyCategory = mongoose.model('advertisement', companyCategorySchema);
module.exports = CompanyCategory;
