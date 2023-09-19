const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        eventId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Event"
        },
        message: {
                type: String,
                required: true,
        },
        type: {
                type: String,
                enum: ["DG", "RegistrationDetails", "ExhibitionDetails", "AboutOrganisation"]
        }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('dgDesk', companyCategorySchema);
module.exports = CompanyCategory;