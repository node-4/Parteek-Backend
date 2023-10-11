const express = require('express');
const auth = require('../controllers/userController');
const authJwt = require("../middlewares/authJwt");
const { productUpload, upload, bannerUpload, blogUpload, gallaryUpload, NutritionUpload, ProductTypeUpload, SkinConditionUpload, SkinTypeUpload, aboutusUpload, subCategoryUpload, categoryUpload, userProfileUpload, serviceUpload, BrandUpload, E4UUpload, offerUpload } = require('../middlewares/imageUpload')

module.exports = (app) => {
        app.post("/api/v1/auth/loginGuestUser", auth.loginGuestUser);
        app.post("/api/v1/auth/login", auth.login);
        app.post("/api/v1/auth/forgetPassword", auth.forgetPassword);
        app.post("/api/v1/auth/changePassword/:id", auth.changePassword);
        app.post("/api/v1/auth/changePasswordAfterLogin/:id", auth.changePasswordAfterLogin);
        app.post("/api/v1/auth/register", authJwt.verifyToken, auth.createUser);
        app.get("/api/v1/auth/users", authJwt.verifyToken, auth.getAllUsers);
        app.get("/api/v1/users/:id", auth.getUserById);
        app.put("/api/v1/users/update/:id", upload.single('image'), authJwt.verifyToken, auth.update);
        app.delete("/api/v1/users/:id", authJwt.verifyToken, auth.deleteUser);
        app.post("/api/v1/auth/giveFeedback", authJwt.verifyToken, auth.giveFeedback);
        app.get("/api/v1/auth/myFeedback", authJwt.verifyToken, auth.myFeedback);
        app.post("/api/v1/auth/createApointmentforuser", authJwt.verifyToken, auth.createApointmentforuser);
        app.put("/api/v1/auth/approveRejectAppointment/:id", authJwt.verifyToken, auth.approveRejectAppointment);
        app.post("/api/v1/auth/createApointmentforDelegate", auth.createApointmentforDelegate);
        app.get("/api/v1/auth/getUserRecivedAppointment/:id", auth.getUserRecivedAppointment);
        app.get("/api/v1/auth/getUserSentAppointment/:id", auth.getUserSentAppointment);
        app.get("/api/v1/auth/getDelegateRecivedAppointment/:id", auth.getDelegateRecivedAppointment);
        app.get("/api/v1/auth/getDelegateSentAppointment/:id", auth.getDelegateSentAppointment);
        app.post("/api/v1/auth/createRemainder", auth.createRemainder);
        app.get("/api/v1/auth/searchApi", auth.searchApi);

}
