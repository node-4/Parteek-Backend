const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        helplineNo: {
                type: String,
                required: true,
        },
        helplineTitle: {
                type: String,
                required: false,
        },
        location: {
                type: {
                        type: String,
                        default: "Point"
                },
                coordinates: {
                        type: [Number],
                        default: [0, 0]
                },
        },
        description: {
                type: String,
                required: false,
        },
        address: {
                type: String,
                required: false,
        },
        fromDate: {
                type: Date,
                required: true,
        },
        toDate: {
                type: Date,
                required: true,
        },
        isPublished: {
                type: Boolean,
                default: false,
        },
        showInOrder: {
                type: Number,
                required: true,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('helpline', companyCategorySchema);
module.exports = CompanyCategory;
