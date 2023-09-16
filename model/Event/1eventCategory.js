const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
    eventCategoryName: {
        type: String,
        required: true,
    },
    showInOrder: {
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
const CompanyCategory = mongoose.model('eventCategory', companyCategorySchema);
module.exports = CompanyCategory;
