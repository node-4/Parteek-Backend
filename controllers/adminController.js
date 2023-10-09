const bcrypt = require('bcryptjs');
const advertisement = require('../model/Advertisement/advertisement');
const banner = require('../model/Banner/banner');
const bookCabs = require('../model/BookCabs/bookCabs');
const ChairmanDeskAboutFaiSeminarTheme = require('../model/ChairmanDeskAboutFaiSeminarTheme/ChairmanDeskAboutFaiSeminarTheme');
const company = require('../model/company/company');
const CompanyCategory = require('../model/company/companyCategoryModel');
const culturalProgram = require('../model/CulturalProgram/culturalProgram');
const dgDesk = require('../model/dgDesk/dgDesk');
const eventCategory = require('../model/Event/1eventCategory');
const eventOrganiser = require('../model/Event/2eventOrganiser');
const event = require('../model/Event/3Event');
const eventSession = require('../model/Event/4EventSession');
const locationFact = require('../model/EventLocationFacts/locationFact');
const locationFactsBanners = require('../model/EventLocationFacts/locationFactsBanners')
const eventSchedule = require('../model/EventSchedule/eventSchedule');
const exhibitor = require('../model/Exhibitor/Exhibitor');
const Exhibition = require('../model/Exhibition/Exhibition');
const feedbackParameter = require('../model/FeedbackParameter/feedbackParameter');
const Faq = require("../model/FAQ/faq.Model");
const feedback = require("../model/Feedback/feedback");
const helpline = require('../model/Helpline/helpline');
const appHelpline = require('../model/Helpline/appHelpline');
const meeting = require('../model/Meeting/meeting');
const nearByInterestType = require('../model/NearByPlaceAndInterest/nearByInterestType');
const nearByPlaceAndInterest = require('../model/NearByPlaceAndInterest/nearByPlaceAndInterest');
const registration = require('../model/Registration/registration');
const paper = require('../model/Speaker/paper');
const uploadAlbum = require('../model/UploadAlbum/uploadAlbum');
const Location = require('../model/locationModel');
const User = require('../model/userModel');
const notification = require("../model/notification");
const program = require("../model/Program/program");
const nodemailer = require("nodemailer");

exports.createCompanyCategory = async (req, res) => {
        try {
                const { categoryName, currency, seminarFee, isPublished } = req.body;
                let findCategory = await CompanyCategory.findOne({ categoryName, currency });
                if (findCategory) {
                        return res.status(409).json({ status: 409, message: 'Company category already exit', data: {} });
                } else {
                        const newCategory = await CompanyCategory.create({ categoryName, currency, seminarFee, isPublished, });
                        return res.status(200).json({ status: 200, message: 'Company category created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create company category' });
        }
};
exports.getCompanyCategoryById = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await CompanyCategory.findById(userId);
                if (user) {
                        return res.status(200).json({ message: "Company category found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Company category not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Company category" });
        }
};
exports.updateCompanyCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const companyCategory = await CompanyCategory.findById(id);
                if (!companyCategory) {
                        return res.status(404).json({ message: 'Company Category not found' });
                }
                const existingUser = await CompanyCategory.findOne({ _id: { $ne: companyCategory._id }, categoryName: req.body.categoryName, currency: req.body.currency });
                if (existingUser) {
                        return res.status(400).json({ status: 400, message: "already exists" });
                }
                companyCategory.categoryName = req.body.categoryName || companyCategory.categoryName;
                companyCategory.currency = req.body.currency || companyCategory.currency;
                companyCategory.seminarFee = req.body.seminarFee || companyCategory.seminarFee;
                companyCategory.isPublished = req.body.isPublished || companyCategory.isPublished;
                const updatedCategory = await companyCategory.save();
                return res.status(200).json({ message: 'Company Category updated successfully', data: updatedCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update Company Category' });
        }
};
exports.deleteCompanyCategory = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await CompanyCategory.findById(userId);
                if (user) {
                        const user1 = await CompanyCategory.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Company category delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Company category not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Company category" });
        }
};
exports.getAllCompanyCategories = async (req, res) => {
        try {
                const categories = await CompanyCategory.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Company category found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Company category not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch company categories' });
        }
};
exports.createLocation = async (req, res) => {
        try {
                const { locationType, countryState, locationName } = req.body;
                if (locationType === "Country") {
                        let findLocation = await Location.findOne({ locationType, locationName });
                        if (findLocation) {
                                return res.status(409).json({ status: 409, message: 'Location already exists', data: findLocation });
                        } else {
                                const savedLocation = await Location.create({ locationType, locationName });
                                return res.status(200).json({ status: 200, message: 'Location created successfully', location: savedLocation });
                        }
                } else {
                        let findLocation = await Location.findOne({ locationType, locationName, countryState });
                        if (findLocation) {
                                return res.status(409).json({ status: 409, message: 'Location already exists', data: findLocation });
                        } else {
                                if (locationType === "State") {
                                        let findCountry = await Location.findOne({ _id: countryState, locationType: "Country" });
                                        if (!findCountry) {
                                                return res.status(404).json({ status: 404, message: 'Country not found.', data: findCountry });
                                        } else {
                                                let findLocation = await Location.findOne({ locationType, country: findCountry._id, locationName });
                                                if (findLocation) {
                                                        return res.status(409).json({ status: 409, message: 'Location already exists', data: findLocation });
                                                } else {
                                                        const savedLocation = await Location.create({ locationType, country: findCountry._id, locationName });
                                                        return res.status(200).json({ status: 200, message: 'Location created successfully', location: savedLocation });
                                                }
                                        }
                                } else if (locationType === "City") {
                                        let findState = await Location.findOne({ _id: countryState, locationType: "State" });
                                        if (!findState) {
                                                return res.status(404).json({ status: 404, message: 'State not found.', data: findState });
                                        } else {
                                                let findLocation = await Location.findOne({ locationType, state: countryState, country: findState.country, locationName });
                                                if (findLocation) {
                                                        return res.status(409).json({ status: 409, message: 'Location already exists', data: findLocation });
                                                } else {
                                                        const savedLocation = await Location.create({ locationType, state: countryState, country: findState.country, locationName });
                                                        return res.status(200).json({ status: 200, message: 'Location created successfully', location: savedLocation });
                                                }
                                        }
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to create location' });
        }
};
exports.getAllLocationCountry = async (req, res) => {
        try {
                const locations = await Location.find({ locationType: "Country" });
                if (locations.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Countries found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'No countries found.', data: locations });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch locations' });
        }
};
exports.getAllLocationStateByCountry = async (req, res) => {
        try {
                const locations = await Location.find({ country: req.params.country, locationType: "State" });
                if (locations.length > 0) {
                        return res.status(200).json({ status: 200, message: 'States found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'No states found.', data: locations });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch locations' });
        }
};
exports.getAllLocationState = async (req, res) => {
        try {
                const locations = await Location.find({ locationType: "State" });
                if (locations.length > 0) {
                        return res.status(200).json({ status: 200, message: 'States found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'No states found.', data: locations });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch locations' });
        }
};
exports.getAllLocationCityByCountry = async (req, res) => {
        try {
                const locations = await Location.find({ country: req.params.country, locationType: "City" }).populate([{ path: 'state', select: 'locationName' }, { path: 'country', select: 'locationName' }]);
                if (locations.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Cities found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'No cities found.', data: locations });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch locations' });
        }
};
exports.getAllLocationCityByState = async (req, res) => {
        try {
                const locations = await Location.find({ state: req.params.state, locationType: "City" }).populate({ path: 'state', select: 'locationName' });
                if (locations.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Cities found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'No cities found.', data: locations });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch locations' });
        }
};
exports.getAllLocationCity = async (req, res) => {
        try {
                const locations = await Location.find({ locationType: "City" }).populate({ path: 'state', select: 'locationName' });
                if (locations.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Cities found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'No cities found.', data: locations });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch locations' });
        }
};
exports.getLocationById = async (req, res) => {
        try {
                const { locationId } = req.params;
                const location = await Location.findById(locationId).populate([{ path: 'state', select: 'locationName' }, { path: 'country', select: 'locationName' }]);
                if (!location) {
                        return res.status(404).json({ status: 404, message: 'Location not found' });
                }
                return res.status(200).json({ status: 200, message: 'Location found successfully', data: location });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to fetch location' });
        }
};
exports.updateLocation = async (req, res) => {
        try {
                const { locationId } = req.params;
                const { locationType, countryState, locationName } = req.body;
                const location = await Location.findById(locationId);
                if (!location) {
                        return res.status(404).json({ status: 404, message: 'Location not found' });
                } else {
                        if (locationType === "Country") {
                                let findLocation = await Location.findOne({ _id: { $ne: location._id }, locationType, locationName });
                                if (findLocation) {
                                        return res.status(409).json({ status: 409, message: 'Location already exists', data: findLocation });
                                } else {
                                        location.locationType = locationType;
                                        location.locationName = locationName;
                                        await location.save();
                                        return res.status(200).json({ status: 200, message: 'Location updated successfully', location: location });
                                }
                        } else {
                                let findLocation = await Location.findOne({ _id: { $ne: location._id }, locationType, locationName, countryState });
                                if (findLocation) {
                                        return res.status(409).json({ status: 409, message: 'Location already exists', data: findLocation });
                                } else {
                                        if (locationType === "State") {
                                                let findCountry = await Location.findOne({ _id: countryState, locationType: "Country" });
                                                if (!findCountry) {
                                                        return res.status(404).json({ status: 404, message: 'Country not found.', data: findCountry });
                                                } else {
                                                        location.locationType = locationType;
                                                        location.country = findCountry._id;
                                                        location.locationName = locationName;
                                                        await location.save();
                                                        return res.status(200).json({ status: 200, message: 'Location updated successfully', location: location });
                                                }
                                        } else if (locationType === "City") {
                                                let findState = await Location.findOne({ _id: countryState, locationType: "State" });
                                                if (!findState) {
                                                        return res.status(404).json({ status: 404, message: 'State not found.', data: findState });
                                                } else {
                                                        location.locationType = locationType;
                                                        location.country = findState.country;
                                                        location.state = countryState;
                                                        location.locationName = locationName;
                                                        await location.save();
                                                        return res.status(200).json({ status: 200, message: 'Location updated successfully', location: location });
                                                }
                                        }
                                }
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, error: 'Failed to update location' });
        }
};
exports.createCompany = async (req, res) => {
        try {
                const { companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch, pinCode, address2, isdCode } = req.body;

                if (!companyCategoryId || !companyName || !companyCode || !address1 || !countryId || !stateCityId || !companyNameOnBatch) {
                        return res.status(400).json({ message: "Provide all required fields: companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch", status: 400, data: {} });
                }

                const findCompanyCategory = await CompanyCategory.findById(companyCategoryId);
                if (!findCompanyCategory) {
                        return res.status(404).json({ message: "Company category not found", status: 404, data: {} });
                }

                const findCountry = await Location.findById(countryId);
                if (!findCountry) {
                        return res.status(404).json({ message: 'Country not found', status: 404, data: {} });
                }

                const findStateCityId = await Location.findById(stateCityId);
                if (!findStateCityId) {
                        return res.status(404).json({ message: 'StateCity not found', status: 404, data: {} });
                }

                let findCompany = await company.findOne({ companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Company category already exists', data: {} });
                } else {
                        const newCategory = await company.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Company created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create company category' });
        }
};
exports.getCompanyById = async (req, res) => {
        try {
                const companyId = req.params.companyId;
                const user = await company.findById(companyId).populate([{ path: 'countryId', select: 'locationName' }, { path: 'stateCityId', select: 'locationName' }, { path: 'companyCategoryId', select: 'categoryName currency seminarFee' }]);
                if (user) {
                        return res.status(200).json({ message: "Company found successfully", status: 200, data: user });
                }
                return res.status(404).json({ message: "Company not found", status: 404, data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve company" });
        }
};
exports.updateCompany = async (req, res) => {
        try {
                const { companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch, pinCode, address2, isdCode } = req.body;
                const companyId = req.params.companyId;
                const findData = await company.findById(companyId);

                if (!findData) {
                        return res.status(404).json({ message: "Company not found", status: 404, data: {} });
                }

                if (companyCategoryId) {
                        const findCompanyCategory = await CompanyCategory.findById(companyCategoryId);
                        if (!findCompanyCategory) {
                                return res.status(404).json({ message: "Company category not found", status: 404, data: {} });
                        }
                }

                if (countryId) {
                        const findCountry = await Location.findById(countryId);
                        if (!findCountry) {
                                return res.status(404).json({ status: 404, message: 'Country not found' });
                        }
                }

                if (stateCityId) {
                        const findStateCityId = await Location.findById(stateCityId);
                        if (!findStateCityId) {
                                return res.status(404).json({ status: 404, message: 'StateCity not found' });
                        }
                }

                let findCompany = await company.findOne({ _id: { $ne: findData._id }, companyCategoryId, companyName, companyNameOnBatch });

                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Company already exists', data: findCompany });
                } else {
                        let data = {
                                companyCategoryId: companyCategoryId || findData.companyCategoryId,
                                companyName: companyName || findData.companyName,
                                companyCode: companyCode || findData.companyCode,
                                address1: address1 || findData.address1,
                                countryId: countryId || findData.countryId,
                                stateCityId: stateCityId || findData.stateCityId,
                                companyNameOnBatch: companyNameOnBatch || findData.companyNameOnBatch,
                                address2: address2 || findData.address2,
                                pinCode: pinCode || findData.pinCode,
                                isdCode: isdCode || findData.isdCode,
                        };

                        const newCategory = await company.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Company updated successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update company' });
        }
};
exports.deleteCompany = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await company.findById(userId);

                if (user) {
                        const user1 = await company.findByIdAndDelete({ _id: user._id });
                        if (user1) {
                                return res.status(200).json({ message: "Company deleted successfully", status: 200, data: {} });
                        }
                } else {
                        return res.status(404).json({ message: "Company not found", status: 404, data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve company" });
        }
};
exports.getAllCompany = async (req, res) => {
        try {
                const categories = await company.find();

                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Companies found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Companies not found', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch companies' });
        }
};
exports.getEventCategoryById = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await eventCategory.findById(userId);

                if (user) {
                        return res.status(200).json({ message: "Event category found successfully", status: 200, data: user });
                }

                return res.status(404).json({ message: "Event category not found", status: 404, data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve event category" });
        }
};
exports.createEventCategory = async (req, res) => {
        try {
                const { eventCategoryName, showInOrder, isPublished } = req.body;
                let findCategory = await eventCategory.findOne({ eventCategoryName, showInOrder });
                if (findCategory) {
                        return res.status(409).json({ status: 409, message: 'Event category already exists', data: {} });
                } else {
                        const newCategory = await eventCategory.create({ eventCategoryName, showInOrder, isPublished });
                        return res.status(200).json({ status: 200, message: 'Event category created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create event category' });
        }
};
exports.updateEventCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const findCategory = await eventCategory.findById(id);

                if (!findCategory) {
                        return res.status(404).json({ message: 'Event category not found', status: 404, data: {} });
                }

                const existingCategory = await eventCategory.findOne({ _id: { $ne: findCategory._id }, eventCategoryName: req.body.eventCategoryName });

                if (existingCategory) {
                        return res.status(400).json({ status: 400, message: "Event category with the same name already exists" });
                }

                findCategory.eventCategoryName = req.body.eventCategoryName || findCategory.eventCategoryName;
                findCategory.showInOrder = req.body.showInOrder || findCategory.showInOrder;
                findCategory.isPublished = req.body.isPublished || findCategory.isPublished;

                const updatedCategory = await findCategory.save();
                return res.status(200).json({ message: 'Event category updated successfully', data: updatedCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update event category' });
        }
};
exports.deleteEventCategory = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await eventCategory.findById(userId);

                if (user) {
                        const user1 = await eventCategory.findByIdAndDelete({ _id: user._id });
                        if (user1) {
                                return res.status(200).json({ message: "Event category deleted successfully", status: 200, data: {} });
                        }
                } else {
                        return res.status(404).json({ message: "Event category not found", status: 404, data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve event category" });
        }
};
exports.getAllEventCategories = async (req, res) => {
        try {
                const categories = await eventCategory.find().sort({ showInOrder: 1 });

                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Event categories found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Event categories not found', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch event categories' });
        }
};
exports.createEventOrganiser = async (req, res) => {
        try {
                const { shortName, orgName, address, contactPerson, contactPersonNo, alternateAddress, isPublished, contactEmail, contactFax } = req.body;

                if (!shortName || !orgName || !address || !contactPerson || !contactPersonNo || !alternateAddress || !isPublished) {
                        return res.status(400).json({ message: "Provide all required fields: shortName, orgName, address, contactPerson, contactPersonNo, alternateAddress, isPublished", status: 400, data: {} });
                }

                let findCompany = await eventOrganiser.findOne({ shortName, orgName });

                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'EventOrganiser already exists', data: {} });
                } else {
                        if (req.file) {
                                req.body.logo = req.file.path;
                        } else {
                                return res.status(400).json({ message: "Logo is required", status: 400, data: {} });
                        }

                        const newCategory = await eventOrganiser.create(req.body);
                        return res.status(200).json({ status: 200, message: 'EventOrganiser created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create eventOrganiser' });
        }
};
exports.getEventOrganiserById = async (req, res) => {
        try {
                const eventOrganiserId = req.params.eventOrganiserId;
                const user = await eventOrganiser.findById(eventOrganiserId);

                if (user) {
                        return res.status(200).json({ message: "EventOrganiser found successfully", status: 200, data: user });
                }

                return res.status(404).json({ message: "EventOrganiser not found", status: 404, data: {} });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventOrganiser" });
        }
};
exports.updateEventOrganiser = async (req, res) => {
        try {
                const { shortName, orgName, address, contactPerson, contactPersonNo, alternateAddress, isPublished, contactEmail, contactFax } = req.body;
                const eventOrganiserId = req.params.eventOrganiserId;
                const findData = await eventOrganiser.findById(eventOrganiserId);

                if (!findData) {
                        return res.status(404).json({ message: "EventOrganiser not found", status: 404, data: {} });
                }

                let findCompany = await eventOrganiser.findOne({ _id: { $ne: findData._id }, shortName, orgName });

                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'EventOrganiser already exists', data: findCategory });
                } else {
                        let logo;

                        if (req.file) {
                                logo = req.file.path;
                        } else {
                                logo = findData.logo;
                        }

                        let data = {
                                shortName: shortName || findData.shortName,
                                orgName: orgName || findData.orgName,
                                address: address || findData.address,
                                contactPerson: contactPerson || findData.contactPerson,
                                contactPersonNo: contactPersonNo || findData.contactPersonNo,
                                alternateAddress: alternateAddress || findData.alternateAddress,
                                isPublished: isPublished || findData.isPublished,
                                contactEmail: contactEmail || findData.contactEmail,
                                logo: logo || findData.logo,
                                contactFax: contactFax || findData.contactFax,
                        };

                        const newCategory = await eventOrganiser.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'EventOrganiser updated successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update EventOrganiser' });
        }
};
exports.deleteEventOrganiser = async (req, res) => {
        try {
                const eventOrganiserId = req.params.id;
                const user = await eventOrganiser.findById(eventOrganiserId);

                if (user) {
                        const user1 = await eventOrganiser.findByIdAndDelete({ _id: user._id });

                        if (user1) {
                                return res.status(200).json({ message: "EventOrganiser deleted successfully", status: 200, data: {} });
                        }
                } else {
                        return res.status(404).json({ message: "EventOrganiser not found", status: 404, data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventOrganiser" });
        }
};
exports.getAllEventOrganisers = async (req, res) => {
        try {
                const eventOrganisers = await eventOrganiser.find();

                if (eventOrganisers.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Event organisers found successfully', data: eventOrganisers });
                } else {
                        return res.status(404).json({ status: 404, message: 'Event organisers not found', data: eventOrganisers });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch event organisers' });
        }
};
exports.getAllEventOrganiser = async (req, res) => {
        try {
                const categories = await eventOrganiser.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'EventOrganiser found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'EventOrganiser not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch EventOrganiser' });
        }
};
exports.createEvent = async (req, res) => {
        try {
                const { eventOrganiserId, eventCategoryId, eventName, eventDescription, eventCountryId, eventCityId, eventAddress, eventFromDate, eventToDate, lat, long, mobileAppIcon, isPublished, showInOrder } = req.body;
                if (!eventOrganiserId && !eventCategoryId && !eventName && !eventDescription && !eventCountryId && !eventCityId && !eventAddress && !eventFromDate && !eventToDate && !lat && !long) {
                        return res.status(201).json({ message: "Provide require fields  eventOrganiserId, eventCategoryId, eventName, eventDescription, eventCountryId, eventCityId, eventAddress, eventFromDate, eventToDate, lat, long", status: 404, data: {}, });
                }
                const findEventOrganiser = await eventOrganiser.findById(eventOrganiserId);
                if (!findEventOrganiser) {
                        return res.status(404).json({ status: 404, message: 'country not found' });
                }
                const findEventCategoryId = await eventCategory.findById(eventCategoryId);
                if (!findEventCategoryId) {
                        return res.status(404).json({ status: 404, message: 'StateCity not found' });
                }
                const findCountry = await Location.findById(eventCountryId);
                if (!findCountry) {
                        return res.status(404).json({ status: 404, message: 'country not found' });
                }
                const findstateCityId = await Location.findById(eventCityId);
                if (!findstateCityId) {
                        return res.status(404).json({ status: 404, message: 'StateCity not found' });
                }
                let findCompany = await event.findOne({ eventOrganiserId, eventCategoryId, eventName });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.mobileAppIcon = req.file.path
                        } else {
                                return res.status(201).json({ message: "Mobile App Icon require", status: 201, data: {}, });
                        }
                        if (req.body.lat || req.body.long) {
                                coordinates = [parseFloat(req.body.lat), parseFloat(req.body.long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        const d = new Date(req.body.eventFromDate);
                        req.body.eventFromDate = d.toISOString();
                        const d1 = new Date(req.body.eventToDate);
                        req.body.eventToDate = d1.toISOString();
                        const newCategory = await event.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Event created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create event' });
        }
};
exports.getEventById = async (req, res) => {
        try {
                const eventId = req.params.eventId;
                const user = await event.findById(eventId);
                if (user) {
                        return res.status(200).json({ message: "Event found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Event not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Event" });
        }
};
exports.updateEvent = async (req, res) => {
        try {
                const { eventOrganiserId, eventCategoryId, eventName, eventDescription, eventCountryId, eventCityId, eventAddress, eventFromDate, eventToDate, lat, long, mobileAppIcon, isPublished, showInOrder, } = req.body;
                const eventId = req.params.eventId;
                const findData = await event.findById(eventId);
                if (!findData) {
                        return res.status(404).json({ message: "Event not Found", status: 404, data: {}, });
                }
                if (eventCategoryId) {
                        const findEventCategoryId = await eventCategory.findById(eventCategoryId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'Event Category not found' });
                        }
                }
                if (eventOrganiserId) {
                        const findEventOrganiser = await eventOrganiser.findById(eventOrganiserId);
                        if (!findEventOrganiser) {
                                return res.status(404).json({ status: 404, message: 'Event Organiser not found' });
                        }
                }
                if (eventCountryId) {
                        const findCountry = await Location.findById(eventCountryId);
                        if (!findCountry) { return res.status(404).json({ status: 404, message: 'country not found' }); }
                }
                if (eventCityId) {
                        const findeventCityId = await Location.findById(eventCityId);
                        if (!findeventCityId) { return res.status(404).json({ status: 404, message: 'StateCity not found' }); }
                }
                let findCompany = await event.findOne({ _id: { $ne: findData._id }, eventOrganiserId, eventCategoryId, eventName, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event already Exit', data: findCategory });
                } else {
                        let mobileAppIcon;
                        if (req.file) {
                                mobileAppIcon = req.file.path
                        } else {
                                mobileAppIcon = findData.mobileAppIcon
                        }
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        let data = {
                                eventOrganiserId: eventOrganiserId || findData.eventOrganiserId,
                                eventCategoryId: eventCategoryId || findData.eventCategoryId,
                                eventName: eventName || findData.eventName,
                                eventDescription: eventDescription || findData.eventDescription,
                                eventCountryId: eventCountryId || findData.eventCountryId,
                                eventCityId: eventCityId || findData.eventCityId,
                                eventAddress: eventAddress || findData.eventAddress,
                                eventFromDate: eventFromDate || findData.eventFromDate,
                                eventToDate: eventToDate || findData.eventToDate,
                                mobileAppIcon: mobileAppIcon || findData.mobileAppIcon,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                                location: req.body.location || findData.location
                        }
                        const newCategory = await event.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Event update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Event' });
        }
};
exports.deleteEvent = async (req, res) => {
        try {
                const eventId = req.params.id;
                const user = await event.findById(eventId);
                if (user) {
                        const user1 = await event.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Event delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Event not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Event" });
        }
};
exports.getAllEvent = async (req, res) => {
        try {
                const categories = await event.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Event found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Event not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Event' });
        }
};
exports.createEventSession = async (req, res) => {
        try {
                const { eventId, sessionName, sessionTitle, sessionDate, sessionFromTime, sessionToTime, isPublished } = req.body;
                if (!eventId && !sessionName && !sessionTitle && !sessionDate && !sessionFromTime && !sessionToTime && !isPublished) {
                        return res.status(201).json({ message: "Provide require fields  eventId, sessionName, sessionTitle, sessionDate, sessionFromTime, sessionToTime, isPublished", status: 404, data: {}, });
                }
                const findEventOrganiser = await event.findById({ _id: eventId });
                if (!findEventOrganiser) {
                        return res.status(404).json({ status: 404, message: 'event not found' });
                }
                let findCompany = await eventSession.findOne({ eventId, sessionName, sessionTitle });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event Session already exit', data: {} });
                } else {
                        const d = new Date(req.body.sessionDate);
                        req.body.sessionDate = d.toISOString();
                        const newCategory = await eventSession.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Event Session created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create event' });
        }
};
exports.getEventSessionById = async (req, res) => {
        try {
                const _id = req.params.eventSessionId;
                const user = await eventSession.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "Event Session found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Event Session not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Event Session" });
        }
};
exports.updateEventSession = async (req, res) => {
        try {
                const { eventId, sessionName, sessionTitle, sessionDate, sessionFromTime, sessionToTime, isPublished } = req.body;
                const eventSessionId = req.params.eventSessionId;
                const findData = await eventSession.findById(eventSessionId);
                if (!findData) {
                        return res.status(404).json({ message: "Event Session not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'event Session not found' });
                        }
                }
                let findCompany = await eventSession.findOne({ _id: { $ne: findData._id }, eventId, sessionName, sessionTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event Session already Exit', data: findCategory });
                } else {
                        if (req.body.sessionDate) {
                                const d = new Date(req.body.sessionDate);
                                req.body.sessionDate = d.toISOString();
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                sessionName: sessionName || findData.sessionName,
                                sessionTitle: sessionTitle || findData.sessionTitle,
                                sessionDate: sessionDate || findData.sessionDate,
                                sessionFromTime: sessionFromTime || findData.sessionFromTime,
                                sessionToTime: sessionToTime || findData.sessionToTime,
                                isPublished: isPublished || findData.isPublished
                        }
                        const newCategory = await eventSession.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Event Session update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Event Session' });
        }
};
exports.deleteEventSession = async (req, res) => {
        try {
                const eventId = req.params.id;
                const user = await eventSession.findById(eventId);
                if (user) {
                        const user1 = await eventSession.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Event Session delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Event Session not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Event Session" });
        }
};
exports.getAllEventSession = async (req, res) => {
        try {
                const categories = await eventSession.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Event Session found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Event Session not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Event Session' });
        }
};
exports.createPaper = async (req, res) => {
        try {
                const { eventId, abstractPaperTitle, author, abstractPaperDescription, abstractPaperUrl, isPublished } = req.body;
                if (!eventId && !abstractPaperTitle && !isPublished) {
                        return res.status(404).json({ message: "Provide require fields  eventId, abstractPaperTitle, isPublished", status: 404, data: {}, });
                }
                const findEventOrganiser = await event.findById({ _id: eventId });
                if (!findEventOrganiser) {
                        return res.status(404).json({ status: 404, message: 'event not found' });
                }
                let findCompany = await paper.findOne({ eventId, abstractPaperTitle });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Paper already exit', data: {} });
                } else {
                        const newCategory = await paper.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Paper created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Paper' });
        }
};
exports.getPaperById = async (req, res) => {
        try {
                const _id = req.params.paperId;
                const user = await paper.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "Paper found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Paper not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Paper" });
        }
};
exports.updatePaper = async (req, res) => {
        try {
                const { eventId, abstractPaperTitle, author, abstractPaperDescription, abstractPaperUrl, isPublished } = req.body;
                const paperId = req.params.paperId;
                const findData = await paper.findById(paperId);
                if (!findData) {
                        return res.status(404).json({ message: "Paper not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'paper not found' });
                        }
                }
                let findCompany = await paper.findOne({ _id: { $ne: findData._id }, eventId, abstractPaperTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Paper already Exit', data: findCategory });
                } else {
                        let data = {
                                eventId: eventId || findData.eventId,
                                abstractPaperTitle: abstractPaperTitle || findData.abstractPaperTitle,
                                author: author || findData.author,
                                abstractPaperDescription: abstractPaperDescription || findData.abstractPaperDescription,
                                abstractPaperUrl: abstractPaperUrl || findData.abstractPaperUrl,
                                isPublished: isPublished || findData.isPublished
                        }
                        const newCategory = await paper.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Paper update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Paper' });
        }
};
exports.deletePaper = async (req, res) => {
        try {
                const paperId = req.params.id;
                const user = await paper.findById(paperId);
                if (user) {
                        const user1 = await paper.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Paper delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Paper not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Paper" });
        }
};
exports.getAllPaper = async (req, res) => {
        try {
                const categories = await paper.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Paper found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Paper not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Paper' });
        }
};
exports.createSpeaker = async (req, res) => {
        try {
                const { eventId, speakerTitle, speakerName, companyId, designation, email, contactNo, speakerAbstractId, profilePic, biography, isPublished, showInOrder, listAsspeaker } = req.body;
                if (!eventId && !speakerName) {
                        return res.status(404).json({ message: "Provide require fields  eventId, speakerName", status: 404, data: {}, });
                }
                if (companyId) {
                        const findCompany = await company.findById(companyId);
                        if (!findCompany) {
                                return res.status(404).json({ status: 404, message: 'Company not found' });
                        }
                }
                if (speakerAbstractId) {
                        const findEventCategoryId = await paper.findById(speakerAbstractId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'AbstractId not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findSpeaker = await User.findOne({ eventId, speakerName, userType: "SPEAKER" });
                if (findSpeaker) {
                        return res.status(409).json({ status: 409, message: 'Speaker already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                return res.status(404).json({ message: "ProfilePic require", status: 404, data: {}, });
                        }
                        req.body.userType = "SPEAKER";
                        const newCategory = await User.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Speaker created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create event' });
        }
};
exports.getSpeakerById = async (req, res) => {
        try {
                const speakerId = req.params.speakerId;
                const user = await User.findOne({ _id: speakerId, userType: "SPEAKER" }).populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');
                if (user) {
                        return res.status(200).json({ message: "Speaker found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Speaker not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Speaker" });
        }
};
exports.updateSpeaker = async (req, res) => {
        try {
                const { eventId, speakerTitle, speakerName, companyId, designation, email, contactNo, speakerAbstractId, profilePic, biography, isPublished, showInOrder, listAsspeaker, } = req.body;
                const speakerId = req.params.speakerId;
                const findData = await User.findOne({ _id: speakerId, userType: "SPEAKER" });
                if (!findData) {
                        return res.status(404).json({ message: "Event not Found", status: 404, data: {}, });
                }
                if (companyId) {
                        const findCompany = await company.findById(companyId);
                        if (!findCompany) {
                                return res.status(404).json({ status: 404, message: 'Company not found' });
                        }
                }
                if (speakerAbstractId) {
                        const findEventCategoryId = await paper.findById(speakerAbstractId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'AbstractId not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await User.findOne({ _id: { $ne: findData._id }, userType: "SPEAKER", eventId, speakerName, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event already Exit', data: findCategory });
                } else {
                        let profilePic;
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                profilePic = findData.profilePic
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                speakerTitle: speakerTitle || findData.speakerTitle,
                                speakerName: speakerName || findData.speakerName,
                                companyId: companyId || findData.companyId,
                                designation: designation || findData.designation,
                                email: email || findData.email,
                                contactNo: contactNo || findData.contactNo,
                                speakerAbstractId: speakerAbstractId || findData.speakerAbstractId,
                                biography: biography || findData.biography,
                                profilePic: profilePic || findData.profilePic,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                                listAsspeaker: listAsspeaker || findData.listAsspeaker,
                        }
                        const newCategory = await User.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Speaker update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Speaker' });
        }
};
exports.deleteSpeaker = async (req, res) => {
        try {
                const speakerId = req.params.id;
                const user = await User.findOne({ _id: speakerId, userType: "SPEAKER" });
                if (user) {
                        const user1 = await User.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Speaker delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Speaker not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Speaker" });
        }
};
exports.getAllSpeaker = async (req, res) => {
        try {
                const categories = await User.find({ userType: "SPEAKER" }).populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Speaker found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Speaker not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Speaker' });
        }
};
exports.createSponser = async (req, res) => {
        try {
                const { eventId, sponserType, sponserName, sponserShortname, sponserLabel, sponserAddress, lat, long, sponserCountryId, sponserCityId, pinCode, sponserLogo, sponserDescription, sponserFromDate, sponserToDate, sponserWebUrl, contactPerson, contactPersonNo, isPublished, showInOrder, meetAt } = req.body;
                if (!eventId && !sponserType && !sponserName && !sponserCountryId && !sponserCityId && !pinCode) {
                        return res.status(404).json({ message: "Provide require fields  eventId, sponserType, sponserNam,esponserCountryId, sponserCityId, pinCode", status: 404, data: {}, });
                }
                if (sponserCountryId) {
                        const findCompany = await Location.findById(sponserCountryId);
                        if (!findCompany) {
                                return res.status(404).json({ status: 404, message: 'Country not found' });
                        }
                }
                if (sponserCityId) {
                        const findEventCategoryId = await Location.findById(sponserCityId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'City not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findSpeaker = await User.findOne({ eventId, sponserType, sponserName, sponserCountryId, sponserCityId, pinCode, userType: "SPONSER" });
                if (findSpeaker) {
                        return res.status(409).json({ status: 409, message: 'Sponser already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.sponserLogo = req.file.path
                        } else {
                                return res.status(404).json({ message: "Sponser Logo require", status: 404, data: {}, });
                        }
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        req.body.userType = "SPONSER";
                        const newCategory = await User.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Sponser created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create event' });
        }
};
exports.getSponserById = async (req, res) => {
        try {
                const sponserId = req.params.sponserId;
                const user = await User.findOne({ _id: sponserId, userType: "SPONSER" }).populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');
                if (user) {
                        return res.status(200).json({ message: "Sponser found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Sponser not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Sponser" });
        }
};
exports.updateSponser = async (req, res) => {
        try {
                const { eventId, sponserType, sponserName, sponserShortname, sponserLabel, sponserAddress, sponserCountryId, sponserCityId, pinCode, lat, long, sponserLogo, sponserDescription, sponserFromDate, sponserToDate, sponserWebUrl, contactPerson, contactPersonNo, isPublished, showInOrder, meetAt } = req.body;
                const sponserId = req.params.sponserId;
                const findData = await User.findOne({ _id: sponserId, userType: "SPONSER" });
                if (!findData) {
                        return res.status(404).json({ message: "Sponser not Found", status: 404, data: {}, });
                }
                if (sponserCountryId) {
                        const findCompany = await Location.findById(sponserCountryId);
                        if (!findCompany) {
                                return res.status(404).json({ status: 404, message: 'Country not found' });
                        }
                }
                if (sponserCityId) {
                        const findEventCategoryId = await Location.findById(sponserCityId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'City not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await User.findOne({ _id: { $ne: findData._id }, userType: "SPONSER", eventId, sponserType, sponserName, sponserCountryId, sponserCityId, pinCode, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event already Exit', data: findCategory });
                } else {
                        let sponserLogo;
                        if (req.file) {
                                req.body.sponserLogo = req.file.path
                        } else {
                                sponserLogo = findData.sponserLogo
                        }
                        let location;
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                location = { type: "Point", coordinates };
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                sponserType: sponserType || findData.sponserType,
                                sponserName: sponserName || findData.sponserName,
                                sponserShortname: sponserShortname || findData.sponserShortname,
                                sponserLabel: sponserLabel || findData.sponserLabel,
                                sponserAddress: sponserAddress || findData.sponserAddress,
                                sponserCountryId: sponserCountryId || findData.sponserCountryId,
                                sponserCityId: sponserCityId || findData.sponserCityId,
                                pinCode: pinCode || findData.pinCode,
                                sponserLogo: sponserLogo || findData.sponserLogo,
                                sponserDescription: sponserDescription || findData.sponserDescription,
                                sponserFromDate: sponserFromDate || findData.sponserFromDate,
                                sponserToDate: sponserToDate || findData.sponserToDate,
                                sponserWebUrl: sponserWebUrl || findData.sponserWebUrl,
                                contactPerson: contactPerson || findData.contactPerson,
                                contactPersonNo: contactPersonNo || findData.contactPersonNo,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                                meetAt: meetAt || findData.meetAt,
                                location: location || findData.location,
                        }
                        const newCategory = await User.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Speaker update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Speaker' });
        }
};
exports.deleteSponser = async (req, res) => {
        try {
                const sponserId = req.params.id;
                const user = await User.findOne({ _id: sponserId, userType: "SPONSER" });
                if (user) {
                        const user1 = await User.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Sponser delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Sponser not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Sponser" });
        }
};
exports.getAllSponser = async (req, res) => {
        try {
                const categories = await User.find({ userType: "SPONSER" }).populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Sponser found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Sponser not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Sponser' });
        }
};
exports.createExhibitor = async (req, res) => {
        try {
                const { eventId, exhibitorName, exhibitorShortname, exhibitorDescription, exhibitorAddress, exhibitorCountryId, exhibitorCityId, pinCode, lat, long, email, exhibitorLogo, stallNo, exhibitorWebUrl, contactPerson, contactPersonNo, isPublished, showInOrder } = req.body;
                if (!eventId && !exhibitorName && !exhibitorCountryId && !exhibitorCityId) {
                        return res.status(404).json({ message: "Provide require fields  eventId, exhibitorName, exhibitorCountryId, exhibitorCityId", status: 404, data: {}, });
                }
                const findCountry = await Location.findById(exhibitorCountryId);
                if (!findCountry) {
                        return res.status(404).json({ status: 404, message: 'country not found' });
                }
                const findstateCityId = await Location.findById(exhibitorCityId);
                if (!findstateCityId) {
                        return res.status(404).json({ status: 404, message: 'StateCity not found' });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findCompany = await exhibitor.findOne({ exhibitorName, eventId, exhibitorCountryId, exhibitorCityId });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Exhibitor already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.exhibitorLogo = req.file.path
                        } else {
                                return res.status(404).json({ message: "Exhibitor Logo Icon require", status: 404, data: {}, });
                        }
                        if (req.body.lat || req.body.long) {
                                coordinates = [parseFloat(req.body.lat), parseFloat(req.body.long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        const newCategory = await exhibitor.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Exhibitor created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Exhibitor' });
        }
};
exports.getExhibitorById = async (req, res) => {
        try {
                const exhibitorId = req.params.exhibitorId;
                const user = await exhibitor.findById(exhibitorId);
                if (user) {
                        return res.status(200).json({ message: "Exhibitor found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Exhibitor not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Exhibitor" });
        }
};
exports.updateExhibitor = async (req, res) => {
        try {
                const { eventId, exhibitorName, exhibitorShortname, exhibitorDescription, exhibitorAddress, exhibitorCountryId, exhibitorCityId, pinCode, lat, long, email, exhibitorLogo, stallNo, exhibitorWebUrl, contactPerson, contactPersonNo, isPublished, showInOrder } = req.body;
                const exhibitorId = req.params.exhibitorId;
                const findData = await exhibitor.findById(exhibitorId);
                if (!findData) {
                        return res.status(404).json({ message: "Exhibitor not Found", status: 404, data: {}, });
                }
                if (exhibitorCountryId) {
                        const findCountry = await Location.findById(exhibitorCountryId);
                        if (!findCountry) {
                                return res.status(404).json({ status: 404, message: 'country not found' });
                        }
                }
                if (exhibitorCityId) {
                        const findstateCityId = await Location.findById(exhibitorCityId);
                        if (!findstateCityId) {
                                return res.status(404).json({ status: 404, message: 'StateCity not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await exhibitor.findOne({ _id: { $ne: findData._id }, exhibitorName, eventId, exhibitorCountryId, exhibitorCityId, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Event already Exit', data: findCategory });
                } else {
                        let exhibitorLogo;
                        if (req.file) {
                                exhibitorLogo = req.file.path
                        } else {
                                exhibitorLogo = findData.exhibitorLogo
                        }
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                exhibitorName: exhibitorName || findData.exhibitorName,
                                exhibitorShortname: exhibitorShortname || findData.exhibitorShortname,
                                exhibitorDescription: exhibitorDescription || findData.exhibitorDescription,
                                exhibitorAddress: exhibitorAddress || findData.exhibitorAddress,
                                exhibitorCountryId: exhibitorCountryId || findData.exhibitorCountryId,
                                exhibitorCityId: exhibitorCityId || findData.exhibitorCityId,
                                pinCode: pinCode || findData.pinCode,
                                location: req.body.location || findData.location,
                                email: email || findData.email,
                                exhibitorLogo: exhibitorLogo || findData.exhibitorLogo,
                                stallNo: stallNo || findData.stallNo,
                                exhibitorWebUrl: exhibitorWebUrl || findData.exhibitorWebUrl,
                                contactPerson: contactPerson || findData.contactPerson,
                                contactPersonNo: contactPersonNo || findData.contactPersonNo,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await exhibitor.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Exhibitor update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Exhibitor' });
        }
};
exports.deleteExhibitor = async (req, res) => {
        try {
                const exhibitorId = req.params.id;
                const user = await exhibitor.findById(exhibitorId);
                if (user) {
                        const user1 = await exhibitor.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Exhibitor delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Exhibitor not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Exhibitor" });
        }
};
exports.getAllExhibitor = async (req, res) => {
        try {
                const categories = await exhibitor.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Exhibitor found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Exhibitor not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Exhibitor' });
        }
};
exports.createEventSchedule = async (req, res) => {
        try {
                const { eventId, eventSessionId, programTitle, programDescription, programDate, programFromTime, programToTime, isShowTime, speaker1, speaker2, speaker3, speaker4, speaker5, sponser1, sponser2, showInOrder, smallIcon, programWebUrl, isPublished } = req.body;
                if (!eventId && !eventSessionId && !programTitle && !programDate && !programFromTime && !programToTime && !isShowTime && !showInOrder) {
                        return res.status(201).json({ message: "Provide require fields  eventId, eventSessionId, programTitle, programDate, programFromTime, programToTime, isShowTime, showInOrder", status: 404, data: {}, });
                }
                const findEvent = await event.findById(eventId); if (!findEvent) { return res.status(404).json({ status: 404, message: 'Event not found' }); }
                const findSession = await eventSession.findById(eventSessionId); if (!findSession) { return res.status(404).json({ status: 404, message: 'Event Session not found' }); }
                if (speaker1) { const findSpeaker1 = await User.findOne({ _id: speaker1, userType: "SPEAKER" }); if (!findSpeaker1) { return res.status(404).json({ status: 404, message: 'Speaker1 not found' }); } }
                if (speaker2) { const findSpeaker2 = await User.findOne({ _id: speaker2, userType: "SPEAKER" }); { return res.status(404).json({ status: 404, message: 'Speaker2 not found' }); } }
                if (speaker3) { const findSpeaker3 = await User.findOne({ _id: speaker3, userType: "SPEAKER" }); if (!findSpeaker3) { return res.status(404).json({ status: 404, message: 'Speaker3 not found' }); } }
                if (speaker4) { const findSpeaker4 = await User.findOne({ _id: speaker4, userType: "SPEAKER" }); if (!findSpeaker4) { return res.status(404).json({ status: 404, message: 'speaker4 not found' }); } }
                if (speaker5) { const findSpeaker5 = await User.findOne({ _id: speaker5, userType: "SPEAKER" }); if (!findSpeaker5) { return res.status(404).json({ status: 404, message: 'speaker5 not found' }); } }
                if (sponser1) { const findSponser1 = await User.findOne({ _id: sponser1, userType: "SPONSER" }); if (!findSponser1) { return res.status(404).json({ status: 404, message: 'Sponser1 not found' }); } }
                if (sponser2) { const findSponser2 = await User.findOne({ _id: sponser2, userType: "SPONSER" }); if (!findSponser2) { return res.status(404).json({ status: 404, message: 'Sponser2 not found' }); } }
                let findCompany = await eventSchedule.findOne({ eventId, eventSessionId, programTitle, programDate, programFromTime, programToTime });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'EventSchedule already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.smallIcon = req.file.path
                        } else {
                                return res.status(404).json({ message: "Event Schedule Logo Icon require", status: 404, data: {}, });
                        }
                        const newCategory = await eventSchedule.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Event Schedule created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create EventSchedule' });
        }
};
exports.getEventScheduleById = async (req, res) => {
        try {
                const eventScheduleId = req.params.eventScheduleId;
                const user = await eventSchedule.findById(eventScheduleId);
                if (user) {
                        return res.status(200).json({ message: "EventSchedule found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "EventSchedule not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventSchedule" });
        }
};
exports.updateEventSchedule = async (req, res) => {
        try {
                const { eventId, eventSessionId, programTitle, programDescription, programDate, programFromTime, programToTime, isShowTime, speaker1, speaker2, speaker3, speaker4, speaker5, sponser1, sponser2, showInOrder, smallIcon, programWebUrl, isPublished } = req.body;
                const eventScheduleId = req.params.eventScheduleId;
                const findData = await eventSchedule.findById(eventScheduleId); if (!findData) { return res.status(404).json({ message: "EventSchedule not Found", status: 404, data: {}, }); }
                if (eventId) { const findEvent = await event.findById(eventId); if (!findEvent) { return res.status(404).json({ status: 404, message: 'Event not found' }); } }
                if (eventSessionId) { const findSession = await eventSession.findById(eventSessionId); if (!findSession) { return res.status(404).json({ status: 404, message: 'Event Session not found' }); } }
                if (speaker1) { const findSpeaker1 = await User.findOne({ _id: speaker1, userType: "SPEAKER" }); if (!findSpeaker1) { return res.status(404).json({ status: 404, message: 'Speaker1 not found' }); } }
                if (speaker2) { const findSpeaker2 = await User.findOne({ _id: speaker2, userType: "SPEAKER" }); { return res.status(404).json({ status: 404, message: 'Speaker2 not found' }); } }
                if (speaker3) { const findSpeaker3 = await User.findOne({ _id: speaker3, userType: "SPEAKER" }); if (!findSpeaker3) { return res.status(404).json({ status: 404, message: 'Speaker3 not found' }); } }
                if (speaker4) { const findSpeaker4 = await User.findOne({ _id: speaker4, userType: "SPEAKER" }); if (!findSpeaker4) { return res.status(404).json({ status: 404, message: 'speaker4 not found' }); } }
                if (speaker5) { const findSpeaker5 = await User.findOne({ _id: speaker5, userType: "SPEAKER" }); if (!findSpeaker5) { return res.status(404).json({ status: 404, message: 'speaker5 not found' }); } }
                if (sponser1) { const findSponser1 = await User.findOne({ _id: sponser1, userType: "SPONSER" }); if (!findSponser1) { return res.status(404).json({ status: 404, message: 'Sponser1 not found' }); } }
                if (sponser2) { const findSponser2 = await User.findOne({ _id: sponser2, userType: "SPONSER" }); if (!findSponser2) { return res.status(404).json({ status: 404, message: 'Sponser2 not found' }); } }
                let findCompany = await eventSchedule.findOne({ _id: { $ne: findData._id }, exhibitorName, eventId, exhibitorCountryId, exhibitorCityId, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'EventSchedule already Exit', data: findCategory });
                } else {
                        let smallIcon;
                        if (req.file) {
                                smallIcon = req.file.path
                        } else {
                                smallIcon = findData.smallIcon
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                eventSessionId: eventSessionId || findData.eventSessionId,
                                programTitle: programTitle || findData.programTitle,
                                programDescription: programDescription || findData.programDescription,
                                programDate: programDate || findData.programDate,
                                programFromTime: programFromTime || findData.programFromTime,
                                programToTime: programToTime || findData.programToTime,
                                isShowTime: isShowTime || findData.isShowTime,
                                speaker1: speaker1 || findData.speaker1,
                                speaker2: speaker2 || findData.speaker2,
                                speaker3: speaker3 || findData.speaker3,
                                speaker4: speaker4 || findData.speaker4,
                                speaker5: speaker5 || findData.speaker5,
                                sponser1: sponser1 || findData.sponser1,
                                sponser2: sponser2 || findData.sponser2,
                                showInOrder: showInOrder || findData.showInOrder,
                                smallIcon: smallIcon || findData.smallIcon,
                                programWebUrl: programWebUrl || findData.programWebUrl,
                                isPublished: isPublished || findData.isPublished,
                        }
                        const newCategory = await eventSchedule.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'EventSchedule update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create EventSchedule' });
        }
};
exports.deleteEventSchedule = async (req, res) => {
        try {
                const exhibitorId = req.params.id;
                const user = await eventSchedule.findById(exhibitorId);
                if (user) {
                        const user1 = await eventSchedule.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "EventSchedule delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "EventSchedule not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventSchedule" });
        }
};
exports.getAllEventSchedule = async (req, res) => {
        try {
                const categories = await eventSchedule.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'EventSchedule found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'EventSchedule not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch EventSchedule' });
        }
};
exports.createDelegate = async (req, res) => {
        try {
                const { eventId, companyId, delegateCategoryId, email, otherEmail, delegateTitle, firstName, middleName, lastName, delegateLoginId, delegatePassword, address1, address2, countryId, cityId, pinCode, mobileNumber, profilePic, designation, aboutMySelf, showEmail, showContactNo, openForAppointment, isPublished, sendMail, payment, receiptNo, sponsorer, currency, seminarFee, remarks, registrationNo, showInOrder } = req.body;
                if (!eventId && !companyId && !delegateCategoryId && !email && !delegateTitle && !firstName && !delegateLoginId && !delegatePassword && !address1) {
                        return res.status(201).json({ message: "Provide require fields  eventId, companyId, delegateCategoryId, email, delegateTitle, firstName, delegateLoginId, delegatePassword, address1", status: 404, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                const findCompany = await company.findById(companyId)
                if (!findCompany) {
                        return res.status(404).json({ status: 404, message: 'company not found' });
                }
                const findDelegateCategory = await CompanyCategory.findById(delegateCategoryId);
                if (!findDelegateCategory) {
                        return res.status(404).json({ status: 404, message: 'Delegate Category not found' });
                }
                const findstateCityId = await Location.findById(cityId);
                if (!findstateCityId) {
                        return res.status(404).json({ status: 404, message: 'StateCity not found' });
                }
                const findCountry = await Location.findById(countryId);
                if (!findCountry) {
                        return res.status(404).json({ status: 404, message: 'country not found' });
                }
                let findDelegate = await User.findOne({ eventId, companyId, delegateCategoryId, email, delegateTitle, firstName, delegateLoginId, address1, userType: "DELEGATE" });
                if (findDelegate) {
                        return res.status(409).json({ status: 409, message: 'Delegate already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                return res.status(201).json({ message: "Profile Pic require", status: 201, data: {}, });
                        }
                        req.body.password = await bcrypt.hash(delegatePassword, 10);
                        req.body.userType = "DELEGATE";
                        const transporter = nodemailer.createTransport({
                                host: 'faidelhi.mithiskyconnect.com',
                                port: 587,
                                auth: {
                                        user: "secy@faidelhi.org",
                                        pass: "SeCyF^ih0$",
                                },
                        });
                        // const transporter = nodemailer.createTransport({
                        //         service: "faidelhi.org",
                        //         auth: {
                        //                 user: "secy@faidelhi.org",
                        //                 pass: "SeCyF^ih0$",
                        //         },
                        // });
                        let html = `<div>
                        <p style="margin-top:0.5pt; margin-bottom:0pt; font-size:9pt;">
                        <img src="data:image/png;base64,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" width="201" height="158" alt="" style="float: left; "><br><span style="font-family:Helvetica;">&nbsp;</span></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;"><strong>THE</strong><strong><span style="letter-spacing:0.5pt;">&nbsp;</span></strong><strong>FERTILISER</strong><strong><span style="letter-spacing:0.15pt;">&nbsp;</span></strong><strong>ASSOCIATION</strong><strong><span style="letter-spacing:0.55pt;">&nbsp;</span></strong><strong>OF</strong><strong><span style="letter-spacing:0.5pt;">&nbsp;</span></strong><strong><span style="letter-spacing:-0.1pt;">INDIA</span></strong></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">FAI<span style="letter-spacing:-0.2pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">House,</span></p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">10, Shaheed Jit Singh Marg, New Delhi - 110067, India</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:10pt;">Telephone: +91- 46005204, 46005233 Fax: 91-11-26960052, 46005213</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt;"><a href="mailto:Email%3Asecy@faidelhi.org" style="text-decoration:none;"><span style="font-size:10pt; letter-spacing:-0.1pt; color:#1154cc;">Email:secy@faidelhi.org</span></a><span style="width:19.78pt; font-size:10pt; display:inline-block;">&nbsp;</span><span style="font-size:10pt;">Website:</span><span style="font-size:10pt; letter-spacing:0.5pt;">&nbsp;</span><a href="http://www.faidelhi.org/" style="text-decoration:none;"><span style="font-size:10pt; letter-spacing:-0.1pt; color:#1154cc;">www.faidelhi.org</span></a></p>
                    </div>
                    <p><br style="clear:both; mso-break-type:section-break;"></p>
                    <div>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:7pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:0.25pt; margin-bottom:0pt; font-size:6pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:0.05pt; margin-left:16.8pt; margin-bottom:0pt; font-size:6pt;"><strong><span style="background-color:#ffff00;">${req.body.firstName} ${req.body.middleName} ${req.body.lastName}</span></strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong>&nbsp; &nbsp; &nbsp;&nbsp;</strong><strong><span style="background-color:#ffff00;">${req.body.designation}</span></strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:9pt;"><strong><span style="background-color:#ffff00;">&nbsp; &nbsp; &nbsp;</span></strong><strong><span style="background-color:#ffff00;">${req.body.address1}</span></strong></p>
                        <p style="margin-top:5.15pt; margin-right:12.1pt; margin-bottom:0pt; text-align:right;"><br style="clear:both; mso-column-break-before:always;"></p>
                    </div>
                    <p><br style="clear:both; mso-break-type:section-break;"></p>
                    <div>
                        <p style="margin-top:0.35pt; margin-bottom:0pt; font-size:9.5pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:4.75pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Dear <span style="letter-spacing:-0.1pt;">Delegate,</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:8pt;">&nbsp;</p>
                        <h1 style="margin:0pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;"><u>FAI</u><u><span style="letter-spacing:-0.4pt;">&nbsp;</span></u><u>Annual</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u><u>Seminar</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u><u>2023</u><u><span style="letter-spacing:-0.05pt;">&nbsp;</span></u></h1>
                        <h1 style="margin:0pt 141.95pt 0pt 120.5pt; text-align:center; font-size:9pt;"><u><span style="letter-spacing:-0.05pt;">INNOVATIONS IN FERTILIZER AND AGRICULTURE SECTORS</span></u></h1>
                        <h1 style="margin:0pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;">06<span style="letter-spacing:-0.05pt;">&nbsp;</span>-<span style="letter-spacing:-0.05pt;">&nbsp;</span>08<span style="letter-spacing:-0.05pt;">&nbsp;</span>December <span style="letter-spacing:-0.2pt;">2023</span></h1>
                        <p style="margin-top:0.3pt; margin-bottom:0pt; font-size:8.5pt;"><strong>&nbsp;</strong></p>
                        <p style="margin:4.75pt 8.3pt 0pt 16.8pt; text-align:justify; line-height:103%; font-size:9pt;">We are pleased to confirm having enrolled you as a delegate for the FAI<span style="letter-spacing:-0.3pt;">&nbsp;</span>Annual Seminar 2023 on &quot;INNOVATIONS IN FERTILIZER AND AGRICULTURE SECTORS&quot; scheduled to be held during 06 to 08 December 2023 at Hotel Pullman and Novotel,<span style="letter-spacing:-0.45pt;">&nbsp;</span>Aerocity, New Delhi, India.<span style="letter-spacing:-0.1pt;">&nbsp;</span>The Registration Desk will be open for the delegates at the Pre-Function<span style="letter-spacing:-0.35pt;">&nbsp;</span>Area of Peacock Ball Room at Hotel Pullman and Novotel, Aerocity, New Delhi, India at the following hours:</p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:0.05pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Wednesday,<span style="letter-spacing:-0.4pt;">&nbsp;</span>06<span style="letter-spacing:-0.3pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.3pt;">&nbsp;</span><span style="letter-spacing:-0.2pt;">2023</span><span style="width:43.63pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:30<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 17:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Thursday,<span style="letter-spacing:-0.25pt;">&nbsp;</span>07<span style="letter-spacing:-0.25pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.2pt;">&nbsp;2023</span><span style="width:53.64pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:00<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 17:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">Friday,<span style="letter-spacing:-0.25pt;">&nbsp;</span>08<span style="letter-spacing:-0.25pt;">&nbsp;</span>Dec<span style="letter-spacing:-0.2pt;">&nbsp;2023</span><span style="width:66.16pt; display:inline-block;">&nbsp;</span><span style="letter-spacing:-0.5pt;">:</span><span style="width:17.6pt; display:inline-block;">&nbsp;</span>09:00<span style="letter-spacing:-0.1pt;">&nbsp;</span>- 12:00 <span style="letter-spacing:-0.2pt;">hrs.</span></p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.2pt;">&nbsp;</span></p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.2pt;">In order to keep in touch with the latest updates of the Seminar we have created a Mobile App for the benefits of the delegates which will be available shortly. The credentials of the same are given below:</span> -</p>
                        <p style="margin-top:6.3pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">&nbsp;</p>
                        <h1 style="margin-top:0.05pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Name<span style="letter-spacing:-0.1pt;">&nbsp;</span>of<span style="letter-spacing:-0.1pt;">&nbsp;</span>the<span style="letter-spacing:-0.05pt;">&nbsp;</span>Mobile<span style="letter-spacing:-0.1pt;">&nbsp;A</span>pp<span style="letter-spacing:-0.05pt;">:</span><span style="letter-spacing:-0.1pt;">&nbsp;</span>FAI<span style="letter-spacing:-0.05pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">Seminar 2023</span></h1>
                        <p style="margin-top:8pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;"><em>To</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>be</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>downloaded</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>from</em><em><span style="letter-spacing:-0.05pt;">&nbsp;</span></em><em>Google</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>Play</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>Store</em><em><span style="letter-spacing:-0.1pt;">&nbsp;</span></em><em>and</em><em><span style="letter-spacing:-0.4pt;">&nbsp;</span></em><em>Apple</em><em><span style="letter-spacing:-0.45pt;">&nbsp;</span></em><em>App</em><em><span style="letter-spacing:-0.05pt;">&nbsp;</span></em><em><span style="letter-spacing:-0.1pt;">Store.</span></em></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><em>&nbsp;</em></p>
                        <h1 style="margin:6.55pt 141.95pt 0pt 146.55pt; text-align:center; font-size:9pt;">Mobile<span style="letter-spacing:-0.35pt;">&nbsp;</span>App Login <span style="letter-spacing:-0.1pt;">Details</span></h1>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:10pt;"><strong>&nbsp;</strong></p>
                        <p style="margin-top:7.15pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;">User <span style="letter-spacing:-0.25pt;">Id:&nbsp;</span><span style="letter-spacing:-0.1pt; background-color:#ffff00;">&lt;</span><strong><span style="letter-spacing:-0.1pt; background-color:#ffff00;">${req.body.email}</span></strong><span style="letter-spacing:-0.1pt; background-color:#ffff00;">&gt;</span></p>
                        <p style="margin-top:7.15pt; margin-left:19.2pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.1pt;">Password:</span> <span style="letter-spacing:-0.1pt; background-color:#ffff00;">&lt;</span><strong><span style="letter-spacing:-0.1pt; background-color:#ffff00;">${req.body.delegatePassword}</span></strong><span style="letter-spacing:-0.1pt; background-color:#ffff00;">&gt;</span></p>
                        <p style="margin-top:0.1pt; margin-bottom:0pt; font-size:10pt;">&nbsp;</p>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">In case you are unable to collect registration material personally, you can send a representative with an authorization letter to collect the material.</p>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">&nbsp;</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:7.5pt;">
                        <span style="background-color:#ffff00;">We</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">have</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">yet</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">to</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">receive</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">the</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">seminar</span><span style="letter-spacing:0.4pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">fee.</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">Kindly</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">expedite</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="background-color:#ffff00;">the</span><span style="letter-spacing:0.35pt; background-color:#ffff00;">&nbsp;</span>
                        <span style="letter-spacing:-0.1pt; background-color:#ffff00;">same</span><span style="letter-spacing:-0.1pt; color:#ff0000; background-color:#ffff00;">.</span>
                        <span style="letter-spacing:-0.1pt; color:#ff0000;">&nbsp;(ADD THIS LINE IF PAYMENT RECEIPT NUMBER IS NOT PRESENT OTHERWISE SKIP)</span></p>
                        <p style="margin-top:0pt; margin-bottom:0pt; font-size:8pt;">&nbsp;</p>
                        <p style="margin:0.05pt 8.3pt 0pt 16.8pt; line-height:103%; font-size:9pt;">For any issues regarding the working of app, please contact us at faisk767@gmail.com.</p>
                        <p style="margin-top:0.05pt; margin-bottom:0pt; font-size:10.5pt;">&nbsp;</p>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Thanking<span style="letter-spacing:-0.15pt;">&nbsp;</span><span style="letter-spacing:-0.2pt;">You,</span></p>
                        <p style="margin-top:0.3pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;"><span style="letter-spacing:-0.1pt;">Yours</span><span style="letter-spacing:-0.35pt;">&nbsp;</span><span style="letter-spacing:-0.1pt;">faithfully</span></p>
                        <p style="margin-top:3.25pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">for<span style="letter-spacing:-0.15pt;">&nbsp;</span>The Fertiliser<span style="letter-spacing:-0.5pt;">&nbsp;</span>Association of <span style="letter-spacing:-0.1pt;">India,</span></p>
                        <p style="margin-top:0.5pt; margin-bottom:0pt; font-size:13.5pt;">&nbsp;</p>
                        <h1 style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">D. <span style="letter-spacing:-0.1pt;">Ramakrishnan</span></h1>
                        <p style="margin-top:0pt; margin-left:16.8pt; margin-bottom:0pt; font-size:9pt;">Additional Director &amp; <span style="letter-spacing:-0.1pt;">Secretary</span></p>
                    </div>
                    <p style="bottom: 10px; right: 10px; position: absolute;"><a href="https://wordtohtml.net" target="_blank" style="font-size:11px; color: #d0d0d0;">t</a></p>`
                        const mailOptions = {
                                from: "secy@faidelhi.org",
                                to: email,
                                subject: "Subject of the Email",
                                text: "Text content of the email",
                                html: html,
                        };
                        transporter.sendMail(mailOptions, async (error, info) => {
                                if (error) {
                                        console.error("Error sending email: " + error);
                                } else {
                                        const newCategory = await User.create(req.body);
                                        return res.status(200).json({ status: 200, message: 'Delegate created successfully', data: newCategory });
                                }
                        });

                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to create Delegate', data: error });
        }
};
exports.getDelegateById = async (req, res) => {
        try {
                const delegateId = req.params.delegateId;
                const user = await User.findOne({ _id: delegateId, userType: "DELEGATE" }).populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');;
                if (user) {
                        return res.status(200).json({ message: "Delegate found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Delegate not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Delegate" });
        }
};
exports.updateDelegate = async (req, res) => {
        try {
                const { eventId, companyId, delegateCategoryId, email, otherEmail, delegateTitle, firstName, middleName, lastName, delegateLoginId, delegatePassword, address1, address2, countryId, cityId, pinCode, mobileNumber, profilePic, designation, aboutMySelf, showEmail, showContactNo, openForAppointment, isPublished, sendMail, payment, receiptNo, sponsorer, currency, seminarFee, remarks, registrationNo, showInOrder } = req.body;
                const delegateId = req.params.delegateId;
                const findData = await await User.findOne({ _id: delegateId, userType: "DELEGATE" });
                if (!findData) { return res.status(201).json({ message: "Delegate not Found", status: 404, data: {}, }); }
                if (eventId) { const findEvent = await event.findById(eventId); if (!findEvent) { return res.status(404).json({ status: 404, message: 'Event not found' }); } }
                if (companyId) { const findCompany = await company.findById(companyId); if (!findCompany) { return res.status(404).json({ status: 404, message: 'company not found' }); } }
                if (delegateCategoryId) { const findDelegateCategory = await CompanyCategory.findById(delegateCategoryId); if (!findDelegateCategory) { return res.status(404).json({ status: 404, message: 'Delegate Category not found' }); } }
                if (cityId) { const findstateCityId = await Location.findById(cityId); if (!findstateCityId) { return res.status(404).json({ status: 404, message: 'StateCity not found' }); } }
                if (countryId) { const findCountry = await Location.findById(countryId); if (!findCountry) { return res.status(404).json({ status: 404, message: 'country not found' }); } }
                let findDelegate = await User.findOne({ _id: { $ne: findData._id }, userType: "DELEGATE", eventId, companyId, delegateCategoryId, email, delegateTitle, firstName, delegateLoginId, address1 });
                if (findDelegate) { return res.status(409).json({ status: 409, message: 'Delegate already exit', data: {} }); } else {
                        if (req.file) { req.body.profilePic = req.file.path } else { req.body.profilePic = findData.profilePic };
                        if (delegatePassword) {
                                req.body.password = await bcrypt.hash(delegatePassword, 10);
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                companyId: companyId || findData.companyId,
                                delegateCategoryId: delegateCategoryId || findData.delegateCategoryId,
                                email: email || findData.email,
                                otherEmail: otherEmail || findData.otherEmail,
                                delegateTitle: delegateTitle || findData.delegateTitle,
                                firstName: firstName || findData.firstName,
                                middleName: middleName || findData.middleName,
                                lastName: lastName || findData.lastName,
                                delegateLoginId: delegateLoginId || findData.delegateLoginId,
                                password: req.body.delegatePassword || findData.password,
                                address1: address1 || findData.address1,
                                address2: address2 || findData.address2,
                                countryId: countryId || findData.countryId,
                                cityId: cityId || findData.cityId,
                                pinCode: pinCode || findData.pinCode,
                                mobileNumber: mobileNumber || findData.mobileNumber,
                                programWebUrl: programWebUrl || findData.programWebUrl,
                                profilePic: req.body.profilePic,
                                designation: designation || findData.designation,
                                aboutMySelf: aboutMySelf || findData.aboutMySelf,
                                showEmail: showEmail || findData.showEmail,
                                showContactNo: showContactNo || findData.showContactNo,
                                openForAppointment: openForAppointment || findData.openForAppointment,
                                isPublished: isPublished || findData.isPublished,
                                sendMail: sendMail || findData.sendMail,
                                payment: payment || findData.payment,
                                receiptNo: receiptNo || findData.receiptNo,
                                sponsorer: sponsorer || findData.sponsorer,
                                currency: currency || findData.currency,
                                seminarFee: seminarFee || findData.seminarFee,
                                remarks: remarks || findData.remarks,
                                registrationNo: registrationNo || findData.registrationNo,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await User.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Delegate update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Delegate' });
        }
};
exports.deleteDelegate = async (req, res) => {
        try {
                const exhibitorId = req.params.id;
                const user = await User.findOne({ _id: exhibitorId, userType: "DELEGATE" });
                if (user) {
                        const user1 = await User.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Delegate delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Delegate not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Delegate" });
        }
};
exports.getAllDelegate = async (req, res) => {
        try {
                const { search, fromDate, toDate, page, limit } = req.query;
                let query = { userType: "DELEGATE" };
                if (search) {
                        query.$or = [
                                { "firstName": { $regex: req.query.search, $options: "i" }, },
                                { "middleName": { $regex: req.query.search, $options: "i" }, },
                                { "lastName": { $regex: req.query.search, $options: "i" }, },
                        ]
                }
                if (fromDate && !toDate) {
                        query.createdAt = { $gte: fromDate };
                }
                if (!fromDate && toDate) {
                        query.createdAt = { $lte: toDate };
                }
                if (fromDate && toDate) {
                        query.$and = [
                                { createdAt: { $gte: fromDate } },
                                { createdAt: { $lte: toDate } },
                        ]
                }
                let options = {
                        page: Number(page) || 1,
                        limit: Number(limit) || 15,
                        sort: { createdAt: -1 },
                        populate: 'countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId'
                };
                let data = await User.paginate(query, options);
                if (data.docs.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Delegate found successfully', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'Delegate not found.', data: [] });
                }

        } catch (err) {
                return res.status(500).send({ msg: "internal server error ", error: err.message, });
        }
};
// exports.getAllDelegate = async (req, res) => {
//         try {
//                 const categories = await delegate.find();
//                 if (categories.length > 0) {
//                         return res.status(200).json({ status: 200, message: 'Delegate found successfully', data: categories });
//                 } else {
//                         return res.status(404).json({ status: 404, message: 'Delegate not found.', data: categories });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to fetch Delegate' });
//         }
// };
exports.createHelpline = async (req, res) => {
        try {
                const { eventId, helplineNo, helplineTitle, lat, long, description, address, fromDate, toDate, isPublished, showInOrder } = req.body;
                if (!eventId && !helplineNo && !helplineTitle) {
                        return res.status(201).json({ message: "Provide require fields  eventId, helplineNo, helplineTitle", status: 404, data: {}, });
                }
                const findEvent = await event.findById({ _id: eventId });
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'event not found' });
                }
                let findCompany = await helpline.findOne({ eventId, helplineNo, helplineTitle });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Helpline already exit', data: {} });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        const d = new Date(fromDate);
                        req.body.fromDate = d.toISOString();
                        const d1 = new Date(toDate);
                        req.body.toDate = d1.toISOString();
                        const newCategory = await helpline.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Helpline created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Helpline' });
        }
};
exports.getHelplineById = async (req, res) => {
        try {
                const _id = req.params.helplineId;
                const user = await helpline.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "Helpline found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Helpline not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Helpline" });
        }
};
exports.updateHelpline = async (req, res) => {
        try {
                const { eventId, helplineNo, helplineTitle, lat, long, description, address, fromDate, toDate, isPublished, showInOrder } = req.body;
                const helplineId = req.params.helplineId;
                const findData = await helpline.findById(helplineId);
                if (!findData) {
                        return res.status(404).json({ message: "Helpline not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await helpline.findOne({ _id: { $ne: findData._id }, eventId, helplineNo, helplineTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Helpline already Exit', data: findCategory });
                } else {
                        if (fromDate) {
                                const d = new Date(fromDate);
                                req.body.fromDate = d.toISOString();
                        }
                        if (toDate) {
                                const d1 = new Date(toDate);
                                req.body.toDate = d1.toISOString();
                        }
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                helplineNo: helplineNo || findData.helplineNo,
                                helplineTitle: helplineTitle || findData.helplineTitle,
                                description: description || findData.description,
                                address: address || findData.address,
                                fromDate: req.body.fromDate || findData.fromDate,
                                toDate: req.body.toDate || findData.toDate,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                                location: req.body.location || findData.location
                        }
                        const newCategory = await helpline.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Helpline update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Helpline' });
        }
};
exports.deleteHelpline = async (req, res) => {
        try {
                const helplineId = req.params.id;
                const user = await helpline.findById(helplineId);
                if (user) {
                        const user1 = await helpline.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Helpline delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Helpline not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Helpline" });
        }
};
exports.getAllHelpline = async (req, res) => {
        try {
                const categories = await helpline.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Helpline found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Helpline not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Helpline' });
        }
};
exports.createFeedbackParameter = async (req, res) => {
        try {
                const { eventId, feedbackParamTitle, feedbackParamDesc, isPublished, showInOrder } = req.body;
                if (!eventId && !feedbackParamTitle) {
                        return res.status(201).json({ message: "Provide require fields  eventId, feedbackParamTitle", status: 201, data: {}, });
                }
                const findEvent = await event.findById({ _id: eventId });
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'event not found' });
                }
                let findCompany = await feedbackParameter.findOne({ eventId, feedbackParamTitle });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'FeedbackParameter already exit', data: {} });
                } else {
                        const newCategory = await feedbackParameter.create(req.body);
                        return res.status(200).json({ status: 200, message: 'FeedbackParameter created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create FeedbackParameter' });
        }
};
exports.getFeedbackParameterById = async (req, res) => {
        try {
                const _id = req.params.feedbackParameterId;
                const user = await feedbackParameter.findById(_id);
                if (user) {
                        return res.status(201).json({ message: "FeedbackParameter found successfully", status: 201, data: user, });
                }
                return res.status(201).json({ message: "FeedbackParameter not Found", status: 201, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve FeedbackParameter" });
        }
};
exports.updateFeedbackParameter = async (req, res) => {
        try {
                const { eventId, feedbackParamTitle, feedbackParamDesc, isPublished, showInOrder } = req.body;
                const feedbackParameterId = req.params.feedbackParameterId;
                const findData = await feedbackParameter.findById(feedbackParameterId);
                if (!findData) {
                        return res.status(201).json({ message: "FeedbackParameter not Found", status: 201, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await feedbackParameter.findOne({ _id: { $ne: findData._id }, eventId, feedbackParamTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'FeedbackParameter already Exit', data: findCategory });
                } else {
                        let data = {
                                eventId: eventId || findData.eventId,
                                feedbackParamTitle: feedbackParamTitle || findData.feedbackParamTitle,
                                feedbackParamDesc: feedbackParamDesc || findData.feedbackParamDesc,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await feedbackParameter.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'FeedbackParameter update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create FeedbackParameter' });
        }
};
exports.deleteFeedbackParameter = async (req, res) => {
        try {
                const feedbackParameterId = req.params.id;
                const user = await feedbackParameter.findById(feedbackParameterId);
                if (user) {
                        const user1 = await feedbackParameter.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "FeedbackParameter delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "FeedbackParameter not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve FeedbackParameter" });
        }
};
exports.getAllFeedbackParameter = async (req, res) => {
        try {
                const categories = await feedbackParameter.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'FeedbackParameter found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'FeedbackParameter not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch FeedbackParameter' });
        }
};
exports.createAdvertisement = async (req, res) => {
        try {
                const { eventId, shortName, adTitle, lat, long, address, adLogoPath, adDescription, adCity, adAddress, adFromDate, adToDate, adWebUrl, contactPerson, contactPersonNo, isPublished, showInOrder, } = req.body;
                if (!eventId && !adTitle) {
                        return res.status(404).json({ message: "Provide require fields  eventId, adTitle", status: 404, data: {}, });
                }
                const findEvent = await event.findById({ _id: eventId });
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'event not found' });
                }
                const findCity = await Location.findById(adCity);
                if (!findCity) {
                        return res.status(404).json({ status: 404, message: 'Ad city not found' });
                }
                let findCompany = await advertisement.findOne({ eventId, adTitle });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Advertisement already successfully', data: findCompany });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        const newCategory = await advertisement.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Advertisement created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Advertisement' });
        }
};
exports.getAdvertisementById = async (req, res) => {
        try {
                const _id = req.params.advertisementId;
                const user = await advertisement.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "Advertisement found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Advertisement not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Advertisement" });
        }
};
exports.updateAdvertisement = async (req, res) => {
        try {
                const { eventId, shortName, adTitle, lat, long, address, adLogoPath, adDescription, adCity, adAddress, adFromDate, adToDate, adWebUrl, contactPerson, contactPersonNo, isPublished, showInOrder } = req.body;
                const advertisementId = req.params.advertisementId;
                const findData = await advertisement.findById(advertisementId);
                if (!findData) {
                        return res.status(404).json({ message: "Advertisement not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                if (adCity) {
                        const findCity = await Location.findById(adCity);
                        if (!findCity) {
                                return res.status(404).json({ status: 404, message: 'Ad city not found' });
                        }
                }
                let findCompany = await advertisement.findOne({ _id: { $ne: findData._id }, eventId, adTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Advertisement already Exit', data: findCompany });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                shortName: shortName || findData.shortName,
                                adTitle: adTitle || findData.adTitle,
                                address: address || findData.address,
                                adLogoPath: adLogoPath || findData.adLogoPath,
                                adDescription: adDescription || findData.adDescription,
                                adCity: adCity || findData.adCity,
                                adAddress: adAddress || findData.adAddress,
                                adFromDate: adFromDate || findData.adFromDate,
                                adToDate: adToDate || findData.adToDate,
                                adWebUrl: adWebUrl || findData.adWebUrl,
                                contactPerson: contactPerson || findData.contactPerson,
                                contactPersonNo: contactPersonNo || findData.contactPersonNo,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                                location: req.body.location || findData.location
                        }
                        const newCategory = await advertisement.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Advertisement update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Advertisement' });
        }
};
exports.deleteAdvertisement = async (req, res) => {
        try {
                const advertisementId = req.params.id;
                const user = await advertisement.findById(advertisementId);
                if (user) {
                        const user1 = await advertisement.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Advertisement delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Advertisement not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Advertisement" });
        }
};
exports.getAllAdvertisement = async (req, res) => {
        try {
                const categories = await advertisement.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Advertisement found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Advertisement not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Advertisement' });
        }
};
exports.createUploadAlbum = async (req, res) => {
        try {
                const { eventId, documentCategory, title, description, displayImage, isPublished, showInOrder, } = req.body;
                if (!eventId && !documentCategory) {
                        return res.status(201).json({ message: "Provide require fields  eventId, documentCategory", status: 201, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findUploadAlbum = await uploadAlbum.findOne({ eventId, documentCategory });
                if (findUploadAlbum) {
                        return res.status(409).json({ status: 409, message: 'Upload Album already successfully', data: findUploadAlbum });
                } else {
                        if (req.file) {
                                req.body.displayImage = req.file.path
                        } else {
                                return res.status(201).json({ message: "Display image require", status: 201, data: {}, });
                        }
                        const newCategory = await uploadAlbum.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Upload Album created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Upload Album' });
        }
};
exports.getUploadAlbumById = async (req, res) => {
        try {
                const uploadAlbumId = req.params.uploadAlbumId;
                const user = await uploadAlbum.findById(uploadAlbumId);
                if (user) {
                        return res.status(200).json({ message: "UploadAlbum found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "UploadAlbum not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve UploadAlbum" });
        }
};
exports.updateUploadAlbum = async (req, res) => {
        try {
                const { eventId, documentCategory, title, description, displayImage, isPublished, showInOrder, } = req.body;
                const uploadAlbumId = req.params.uploadAlbumId;
                const findData = await uploadAlbum.findById(uploadAlbumId);
                if (!findData) {
                        return res.status(404).json({ message: "Upload Album not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await uploadAlbum.findOne({ _id: { $ne: findData._id }, eventId, documentCategory, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Upload Album already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.displayImage = req.file.path;
                        } else {
                                req.body.displayImage = findData.displayImage;
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                documentCategory: documentCategory || findData.documentCategory,
                                title: title || findData.title,
                                description: description || findData.description,
                                displayImage: req.body.displayImage,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await uploadAlbum.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Upload Album update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create UploadAlbum' });
        }
};
exports.deleteUploadAlbum = async (req, res) => {
        try {
                const uploadAlbumId = req.params.id;
                const user = await uploadAlbum.findById(uploadAlbumId);
                if (user) {
                        const user1 = await uploadAlbum.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "UploadAlbum delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "UploadAlbum not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve UploadAlbum" });
        }
};
exports.getAllUploadAlbum = async (req, res) => {
        try {
                const categories = await uploadAlbum.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'UploadAlbum found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'UploadAlbum not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch UploadAlbum' });
        }
};
exports.getAllUploadAlbumBydocumentCategory = async (req, res) => {
        try {
                const categories = await uploadAlbum.find({ documentCategory: req.params.documentCategory });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'UploadAlbum found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'UploadAlbum not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch UploadAlbum' });
        }
};
exports.createBanner = async (req, res) => {
        try {
                const { eventId, bannerTitle, bannerDescription, bannerImage, bannerRedirectUrl, isPublished, showInOrder } = req.body;
                if (!eventId && !bannerTitle && !showInOrder) {
                        return res.status(201).json({ message: "Provide require fields  eventId, bannerTitle, showInOrder", status: 201, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findBanner = await banner.findOne({ eventId, bannerTitle });
                if (findBanner) {
                        return res.status(409).json({ status: 409, message: 'Banner already successfully', data: findBanner });
                } else {
                        if (req.file) {
                                req.body.bannerImage = req.file.path
                        } else {
                                return res.status(201).json({ message: "Banner Image require", status: 201, data: {}, });
                        }
                        const newCategory = await banner.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Banner created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Banner' });
        }
};
exports.getBannerById = async (req, res) => {
        try {
                const bannerId = req.params.bannerId;
                const user = await banner.findById(bannerId);
                if (user) {
                        return res.status(200).json({ message: "Banner found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Banner not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Banner" });
        }
};
exports.updateBanner = async (req, res) => {
        try {
                const { eventId, bannerTitle, bannerDescription, bannerImage, bannerRedirectUrl, isPublished, showInOrder } = req.body;
                const bannerId = req.params.bannerId;
                const findData = await banner.findById(bannerId);
                if (!findData) {
                        return res.status(404).json({ message: "Banner not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await banner.findOne({ _id: { $ne: findData._id }, eventId, bannerTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Banner already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.bannerImage = req.file.path;
                        } else {
                                req.body.bannerImage = findData.bannerImage;
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                bannerTitle: bannerTitle || findData.bannerTitle,
                                bannerDescription: bannerDescription || findData.bannerDescription,
                                bannerImage: req.body.bannerImage,
                                bannerRedirectUrl: bannerRedirectUrl || findData.bannerRedirectUrl,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await banner.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Banner update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Banner' });
        }
};
exports.deleteBanner = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await banner.findById(bannerId);
                if (user) {
                        const user1 = await banner.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Banner delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Banner not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Banner" });
        }
};
exports.getAllBanner = async (req, res) => {
        try {
                const categories = await banner.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Banner found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Banner not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Banner' });
        }
};
exports.createDgDesk = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                if (!eventId && !message) {
                        return res.status(201).json({ message: "Provide require fields  eventId, message", status: 201, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findDgDesk = await dgDesk.findOne({ eventId, message, type: "DG" });
                if (findDgDesk) {
                        return res.status(409).json({ status: 409, message: 'DgDesk already successfully', data: findDgDesk });
                } else {
                        req.body.type = "DG";
                        const newCategory = await dgDesk.create(req.body);
                        return res.status(200).json({ status: 200, message: 'DgDesk created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create DgDesk' });
        }
};
exports.getDgDeskById = async (req, res) => {
        try {
                const dgDeskId = req.params.dgDeskId;
                const user = await dgDesk.findById({ _id: dgDeskId, type: "DG" });
                if (user) {
                        return res.status(200).json({ message: "DgDesk found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "DgDesk not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve DgDesk" });
        }
};
exports.updateDgDesk = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                const dgDeskId = req.params.dgDeskId;
                const findData = await dgDesk.findById({ _id: dgDeskId, type: "DG" });
                if (!findData) {
                        return res.status(404).json({ message: "DgDesk not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await dgDesk.findOne({ _id: { $ne: findData._id }, eventId, message, type: "DG" });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'DgDesk already Exit', data: findCompany });
                } else {
                        let data = {
                                eventId: eventId || findData.eventId,
                                message: message || findData.message,
                                type: "DG"
                        }
                        const newCategory = await dgDesk.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'DgDesk update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create DgDesk' });
        }
};
exports.deleteDgDesk = async (req, res) => {
        try {
                const dgDeskId = req.params.id;
                const user = await dgDesk.findById({ _id: dgDeskId, type: "DG" });
                if (user) {
                        const user1 = await dgDesk.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "DgDesk delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "DgDesk not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve DgDesk" });
        }
};
exports.getAllDgDesk = async (req, res) => {
        try {
                const categories = await dgDesk.find({ type: "DG" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'DgDesk found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'DgDesk not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch DgDesk' });
        }
};
exports.createLocationFact = async (req, res) => {
        try {
                const { eventId, title, description, isPublished, showInOrder } = req.body;
                if (!eventId && !title && !description) {
                        return res.status(404).json({ message: "Provide require fields  eventId, title, description", status: 404, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findLocationFact = await locationFact.findOne({ eventId, title, description });
                if (findLocationFact) {
                        return res.status(409).json({ status: 409, message: 'Location Fact already successfully', data: findLocationFact });
                } else {
                        const newCategory = await locationFact.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Location Fact created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Location Fact' });
        }
};
exports.getLocationFactById = async (req, res) => {
        try {
                const locationFactId = req.params.locationFactId;
                const user = await locationFact.findById(locationFactId);
                if (user) {
                        return res.status(200).json({ message: "LocationFact found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "LocationFact not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve LocationFact" });
        }
};
exports.updateLocationFact = async (req, res) => {
        try {
                const { eventId, title, description, isPublished, showInOrder, } = req.body;
                const locationFactId = req.params.locationFactId;
                const findData = await locationFact.findById(locationFactId);
                if (!findData) {
                        return res.status(404).json({ message: "Location Fact not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await locationFact.findOne({ _id: { $ne: findData._id }, eventId, title, description, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Location Fact already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.displayImage = req.file.path;
                        } else {
                                req.body.displayImage = findData.displayImage;
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                title: title || findData.title,
                                description: description || findData.description,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await locationFact.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Location Fact update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create LocationFact' });
        }
};
exports.deleteLocationFact = async (req, res) => {
        try {
                const locationFactId = req.params.id;
                const user = await locationFact.findById(locationFactId);
                if (user) {
                        const user1 = await locationFact.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "LocationFact delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "LocationFact not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve LocationFact" });
        }
};
exports.getAllLocationFact = async (req, res) => {
        try {
                const categories = await locationFact.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'LocationFact found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'LocationFact not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch LocationFact' });
        }
};
exports.createLocationFactsBanner = async (req, res) => {
        try {
                const { eventId, bannerTitle, bannerDescr, bannerImage, bannerRedirectUrl, isPublished, showInOrder } = req.body;
                if (!eventId && !bannerTitle && !showInOrder) {
                        return res.status(404).json({ message: "Provide require fields  eventId, bannerTitle, showInOrder", status: 404, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findBanner = await locationFactsBanners.findOne({ eventId, bannerTitle });
                if (findBanner) {
                        return res.status(409).json({ status: 409, message: 'LocationFactsBanner already successfully', data: findBanner });
                } else {
                        if (req.file) {
                                req.body.bannerImage = req.file.path
                        } else {
                                return res.status(404).json({ message: "LocationFactsBanner Image require", status: 404, data: {}, });
                        }
                        const newCategory = await locationFactsBanners.create(req.body);
                        return res.status(200).json({ status: 200, message: 'LocationFactsBanner created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create LocationFactsBanner' });
        }
};
exports.getLocationFactsBannerById = async (req, res) => {
        try {
                const bannerId = req.params.bannerId;
                const user = await locationFactsBanners.findById(bannerId);
                if (user) {
                        return res.status(200).json({ message: "LocationFactsBanner found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "LocationFactsBanner not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve LocationFactsBanner" });
        }
};
exports.updateLocationFactsBanner = async (req, res) => {
        try {
                const { eventId, bannerTitle, bannerDescr, bannerImage, bannerRedirectUrl, isPublished, showInOrder } = req.body;
                const bannerId = req.params.bannerId;
                const findData = await locationFactsBanners.findById(bannerId);
                if (!findData) {
                        return res.status(404).json({ message: "LocationFactsBanner not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await locationFactsBanners.findOne({ _id: { $ne: findData._id }, eventId, bannerTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'LocationFactsBanner already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.bannerImage = req.file.path;
                        } else {
                                req.body.bannerImage = findData.bannerImage;
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                bannerTitle: bannerTitle || findData.bannerTitle,
                                bannerDescr: bannerDescr || findData.bannerDescr,
                                bannerImage: req.body.bannerImage,
                                bannerRedirectUrl: bannerRedirectUrl || findData.bannerRedirectUrl,
                                isPublished: isPublished || findData.isPublished,
                                showInOrder: showInOrder || findData.showInOrder,
                        }
                        const newCategory = await locationFactsBanners.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'LocationFactsBanner update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create LocationFactsBanner' });
        }
};
exports.deleteLocationFactsBanner = async (req, res) => {
        try {
                const bannerId = req.params.id;
                const user = await locationFactsBanners.findById(bannerId);
                if (user) {
                        const user1 = await locationFactsBanners.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "LocationFactsBanner delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "LocationFactsBanner not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve LocationFactsBanner" });
        }
};
exports.getAllLocationFactsBanner = async (req, res) => {
        try {
                const categories = await locationFactsBanners.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'LocationFactsBanner found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'LocationFactsBanner not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch LocationFactsBanner' });
        }
};
exports.createRegistrationDetails = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                if (!eventId && !message) {
                        return res.status(201).json({ message: "Provide require fields  eventId, message", status: 201, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findDgDesk = await dgDesk.findOne({ eventId, message, type: "RegistrationDetails" });
                if (findDgDesk) {
                        return res.status(409).json({ status: 409, message: 'RegistrationDetails already successfully', data: findDgDesk });
                } else {
                        req.body.type = "RegistrationDetails";
                        const newCategory = await dgDesk.create(req.body);
                        return res.status(200).json({ status: 200, message: 'RegistrationDetails created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create RegistrationDetails' });
        }
};
exports.getRegistrationDetailsById = async (req, res) => {
        try {
                const registrationDetailsId = req.params.registrationDetailsId;
                const user = await dgDesk.findById({ _id: registrationDetailsId, type: "RegistrationDetails" });
                if (user) {
                        return res.status(200).json({ message: "RegistrationDetails found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "RegistrationDetails not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve RegistrationDetails" });
        }
};
exports.updateRegistrationDetails = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                const registrationDetailsId = req.params.registrationDetailsId;
                const findData = await dgDesk.findById({ _id: registrationDetailsId, type: "RegistrationDetails" });
                if (!findData) {
                        return res.status(404).json({ message: "RegistrationDetails not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await dgDesk.findOne({ _id: { $ne: findData._id }, eventId, message, type: "RegistrationDetails" });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'RegistrationDetails already Exit', data: findCompany });
                } else {
                        let data = {
                                eventId: eventId || findData.eventId,
                                message: message || findData.message,
                                type: "RegistrationDetails"
                        }
                        const newCategory = await dgDesk.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'RegistrationDetails update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create RegistrationDetails' });
        }
};
exports.deleteRegistrationDetails = async (req, res) => {
        try {
                const dgDeskId = req.params.id;
                const user = await dgDesk.findById({ _id: dgDeskId, type: "RegistrationDetails" });
                if (user) {
                        const user1 = await dgDesk.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "RegistrationDetails delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "RegistrationDetails not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve RegistrationDetails" });
        }
};
exports.getAllRegistrationDetails = async (req, res) => {
        try {
                const categories = await dgDesk.find({ type: "RegistrationDetails" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'RegistrationDetails found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'RegistrationDetails not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch RegistrationDetails' });
        }
};
exports.createExhibitionDetail = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                if (!eventId && !message) {
                        return res.status(404).json({ message: "Provide require fields  eventId, message", status: 404, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findDgDesk = await dgDesk.findOne({ eventId, message, type: "ExhibitionDetail" });
                if (findDgDesk) {
                        return res.status(409).json({ status: 409, message: 'ExhibitionDetail already successfully', data: findDgDesk });
                } else {
                        req.body.type = "ExhibitionDetail";
                        const newCategory = await dgDesk.create(req.body);
                        return res.status(200).json({ status: 200, message: 'ExhibitionDetail created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create ExhibitionDetail' });
        }
};
exports.getExhibitionDetailById = async (req, res) => {
        try {
                const ExhibitionDetailId = req.params.ExhibitionDetailId;
                const user = await dgDesk.findById({ _id: ExhibitionDetailId, type: "ExhibitionDetail" });
                if (user) {
                        return res.status(200).json({ message: "ExhibitionDetail found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "ExhibitionDetail not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve ExhibitionDetail" });
        }
};
exports.updateExhibitionDetail = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                const ExhibitionDetailId = req.params.ExhibitionDetailId;
                const findData = await dgDesk.findById({ _id: ExhibitionDetailId, type: "ExhibitionDetail" });
                if (!findData) {
                        return res.status(404).json({ message: "ExhibitionDetail not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await dgDesk.findOne({ _id: { $ne: findData._id }, eventId, message, type: "ExhibitionDetail" });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'ExhibitionDetail already Exit', data: findCompany });
                } else {
                        let data = {
                                eventId: eventId || findData.eventId,
                                message: message || findData.message,
                                type: "ExhibitionDetail"
                        }
                        const newCategory = await dgDesk.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'ExhibitionDetail update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create ExhibitionDetail' });
        }
};
exports.deleteExhibitionDetail = async (req, res) => {
        try {
                const dgDeskId = req.params.id;
                const user = await dgDesk.findById({ _id: dgDeskId, type: "ExhibitionDetail" });
                if (user) {
                        const user1 = await dgDesk.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "ExhibitionDetail delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "ExhibitionDetail not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve ExhibitionDetail" });
        }
};
exports.getAllExhibitionDetail = async (req, res) => {
        try {
                const categories = await dgDesk.find({ type: "ExhibitionDetail" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'ExhibitionDetail found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'ExhibitionDetail not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch ExhibitionDetail' });
        }
};
exports.createAboutOrganisation = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                if (!eventId && !message) {
                        return res.status(404).json({ message: "Provide require fields  eventId, message", status: 404, data: {}, });
                }
                const findEvent = await event.findById(eventId);
                if (!findEvent) {
                        return res.status(404).json({ status: 404, message: 'Event not found' });
                }
                let findDgDesk = await dgDesk.findOne({ eventId, message, type: "AboutOrganisation" });
                if (findDgDesk) {
                        return res.status(409).json({ status: 409, message: 'AboutOrganisation already successfully', data: findDgDesk });
                } else {
                        req.body.type = "AboutOrganisation";
                        const newCategory = await dgDesk.create(req.body);
                        return res.status(200).json({ status: 200, message: 'AboutOrganisation created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create AboutOrganisation' });
        }
};
exports.getAboutOrganisationById = async (req, res) => {
        try {
                const AboutOrganisationId = req.params.AboutOrganisationId;
                const user = await dgDesk.findById({ _id: AboutOrganisationId, type: "AboutOrganisation" });
                if (user) {
                        return res.status(200).json({ message: "AboutOrganisation found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "AboutOrganisation not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve AboutOrganisation" });
        }
};
exports.updateAboutOrganisation = async (req, res) => {
        try {
                const { eventId, message } = req.body;
                const AboutOrganisationId = req.params.AboutOrganisationId;
                const findData = await dgDesk.findById({ _id: AboutOrganisationId, type: "AboutOrganisation" });
                if (!findData) {
                        return res.status(404).json({ message: "AboutOrganisation not Found", status: 404, data: {}, });
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await dgDesk.findOne({ _id: { $ne: findData._id }, eventId, message, type: "AboutOrganisation" });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'AboutOrganisation already Exit', data: findCompany });
                } else {
                        let data = {
                                eventId: eventId || findData.eventId,
                                message: message || findData.message,
                                type: "AboutOrganisation"
                        }
                        const newCategory = await dgDesk.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'AboutOrganisation update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create AboutOrganisation' });
        }
};
exports.deleteAboutOrganisation = async (req, res) => {
        try {
                const dgDeskId = req.params.id;
                const user = await dgDesk.findById({ _id: dgDeskId, type: "AboutOrganisation" });
                if (user) {
                        const user1 = await dgDesk.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "AboutOrganisation delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "AboutOrganisation not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve AboutOrganisation" });
        }
};
exports.getAllAboutOrganisation = async (req, res) => {
        try {
                const categories = await dgDesk.find({ type: "AboutOrganisation" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'AboutOrganisation found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'AboutOrganisation not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch AboutOrganisation' });
        }
};
exports.createMeeting = async (req, res) => {
        try {
                const { eventId, title, description, fromDate, toDate, fromTime, toTime, countryId, cityId, address, pinCode, isPublished, meetingBy } = req.body;
                if (!eventId && !countryId && !cityId && !title) {
                        return res.status(201).json({ message: "Provide require fields  eventId, countryId, cityId, title", status: 201, data: {}, });
                }
                if (countryId) {
                        const findCompany = await Location.findById(countryId);
                        if (!findCompany) {
                                return res.status(404).json({ status: 404, message: 'Country not found' });
                        }
                }
                if (cityId) {
                        const findEventCategoryId = await Location.findById(cityId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'City not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findSpeaker = await meeting.findOne({ eventId, countryId, cityId, title });
                if (findSpeaker) {
                        return res.status(409).json({ status: 409, message: 'Meeting already exit', data: {} });
                } else {
                        const d = new Date(fromDate);
                        req.body.fromDate = d.toISOString();
                        const d1 = new Date(toDate);
                        req.body.toDate = d1.toISOString();
                        const newCategory = await meeting.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Meeting created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create meeting' });
        }
};
exports.getMeetingById = async (req, res) => {
        try {
                const meetingId = req.params.meetingId;
                const user = await meeting.findById(meetingId);
                if (user) {
                        return res.status(200).json({ message: "Meeting found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Meeting not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Meeting" });
        }
};
exports.updateMeeting = async (req, res) => {
        try {
                const { eventId, title, description, fromDate, toDate, fromTime, toTime, countryId, cityId, address, pinCode, isPublished, meetingBy } = req.body;
                const meetingId = req.params.meetingId;
                const findData = await meeting.findById(meetingId);
                if (!findData) {
                        return res.status(404).json({ message: "Meeting not Found", status: 404, data: {}, });
                }
                if (countryId) {
                        const findCompany = await Location.findById(countryId);
                        if (!findCompany) {
                                return res.status(404).json({ status: 404, message: 'Country not found' });
                        }
                }
                if (cityId) {
                        const findEventCategoryId = await Location.findById(cityId);
                        if (!findEventCategoryId) {
                                return res.status(404).json({ status: 404, message: 'City not found' });
                        }
                }
                if (eventId) {
                        const findEvent = await event.findById(eventId);
                        if (!findEvent) {
                                return res.status(404).json({ status: 404, message: 'Event not found' });
                        }
                }
                let findCompany = await meeting.findOne({ _id: { $ne: findData._id }, eventId, countryId, cityId, title, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Meeting already Exit', data: findCategory });
                } else {
                        if (fromDate) {
                                const d = new Date(fromDate);
                                req.body.fromDate = d.toISOString();
                        }
                        if (toDate) {
                                const d1 = new Date(toDate);
                                req.body.toDate = d1.toISOString();
                        }
                        let data = {
                                eventId: eventId || findData.eventId,
                                title: title || findData.title,
                                description: description || findData.description,
                                fromDate: req.body.fromDate || findData.fromDate,
                                toDate: req.body.toDate || findData.toDate,
                                fromTime: fromTime || findData.fromTime,
                                toTime: toTime || findData.toTime,
                                countryId: countryId || findData.meetingCountryId,
                                cityId: cityId || findData.cityId,
                                address: address || findData.address,
                                pinCode: pinCode || findData.pinCode,
                                isPublished: isPublished || findData.isPublished,
                                meetingBy: meetingBy || findData.meetingBy
                        }
                        const newCategory = await meeting.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'meeting update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create meeting' });
        }
};
exports.deleteMeeting = async (req, res) => {
        try {
                const meetingId = req.params.id;
                const user = await meeting.findById(meetingId);
                if (user) {
                        const user1 = await meeting.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Meeting delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Meeting not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Meeting" });
        }
};
exports.getAllMeeting = async (req, res) => {
        try {
                const categories = await meeting.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Meeting found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Meeting not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Meeting' });
        }
};
exports.createNearByType = async (req, res) => {
        try {
                const { name, image } = req.body;
                if (!name) {
                        return res.status(201).json({ message: "Provide require fields  name", status: 201, data: {}, });
                }
                let findNearByInterestType = await nearByInterestType.findOne({ name, type: "NearBy" });
                if (findNearByInterestType) {
                        return res.status(409).json({ status: 409, message: 'NearByType already successfully', data: findNearByInterestType });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(201).json({ message: "NearByType Image require", status: 201, data: {}, });
                        }
                        req.body.type = "NearBy";
                        const newCategory = await nearByInterestType.create(req.body);
                        return res.status(200).json({ status: 200, message: 'NearByType created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create NearByType' });
        }
};
exports.getNearByTypeById = async (req, res) => {
        try {
                const nearByInterestTypeId = req.params.nearByInterestTypeId;
                const user = await nearByInterestType.findById({ _id: nearByInterestTypeId, type: "NearBy" });
                if (user) {
                        return res.status(200).json({ message: "NearByType found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "NearByType not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve NearByType" });
        }
};
exports.updateNearByType = async (req, res) => {
        try {
                const { name, image, type } = req.body;
                const nearByInterestTypeId = req.params.nearByInterestTypeId;
                const findData = await nearByInterestType.findById({ _id: nearByInterestTypeId, type: "NearBy" });
                if (!findData) {
                        return res.status(404).json({ message: "NearByType not Found", status: 404, data: {}, });
                }
                let findCompany = await nearByInterestType.findOne({ _id: { $ne: findData._id }, name, type: "NearBy", });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'NearByType already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                req.body.image = findData.image;
                        }
                        let data = {
                                image: req.body.image,
                                name: name || findData.name,
                                type: "NearBy" || findData.type,
                        }
                        const newCategory = await nearByInterestType.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'NearByType update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create NearByType' });
        }
};
exports.deleteNearByType = async (req, res) => {
        try {
                const nearByInterestTypeId = req.params.id;
                const user = await nearByInterestType.findById({ _id: nearByInterestTypeId, type: "NearBy" });
                if (user) {
                        const user1 = await nearByInterestType.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "NearByType delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "NearByType not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve NearByType" });
        }
};
exports.getAllNearByType = async (req, res) => {
        try {
                const categories = await nearByInterestType.find({ type: "NearBy" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'NearByType found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'NearByType not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch NearByType' });
        }
};
exports.createInterestType = async (req, res) => {
        try {
                const { name, image } = req.body;
                if (!name) {
                        return res.status(201).json({ message: "Provide require fields  name", status: 200, data: {}, });
                }
                let findNearByInterestType = await nearByInterestType.findOne({ name, type: "Interest" });
                if (findNearByInterestType) {
                        return res.status(409).json({ status: 409, message: 'InterestType already successfully', data: findNearByInterestType });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "InterestType Image require", status: 404, data: {}, });
                        }
                        req.body.type = "Interest";
                        const newCategory = await nearByInterestType.create(req.body);
                        return res.status(200).json({ status: 200, message: 'InterestType created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create InterestType' });
        }
};
exports.getInterestTypeById = async (req, res) => {
        try {
                const nearByInterestTypeId = req.params.nearByInterestTypeId;
                const user = await nearByInterestType.findById({ _id: nearByInterestTypeId, type: "Interest" });
                if (user) {
                        return res.status(200).json({ message: "InterestType found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "InterestType not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve InterestType" });
        }
};
exports.updateInterestType = async (req, res) => {
        try {
                const { name, image, type } = req.body;
                const nearByInterestTypeId = req.params.nearByInterestTypeId;
                const findData = await nearByInterestType.findById({ _id: nearByInterestTypeId, type: "Interest" });
                if (!findData) {
                        return res.status(404).json({ message: "InterestType not Found", status: 404, data: {}, });
                }
                let findCompany = await nearByInterestType.findOne({ _id: { $ne: findData._id }, name, type: "Interest", });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'InterestType already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                req.body.image = findData.image;
                        }
                        let data = {
                                image: req.body.image,
                                name: name || findData.name,
                                type: "Interest" || findData.type,
                        }
                        const newCategory = await nearByInterestType.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'InterestType update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create InterestType' });
        }
};
exports.deleteInterestType = async (req, res) => {
        try {
                const nearByInterestTypeId = req.params.id;
                const user = await nearByInterestType.findById({ _id: nearByInterestTypeId, type: "Interest" });
                if (user) {
                        const user1 = await nearByInterestType.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "InterestType delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "InterestType not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve InterestType" });
        }
};
exports.getAllInterestType = async (req, res) => {
        try {
                const categories = await nearByInterestType.find({ type: "Interest" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'InterestType found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'InterestType not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch InterestType' });
        }
};
exports.createNearByPlace = async (req, res) => {
        try {
                const { name, description, lat, long, typeId } = req.body;
                if (!name && !typeId) {
                        return res.status(404).json({ message: "Provide require fields  name, typeId", status: 404, data: {}, });
                }
                const findData = await nearByInterestType.findById({ _id: typeId, type: "NearBy" });
                if (!findData) {
                        return res.status(404).json({ status: 404, message: 'NearByType not found' });
                }
                let findCompany = await nearByPlaceAndInterest.findOne({ typeId, name, type: "NearBy" });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'NearByPlace already exit', data: {} });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        req.body.type = "NearBy";
                        const newCategory = await nearByPlaceAndInterest.create(req.body);
                        return res.status(200).json({ status: 200, message: 'NearByPlace created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Helpline' });
        }
};
exports.getNearByPlaceById = async (req, res) => {
        try {
                const _id = req.params.nearByPlaceId;
                const user = await nearByPlaceAndInterest.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "NearByPlace found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "NearByPlace not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve NearByPlace" });
        }
};
exports.updateNearByPlace = async (req, res) => {
        try {
                const { name, description, lat, long, typeId } = req.body;
                const nearByPlaceId = req.params.nearByPlaceId;
                const findData = await nearByPlaceAndInterest.findById({ _id: nearByPlaceId, type: "NearBy" });
                if (!findData) {
                        return res.status(404).json({ message: "NearByPlace not Found", status: 404, data: {}, });
                }
                if (typeId) {
                        const findData = await nearByInterestType.findById({ _id: typeId, type: "NearBy" });
                        if (!findData) {
                                return res.status(404).json({ status: 404, message: 'NearByType not found' });
                        }
                }
                let findCompany = await nearByPlaceAndInterest.findOne({ _id: { $ne: findData._id }, typeId, name, type: "NearBy", });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'NearByPlace already Exit', data: findCategory });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        let data = {
                                name: name || findData.name,
                                description: description || findData.description,
                                typeId: typeId || findData.typeId,
                                location: location || findData.location,
                        }
                        const newCategory = await nearByPlaceAndInterest.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'NearByPlace update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create NearByPlace' });
        }
};
exports.deleteNearByPlace = async (req, res) => {
        try {
                const nearByPlaceId = req.params.id;
                const findData = await nearByPlaceAndInterest.findById({ _id: nearByPlaceId, type: "NearBy" });
                if (findData) {
                        const user1 = await nearByPlaceAndInterest.findByIdAndDelete({ _id: findData._id });;
                        if (user1) {
                                return res.status(200).json({ message: "NearByPlace delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "NearByPlace not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve NearByPlace" });
        }
};
exports.getAllNearByPlace = async (req, res) => {
        try {
                const categories = await nearByPlaceAndInterest.find({ type: "NearBy" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'NearByPlace found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'NearByPlace not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch NearByPlace' });
        }
};
exports.getAllNearByPlaceByTypeId = async (req, res) => {
        try {
                const categories = await nearByPlaceAndInterest.find({ typeId: req.params.typeId, type: "NearBy" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'NearByPlace found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'NearByPlace not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch NearByPlace' });
        }
};
exports.createPlaceOfInterest = async (req, res) => {
        try {
                const { name, description, lat, long, typeId } = req.body;
                if (!name && !typeId) {
                        return res.status(404).json({ message: "Provide require fields  name, typeId", status: 404, data: {}, });
                }
                const findData = await nearByInterestType.findById({ _id: typeId, type: "Interest" });
                if (!findData) {
                        return res.status(404).json({ status: 404, message: 'InterestType not found' });
                }
                let findCompany = await nearByPlaceAndInterest.findOne({ typeId, name, type: "Interest" });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'NearByPlace already exit', data: {} });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        req.body.type = "Interest";
                        const newCategory = await nearByPlaceAndInterest.create(req.body);
                        return res.status(200).json({ status: 200, message: 'NearByPlace created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Helpline' });
        }
};
exports.getPlaceOfInterestById = async (req, res) => {
        try {
                const _id = req.params.nearByPlaceId;
                const user = await nearByPlaceAndInterest.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "NearByPlace found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "NearByPlace not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve NearByPlace" });
        }
};
exports.updatePlaceOfInterest = async (req, res) => {
        try {
                const { name, description, lat, long, typeId } = req.body;
                const nearByPlaceId = req.params.nearByPlaceId;
                const findData = await nearByPlaceAndInterest.findById({ _id: nearByPlaceId, type: "Interest" });
                if (!findData) {
                        return res.status(404).json({ message: "NearByPlace not Found", status: 404, data: {}, });
                }
                if (typeId) {
                        const findData = await nearByInterestType.findById({ _id: typeId, type: "Interest" });
                        if (!findData) {
                                return res.status(404).json({ status: 404, message: 'NearByType not found' });
                        }
                }
                let findCompany = await nearByPlaceAndInterest.findOne({ _id: { $ne: findData._id }, typeId, name, type: "Interest", });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'NearByPlace already Exit', data: findCategory });
                } else {
                        if (lat || long) {
                                coordinates = [parseFloat(lat), parseFloat(long)]
                                req.body.location = { type: "Point", coordinates };
                        }
                        let data = {
                                name: name || findData.name,
                                description: description || findData.description,
                                typeId: typeId || findData.typeId,
                                location: location || findData.location,
                        }
                        const newCategory = await nearByPlaceAndInterest.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'NearByPlace update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create NearByPlace' });
        }
};
exports.deletePlaceOfInterest = async (req, res) => {
        try {
                const nearByPlaceId = req.params.id;
                const findData = await nearByPlaceAndInterest.findById({ _id: nearByPlaceId, type: "Interest" });
                if (findData) {
                        const user1 = await nearByPlaceAndInterest.findByIdAndDelete({ _id: findData._id });;
                        if (user1) {
                                return res.status(200).json({ message: "NearByPlace delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "NearByPlace not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve NearByPlace" });
        }
};
exports.getAllPlaceOfInterest = async (req, res) => {
        try {
                const categories = await nearByPlaceAndInterest.find({ type: "Interest" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'NearByPlace found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'NearByPlace not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch NearByPlace' });
        }
};
exports.getAllPlaceOfInterestByTypeId = async (req, res) => {
        try {
                const categories = await nearByPlaceAndInterest.find({ typeId: req.params.typeId, type: "Interest" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'NearByPlace found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'NearByPlace not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch NearByPlace' });
        }
};
exports.createAppHelpline = async (req, res) => {
        try {
                const { helplineNo, helplineTitle, helplineImage, description, } = req.body;
                let findAppHelpline = await appHelpline.findOne({ helplineNo, helplineTitle });
                if (findAppHelpline) {
                        return res.status(409).json({ status: 409, message: 'App Helpline already successfully', data: findAppHelpline });
                } else {
                        if (req.file) {
                                req.body.helplineImage = req.file.path
                        } else {
                                return res.status(404).json({ message: "Helpline image require", status: 404, data: {}, });
                        }
                        const newCategory = await appHelpline.create(req.body);
                        return res.status(200).json({ status: 200, message: 'App Helpline created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create App Helpline' });
        }
};
exports.getAppHelplineById = async (req, res) => {
        try {
                const appHelplineId = req.params.appHelplineId;
                const user = await appHelpline.findById(appHelplineId);
                if (user) {
                        return res.status(200).json({ message: "AppHelpline found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "AppHelpline not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve AppHelpline" });
        }
};
exports.updateAppHelpline = async (req, res) => {
        try {
                const { helplineNo, helplineTitle, helplineImage, description, } = req.body;
                const appHelplineId = req.params.appHelplineId;
                const findData = await appHelpline.findById(appHelplineId);
                if (!findData) {
                        return res.status(404).json({ message: "App Helpline not Found", status: 404, data: {}, });
                }
                let findCompany = await appHelpline.findOne({ _id: { $ne: findData._id }, helplineNo, helplineTitle, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'App Helpline already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.helplineImage = req.file.path;
                        } else {
                                req.body.helplineImage = findData.helplineImage;
                        }
                        let data = {
                                helplineNo: helplineNo || findData.helplineNo,
                                helplineTitle: helplineTitle || findData.helplineTitle,
                                helplineImage: req.body.helplineImage,
                                description: description || findData.description,
                        }
                        const newCategory = await appHelpline.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'App Helpline update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create AppHelpline' });
        }
};
exports.deleteAppHelpline = async (req, res) => {
        try {
                const appHelplineId = req.params.id;
                const user = await appHelpline.findById(appHelplineId);
                if (user) {
                        const user1 = await appHelpline.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "AppHelpline delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "AppHelpline not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve AppHelpline" });
        }
};
exports.getAllAppHelpline = async (req, res) => {
        try {
                const categories = await appHelpline.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'AppHelpline found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'AppHelpline not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch AppHelpline' });
        }
};
exports.createFaq = async (req, res) => {
        const { question, answer } = req.body;
        try {
                if (!question || !answer) {
                        return res.status(400).json({ message: "questions and answers cannot be blank " });
                }
                const faq = await Faq.create(req.body);
                return res.status(200).json({ status: 200, message: "FAQ Added Successfully ", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Error ", status: 500, data: err.message });
        }
};
exports.getFaqById = async (req, res) => {
        const { id } = req.params;
        try {
                const faq = await Faq.findById(id);
                if (!faq) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "faqs retrieved successfully ", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.updateFaq = async (req, res) => {
        const { id } = req.params;
        try {
                const faq = await Faq.findByIdAndUpdate(id, req.body, { new: true });
                if (!faq) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "update successfully.", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Something went wrong ", status: 500, data: err.message });
        }
};
exports.getAllFaqs = async (req, res) => {
        try {
                const faqs = await Faq.find().lean();
                if (faqs.length == 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "faqs retrieved successfully ", data: faqs });
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.deleteFaq = async (req, res) => {
        const { id } = req.params;
        try {
                const faq = await Faq.findByIdAndDelete(id);
                if (!faq) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "FAQ Deleted Successfully ", data: faq });
        } catch (err) {
                console.log(err);
                return res.status(500).json({ message: "Something went wrong ", status: 500, data: err.message });
        }
};
exports.getFeedBackById = async (req, res) => {
        const { id } = req.params;
        try {
                const findFeedback = await feedback.findById(id).populate('rating.user');
                if (!findFeedback) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "FeedBack retrieved successfully ", data: findFeedback });
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getAllFeedBack = async (req, res) => {
        try {
                const findFeedback = await feedback.find().lean().populate('rating.user');
                if (findFeedback.length == 0) {
                        return res.status(404).json({ status: 404, message: "No data found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "FeedBack retrieved successfully ", data: findFeedback });
        } catch (err) {
                console.log(err);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.createBookCabs = async (req, res) => {
        try {
                const { name, image, link, } = req.body;
                let findBookCabs = await bookCabs.findOne({ name });
                if (findBookCabs) {
                        return res.status(409).json({ status: 409, message: 'Book Cab already successfully', data: findBookCabs });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "Image require", status: 404, data: {}, });
                        }
                        const newCategory = await bookCabs.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Book Cab created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Book Cab' });
        }
};
exports.getBookCabsById = async (req, res) => {
        try {
                const bookCabsId = req.params.bookCabsId;
                const user = await bookCabs.findById(bookCabsId);
                if (user) {
                        return res.status(200).json({ message: "BookCabs found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "BookCabs not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve BookCabs" });
        }
};
exports.updateBookCabs = async (req, res) => {
        try {
                const { name, image, link, } = req.body;
                const bookCabsId = req.params.bookCabsId;
                const findData = await bookCabs.findById(bookCabsId);
                if (!findData) {
                        return res.status(404).json({ message: "Book Cab not Found", status: 404, data: {}, });
                }
                let findCompany = await bookCabs.findOne({ _id: { $ne: findData._id }, name, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Book Cab already Exit', data: findCompany });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path;
                        } else {
                                req.body.image = findData.image;
                        }
                        let data = {
                                name: name || findData.name,
                                link: link || findData.link,
                                image: req.body.image,
                        }
                        const newCategory = await bookCabs.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Book Cab update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create BookCabs' });
        }
};
exports.deleteBookCabs = async (req, res) => {
        try {
                const bookCabsId = req.params.id;
                const user = await bookCabs.findById(bookCabsId);
                if (user) {
                        const user1 = await bookCabs.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "BookCabs delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "BookCabs not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve BookCabs" });
        }
};
exports.getAllBookCabs = async (req, res) => {
        try {
                const categories = await bookCabs.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'BookCabs found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'BookCabs not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch BookCabs' });
        }
};
// exports.createChairmanDesk = async (req, res) => {
//         try {
//                 const { image, description, name, designation } = req.body;
//                 let findChairmanDesk = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "ChairmanDesk" });
//                 if (findChairmanDesk) {
//                         if (req.file) {
//                                 req.body.image = req.file.path
//                         } else {
//                                 req.body.image = findChairmanDesk.image;
//                         }
//                         let obj = {
//                                 type: "ChairmanDesk",
//                                 image: req.body.image || findChairmanDesk.image,
//                                 designation: designation || findChairmanDesk.designation,
//                                 name: name || findChairmanDesk.name,
//                                 description: description || findChairmanDesk.description
//                         }
//                         const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findChairmanDesk._id }, { $set: data }, { new: true });
//                         return res.status(200).json({ status: 200, message: 'ChairmanDesk update successfully', data: newCategory });
//                 } else {
//                         if (req.file) {
//                                 req.body.image = req.file.path
//                         } else {
//                                 return res.status(404).json({ message: "Image require", status: 404, data: {}, });
//                         }
//                         let obj = {
//                                 type: "ChairmanDesk",
//                                 image: req.body.image,
//                                 designation: designation,
//                                 name: name,
//                                 description: description
//                         }
//                         const newCategory = await ChairmanDeskAboutFaiSeminarTheme.create(obj);
//                         return res.status(200).json({ status: 200, message: 'ChairmanDesk created successfully', data: newCategory });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to create ChairmanDesk' });
//         }
// };
exports.createChairmanDesk = async (req, res) => {
        try {
                const { content } = req.body;
                let findChairmanDesk = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "ChairmanDesk" });
                if (findChairmanDesk) {
                        let obj = {
                                type: "ChairmanDesk",
                                content: content || findAboutFai.content,
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findChairmanDesk._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk update successfully', data: newCategory });
                } else {
                        let obj = {
                                type: "ChairmanDesk",
                                content: content
                                // content: "<title></title><meta content=\"initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui\" name=\"viewport\"/><link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" rel=\"stylesheet\"/><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify !important;background-color:#ffffff;\"><span>the Fertiliser Association of India (FAI) is a non-profit and non-trading organization  representing mainly the fertilizer manufacturers, distributors, importers, equipment manufacturers, research institutes and suppliers of inputs. The Association was established in 1955 with the objective of bringing together all concerned with the production, marketing and use of fertilizers with a view to:</span></p><ul style=\"box-sizing:border-box;list-style:circle;-webkit-tap-highlight-color:transparent;padding:0px 15px 10px 35px;margin-top:0px;margin-bottom:0px;font-size:14px;color:#777777;font-family:Roboto, sans-serif;background-color:#ffffff;\"><li style=\"box-sizing:border-box;margin-bottom:5px;\">Assist the industry in improving its operational efficiency;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Find solutions to the problems faced by the fertilizer industry and agriculture;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Promote balanced and efficient use of fertilizer;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Encourage use of more and better plant foods and</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Promote consideration and discussion of all issues that contribute to sound agricultural practices.</li></ul><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify;background-color:#ffffff;\"><span>FAI is represented on important government committees/panels related to fertilizer and agriculture. The Association cooperates actively with the Government of India on all issues related to fertilizer sector and acts as an interface between the Industry and the Government by maintaining close contacts and rapport.</span></p><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify;background-color:#ffffff;\"><span>The Indian fertilizer industry is highly complex and technology driven consisting of plants with varying capacity, technology, vintage and product range. With nearly 700 members comprising Active, Associate, Overseas Associate and Technical and Professional, FAI provides the necessary support for meeting the challenges facing the Industry.</span></p><p style=\"text-align:right;font-weight:bold;\">Arvind Chaudhary<br/>Director General</p>"
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.create(obj);
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create ChairmanDesk' });
        }
};
exports.getChairmanDeskById = async (req, res) => {
        try {
                const chairmanDeskId = req.params.chairmanDeskId;
                const user = await ChairmanDeskAboutFaiSeminarTheme.findById(chairmanDeskId);
                if (user) {
                        return res.status(200).json({ message: "ChairmanDesk found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "ChairmanDesk not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve ChairmanDesk" });
        }
};
exports.deleteChairmanDesk = async (req, res) => {
        try {
                const chairmanDeskId = req.params.id;
                const user = await ChairmanDeskAboutFaiSeminarTheme.findById(chairmanDeskId);
                if (user) {
                        const user1 = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "ChairmanDesk delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "ChairmanDesk not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve ChairmanDesk" });
        }
};
exports.getAllChairmanDesk = async (req, res) => {
        try {
                const categories = await ChairmanDeskAboutFaiSeminarTheme.find({ type: "ChairmanDesk" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'ChairmanDesk not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch ChairmanDesk' });
        }
};
// exports.createAboutFai = async (req, res) => {
//         try {
//                 const { description, name, designation, } = req.body;
//                 let findAboutFai = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "AboutFai" });
//                 if (findAboutFai) {
//                         let obj = {
//                                 type: "AboutFai",
//                                 designation: designation || findAboutFai.designation,
//                                 name: name || findAboutFai.name,
//                                 description: description || findAboutFai.description
//                         }
//                         const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findAboutFai._id }, { $set: data }, { new: true });
//                         return res.status(200).json({ status: 200, message: 'AboutFai update successfully', data: newCategory });
//                 } else {
//                         let obj = {
//                                 type: "AboutFai",
//                                 designation: designation,
//                                 name: name,
//                                 description: description
//                         }
//                         const newCategory = await ChairmanDeskAboutFaiSeminarTheme.create(obj);
//                         return res.status(200).json({ status: 200, message: 'AboutFai created successfully', data: newCategory });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to create AboutFai' });
//         }
// };
exports.createAboutFai = async (req, res) => {
        try {
                const { content } = req.body;
                let findAboutFai = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "AboutFai" });
                if (findAboutFai) {
                        let obj = {
                                type: "AboutFai",
                                content: content || findAboutFai.content,
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findAboutFai._id }, { $set: obj }, { new: true });
                        return res.status(200).json({ status: 200, message: 'AboutFai update successfully', data: newCategory });
                } else {

                        let obj = {
                                type: "AboutFai",
                                content: content
                        }
                        //  content: "<title></title><meta content=\"initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui\" name=\"viewport\"/><link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" rel=\"stylesheet\"/><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify !important;background-color:#ffffff;\"><span>the Fertiliser Association of India (FAI) is a non-profit and non-trading organization  representing mainly the fertilizer manufacturers, distributors, importers, equipment manufacturers, research institutes and suppliers of inputs. The Association was established in 1955 with the objective of bringing together all concerned with the production, marketing and use of fertilizers with a view to:</span></p><ul style=\"box-sizing:border-box;list-style:circle;-webkit-tap-highlight-color:transparent;padding:0px 15px 10px 35px;margin-top:0px;margin-bottom:0px;font-size:14px;color:#777777;font-family:Roboto, sans-serif;background-color:#ffffff;\"><li style=\"box-sizing:border-box;margin-bottom:5px;\">Assist the industry in improving its operational efficiency;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Find solutions to the problems faced by the fertilizer industry and agriculture;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Promote balanced and efficient use of fertilizer;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Encourage use of more and better plant foods and</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Promote consideration and discussion of all issues that contribute to sound agricultural practices.</li></ul><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify;background-color:#ffffff;\"><span>FAI is represented on important government committees/panels related to fertilizer and agriculture. The Association cooperates actively with the Government of India on all issues related to fertilizer sector and acts as an interface between the Industry and the Government by maintaining close contacts and rapport.</span></p><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify;background-color:#ffffff;\"><span>The Indian fertilizer industry is highly complex and technology driven consisting of plants with varying capacity, technology, vintage and product range. With nearly 700 members comprising Active, Associate, Overseas Associate and Technical and Professional, FAI provides the necessary support for meeting the challenges facing the Industry.</span></p><p style=\"text-align:right;font-weight:bold;\">Arvind Chaudhary<br/>Director General</p>"

                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.create(obj);
                        return res.status(200).json({ status: 200, message: 'AboutFai created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create AboutFai' });
        }
};
exports.getAboutFaiById = async (req, res) => {
        try {
                const aboutFaiId = req.params.aboutFaiId;
                const user = await ChairmanDeskAboutFaiSeminarTheme.findById(aboutFaiId);
                if (user) {
                        return res.status(200).json({ message: "AboutFai found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "AboutFai not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve AboutFai" });
        }
};
exports.deleteAboutFai = async (req, res) => {
        try {
                const aboutFaiId = req.params.id;
                const user = await ChairmanDeskAboutFaiSeminarTheme.findById(aboutFaiId);
                if (user) {
                        const user1 = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "AboutFai delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "AboutFai not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve AboutFai" });
        }
};
exports.getAllAboutFai = async (req, res) => {
        try {
                const categories = await ChairmanDeskAboutFaiSeminarTheme.find({ type: "AboutFai" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'AboutFai found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'AboutFai not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch AboutFai' });
        }
};
// exports.createSeminarTheme = async (req, res) => {
//         try {
//                 const { title, date, location, description } = req.body;
//                 let findSeminarTheme = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "SeminarTheme" });
//                 if (findSeminarTheme) {
//                         let obj = {
//                                 type: "SeminarTheme",
//                                 title: title || findSeminarTheme.title,
//                                 location: location || findSeminarTheme.location,
//                                 date: date || findSeminarTheme.date,
//                                 description: description || findSeminarTheme.description
//                         }
//                         const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findSeminarTheme._id }, { $set: obj }, { new: true });
//                         return res.status(200).json({ status: 200, message: 'ChairmanDesk update successfully', data: newCategory });
//                 } else {
//                         let obj = {
//                                 type: "SeminarTheme",
//                                 title: req.body.title,
//                                 location: location,
//                                 date: date,
//                                 description: description
//                         }
//                         const newCategory = await ChairmanDeskAboutFaiSeminarTheme.create(obj);
//                         return res.status(200).json({ status: 200, message: 'ChairmanDesk created successfully', data: newCategory });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to create ChairmanDesk' });
//         }
// };
exports.createSeminarTheme = async (req, res) => {
        try {
                const { content } = req.body;
                let findSeminarTheme = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "SeminarTheme" });
                if (findSeminarTheme) {
                        let obj = {
                                type: "SeminarTheme",
                                content: content || findSeminarTheme.content,
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findSeminarTheme._id }, { $set: obj }, { new: true });
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk update successfully', data: newCategory });
                } else {
                        let obj = {
                                type: "SeminarTheme",
                                content: content
                                // content: "<title></title><meta content=\"initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui\" name=\"viewport\"/><link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css\" rel=\"stylesheet\"/><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify !important;background-color:#ffffff;\"><span>the Fertiliser Association of India (FAI) is a non-profit and non-trading organization  representing mainly the fertilizer manufacturers, distributors, importers, equipment manufacturers, research institutes and suppliers of inputs. The Association was established in 1955 with the objective of bringing together all concerned with the production, marketing and use of fertilizers with a view to:</span></p><ul style=\"box-sizing:border-box;list-style:circle;-webkit-tap-highlight-color:transparent;padding:0px 15px 10px 35px;margin-top:0px;margin-bottom:0px;font-size:14px;color:#777777;font-family:Roboto, sans-serif;background-color:#ffffff;\"><li style=\"box-sizing:border-box;margin-bottom:5px;\">Assist the industry in improving its operational efficiency;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Find solutions to the problems faced by the fertilizer industry and agriculture;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Promote balanced and efficient use of fertilizer;</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Encourage use of more and better plant foods and</li><li style=\"box-sizing:border-box;margin-bottom:5px;\">Promote consideration and discussion of all issues that contribute to sound agricultural practices.</li></ul><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify;background-color:#ffffff;\"><span>FAI is represented on important government committees/panels related to fertilizer and agriculture. The Association cooperates actively with the Government of India on all issues related to fertilizer sector and acts as an interface between the Industry and the Government by maintaining close contacts and rapport.</span></p><p style=\"color:#777777;font-family:Roboto, sans-serif;font-size:14px;text-align:justify;background-color:#ffffff;\"><span>The Indian fertilizer industry is highly complex and technology driven consisting of plants with varying capacity, technology, vintage and product range. With nearly 700 members comprising Active, Associate, Overseas Associate and Technical and Professional, FAI provides the necessary support for meeting the challenges facing the Industry.</span></p><p style=\"text-align:right;font-weight:bold;\">Arvind Chaudhary<br/>Director General</p>"

                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.create(obj);
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create ChairmanDesk' });
        }
};
exports.getSeminarThemeById = async (req, res) => {
        try {
                const chairmanDeskId = req.params.chairmanDeskId;
                const user = await ChairmanDeskAboutFaiSeminarTheme.findById(chairmanDeskId);
                if (user) {
                        return res.status(200).json({ message: "ChairmanDesk found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "ChairmanDesk not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve ChairmanDesk" });
        }
};
exports.deleteSeminarTheme = async (req, res) => {
        try {
                const chairmanDeskId = req.params.id;
                const user = await ChairmanDeskAboutFaiSeminarTheme.findById(chairmanDeskId);
                if (user) {
                        const user1 = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "ChairmanDesk delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "ChairmanDesk not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve ChairmanDesk" });
        }
};
exports.getAllSeminarTheme = async (req, res) => {
        try {
                const categories = await ChairmanDeskAboutFaiSeminarTheme.find({ type: "SeminarTheme" });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'ChairmanDesk not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch ChairmanDesk' });
        }
};
exports.createCulturalPrograms = async (req, res) => {
        try {
                const { title, heading, description, } = req.body;
                let findCulturalPrograms = await culturalProgram.findOne();
                if (findCulturalPrograms) {
                        return res.status(409).json({ status: 409, message: 'Cultural Program already successfully', data: findCulturalPrograms });
                } else {
                        let image;
                        if (req.file) {
                                image = req.file.path
                        } else {
                                return res.status(404).json({ message: "Image require", status: 404, data: {}, });
                        }
                        let content = [{
                                heading: heading,
                                image: image,
                                description: description,
                        }]
                        let obj = {
                                title: title,
                                content: content,
                        }
                        const newCategory = await culturalProgram.create(obj);
                        return res.status(200).json({ status: 200, message: 'Cultural Program created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Cultural Program' });
        }
};
exports.getCulturalProgramsById = async (req, res) => {
        try {
                const culturalProgramsId = req.params.culturalProgramsId;
                const user = await culturalProgram.findById(culturalProgramsId);
                if (user) {
                        return res.status(200).json({ message: "CulturalPrograms found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "CulturalPrograms not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve CulturalPrograms" });
        }
};
exports.updateCulturalPrograms = async (req, res) => {
        try {
                const { title, heading, description, } = req.body;
                const findData = await culturalProgram.findOne();
                if (!findData) {
                        return res.status(404).json({ message: "Cultural Program not Found", status: 404, data: {}, });
                }
                let image;
                if (req.file) {
                        image = req.file.path
                } else {
                        return res.status(404).json({ message: "Image require", status: 404, data: {}, });
                }
                let content = {
                        heading: heading,
                        image: image,
                        description: description,
                }
                const newCategory = await culturalProgram.findByIdAndUpdate({ _id: findData._id }, { $set: { title: title || findData.title }, $push: { content: content } }, { new: true });
                return res.status(200).json({ status: 200, message: 'Cultural Program update successfully', data: newCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Cultural Programs' });
        }
};
exports.deleteCulturalPrograms = async (req, res) => {
        try {
                const culturalProgramsId = req.params.id;
                const user = await culturalProgram.findById(culturalProgramsId);
                if (user) {
                        const user1 = await culturalProgram.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Cultural Programs delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Cultural Programs not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Cultural Programs" });
        }
};
exports.getAllCulturalPrograms = async (req, res) => {
        try {
                const categories = await culturalProgram.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'CulturalPrograms found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'CulturalPrograms not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Cultural Programs' });
        }
};
// exports.createRegistration = async (req, res) => {
//         try {
//                 const { seminarFeeInclude, seminarFee, onlineRegistration, dulyFiledregistration, SavingBankACNo, bankNameandAddress, branchCode, IFSCcode, micrCode, faiGstNo, faiPanNo, registrationForm, paymentOptionsHeading, paymentOptions, OnTheSpotRegistration, changeInNames, Cancellation, type } = req.body;
//                 let findCompany = await registration.findOne({ type: type });
//                 if (findCompany) {
//                         return res.status(409).json({ status: 409, message: 'Registration already successfully', data: {} });
//                 } else {
//                         const newCategory = await registration.create(req.body);
//                         return res.status(200).json({ status: 200, message: 'Registration created successfully', data: newCategory });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to create Registration' });
//         }
// };
exports.createRegistration = async (req, res) => {
        try {
                const { registrationForm } = req.body;
                let findCompany = await registration.findOne({});
                if (findCompany) {
                        const newCategory = await registration.findByIdAndUpdate({ _id: findCompany._id }, { $set: req.body }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Registration update successfully', data: newCategory });
                } else {
                        const newCategory = await registration.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Registration created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Registration' });
        }
};
exports.getRegistrationById = async (req, res) => {
        try {
                const _id = req.params.registrationId;
                const user = await registration.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "Registration found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Registration not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Registration" });
        }
};
exports.updateRegistration = async (req, res) => {
        try {
                const { seminarFeeInclude, seminarFee, onlineRegistration, dulyFiledregistration, SavingBankACNo, bankNameandAddress, branchCode, IFSCcode, micrCode, faiGstNo, faiPanNo, registrationForm, paymentOptionsHeading, paymentOptions, OnTheSpotRegistration, changeInNames, Cancellation, type } = req.body;
                const _id = req.params.registrationId;
                const findData = await registration.findById(_id);
                if (!findData) {
                        return res.status(404).json({ message: "Registration not Found", status: 404, data: {}, });
                }
                let data = {
                        seminarFeeInclude: seminarFeeInclude || findData.seminarFeeInclude,
                        seminarFee: seminarFee || findData.seminarFee,
                        onlineRegistration: onlineRegistration || findData.onlineRegistration,
                        dulyFiledregistration: dulyFiledregistration || findData.dulyFiledregistration,
                        SavingBankACNo: SavingBankACNo || findData.SavingBankACNo,
                        bankNameandAddress: bankNameandAddress || findData.bankNameandAddress,
                        branchCode: branchCode || findData.branchCode,
                        IFSCcode: IFSCcode || findData.IFSCcode,
                        micrCode: micrCode || findData.micrCode,
                        faiGstNo: faiGstNo || findData.faiGstNo,
                        faiPanNo: faiPanNo || findData.faiPanNo,
                        registrationForm: registrationForm || findData.registrationForm,
                        paymentOptionsHeading: paymentOptionsHeading || findData.paymentOptionsHeading,
                        paymentOptions: paymentOptions || findData.paymentOptions,
                        OnTheSpotRegistration: OnTheSpotRegistration || findData.OnTheSpotRegistration,
                        correspondentBank: correspondentBank || findData.correspondentBank,
                        correspondentBankSWIFTCode: correspondentBankSWIFTCode || findData.correspondentBankSWIFTCode,
                        beneficiaryBankofUSD: beneficiaryBankofUSD || findData.beneficiaryBankofUSD,
                        currentAccountNumber: currentAccountNumber || findData.currentAccountNumber,
                        beneficiaryBankSWIFTCode: beneficiaryBankSWIFTCode || findData.beneficiaryBankSWIFTCode,
                        beneficiaryBankAddress: beneficiaryBankAddress || findData.beneficiaryBankAddress,
                        telephoneNumber: telephoneNumber || findData.telephoneNumber,
                        CitibankIndiaNostroAcNumberwithCitiNY: CitibankIndiaNostroAcNumberwithCitiNY || findData.CitibankIndiaNostroAcNumberwithCitiNY,
                        BeneficiaryAcNumberNameAddress: BeneficiaryAcNumberNameAddress || findData.BeneficiaryAcNumberNameAddress,
                        purposeofRemittance: purposeofRemittance || findData.purposeofRemittance,
                        changeInNames: changeInNames || findData.changeInNames,
                        Cancellation: Cancellation || findData.Cancellation,
                        type: findData.type,
                }
                const newCategory = await registration.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                return res.status(200).json({ status: 200, message: 'Registration update successfully', data: newCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Registration' });
        }
};
exports.deleteRegistration = async (req, res) => {
        try {
                const registrationId = req.params.id;
                const findData = await registration.findById({ _id: registrationId, });
                if (findData) {
                        const user1 = await registration.findByIdAndDelete({ _id: findData._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Registration delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Registration not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Registration" });
        }
};
exports.getAllRegistration = async (req, res) => {
        try {
                let categories = await registration.findOne({});
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'Registration found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Registration not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Registration' });
        }
};
exports.getAllRegistrationbyType = async (req, res) => {
        try {
                const categories = await registration.findOne({ type: req.params.type });
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'Registration found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Registration not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Registration' });
        }
};
// exports.createExhibition = async (req, res) => {
//         try {
//                 const { title, faiMmberCompany, nonfaiMmberCompany, descriptionBelowTitle, description, email, tel, telBelowTitle, telBelowHeading, headingArray, reservationTitle, reservationDescription, hotelTitle, hotelPullmanSingle, hotelPullmanDouble, hotelPullmanRoomType, hotelNovotelSingle, hotelNovotelDouble, hotelNovotelRoomType, type } = req.body;
//                 let findCompany = await Exhibition.findOne({ type: type });
//                 if (findCompany) {
//                         return res.status(409).json({ status: 409, message: 'Exhibition already successfully', data: {} });
//                 } else {
//                         const newCategory = await Exhibition.create(req.body);
//                         return res.status(200).json({ status: 200, message: 'Exhibition created successfully', data: newCategory });
//                 }
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ error: 'Failed to create Exhibition' });
//         }
// };
exports.createExhibition = async (req, res) => {
        try {
                const { registrationForm } = req.body;
                let findCompany = await Exhibition.findOne({});
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Exhibition already successfully', data: {} });
                } else {
                        req.body.registrationForm = `< !DOCTYPE html > <html xmlns="http://www.w3.org/1999/xhtml"><head><title></title><meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"><link rel="stylesheet" href="http://idangero.us/swiper/dist/css/swiper.css"><style>body {margin: 0;
                                }html {font - family: Roboto, sans-serif;text-align: justify;color: #777777;font-size: 14px;
                                }h5 {font - size: 15px;margin: 10px 0;
                                } .tabs ul {list - style: none;margin: 0;width: 100%;overflow-x: auto;padding: 0;background: #fff;white-space: nowrap;height: 40px;overflow-y: hidden;display: table;
                                } .tabs ul li {width: 1%;display: table-cell;
                                } .tabs ul li {width: 1%;display: table-cell;
                                } .tabs a {position: relative;color: #83c45d;text-decoration: none;display: block;width: auto;height: 40px;text-align: center;line-height: 40px;font-weight: 700;font-size: 14px;overflow: hidden;font-weight: normal;padding: 0 12px;
                                } .tabs {position: fixed;width: 100%;top: 0px;z-index: 2;overflow-x: auto;box-shadow: 0px 1px 7px #808080;
                                } .tabs li.tabitem.active {border - bottom: 2px solid #83c45d;
                                } table {width: 100%;
                                } table td {border: 1px solid #eee;padding: 10px 5px;
                                } .swiper-container {width: 100%;height: auto;border-bottom: none;overflow-x: hidden;overflow-y: auto;
                                } .descriptionBody {text - align: justify;margin-top: 55px;padding: 0 10px;
                                } .swiper-slide {min - width: 100%;
                                } ul {list - style: circle;padding-left: 20px;
                                }</style></head><body><div id='tabs' class="tabs"><ul><li class="tabitem active"><a href="#" data-slide="0">INDIAN<span></span></a></li><li class="tabitem"><a href="#" data-slide="1">OVERSEAS<span></span></a></li></ul></div><div class="descriptionBody"><div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide"><h5>SEMINAR FEE</h5><ul><li>Members: Rs. 18,
                                000 + 18% GST per delegate</li><li>Non-members: Rs. 29,
                                000 + 18% GST per delegate</li></ul><h5>Seminar Fee includes:</h5><ul><li>Seminar Kit with Pre-prints of Seminar Papers</li><li>High Tea, Cultural Programme, Cocktails and Dinner on December 5,
                                2017 (Tuesday)</li><li>Working lunches and pre/post lunch tea/coffee on December 6-7,
                                2017 (Wednesday &amp; Thursday)</li></ul><br /><h3>Procedure of Registration &amp; Payment</h3><h5>I. ONLINE REGISTRATION</h5><p>For registering online, please visit FAI website <a href="https://falcon.spectra.co/fai/html/fai.html" target="_blank"> www.faidelhi.org</a></p><h5>II. Registration Form</h5><p>Nominations in the attached <a href="http://43.242.124.76:8052/AppUploads/FAI-Registration-Indian-13.pdf" target="_top">registration form</a>, along with the seminar fee, should be sent to The Fertiliser Association of India, New Delhi.</p><h4>Payment Options</h4><p>Payment can be made either of the following:</p><ul><li>Bankers' cheque / demand draft payable at New Delhi in favour of 'The Fertiliser Association of India'.</li > <li>Through NEFT / RTGS under intimation to FAI as per the details given below:<br style="box-sizing:border-box;" /></li></ul ><br /><table><tr><td>Saving Bank A/c No.</td><td>1484101006029.</td></tr><tr><td>Bank Name and Address</td><td><strong>CANARA BANK</strong><br>Jit Singh Marg,<br>New Delhi &ndash; 110 067</td></tr><tr><td>Branch code</td><td>1484</td></tr><tr><td>IFSC code</td><td>CNRB0001484</td></tr><tr><td>MICR Code</td><td>110015015</td></tr><tr><td>FAI - GSTIN</td><td>07AAACT0097M1Z3</td></tr><tr><td>FAI - PAN No.</td><td>AAACT0097M</td></tr></table><h5>Duly filled registration form should be sent to:</h5><p style="font-size:15px">The Secretary<br>The Fertiliser Association of India<br style="box-sizing:border-box;" />FAI House,
                                10 Shaheed Jit Singh Marg<br style="box-sizing:border-box;" />New Delhi &ndash; 110067<br style="box-sizing:border-box;" />Tel: +91-11- 46005204/46005233/46005209<br style="box-sizing:border-box;" />Fax: +91-11-26960052/46005213<br style="box-sizing:border-box;" />Email: secy@faidelhi.org; acctt@faidelhi.org</p><h5>On The Spot Registration</h5><p>It can be done by payment of Cash, Demand Draft or Credit Card at the venue of the seminar.</p><h5>Change in Names/Cancellation</h5><p>Change in names of the delegates or cancellation of registration can be made up to&nbsp;<strong style="box-sizing:border-box;">25th November, 2017.</strong> Please note that any request for cancellation/refund after this date will be eligible for only 50% refund after deducting the service tax paid to the Government of India. Only the names of delegates registered by&nbsp;<strong style="box-sizing:border-box;">25th November,
                                2017</strong>&nbsp;will appear in the printed List of Delegates.</p></div><div class="swiper-slide"><h5>SEMINAR FEE</h5><ul><li>Members: US$ 2200 + 18% GST per delegate</li><li>Non-members: US$ 2600 + 18% GST per delegate</li></ul><h5>Seminar Fee includes:</h5><ul><li>Seminar Kit with Pre-prints of Seminar Papers</li><li>High Tea, Cultural Programme, Cocktails and Dinner on December 5,
                                2017 (Tuesday)</li><li>Working lunches and pre/post lunch tea/coffee on December 6-7,
                                2017 (Wednesday &amp; Thursday)</li></ul><br /><h3>Procedure of Registration &amp; Payment</h3><h5>I. ONLINE REGISTRATION</h5><p>For registering online, please visit FAI website <a href="https://falcon.spectra.co/fai/html/fai.html" target="_blank"> www.faidelhi.org</a></p><h5>II. Registration Form</h5><p>Nominations in the attached <a href="http://43.242.124.76:8052/AppUploads/FAI-Registration-overseas-13.pdf" target="_top">registration form</a>, along with the seminar fee, should be sent to The Fertiliser Association of India, New Delhi.</p><h4>Payment Options</h4><p>Payment can be made either of the following:</p><ul><li><strong>Draft:</strong> Please make Bank Draft payable at <strong>New York</strong> in favour of <strong>‘The Fertiliser Association of India'</strong> .</li><li><strong>Wire Transfer:</strong> Mode of transfer of funds to FAI’s Citibank Account should be as per the details given below:</li></ul><br /><table><tr><td>Account Holder's Name</td><td>The Fertiliser Association of India</td></tr><tr><td>Account Holder’s Address</td><td>FAI House,
                                10 Shaheed Jit Singh Marg,<br />New Delhi - 110 067</td></tr><tr><td>Account Holder’s Bank</td><td><strong>CITIBANK,N.A., Delhi</strong> <br />(Beneficiary Bank)</td></tr><tr><td>Address of the Bank</td><td>Level -1, Gurmehar, A-12, Ring Road<br />South Extn-1, New Delhi - 110 049</td></tr><tr><td>Citibank Contact No.</td><td>Citibank Contact No.</td></tr><tr><td>Current Account Number</td><td>0-414462-006</td></tr><tr><td>ABA Routing Number</td><td>021000089<br />Swift Code CITIUS33 and Nostro Account: 36241797<br />Please fax/email copy of banker's advice to us for follow up.</td></tr><tr><td>Swift Code</td><td>CITIINBX</td></tr><tr><td>Intermediary Bank</td><td>CITIBANK, New York</td></tr><tr><td>FAI - GSTIN </td><td>07AAACT0097M1Z3</td></tr><tr><td>FAI - PAN No.</td><td>AAACT0097M</td></tr></table><h5>Duly filled registration form should be sent to:</h5><p style="font-size:15px">The Secretary<br>The Fertiliser Association of India<br style="box-sizing:border-box;" />FAI House,
                                10 Shaheed Jit Singh Marg<br style="box-sizing:border-box;" />New Delhi &ndash; 110067<br style="box-sizing:border-box;" />Tel: +91-11- 46005204/46005233/46005209<br style="box-sizing:border-box;" />Fax: +91-11-26960052/46005213<br style="box-sizing:border-box;" />Email: secy@faidelhi.org; acctt@faidelhi.org</p><h5>On The Spot Registration</h5><p>It can be done by payment of Cash, Demand Draft or Credit Card at the venue of the seminar.</p><h5>Change in Names/Cancellation</h5><p>Change in names of the delegates or cancellation of registration can be made up to&nbsp;<strong style="box-sizing:border-box;">25th November, 2017.</strong> Please note that any request for cancellation/refund after this date will be eligible for only 50% refund after deducting the service tax paid to the Government of India. Only the names of delegates registered by&nbsp;<strong style="box-sizing:border-box;">25th November,
                                2017</strong>&nbsp;will appear in the printed List of Delegates.</p></div></div></div ></div ><script src="http://idangero.us/swiper/js/vendor/jquery-1.11.0.min.js"></script><script src="http://idangero.us/swiper/dist/js/swiper.min.js"></script><script>var swiper = new Swiper('.swiper-container',
                                {autoHeight: true,
                                });$('a[data-slide
                                ]').click(function (e) {e.preventDefault(); $(".tabitem").removeClass("active"); $(this).parent().addClass("active"); swiper.slideTo($(this).data('slide'));
                                }); swiper.on('slideChange', function () {$(".tabitem").removeClass("active"); $(".tabitem a[data-slide='" + swiper.activeIndex + "']").parent().addClass("active");
                                });</script></body ></html >`;

                        const newCategory = await Exhibition.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Exhibition created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Exhibition' });
        }
};
exports.getExhibitionById = async (req, res) => {
        try {
                const _id = req.params.ExhibitionId;
                const user = await Exhibition.findById(_id);
                if (user) {
                        return res.status(200).json({ message: "Exhibition found successfully", status: 200, data: user, });
                }
                return res.status(404).json({ message: "Exhibition not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Exhibition" });
        }
};
exports.updateExhibition = async (req, res) => {
        try {
                const { seminarFeeInclude, seminarFee, onlineRegistration, dulyFiledregistration, SavingBankACNo, bankNameandAddress, branchCode, IFSCcode, micrCode, faiGstNo, faiPanNo, registrationForm, paymentOptionsHeading, paymentOptions, OnTheSpotRegistration, changeInNames, Cancellation, type } = req.body;
                const _id = req.params.ExhibitionId;
                const findData = await Exhibition.findById(_id);
                if (!findData) {
                        return res.status(404).json({ message: "Registration not Found", status: 404, data: {}, });
                }
                let data = {
                        seminarFeeInclude: seminarFeeInclude || findData.seminarFeeInclude,
                        seminarFee: seminarFee || findData.seminarFee,
                        onlineRegistration: onlineRegistration || findData.onlineRegistration,
                        dulyFiledregistration: dulyFiledregistration || findData.dulyFiledregistration,
                        SavingBankACNo: SavingBankACNo || findData.SavingBankACNo,
                        bankNameandAddress: bankNameandAddress || findData.bankNameandAddress,
                        branchCode: branchCode || findData.branchCode,
                        IFSCcode: IFSCcode || findData.IFSCcode,
                        micrCode: micrCode || findData.micrCode,
                        faiGstNo: faiGstNo || findData.faiGstNo,
                        faiPanNo: faiPanNo || findData.faiPanNo,
                        registrationForm: registrationForm || findData.registrationForm,
                        paymentOptionsHeading: paymentOptionsHeading || findData.paymentOptionsHeading,
                        paymentOptions: paymentOptions || findData.paymentOptions,
                        OnTheSpotRegistration: OnTheSpotRegistration || findData.OnTheSpotRegistration,
                        correspondentBank: correspondentBank || findData.correspondentBank,
                        correspondentBankSWIFTCode: correspondentBankSWIFTCode || findData.correspondentBankSWIFTCode,
                        beneficiaryBankofUSD: beneficiaryBankofUSD || findData.beneficiaryBankofUSD,
                        currentAccountNumber: currentAccountNumber || findData.currentAccountNumber,
                        beneficiaryBankSWIFTCode: beneficiaryBankSWIFTCode || findData.beneficiaryBankSWIFTCode,
                        beneficiaryBankAddress: beneficiaryBankAddress || findData.beneficiaryBankAddress,
                        telephoneNumber: telephoneNumber || findData.telephoneNumber,
                        CitibankIndiaNostroAcNumberwithCitiNY: CitibankIndiaNostroAcNumberwithCitiNY || findData.CitibankIndiaNostroAcNumberwithCitiNY,
                        BeneficiaryAcNumberNameAddress: BeneficiaryAcNumberNameAddress || findData.BeneficiaryAcNumberNameAddress,
                        purposeofRemittance: purposeofRemittance || findData.purposeofRemittance,
                        changeInNames: changeInNames || findData.changeInNames,
                        Cancellation: Cancellation || findData.Cancellation,
                        type: findData.type,
                }
                const newCategory = await Exhibition.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                return res.status(200).json({ status: 200, message: 'Exhibition update successfully', data: newCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Exhibition' });
        }
};
exports.deleteExhibition = async (req, res) => {
        try {
                const registrationId = req.params.id;
                const findData = await Exhibition.findById({ _id: registrationId, });
                if (findData) {
                        const user1 = await Exhibition.findByIdAndDelete({ _id: findData._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Exhibition delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Exhibition not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Exhibition" });
        }
};
exports.getAllExhibition = async (req, res) => {
        try {
                let categories = await Exhibition.findOne({});
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'Exhibition found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Exhibition not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Exhibition' });
        }
};
exports.getAllExhibitionbyType = async (req, res) => {
        try {
                const categories = await Exhibition.findOne({ type: req.params.type });
                if (categories) {
                        return res.status(200).json({ status: 200, message: 'Exhibition found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Exhibition not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Exhibition' });
        }
};
exports.sendNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "Admin not found" });
                } else {
                        if (req.body.total == "ALL") {
                                let userData = await User.find({ _id: { $ne: admin._id } });
                                if (userData.length == 0) {
                                        return res.status(404).json({ status: 404, message: "Employee not found" });
                                } else {
                                        console.log("-----------------");
                                        for (let i = 0; i < userData.length; i++) {
                                                console.log("-----------------", userData[i]._id);
                                                let obj = {
                                                        userId: userData[i]._id,
                                                        title: req.body.title,
                                                        body: req.body.body,
                                                        date: req.body.date,
                                                        image: req.body.image,
                                                        time: req.body.time,
                                                }
                                                await notification.create(obj)
                                        }
                                        let obj1 = {
                                                userId: admin._id,
                                                title: req.body.title,
                                                body: req.body.body,
                                                date: req.body.date,
                                                image: req.body.image,
                                                time: req.body.time,
                                        }
                                        await notification.create(obj1)
                                        return res.status(200).json({ status: 200, message: "Notification send successfully." });
                                }
                        }
                        if (req.body.total == "SINGLE") {
                                let userData = await User.findById({ _id: req.body._id });
                                if (!userData) {
                                        return res.status(404).json({ status: 404, message: "Employee not found" });
                                } else {
                                        let obj = {
                                                userId: userData._id,
                                                title: req.body.title,
                                                body: req.body.body,
                                                date: req.body.date,
                                                image: req.body.image,
                                                time: req.body.time,
                                        }
                                        let data = await notification.create(obj)
                                        if (data) {
                                                let obj1 = {
                                                        userId: admin._id,
                                                        title: req.body.title,
                                                        body: req.body.body,
                                                        date: req.body.date,
                                                        image: req.body.image,
                                                        time: req.body.time,
                                                }
                                                await notification.create(obj1)
                                                return res.status(200).json({ status: 200, message: "Notification send successfully.", data: data });
                                        }
                                }
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.allNotification = async (req, res) => {
        try {
                const admin = await User.findById({ _id: req.user._id });
                if (!admin) {
                        return res.status(404).json({ status: 404, message: "Admin not found" });
                } else {
                        let findNotification = await notification.find({ userId: admin._id }).populate('userId');
                        if (findNotification.length == 0) {
                                return res.status(404).json({ status: 404, message: "Notification data not found successfully.", data: {} })
                        } else {
                                return res.status(200).json({ status: 200, message: "Notification data found successfully.", data: findNotification })
                        }
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
}
exports.createProgram = async (req, res) => {
        try {
                let findCompany = await program.findOne({ date: req.body.date });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Program already successfully', data: {} });
                } else {
                        const newCategory = await program.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Program created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create ExhibiProgramion' });
        }
};
exports.getProgramById = async (req, res) => {
        try {
                const ProgramId = req.params.id;
                const findData = await program.findById({ _id: ProgramId, });
                if (findData) {
                        return res.status(200).json({ message: "Program found successfully", status: 200, data: findData, });
                }
                return res.status(404).json({ message: "Program not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Program" });
        }
};
exports.getAllProgram = async (req, res) => {
        try {
                const categories = await program.find({});
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Program found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Program not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Program' });
        }
};
exports.deleteProgram = async (req, res) => {
        try {
                const ProgramId = req.params.id;
                const findData = await program.findById({ _id: ProgramId, });
                if (findData) {
                        const user1 = await program.findByIdAndDelete({ _id: findData._id });;
                        if (user1) {
                                return res.status(200).json({ message: "Program delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(404).json({ message: "Program not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Program" });
        }
};