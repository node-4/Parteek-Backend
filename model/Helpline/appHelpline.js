const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        helplineNo: {
                type: String,
                required: true,
        },
        helplineTitle: {
                type: String,
                required: false,
        },
        helplineImage: {
                type: String,
                required: false,
        },
        description: {
                type: String,
                required: false,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('appHelpline', companyCategorySchema);
module.exports = CompanyCategory;
