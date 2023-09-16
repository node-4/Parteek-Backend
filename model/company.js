const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companySchema = new mongoose.Schema({
        companyCategoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CompanyCategory"
        },
        companyName: {
                type: String,
                required: true,
        },
        companyCode: {
                type: String,
                required: true,
        },
        address1: {
                type: String,
                required: true,
        },
        countryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        stateCityId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Location"
        },
        companyNameOnBatch: {
                type: String,
                required: true,
        },
        address2: {
                type: String,
                required: false,
        },
        pinCode: {
                type: String,
                required: false,
        },
        isdCode: {
                type: String,
                required: false,
        },
});
companySchema.plugin(mongoosePaginate);
companySchema.plugin(mongooseAggregatePaginate);
const Company = mongoose.model('Company', companySchema);
module.exports = Company;