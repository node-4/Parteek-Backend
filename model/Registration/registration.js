const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        seminarFee: {
                type: Array,
        },
        seminarFeeInclude: {
                type: Array,
        },
        onlineRegistration: {
                type: String,
        },
        registrationForm: {
                type: String,
        },
        paymentOptionsHeading: {
                type: String,
        },
        paymentOptions: {
                type: Array,
        },
        OnTheSpotRegistration: {
                type: String,
        },
        dulyFiledregistration: {
                type: Array,
        },
        SavingBankACNo: {
                type: String,
        },
        bankNameandAddress: {
                type: String,
        },
        branchCode: {
                type: String,
        },
        IFSCcode: {
                type: String,
        },
        micrCode: {
                type: String,
        },
        faiGstNo: {
                type: String,
        },
        faiPanNo: {
                type: String,
        },
        changeInNames: {
                type: String,
        },
        Cancellation: {
                type: String,
        },
        type: {
                type: String,
                enum: ["INDIAN", "OVERSEAS"]
        }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('Registration', companyCategorySchema);
module.exports = CompanyCategory;
