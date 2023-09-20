const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        image: {
                type: String,
        },
        title: {
                type: String,
        },
        date: {
                type: String,
        },
        location: {
                type: String,
        },
        description: {
                type: Array,
        },
        name: {
                type: String,
        },
        designation: {
                type: String,
        },
        type: {
                type: String,
                enum: ["ChairmanDesk", "AboutFai", "SeminarTheme"]
        }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('ChairmanDeskAboutFaiseminarTheme', companyCategorySchema);
module.exports = CompanyCategory;
