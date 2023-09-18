const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    seminarFee: {
        type: Number,
        required: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('CompanyCategory', companyCategorySchema);

module.exports = CompanyCategory;
