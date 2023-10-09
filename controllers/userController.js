const bcrypt = require('bcryptjs');
const advertisement = require('../model/Advertisement/advertisement');
const banner = require('../model/Banner/banner');
const company = require('../model/company/company');
const CompanyCategory = require('../model/company/companyCategoryModel');
const dgDesk = require('../model/dgDesk/dgDesk');
const eventCategory = require('../model/Event/1eventCategory');
const eventOrganiser = require('../model/Event/2eventOrganiser');
const event = require('../model/Event/3Event');
const eventSession = require('../model/Event/4EventSession');
const locationFact = require('../model/EventLocationFacts/locationFact');
const locationFactsBanners = require('../model/EventLocationFacts/locationFactsBanners')
const eventSchedule = require('../model/EventSchedule/eventSchedule');
const exhibitor = require('../model/Exhibitor/Exhibitor');
const feedbackParameter = require('../model/FeedbackParameter/feedbackParameter');
const Faq = require("../model/FAQ/faq.Model");
const feedback = require("../model/Feedback/feedback");
const helpline = require('../model/Helpline/helpline');
const appHelpline = require('../model/Helpline/appHelpline');
const meeting = require('../model/Meeting/meeting');
const nearByInterestType = require('../model/NearByPlaceAndInterest/nearByInterestType');
const nearByPlaceAndInterest = require('../model/NearByPlaceAndInterest/nearByPlaceAndInterest');
const paper = require('../model/Speaker/paper');
const uploadAlbum = require('../model/UploadAlbum/uploadAlbum');
const Location = require('../model/locationModel');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
var newOTP = require("otp-generators");
const authConfig = require("../configs/auth.config");
const appointment = require('../model/Appointment/appointment');
const remainder = require('../model/remainder');
const nodemailer = require("nodemailer");
exports.login = async (req, res) => {
    try {
        const { email, password, typeofMember } = req.body;
        const user = await User.findOne({ email, typeofMember });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ status: 401, message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, authConfig.secret, { expiresIn: '365d' });
        const obj = { ID: user._id, Mobile: user.mobile, Token: token }
        return res.status(200).json({ status: 200, message: "Login sucessfully", data: obj });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.forgetPassword = async (req, res) => {
    try {
        const data = await User.findOne({ email: req.body.email, typeofMember: req.body.typeofMember });
        if (!data) {
            return res.status(400).send({ msg: "not found" });
        } else {
            let otp = newOTP.generate(4, { alphabets: false, upperCase: false, specialChar: false, });
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: "magnus88@ethereal.email",
                    pass: "e4xYPwuaUbX2u4Qjyy",
                },
            });
            // const transporter = nodemailer.createTransport({
            //     service: "Faidelhi.mithiskyconnect.com",
            //     host: 'faidelhi.org',
            //     secure: true,
            //     port: 465,
            //     auth: {
            //         user: "secy@faidelhi.org",
            //         pass: "SeCyF^ih0$",
            //     },
            // });
            let mailOptions;
            mailOptions = {
                from: 'secy@faidelhi.org',
                to: req.body.email,
                subject: 'Forget password verification',
                text: `Your Account Verification Code is ${otp}`,
            };
            console.log(mailOptions);
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(200).json({ message: "Otp not send on your mail please check.", status: 200, data: {} });
                } else {
                    let accountVerification = false;
                    let otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
                    const updated = await User.findOneAndUpdate({ _id: data._id }, { $set: { accountVerification: accountVerification, otp: otp, otpExpiration: otpExpiration } }, { new: true, });
                    if (updated) {
                        return res.status(200).json({ message: "Otp send to your email.", status: 200, data: updated });
                    }
                }
            });
        }
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ msg: "internal server error", error: err.message, });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { otp, newPassword, confirmPassword } = req.body;
        const user = await User.findOne({ _id: req.params.id });
        if (user) {
            if (user.otp !== otp || user.otpExpiration < Date.now()) {
                return res.status(400).json({ status: 400, message: "Invalid OTP" });
            }
            if (newPassword == confirmPassword) {
                const updated = await User.findOneAndUpdate({ _id: user._id }, { $set: { password: bcrypt.hashSync(req.body.newPassword), accountVerification: true } }, { new: true });
                return res.status(200).send({ status: 200, message: "Password update successfully.", data: updated, });
            } else {
                return res.status(201).send({ status: 201, message: "Password Not matched.", data: {}, });
            }
        } else {
            return res.status(404).json({ status: 404, message: "No data found", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
};
exports.createUser = async (req, res) => {
    try {
        const { typeofMember, username, email, password, mobile } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ status: 400, message: "User name already exists" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ status: 400, message: "Email already exists" });
        }
        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({ status: 400, message: "Mobile already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ typeofMember, username, email, password: hashedPassword, mobile });
        await newUser.save();
        return res.status(201).json({ status: 200, message: 'User registered successfully', data: newUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.changePasswordAfterLogin = async (req, res) => {
    try {
        const { password, newPassword, confirmPassword } = req.body;
        const user = await User.findOne({ _id: req.params.id });
        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ status: 401, message: 'old password not matched' });
            }
            if (newPassword == confirmPassword) {
                const updated = await User.findOneAndUpdate({ _id: user._id }, { $set: { password: bcrypt.hashSync(req.body.newPassword) } }, { new: true });
                return res.status(200).send({ status: 200, message: "Password update successfully.", data: updated, });
            } else {
                return res.status(201).send({ status: 201, message: "Password Not matched.", data: {}, });
            }
        } else {
            return res.status(404).json({ status: 404, message: "No data found", data: {} });
        }
    } catch (error) {
        console.log(error);
        return res.status(501).send({ status: 501, message: "server error.", data: {}, });
    }
};
exports.update = async (req, res) => {
    try {
        const { typeofMember, username, email, password, mobile, designation, address1, address2, countryId, cityId, bio, pinCode, showEmail, showContact, openForAppointment } = req.body;
        const userId = req.params.id;
        let hashedPassword;
        const user = await User.findById(userId);
        if (user) {
            const existingUser = await User.findOne({ _id: { $ne: user._id }, username });
            if (existingUser) { return res.status(400).json({ status: 400, message: "User name already exists" }); }
            const existingEmail = await User.findOne({ _id: { $ne: user._id }, email });
            if (existingEmail) { return res.status(400).json({ status: 400, message: "Email already exists" }); }
            const existingMobile = await User.findOne({ _id: { $ne: user._id }, mobile });
            if (existingMobile) { return res.status(400).json({ status: 400, message: "Mobile already exists" }); }
            if (countryId) { const findCompany = await Location.findById(countryId); if (!findCompany) { return res.status(404).json({ status: 404, message: 'Country not found' }); } }
            if (cityId) { const findEventCategoryId = await Location.findById(cityId); if (!findEventCategoryId) { return res.status(404).json({ status: 404, message: 'City not found' }); } }
            if (password) { hashedPassword = await bcrypt.hash(password, 10); }
            if (req.file) {
                req.body.profilePic = req.file.path;
            }
            let obj = {
                typeofMember: typeofMember || user.typeofMember,
                username: username || user.username,
                email: email || user.email,
                password: hashedPassword || user.password,
                mobile: mobile || user.mobile,
                designation: designation || user.designation,
                address1: address1 || user.address1,
                address2: address2 || user.address2,
                countryId: countryId || user.countryId,
                cityId: cityId || user.cityId,
                profilePic: req.body.profilePic || user.profilePic,
                bio: bio || user.bio,
                pinCode: pinCode || user.pinCode,
                showEmail: showEmail || user.showEmail,
                showContact: showContact || user.showContact,
                openForAppointment: openForAppointment || user.openForAppointment,
            }
            const newUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: obj }, { new: true });
            return res.status(200).json({ status: 200, message: 'User update successfully', data: newUser });
        }
        return res.status(404).json({ message: "user not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');
        if (users.length > 0) {
            return res.status(201).json({ message: "users Found", status: 200, data: users, });
        }
        return res.status(201).json({ message: "users not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve users" });
    }
};
exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate('countryId cityId eventId companyId delegateCategoryId speakerAbstractId eventId sponserCountryId sponserCityId');;
        if (user) {
            return res.status(200).json({ message: "user Found", status: 200, data: user, });
        }
        return res.status(404).json({ message: "user not Found", status: 404, data: {}, });
    } catch (error) {
        return res.status(500).json({ error: "Failed to retrieve users" });
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
            const user1 = await User.findByIdAndDelete({ _id: user._id });;
            if (user1) {
                return res.status(201).json({ message: "user delete successfully.", status: 200, data: {}, });
            }
        } else {
            return res.status(201).json({ message: "user not Found", status: 404, data: {}, });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve users" });
    }
};
exports.giveFeedback = async (req, res) => {
    const { type, message, rating } = req.body;
    try {
        if (!type && !message || !rating) {
            return res.status(400).json({ message: "type and  message cannot be blank " });
        }
        let findFeedback = await feedback.findOne({ type: type });
        if (findFeedback) {
            if (findFeedback.rating.length == 0) {
                const review = {
                    user: req.user._id,
                    message: message,
                    rating: rating
                };
                findFeedback.rating.push(review);
            } else {
                const review = {
                    user: req.user._id,
                    message: message,
                    rating: rating
                };
                findFeedback.rating.push(review);
            }
            let avg = 0;
            findFeedback.rating.forEach((rev) => { avg += rev.rating; });
            findFeedback.averageRating = avg / findFeedback.rating.length;
            await findFeedback.save({ validateBeforeSave: false })
            return res.status(200).json({ status: 200, data: findFeedback });
        } else {
            let obj = { type: type, rating: [{ user: req.user._id, message: message, rating: rating, }], averageRating: rating, }
            const addDeedback = await feedback.create(obj);
            return res.status(200).json({ status: 200, message: "Feedback Added Successfully ", data: addDeedback });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error ", status: 500, data: err.message });
    }
};
exports.createApointmentforuser = async (req, res) => {
    try {
        const { delegateId, date, time, venue, note } = req.body;
        if (!delegateId && !date && !time) {
            return res.status(400).json({ message: "Provide all required fields: delegateId, date, time", status: 400, data: {} });
        }
        let userId = req.user._id;
        let findCompany = await appointment.findOne({ delegateId, date, time, userId });
        if (findCompany) {
            return res.status(409).json({ status: 409, message: 'EventOrganiser already exists', data: {} });
        } else {
            req.body.userId = req.user._id;
            req.body.userRecivedSent = "Sent";
            req.body.delegateRecivedSent = "Recived";
            const newCategory = await appointment.create(req.body);
            return res.status(200).json({ status: 200, message: 'EventOrganiser created successfully', data: newCategory });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create eventOrganiser' });
    }
};
exports.createApointmentforDelegate = async (req, res) => {
    try {
        const { userId, delegateId, date, time, venue, note } = req.body;
        if (!delegateId && !userId && !date && !time) {
            return res.status(400).json({ message: "Provide all required fields: delegateId, date, time", status: 400, data: {} });
        }
        let findCompany = await appointment.findOne({ delegateId, date, time, userId });
        if (findCompany) {
            return res.status(409).json({ status: 409, message: 'EventOrganiser already exists', data: {} });
        } else {
            req.body.userRecivedSent = "Recived";
            req.body.delegateRecivedSent = "Sent";
            const newCategory = await appointment.create(req.body);
            return res.status(200).json({ status: 200, message: 'EventOrganiser created successfully', data: newCategory });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create eventOrganiser' });
    }
};
exports.getUserRecivedAppointment = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await appointment.findOne({ userId: userId, userRecivedSent: "Recived" });
        if (user) {
            return res.status(201).json({ message: "Get Recived Appointment", status: 200, data: user, });
        }
        return res.status(201).json({ message: "Get Recived Appointment not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve Get Recived Appointment" });
    }
};
exports.getUserSentAppointment = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await appointment.findOne({ userId: userId, userRecivedSent: "Sent" });
        if (user) {
            return res.status(201).json({ message: "Get Send Appointment", status: 200, data: user, });
        }
        return res.status(201).json({ message: "Get Send Appointment not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve Get Send Appointment" });
    }
};
exports.getDelegateRecivedAppointment = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await appointment.findOne({ delegateId: userId, delegateRecivedSent: "Recived" });
        if (user) {
            return res.status(201).json({ message: "Get Recived Appointment", status: 200, data: user, });
        }
        return res.status(201).json({ message: "Get Recived Appointment not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve Get Recived Appointment" });
    }
};
exports.getDelegateSentAppointment = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await appointment.findOne({ delegateId: userId, delegateRecivedSent: "Sent" });
        if (user) {
            return res.status(201).json({ message: "Get Send Appointment", status: 200, data: user, });
        }
        return res.status(201).json({ message: "Get Send Appointment not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to retrieve Get Send Appointment" });
    }
};
exports.loginGuestUser = async (req, res) => {
    try {
        const { username, email, mobile } = req.body;
        const existingUser = await User.findOne({ username, mobile, email, userType: "GUEST" });
        if (existingUser) {
            const token = jwt.sign({ userId: existingUser._id }, authConfig.secret, { expiresIn: '365d' });
            const obj = { ID: existingUser._id, Mobile: existingUser.mobile, Token: token }
            return res.status(200).json({ status: 200, message: "Login sucessfully", data: obj });
        }
        const newUser = await User.create({ username, mobile, email, userType: "GUEST", });
        const token = jwt.sign({ userId: newUser._id }, authConfig.secret, { expiresIn: '365d' });
        const obj = { ID: newUser._id, Mobile: newUser.mobile, Token: token }
        return res.status(200).json({ status: 200, message: "Login sucessfully", data: obj });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createRemainder = async (req, res) => {
    try {
        const { eventId, userId } = req.body;
        let findCompany = await remainder.findOne({ eventId, userId });
        if (findCompany) {
            return res.status(409).json({ status: 409, message: 'remainder already exists', data: {} });
        } else {
            const newCategory = await remainder.create(req.body);
            return res.status(200).json({ status: 200, message: 'remainder created successfully', data: newCategory });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create remainder' });
    }
};
exports.searchApi = async (req, res) => {
    try {
        const { search, fromDate, toDate, page, limit } = req.query;
        let query = {};
        if (search) {
            query.$or = [
                { "firstName": { $regex: req.query.search, $options: "i" }, },
                { "middleName": { $regex: req.query.search, $options: "i" }, },
                { "lastName": { $regex: req.query.search, $options: "i" }, },
                { "username": { $regex: req.query.search, $options: "i" }, },
                { "email": { $regex: req.query.search, $options: "i" }, },
                { "otherEmail": { $regex: req.query.search, $options: "i" }, },
                { "speakerTitle": { $regex: req.query.search, $options: "i" }, },
                { "speakerName": { $regex: req.query.search, $options: "i" }, },
                { "delegateTitle": { $regex: req.query.search, $options: "i" }, },
                { "sponserName": { $regex: req.query.search, $options: "i" }, },
                { "sponserShortname": { $regex: req.query.search, $options: "i" }, },
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
        let data = await User.paginate(query, options);
        if (data.docs.length > 0) {
            return res.status(200).json({ status: 200, message: 'Data found successfully', data: data });
        } else {
            return res.status(404).json({ status: 404, message: 'Delegate not found.', data: [] });
        }

    } catch (err) {
        return res.status(500).send({ msg: "internal server error ", error: err.message, });
    }
};