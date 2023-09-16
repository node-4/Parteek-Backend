const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        shortName: {
                type: String,
                required: true,
        },
        orgName: {
                type: String,
                required: true,
        },
        address: {
                type: String,
                required: true,
        },
        alternateAddress: {
                type: String,
                required: false,
        },
        logo: {
                type: String,
                required: true,
        },
        contactPerson: {
                type: String,
                required: true,
        },
        contactPersonNo: {
                type: String,
                required: true,
        },
        contactEmail: {
                type: String,
                required: false,
        },
        contactFax: {
                type: String,
                required: false,
        },
        isPublished: {
                type: Boolean,
                default: false,
        },

}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('eventOrganiser', companyCategorySchema);
module.exports = CompanyCategory;
