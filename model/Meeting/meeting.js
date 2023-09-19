const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        title: {
                type: String,
                required: true,
        },
        description: {
                type: String,
                required: false,
        },
        fromDate: {
                type: Date,
                required: false,
        },
        toDate: {
                type: Date,
                required: false,
        },
        fromTime: {
                type: String,
                required: false,
        },
        toTime: {
                type: String,
                required: false,
        },
        countryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        cityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        address: {
                type: String,
                required: false,
        },
        pinCode: {
                type: String,
                required: false,
        },
        isPublished: {
                type: Boolean,
                default: false,
        },
        meetingBy: {
                type: String,
                required: false,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('meeting', companyCategorySchema);
module.exports = CompanyCategory;
