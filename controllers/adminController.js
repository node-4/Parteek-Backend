const company = require('../model/company');
const CompanyCategory = require('../model/companyCategoryModel');
const eventCategory = require('../model/Event/1eventCategory');
const eventOrganiser = require('../model/Event/2eventOrganiser');
const event = require('../model/Event/3Event');
const eventSession = require('../model/Event/4EventSession');
const Location = require('../model/locationModel');
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
exports.getCompanyById = async (req, res) => {
        try {
                const eventOrganiserId = req.params.eventOrganiserId;
                const user = await eventOrganiser.findById(eventOrganiserId).populate([{ path: 'countryId', select: 'locationName' }, { path: 'stateCityId', select: 'locationName' }, { path: 'companyCategoryId', select: 'categoryName currency seminarFee' }]);
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
                let findCompany = await eventOrganiser.findOne({ _id: { $ne: _id }, shortName, orgName, });
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