const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");

const userSchema = new mongoose.Schema({
    typeofMember: {
        type: String,
        enum: ["FAI Employess", "FAI Members"],
    },
    userType: {
        type: String,
        enum: ["USER", "ADMIN", "GUEST", "DELEGATE", "SPEAKER", "SPONSER"],
    },
    username: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
    },
    otherEmail: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    address1: {
        type: String,
        required: true,
    },
    address2: {
        type: String,
        default: ''
    },
    otp: {
        type: String,
        default: ''
    },
    otpExpiration: Date,
    accountVerification: {
        type: Boolean,
        default: false,
    },
    designation: {
        type: String,
        default: ''
    },
    countryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    cityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location",
    },
    bio: {
        type: String,
        default: ''
    },
    pinCode: {
        type: String,
        default: ''
    },
    profilePic: {
        type: String,
        default: ''
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
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    delegateCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyCategory",
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
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    delegateLoginId: {
        type: String,
        required: true,
    },
    delegatePassword: {
        type: String,
        required: true,
    },
    mobileNumber: String,
    aboutMySelf: String,
    isPublished: {
        type: Boolean,
        required: false,
    },
    sendMail: {
        type: Boolean,
        default: false,
    },
    payment: {
        type: Boolean,
        required: false,
    },
    receiptNo: {
        type: String,
        default: ''
    },
    sponsorer: {
        type: String,
        default: ''
    },
    currency: {
        type: String,
        default: ''
    },
    seminarFee: {
        type: Number,
    },
    remarks: {
        type: String,
        default: ''
    },
    registrationNo: {
        type: String,
        default: ''
    },
    showInOrder: {
        type: Number,
    },
    speakerTitle: {
        type: String,
        default: ''
    },
    speakerName: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        default: ''
    },
    speakerAbstractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "paper",
    },
    biography: {
        type: String,
        default: ''
    },
    listAsSpeaker: {
        type: Boolean,
        default: false,
    },
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
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);
const User = mongoose.model('User', userSchema);
module.exports = User;
