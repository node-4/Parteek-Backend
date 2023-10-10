const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        galleryFolderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "galleryFolder",
                required: true,
        },
        name: {
                type: String,
        },
        link: {
                type: String,
        },
        image: {
                type: String,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('gallerySubFolder', companyCategorySchema);
module.exports = CompanyCategory;
