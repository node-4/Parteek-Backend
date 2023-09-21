const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        title: {
                type: Array,
                required: true,
        },
        content: [{
                heading: {
                        type: String,
                },
                image: {
                        type: String,
                },
                description: {
                        type: String,
                },
        }]
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('CulturalProgram', companyCategorySchema);
module.exports = CompanyCategory;
