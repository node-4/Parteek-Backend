const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        sessionName: {
                type: String,
                required: true,
        },
        sessionTitle: {
                type: String,
                required: true,
        },
        sessionDate: {
                type: Date,
                required: true,
        },
        sessionFromTime: {
                type: String,
                required: true,
        },
        sessionToTime: {
                type: String,
                required: true,
        },
        isPublished: {
                type: Boolean,
                default: false,
        }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('eventSession', companyCategorySchema);
module.exports = CompanyCategory;
