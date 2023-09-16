const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const userSchema = new mongoose.Schema({
    typeofMember: {
        type: String,
        enum: ["FAI Employess", "FAI Members"],
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    mobile: {
        type: String,
    },
    image: {
        type: String,
    },
    address1: {
        type: String,
    },
    address2: {
        type: String,
    },
    otp: {
        type: String,
    },
    otpExpiration: {
        type: Date,
    },
    accountVerification: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });
userSchema.plugin(mongoosePaginate);
userSchema.plugin(mongooseAggregatePaginate);
const User = mongoose.model('User', userSchema);
module.exports = User;
