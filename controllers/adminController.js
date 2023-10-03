const bcrypt = require('bcryptjs');
const advertisement = require('../model/Advertisement/advertisement');
const banner = require('../model/Banner/banner');
const bookCabs = require('../model/BookCabs/bookCabs');
const ChairmanDeskAboutFaiSeminarTheme = require('../model/ChairmanDeskAboutFaiSeminarTheme/ChairmanDeskAboutFaiSeminarTheme');
const company = require('../model/company/company');
const CompanyCategory = require('../model/company/companyCategoryModel');
const culturalProgram = require('../model/CulturalProgram/culturalProgram');
const delegate = require('../model/Delegate/delegate');
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
const speaker = require('../model/Speaker/speaker');
const sponser = require('../model/Sponser/sponser');
const uploadAlbum = require('../model/UploadAlbum/uploadAlbum');
const Location = require('../model/locationModel');
const User = require('../model/userModel');
const notification = require("../model/notification");

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
                                                const savedLocation = await Location.create({ locationType, country: findCountry._id, locationName });
                                                return res.status(200).json({ status: 200, message: 'Location created successfully', location: savedLocation });
                                        }
                                } else if (locationType === "City") {
                                        let findState = await Location.findOne({ _id: countryState, locationType: "State" });
                                        if (!findState) {
                                                return res.status(404).json({ status: 404, message: 'State not found.', data: findState });
                                        } else {
                                                const savedLocation = await Location.create({ locationType, state: countryState, country: findState.country, locationName });
                                                return res.status(200).json({ status: 200, message: 'Location created successfully', location: savedLocation });
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
exports.getAllLocationState = async (req, res) => {
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
                let findSpeaker = await speaker.findOne({ eventId, speakerName });
                if (findSpeaker) {
                        return res.status(409).json({ status: 409, message: 'Speaker already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                return res.status(404).json({ message: "ProfilePic require", status: 404, data: {}, });
                        }
                        const newCategory = await speaker.create(req.body);
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
                const user = await speaker.findById(speakerId);
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
                const findData = await speaker.findById(speakerId);
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
                let findCompany = await speaker.findOne({ _id: { $ne: findData._id }, eventId, speakerName, });
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
                        const newCategory = await speaker.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
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
                const user = await speaker.findById(speakerId);
                if (user) {
                        const user1 = await speaker.findByIdAndDelete({ _id: user._id });;
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
                const categories = await speaker.find();
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
                let findSpeaker = await sponser.findOne({ eventId, sponserType, sponserName, sponserCountryId, sponserCityId, pinCode });
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
                        const newCategory = await sponser.create(req.body);
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
                const user = await sponser.findById(sponserId);
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
                const findData = await sponser.findById(sponserId);
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
                let findCompany = await sponser.findOne({ _id: { $ne: findData._id }, eventId, sponserType, sponserName, sponserCountryId, sponserCityId, pinCode, });
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
                        const newCategory = await sponser.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
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
                const user = await sponser.findById(sponserId);
                if (user) {
                        const user1 = await sponser.findByIdAndDelete({ _id: user._id });;
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
                const categories = await sponser.find();
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
                if (speaker1) { const findSpeaker1 = await speaker.findById(speaker1); if (!findSpeaker1) { return res.status(404).json({ status: 404, message: 'Speaker1 not found' }); } }
                if (speaker2) { const findSpeaker2 = await speaker.findById(speaker2); if (!findSpeaker2) { return res.status(404).json({ status: 404, message: 'Speaker2 not found' }); } }
                if (speaker3) { const findSpeaker3 = await speaker.findById(speaker3); if (!findSpeaker3) { return res.status(404).json({ status: 404, message: 'Speaker3 not found' }); } }
                if (speaker4) { const findSpeaker4 = await speaker.findById(speaker4); if (!findSpeaker4) { return res.status(404).json({ status: 404, message: 'speaker4 not found' }); } }
                if (speaker5) { const findSpeaker5 = await speaker.findById(speaker5); if (!findSpeaker5) { return res.status(404).json({ status: 404, message: 'speaker5 not found' }); } }
                if (sponser1) { const findSponser1 = await sponser.findById(sponser1); if (!findSponser1) { return res.status(404).json({ status: 404, message: 'Sponser1 not found' }); } }
                if (sponser2) { const findSponser2 = await sponser.findById(sponser2); if (!findSponser2) { return res.status(404).json({ status: 404, message: 'Sponser2 not found' }); } }
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
                if (speaker1) { const findSpeaker1 = await speaker.findById(speaker1); if (!findSpeaker1) { return res.status(404).json({ status: 404, message: 'Speaker1 not found' }); } }
                if (speaker2) { const findSpeaker2 = await speaker.findById(speaker2); if (!findSpeaker2) { return res.status(404).json({ status: 404, message: 'Speaker2 not found' }); } }
                if (speaker3) { const findSpeaker3 = await speaker.findById(speaker3); if (!findSpeaker3) { return res.status(404).json({ status: 404, message: 'Speaker3 not found' }); } }
                if (speaker4) { const findSpeaker4 = await speaker.findById(speaker4); if (!findSpeaker4) { return res.status(404).json({ status: 404, message: 'speaker4 not found' }); } }
                if (speaker5) { const findSpeaker5 = await speaker.findById(speaker5); if (!findSpeaker5) { return res.status(404).json({ status: 404, message: 'speaker5 not found' }); } }
                if (sponser1) { const findSponser1 = await sponser.findById(sponser1); if (!findSponser1) { return res.status(404).json({ status: 404, message: 'Sponser1 not found' }); } }
                if (sponser2) { const findSponser2 = await sponser.findById(sponser2); if (!findSponser2) { return res.status(404).json({ status: 404, message: 'Sponser2 not found' }); } }
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
                let findDelegate = await delegate.findOne({ eventId, companyId, delegateCategoryId, email, delegateTitle, firstName, delegateLoginId, address1 });
                if (findDelegate) {
                        return res.status(409).json({ status: 409, message: 'Delegate already exit', data: {} });
                } else {
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                return res.status(201).json({ message: "Profile Pic require", status: 201, data: {}, });
                        }
                        req.body.delegatePassword = await bcrypt.hash(delegatePassword, 10);
                        const newCategory = await delegate.create(req.body);
                        return res.status(200).json({ status: 200, message: 'Delegate created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create Delegate' });
        }
};
exports.getDelegateById = async (req, res) => {
        try {
                const delegateId = req.params.delegateId;
                const user = await delegate.findById(delegateId);
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
                const findData = await delegate.findById(delegateId); if (!findData) { return res.status(201).json({ message: "Delegate not Found", status: 404, data: {}, }); }
                if (eventId) { const findEvent = await event.findById(eventId); if (!findEvent) { return res.status(404).json({ status: 404, message: 'Event not found' }); } }
                if (companyId) { const findCompany = await company.findById(companyId); if (!findCompany) { return res.status(404).json({ status: 404, message: 'company not found' }); } }
                if (delegateCategoryId) { const findDelegateCategory = await CompanyCategory.findById(delegateCategoryId); if (!findDelegateCategory) { return res.status(404).json({ status: 404, message: 'Delegate Category not found' }); } }
                if (cityId) { const findstateCityId = await Location.findById(cityId); if (!findstateCityId) { return res.status(404).json({ status: 404, message: 'StateCity not found' }); } }
                if (countryId) { const findCountry = await Location.findById(countryId); if (!findCountry) { return res.status(404).json({ status: 404, message: 'country not found' }); } }
                let findDelegate = await delegate.findOne({ _id: { $ne: findData._id }, eventId, companyId, delegateCategoryId, email, delegateTitle, firstName, delegateLoginId, address1 });
                if (findDelegate) { return res.status(409).json({ status: 409, message: 'Delegate already exit', data: {} }); } else {
                        if (req.file) { req.body.profilePic = req.file.path } else { req.body.profilePic = findData.profilePic };
                        if (delegatePassword) {
                                req.body.delegatePassword = await bcrypt.hash(delegatePassword, 10);
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
                                delegatePassword: req.body.delegatePassword || findData.delegatePassword,
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
                        const newCategory = await delegate.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
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
                const user = await delegate.findById(exhibitorId);
                if (user) {
                        const user1 = await delegate.findByIdAndDelete({ _id: user._id });;
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
                let query = {};
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
                };
                let data = await delegate.paginate(query, options);
                if (data.docs.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Delegate found successfully', data: data.docs });
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
exports.createChairmanDesk = async (req, res) => {
        try {
                const { image, description, name, designation } = req.body;
                let findChairmanDesk = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "ChairmanDesk" });
                if (findChairmanDesk) {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                req.body.image = findChairmanDesk.image;
                        }
                        let obj = {
                                type: "ChairmanDesk",
                                image: req.body.image || findChairmanDesk.image,
                                designation: designation || findChairmanDesk.designation,
                                name: name || findChairmanDesk.name,
                                description: description || findChairmanDesk.description
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findChairmanDesk._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk update successfully', data: newCategory });
                } else {
                        if (req.file) {
                                req.body.image = req.file.path
                        } else {
                                return res.status(404).json({ message: "Image require", status: 404, data: {}, });
                        }
                        let obj = {
                                type: "ChairmanDesk",
                                image: req.body.image,
                                designation: designation,
                                name: name,
                                description: description
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
exports.createAboutFai = async (req, res) => {
        try {
                const { description, name, designation, } = req.body;
                let findAboutFai = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "AboutFai" });
                if (findAboutFai) {
                        let obj = {
                                type: "AboutFai",
                                designation: designation || findAboutFai.designation,
                                name: name || findAboutFai.name,
                                description: description || findAboutFai.description
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findAboutFai._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'AboutFai update successfully', data: newCategory });
                } else {
                        let obj = {
                                type: "AboutFai",
                                designation: designation,
                                name: name,
                                description: description
                        }
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
exports.createSeminarTheme = async (req, res) => {
        try {
                const { title, date, location, description } = req.body;
                let findSeminarTheme = await ChairmanDeskAboutFaiSeminarTheme.findOne({ type: "SeminarTheme" });
                if (findSeminarTheme) {
                        let obj = {
                                type: "SeminarTheme",
                                title: title || findSeminarTheme.title,
                                location: location || findSeminarTheme.location,
                                date: date || findSeminarTheme.date,
                                description: description || findSeminarTheme.description
                        }
                        const newCategory = await ChairmanDeskAboutFaiSeminarTheme.findByIdAndUpdate({ _id: findSeminarTheme._id }, { $set: obj }, { new: true });
                        return res.status(200).json({ status: 200, message: 'ChairmanDesk update successfully', data: newCategory });
                } else {
                        let obj = {
                                type: "SeminarTheme",
                                title: req.body.title,
                                location: location,
                                date: date,
                                description: description
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
exports.createRegistration = async (req, res) => {
        try {
                const { seminarFeeInclude, seminarFee, onlineRegistration, dulyFiledregistration, SavingBankACNo, bankNameandAddress, branchCode, IFSCcode, micrCode, faiGstNo, faiPanNo, registrationForm, paymentOptionsHeading, paymentOptions, OnTheSpotRegistration, changeInNames, Cancellation, type } = req.body;
                let findCompany = await registration.findOne({ type: type });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Registration already successfully', data: {} });
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
                const categories = await registration.find({});
                if (categories.length > 0) {
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
exports.createExhibition = async (req, res) => {
        try {
                const { title, faiMmberCompany, nonfaiMmberCompany, descriptionBelowTitle, description, email, tel, telBelowTitle, telBelowHeading, headingArray, reservationTitle, reservationDescription, hotelTitle, hotelPullmanSingle, hotelPullmanDouble, hotelPullmanRoomType, hotelNovotelSingle, hotelNovotelDouble, hotelNovotelRoomType, type } = req.body;
                let findCompany = await Exhibition.findOne({ type: type });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Exhibition already successfully', data: {} });
                } else {
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
                const categories = await Exhibition.find({});
                if (categories.length > 0) {
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