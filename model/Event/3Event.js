const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventOrganiserId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "eventOrganiser"
        },
        eventCategoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "eventCategory"
        },
        eventName: {
                type: String,
                required: true,
        },
        eventDescription: {
                type: String,
                required: true,
        },
        eventCountryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        eventCityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        eventAddress: {
                type: String,
                required: true,
        },
        eventFromDate: {
                type: Date,
                required: true,
        },
        eventToDate: {
                type: Date,
                required: true,
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
        mobileAppIcon: {
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
const CompanyCategory = mongoose.model('Event', companyCategorySchema);
module.exports = CompanyCategory;
