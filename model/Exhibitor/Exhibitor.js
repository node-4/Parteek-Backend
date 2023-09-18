const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        exhibitorName: {
                type: String,
                required: true,
        },
        exhibitorShortname: {
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
        exhibitorDescription: {
                type: String,
                required: false,
        },
        exhibitorAddress: {
                type: String,
                required: false,
        },
        exhibitorCountryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        exhibitorCityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        pinCode: {
                type: String,
                required: false,
        },
        email: {
                type: String,
                required: false,
        },
        exhibitorLogo: {
                type: String,
                required: false,
        },
        stallNo: {
                type: String,
                required: false,
        },
        exhibitorWebUrl: {
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
const CompanyCategory = mongoose.model('exhibitor', companyCategorySchema);
module.exports = CompanyCategory;
