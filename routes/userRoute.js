const express = require('express');
const auth = require('../controllers/userController');
const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
        app.post("/api/v1/auth/login", auth.login);
        app.post("/api/v1/auth/forgetPassword", auth.forgetPassword);
        app.post("/api/v1/auth/register", authJwt.verifyToken, auth.createUser);
        app.get("/api/v1/auth/users", authJwt.verifyToken, auth.getAllUsers);
        app.get("/api/v1/users/:id", authJwt.verifyToken, auth.getUserById);
        app.put("/api/v1/users/update/:id", authJwt.verifyToken, auth.update);
        app.delete("/api/v1/users/:id", authJwt.verifyToken, auth.deleteUser);
}
