const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const companyCategorySchema = new mongoose.Schema({
        registrationForm: {
                type: String,
        },
        // title: {
        //         type: Array,
        // },
        // faiMmberCompany: {
        //         type: String,
        // },
        // nonfaiMmberCompany: {
        //         type: String,
        // },
        // description: {
        //         type: String,
        // },
        // descriptionBelowTitle: {
        //         type: String,
        // },
        // email: {
        //         type: String,
        // },
        // tel: {
        //         type: String,
        // },
        // telBelowTitle: {
        //         type: String,
        // },
        // telBelowHeading: {
        //         type: String,
        // },
        // headingArray: {
        //         type: Array,
        // },
        // reservationTitle: {
        //         type: String,
        // },
        // reservationDescription: {
        //         type: Array,
        // },
        // hotelTitle: {
        //         type: String,
        // },
        // hotelPullmanSingle: {
        //         type: String,
        // },
        // hotelPullmanDouble: {
        //         type: String,
        // },
        // hotelPullmanRoomType: {
        //         type: String,
        // },
        // hotelNovotelSingle: {
        //         type: String,
        // },
        // hotelNovotelDouble: {
        //         type: String,
        // },
        // hotelNovotelRoomType: {
        //         type: String,
        // },
        // type: {
        //         type: String,
        //         enum: ["INDIAN", "OVERSEAS"]
        // }
}, { timestamps: true });
companyCategorySchema.plugin(mongoosePaginate);
companyCategorySchema.plugin(mongooseAggregatePaginate);
const CompanyCategory = mongoose.model('Exhibition', companyCategorySchema);
module.exports = CompanyCategory;
