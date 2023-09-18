const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company"
        },
        delegateCategoryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "CompanyCategory"
        },
        email: {
                type: String,
                required: true,
        },
        otherEmail: {
                type: String,
                required: false,
        },
        delegateTitle: {
                type: String,
                required: true,
        },
        firstName: {
                type: String,
                required: true,
        },
        middleName: {
                type: String,
                required: false,
        },
        lastName: {
                type: String,
                required: false,
        },
        delegateLoginId: {
                type: String,
                required: true,
        },
        delegatePassword: {
                type: String,
                required: true,
        },
        address1: {
                type: String,
                required: true,
        },
        address2: {
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
        pinCode: {
                type: String,
                required: false,
        },
        mobileNumber: {
                type: String,
                required: false,
        },
        profilePic: {
                type: String,
                required: false,
        },
        designation: {
                type: String,
                required: false,
        },
        aboutMySelf: {
                type: String,
                required: false,
        },
        showEmail: {
                type: Boolean,
                default: false,
        },
        showContactNo: {
                type: Boolean,
                default: false,
        },
        openForAppointment: {
                type: Boolean,
                default: false,
        },
        isPublished: {
                type: Number,
                required: false,
        },
        sendMail: {
                type: Boolean,
                default: false,
        },
        payment: {
                type: Number,
                required: true,
        },
        receiptNo: {
                type: String,
                required: false,
        },
        sponsorer: {
                type: String,
                required: false,
        },
        currency: {
                type: String,
                required: false,
        },
        seminarFee: {
                type: Number,
                required: false,
        },
        remarks: {
                type: String,
                required: false,
        },
        registrationNo: {
                type: String,
                required: false,
        },
        showInOrder: {
                type: Boolean,
                default: false,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('delegate', companyCategorySchema);
module.exports = CompanyCategory;
