const company = require('../model/company/company');
const CompanyCategory = require('../model/company/companyCategoryModel');
const delegate = require('../model/Delegate/delegate');
const exhibitor = require('../model/Exhibitor/Exhibitor');
const eventSchedule = require('../model/EventSchedule/eventSchedule');
const eventCategory = require('../model/Event/1eventCategory');
const eventOrganiser = require('../model/Event/2eventOrganiser');
const event = require('../model/Event/3Event');
const eventSession = require('../model/Event/4EventSession');
const Location = require('../model/locationModel');
const paper = require('../model/Speaker/paper');
const speaker = require('../model/Speaker/speaker');
const sponser = require('../model/Sponser/sponser');
const User = require('../model/userModel');

exports.createCompanyCategory = async (req, res) => {
        try {
                const { categoryName, currency, seminarFee, isPublished } = req.body;
                let findCategory = await CompanyCategory.findOne({ categoryName, currency });
                if (findCategory) {
                        return res.status(409).json({ status: 409, message: 'Company category already successfully', data: findCategory });
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
                        return res.status(201).json({ message: "Company category found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Company category not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Company category delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Company category not Found", status: 404, data: {}, });
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
                if (locationType == "Country") {
                        let findCategory = await Location.findOne({ locationType, locationName });
                        if (findCategory) {
                                return res.status(409).json({ status: 409, message: 'Location already exits', data: findCategory });
                        } else {
                                const savedLocation = await Location.create({ locationType, locationName, });
                                return res.status(201).json({ status: 201, message: 'Location created successfully', location: savedLocation });
                        }
                } else {
                        let findCategory = await Location.findOne({ locationType, locationName, countryState });
                        if (findCategory) {
                                return res.status(409).json({ status: 409, message: 'Location already exits', data: findCategory });
                        } else {
                                if (locationType == "State") {
                                        let findCategory1 = await Location.findOne({ _id: countryState, locationType: "Country" });
                                        if (!findCategory1) {
                                                return res.status(409).json({ status: 409, message: 'Country not found.', data: findCategory1 });
                                        } else {
                                                const savedLocation = await Location.create({ locationType, country: findCategory1._id, locationName, });
                                                return res.status(201).json({ status: 201, message: 'Location created successfully', location: savedLocation });
                                        }
                                }
                                if (locationType == "City") {
                                        let findCategory1 = await Location.findOne({ _id: countryState, locationType: "State" });
                                        if (!findCategory1) {
                                                return res.status(409).json({ status: 409, message: 'State not found.', data: findCategory1 });
                                        } else {
                                                const savedLocation = await Location.create({ locationType, state: countryState, country: findCategory1.country, locationName, });
                                                return res.status(201).json({ status: 201, message: 'Location created successfully', location: savedLocation });
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
                        return res.status(200).json({ status: 200, message: 'Country found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'Country not found.', data: locations });
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
                        return res.status(200).json({ status: 200, message: 'State found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'State not found.', data: locations });
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
                        return res.status(200).json({ status: 200, message: 'City found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'City not found.', data: locations });
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
                        return res.status(200).json({ status: 200, message: 'City found successfully', data: locations });
                } else {
                        return res.status(404).json({ status: 404, message: 'City not found.', data: locations });
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
                        if (locationType == "Country") {
                                let findCategory = await Location.findOne({ _id: { $ne: location._id }, locationType, locationName });
                                if (findCategory) {
                                        return res.status(409).json({ status: 409, message: 'Location already exits', data: findCategory });
                                } else {
                                        location.locationType = locationType;
                                        location.locationName = locationName;
                                        await location.save();
                                        return res.status(201).json({ status: 201, message: 'Location update successfully', location: location });
                                }
                        } else {
                                let findCategory = await Location.findOne({ _id: { $ne: location._id }, locationType, locationName, countryState });
                                if (findCategory) {
                                        return res.status(409).json({ status: 409, message: 'Location already exits', data: findCategory });
                                } else {
                                        if (locationType == "State") {
                                                let findCategory1 = await Location.findOne({ _id: countryState, locationType: "Country" });
                                                if (!findCategory1) {
                                                        return res.status(409).json({ status: 409, message: 'Country not found.', data: findCategory1 });
                                                } else {
                                                        location.locationType = locationType;
                                                        location.country = findCategory1._id;
                                                        location.locationName = locationName;
                                                        await location.save();
                                                        return res.status(201).json({ status: 201, message: 'Location update successfully', location: location });
                                                }
                                        }
                                        if (locationType == "City") {
                                                let findCategory1 = await Location.findOne({ _id: countryState, locationType: "State" });
                                                if (!findCategory1) {
                                                        return res.status(409).json({ status: 409, message: 'State not found.', data: findCategory1 });
                                                } else {
                                                        location.locationType = locationType;
                                                        location.country = findCategory1._id;
                                                        location.state = location.state;
                                                        location.locationName = locationName;
                                                        await location.save(); await location.save();
                                                        return res.status(201).json({ status: 201, message: 'Location update successfully', location: location });
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
exports.createCompany = async (req, res) => {
        try {
                const { companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch, pinCode, address2, isdCode, } = req.body;
                if (!companyCategoryId && !companyName && !companyCode && !address1 && !countryId && !stateCityId && !companyNameOnBatch) {
                        return res.status(201).json({ message: "Provide require fields  companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch", status: 404, data: {}, });
                }
                const findCompanyCategory = await CompanyCategory.findById(companyCategoryId);
                if (!findCompanyCategory) {
                        return res.status(201).json({ message: "Company category not Found", status: 404, data: {}, });
                }
                const findCountry = await Location.findById(countryId);
                if (!findCountry) {
                        return res.status(404).json({ status: 404, message: 'country not found' });
                }
                const findstateCityId = await Location.findById(stateCityId);
                if (!findstateCityId) {
                        return res.status(404).json({ status: 404, message: 'StateCity not found' });
                }
                let findCompany = await company.findOne({ companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Company category already successfully', data: findCategory });
                } else {
                        const newCategory = await company.create(req.body);
                        return res.status(200).json({ status: 200, message: 'company created successfully', data: newCategory });
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
                        return res.status(201).json({ message: "company found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "company not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve company" });
        }
};
exports.updateCompany = async (req, res) => {
        try {
                const { companyCategoryId, companyName, companyCode, address1, countryId, stateCityId, companyNameOnBatch, pinCode, address2, isdCode, } = req.body;
                const companyId = req.params.companyId;
                const findData = await company.findById(companyId);
                if (!findData) {
                        return res.status(201).json({ message: "company not Found", status: 404, data: {}, });
                }
                if (companyCategoryId) {
                        const findCompanyCategory = await CompanyCategory.findById(companyCategoryId);
                        if (!findCompanyCategory) { return res.status(201).json({ message: "Company category not Found", status: 404, data: {}, }); }
                }
                if (countryId) {
                        const findCountry = await Location.findById(countryId);
                        if (!findCountry) { return res.status(404).json({ status: 404, message: 'country not found' }); }
                }
                if (stateCityId) {
                        const findstateCityId = await Location.findById(stateCityId);
                        if (!findstateCityId) { return res.status(404).json({ status: 404, message: 'StateCity not found' }); }
                }
                let findCompany = await company.findOne({ _id: { $ne: _id }, companyCategoryId, companyName, companyNameOnBatch, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Company already Exit', data: findCategory });
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
                        }
                        const newCategory = await company.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'company update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create company category' });
        }
};
exports.deleteCompany = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await company.findById(userId);
                if (user) {
                        const user1 = await company.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "Company delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Company not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Company" });
        }
};
exports.getAllCompany = async (req, res) => {
        try {
                const categories = await company.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Company found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Company not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch company categories' });
        }
};
exports.createEventCategory = async (req, res) => {
        try {
                const { eventCategoryName, showInOrder, isPublished } = req.body;
                let findCategory = await eventCategory.findOne({ eventCategoryName, showInOrder });
                if (findCategory) {
                        return res.status(409).json({ status: 409, message: 'Event category already successfully', data: findCategory });
                } else {
                        const newCategory = await eventCategory.create({ eventCategoryName, showInOrder, isPublished, });
                        return res.status(200).json({ status: 200, message: 'Event category created successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create event category' });
        }
};
exports.getEventCategoryById = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await eventCategory.findById(userId);
                if (user) {
                        return res.status(201).json({ message: "Event category found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Event category not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Event category" });
        }
};
exports.updateEventCategory = async (req, res) => {
        try {
                const { id } = req.params;
                const findCategory = await eventCategory.findById(id);
                if (!findCategory) {
                        return res.status(404).json({ message: 'Event category not found' });
                }
                const existingUser = await eventCategory.findOne({ _id: { $ne: findCategory._id }, eventCategoryName: req.body.eventCategoryName });
                if (existingUser) {
                        return res.status(400).json({ status: 400, message: "already exists" });
                }
                findCategory.eventCategoryName = req.body.eventCategoryName || findCategory.eventCategoryName;
                findCategory.showInOrder = req.body.showInOrder || findCategory.showInOrder;
                findCategory.isPublished = req.body.isPublished || findCategory.isPublished;
                const updatedCategory = await findCategory.save();
                return res.status(200).json({ message: 'Event category updated successfully', data: updatedCategory });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update Event category' });
        }
};
exports.deleteEventCategory = async (req, res) => {
        try {
                const userId = req.params.id;
                const user = await eventCategory.findById(userId);
                if (user) {
                        const user1 = await eventCategory.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "Event category delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Event category not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Event category" });
        }
};
exports.getAllEventCategories = async (req, res) => {
        try {
                const categories = await eventCategory.find().sort({ showInOrder: 1 });
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Event category found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Event category not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch company categories' });
        }
};
exports.createEventOrganiser = async (req, res) => {
        try {
                const { shortName, orgName, address, contactPerson, contactPersonNo, alternateAddress, isPublished, contactEmail, contactFax } = req.body;
                if (!shortName && !orgName && !address && !contactPerson && !contactPersonNo && !alternateAddress && !isPublished) {
                        return res.status(201).json({ message: "Provide require fields  shortName, orgName, address, contactPerson, contactPersonNo, alternateAddress, isPublished", status: 404, data: {}, });
                }
                let findCompany = await eventOrganiser.findOne({ shortName, orgName });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'EventOrganiser already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.logo = req.file.path
                        } else {
                                return res.status(201).json({ message: "Logo require", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "EventOrganiser found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "EventOrganiser not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventOrganiser" });
        }
};
exports.updateEventOrganiser = async (req, res) => {
        try {
                const { shortName, orgName, address, contactPerson, contactPersonNo, alternateAddress, isPublished, contactEmail, contactFax, } = req.body;
                const eventOrganiserId = req.params.eventOrganiserId;
                const findData = await eventOrganiser.findById(eventOrganiserId);
                if (!findData) {
                        return res.status(201).json({ message: "EventOrganiser not Found", status: 404, data: {}, });
                }
                let findCompany = await eventOrganiser.findOne({ _id: { $ne: findData._id }, shortName, orgName, });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'EventOrganiser already Exit', data: findCategory });
                } else {
                        let logo;
                        if (req.file) {
                                logo = req.file.path
                        } else {
                                logo = findData.logo
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
                        }
                        const newCategory = await eventOrganiser.findByIdAndUpdate({ _id: findData._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: 'EventOrganiser update successfully', data: newCategory });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to create EventOrganiser' });
        }
};
exports.deleteEventOrganiser = async (req, res) => {
        try {
                const eventOrganiserId = req.params.id;
                const user = await eventOrganiser.findById(eventOrganiserId);
                if (user) {
                        const user1 = await eventOrganiser.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "EventOrganiser delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "EventOrganiser not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventOrganiser" });
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
                        return res.status(409).json({ status: 409, message: 'Event already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.mobileAppIcon = req.file.path
                        } else {
                                return res.status(201).json({ message: "Mobile App Icon require", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Event found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Event not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Event not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Event delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Event not Found", status: 404, data: {}, });
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
                        return res.status(409).json({ status: 409, message: 'Event Session already successfully', data: findCategory });
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
                        return res.status(201).json({ message: "Event Session found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Event Session not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Event Session not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Event Session delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Event Session not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Provide require fields  eventId, abstractPaperTitle, isPublished", status: 404, data: {}, });
                }
                const findEventOrganiser = await event.findById({ _id: eventId });
                if (!findEventOrganiser) {
                        return res.status(404).json({ status: 404, message: 'event not found' });
                }
                let findCompany = await paper.findOne({ eventId, abstractPaperTitle });
                if (findCompany) {
                        return res.status(409).json({ status: 409, message: 'Paper already successfully', data: findCategory });
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
                        return res.status(201).json({ message: "Paper found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Paper not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Paper not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Paper delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Paper not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Provide require fields  eventId, speakerName", status: 404, data: {}, });
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
                        return res.status(409).json({ status: 409, message: 'Speaker already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                return res.status(201).json({ message: "ProfilePic require", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Speaker found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Speaker not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Event not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Speaker delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Speaker not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Provide require fields  eventId, sponserType, sponserNam,esponserCountryId, sponserCityId, pinCode", status: 404, data: {}, });
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
                        return res.status(409).json({ status: 409, message: 'Sponser already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.sponserLogo = req.file.path
                        } else {
                                return res.status(201).json({ message: "Sponser Logo require", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Sponser found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Sponser not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Sponser not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Sponser delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Sponser not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Provide require fields  eventId, exhibitorName, exhibitorCountryId, exhibitorCityId", status: 404, data: {}, });
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
                        return res.status(409).json({ status: 409, message: 'Exhibitor already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.exhibitorLogo = req.file.path
                        } else {
                                return res.status(201).json({ message: "Exhibitor Logo Icon require", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Exhibitor found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Exhibitor not Found", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "Exhibitor not Found", status: 404, data: {}, });
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
                                return res.status(201).json({ message: "Exhibitor delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Exhibitor not Found", status: 404, data: {}, });
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
                        return res.status(409).json({ status: 409, message: 'EventSchedule already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.smallIcon = req.file.path
                        } else {
                                return res.status(201).json({ message: "Event Schedule Logo Icon require", status: 404, data: {}, });
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
                        return res.status(201).json({ message: "EventSchedule found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "EventSchedule not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve EventSchedule" });
        }
};
exports.updateEventSchedule = async (req, res) => {
        try {
                const { eventId, eventSessionId, programTitle, programDescription, programDate, programFromTime, programToTime, isShowTime, speaker1, speaker2, speaker3, speaker4, speaker5, sponser1, sponser2, showInOrder, smallIcon, programWebUrl, isPublished } = req.body;
                const eventScheduleId = req.params.eventScheduleId;
                const findData = await eventSchedule.findById(eventScheduleId); if (!findData) { return res.status(201).json({ message: "EventSchedule not Found", status: 404, data: {}, }); }
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
                                return res.status(201).json({ message: "EventSchedule delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "EventSchedule not Found", status: 404, data: {}, });
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
                        return res.status(409).json({ status: 409, message: 'Delegate already successfully', data: findCategory });
                } else {
                        if (req.file) {
                                req.body.profilePic = req.file.path
                        } else {
                                return res.status(201).json({ message: "Profile Pic require", status: 404, data: {}, });
                        }
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
                        return res.status(201).json({ message: "Delegate found successfully", status: 200, data: user, });
                }
                return res.status(201).json({ message: "Delegate not Found", status: 404, data: {}, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Delegate" });
        }
};
exports.deleteDelegate = async (req, res) => {
        try {
                const exhibitorId = req.params.id;
                const user = await delegate.findById(exhibitorId);
                if (user) {
                        const user1 = await delegate.findByIdAndDelete({ _id: user._id });;
                        if (user1) {
                                return res.status(201).json({ message: "Delegate delete successfully.", status: 200, data: {}, });
                        }
                } else {
                        return res.status(201).json({ message: "Delegate not Found", status: 404, data: {}, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Failed to retrieve Delegate" });
        }
};
exports.getAllDelegate = async (req, res) => {
        try {
                const categories = await delegate.find();
                if (categories.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Delegate found successfully', data: categories });
                } else {
                        return res.status(404).json({ status: 404, message: 'Delegate not found.', data: categories });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to fetch Delegate' });
        }
};