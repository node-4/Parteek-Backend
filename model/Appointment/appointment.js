const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        delegateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "delegate"
        },
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
        },
        date: {
                type: Date,
        },
        time: {
                type: String,
        },
        venue: {
                type: String,
        },
        note: {
                type: String,
        },
        userRecivedSent: {
                type: String,
                enum: ["Recived", "Sent"]
        },
        delegateRecivedSent: {
                type: String,
                enum: ["Recived", "Sent"]
        },
        status: {
                type: String,
                enum: ["Pending", "Accept", "Reject"]
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('appointment', companyCategorySchema);
module.exports = CompanyCategory;
