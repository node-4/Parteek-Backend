const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var newOTP = require("otp-generators");
const User = require('../model/userModel');
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
            return res.status(401).json({ error: 'Invalid email or password' });
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
                return res.status(200).json({ message: "Otp send to your email.", status: 200, data: updated._id });
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
        const { typeofMember, username, email, password, mobile } = req.body;
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
            const existingUser = await User.findOne({ _id: { $ne: user._id }, username });
            if (existingUser) {
                return res.status(400).json({ status: 400, message: "User name already exists" });
            }
            const existingEmail = await User.findOne({ _id: { $ne: user._id }, email });
            if (existingEmail) {
                return res.status(400).json({ status: 400, message: "Email already exists" });
            }
            const existingMobile = await User.findOne({ _id: { $ne: user._id }, mobile });
            if (existingMobile) {
                return res.status(400).json({ status: 400, message: "Mobile already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.findByIdAndUpdate({ _id: user._id }, { $set: { typeofMember, username, email, password: hashedPassword, mobile } }, { new: true });
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