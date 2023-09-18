const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        speakerTitle: {
                type: String,
                required: false,
        },
        speakerName: {
                type: String,
                required: true,
        },
        companyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company"
        },
        designation: {
                type: String,
                required: false,
        },
        email: {
                type: String,
                required: false,
        },
        contactNo: {
                type: String,
                required: false,
        },
        speakerAbstractId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "paper"
        },
        profilePic: {
                type: String,
                required: false,
        },
        biography: {
                type: String,
                required: false,
        },
        isPublished: {
                type: Boolean,
                default: false,
        },
        showInOrder: {
                type: Number,
                required: false,
        },
        listAsspeaker: {
                type: Boolean,
                default: false,
        },
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('speaker', companyCategorySchema);
module.exports = CompanyCategory;
