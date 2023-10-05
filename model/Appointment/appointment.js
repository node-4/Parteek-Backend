const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        delegateId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "delegate"
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
        status: {
                type: String,
                enum: ["Pending", "Accept", "Reject"]
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('appointment', companyCategorySchema);
module.exports = CompanyCategory;
