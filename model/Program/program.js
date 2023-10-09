const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        date: {
                type: String,
        },
        sessions: [{
                session_timing: {
                        type: String,
                },
                session_name: {
                        type: String,
                },
                speeches: [{
                        speech_name: {
                                type: String,
                        },
                        speaker: {
                                type: String,
                        },
                        speaker_link: {
                                type: mongoose.Schema.Types.ObjectId,
                                ref: "User"
                        },
                }]
        }]
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('program', companyCategorySchema);
module.exports = CompanyCategory;
