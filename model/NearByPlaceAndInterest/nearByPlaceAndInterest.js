const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        name: {
                type: String,
                required: true,
        },
        description: {
                type: String,
                required: true,
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
        typeId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "nearByInterestType"
        },
        type: {
                type: String,
                enum: ["NearBy", "Interest"]
        }

}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('NearByPlaceAndInterest', companyCategorySchema);
module.exports = CompanyCategory;
