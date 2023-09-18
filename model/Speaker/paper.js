const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        abstractPaperTitle: {
                type: String,
                required: true,
        },
        author: {
                type: String,
                required: false,
        },
        abstractPaperDescription: {
                type: String,
                required: false,
        },
        abstractPaperUrl: {
                type: String,
                required: false,
        },
        isPublished: {
                type: Boolean,
                default: false,
        }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('paper', companyCategorySchema);
module.exports = CompanyCategory;
