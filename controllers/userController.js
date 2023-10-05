const bcrypt = require('bcryptjs');
const advertisement = require('../model/Advertisement/advertisement');
const banner = require('../model/Banner/banner');
const company = require('../model/company/company');
const CompanyCategory = require('../model/company/companyCategoryModel');
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
const feedbackParameter = require('../model/FeedbackParameter/feedbackParameter');
const Faq = require("../model/FAQ/faq.Model");
const feedback = require("../model/Feedback/feedback");
const helpline = require('../model/Helpline/helpline');
const appHelpline = require('../model/Helpline/appHelpline');
const meeting = require('../model/Meeting/meeting');
const nearByInterestType = require('../model/NearByPlaceAndInterest/nearByInterestType');
const nearByPlaceAndInterest = require('../model/NearByPlaceAndInterest/nearByPlaceAndInterest');
const paper = require('../model/Speaker/paper');
const speaker = require('../model/Speaker/speaker');
const sponser = require('../model/Sponser/sponser');
const uploadAlbum = require('../model/UploadAlbum/uploadAlbum');
const Location = require('../model/locationModel');
const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
var newOTP = require("otp-generators");
const authConfig = require("../configs/auth.config");

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
            // var transporter = nodemailer.createTransport({
            //         service: 'gmail',
            //         auth: {
            //                 "user": "",
            //                 "pass": ""
            //         }
            // });
            // let mailOptions;
            // mailOptions = {
            //         from: '',
            //         to: req.body.email,
            //         subject: 'Forget password verification',
            //         text: `Your Account Verification Code is ${otp}`,
            // };
            // let info = await transporter.sendMail(mailOptions);
            // if (info) {
            let accountVerification = false;
            let otpExpiration = new Date(Date.now() + 5 * 60 * 1000);
            const updated = await User.findOneAndUpdate({ _id: data._id }, { $set: { accountVerification: accountVerification, otp: otp, otpExpiration: otpExpiration } }, { new: true, });
            if (updated) {
                return res.status(200).json({ message: "Otp send to your email.", status: 200, data: updated });
            }
            // } else {
            //    return     res.status(200).json({ message: "Otp not send on your mail please check.", status: 200, data: {} });
            // }
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
            return res.status(201).json({ status: 200, message: 'User update successfully', data: newUser });
        }
        return res.status(201).json({ message: "user not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
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
        const user = await User.findById(userId);
        if (user) {
            return res.status(201).json({ message: "user Found", status: 200, data: user, });
        }
        return res.status(201).json({ message: "user not Found", status: 404, data: {}, });
    } catch (error) {
        console.error(error);
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