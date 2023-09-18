const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        sponserType: {
                type: String,
                enum: ["Silver", "Gold"],
        },
        sponserName: {
                type: String,
                required: true,
        },
        sponserShortname: {
                type: String,
                required: false,
        },
        sponserLabel: {
                type: String,
                required: false,
        },
        sponserAddress: {
                type: String,
                required: false,
        },
        sponserCountryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        sponserCityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        pinCode: {
                type: String,
                required: false,
        },
        sponserLogo: {
                type: String,
                required: false,
        },
        sponserDescription: {
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
        sponserFromDate: {
                type: Date,
                required: true,
        },
        sponserToDate: {
                type: Date,
                required: true,
        },
        sponserWebUrl: {
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
        meetAt: {
                type: String,
                required: false,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('sponser', companyCategorySchema);
module.exports = CompanyCategory;
