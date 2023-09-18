const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        eventSessionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "eventSession"
        },
        programTitle: {
                type: String,
                required: true,
        },
        programDescription: {
                type: String,
                required: false,
        },
        programDate: {
                type: Date,
                required: false,
        },
        programFromTime: {
                type: String,
                required: false,
        },
        programToTime: {
                type: String,
                required: false,
        },
        isShowTime: {
                type: String,
                required: false,
        },
        speaker1: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "speaker"
        },
        speaker2: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "speaker"
        },
        speaker3: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "speaker"
        },
        speaker4: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "speaker"
        },
        speaker5: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "speaker"
        },
        sponser1: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "sponser"
        },
        sponser2: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "sponser"
        },
        showInOrder: {
                type: Number,
                required: true,
        },
        smallIcon: {
                type: String,
                required: false,
        },
        programWebUrl: {
                type: String,
                required: false,
        },
        isPublished: {
                type: Boolean,
                default: false,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('eventSchedule', companyCategorySchema);
module.exports = CompanyCategory;
