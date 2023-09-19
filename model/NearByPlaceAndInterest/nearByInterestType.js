const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        name: {
                type: String,
                required: true,
        },
        image: {
                type: String,
                required: true,
        },
        type: {
                type: String,
                enum: ["NearBy", "Interest"]
        }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('nearByInterestType', companyCategorySchema);
module.exports = CompanyCategory;
