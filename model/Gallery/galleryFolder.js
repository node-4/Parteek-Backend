const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        galleryId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "gallery",
                required: true,
        },
        name: {
                type: String,
        },
        image: {
                type: String,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('galleryFolder', companyCategorySchema);
module.exports = CompanyCategory;
