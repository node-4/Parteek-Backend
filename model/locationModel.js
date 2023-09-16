const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const locationSchema = new mongoose.Schema({
    locationType: {
        type: String,
        required: true,
        enum: ['Country', 'State', 'City'],
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    state: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Location"
    },
    locationName: {
        type: String,
        required: true,
    },
});
locationSchema.plugin(mongoosePaginate);
locationSchema.plugin(mongooseAggregatePaginate);
const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
