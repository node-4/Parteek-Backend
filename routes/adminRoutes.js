const express = require('express');
const auth = require('../controllers/adminController');
const authJwt = require("../middlewares/authJwt");
module.exports = (app) => {
        app.post('/api/v1/company-categories', auth.createCompanyCategory);                                                    // add
        app.get("/api/v1/company-categories/:id", authJwt.verifyToken, auth.getCompanyCategoryById);                           // view
        app.put("/api/v1/company-categories/update/:id", authJwt.verifyToken, auth.updateCompanyCategory);                     // edit
        app.delete("/api/v1/company-categories/:id", authJwt.verifyToken, auth.deleteCompanyCategory);                         // delete
        app.get('/api/v1/company-categories', auth.getAllCompanyCategories);                                                   // all
        app.post('/api/v1/location', authJwt.verifyToken, auth.createLocation);                                                // add
        app.get('/api/v1/location/:locationId', auth.getLocationById);                                                         // view
        app.put('/api/v1/locations/:locationId', authJwt.verifyToken, auth.updateLocation);                                    // edit
        app.get('/api/v1/getAllLocationCountry', authJwt.verifyToken, auth.getAllLocationCountry);                             // all Country
        app.get('/api/v1/getAllLocationState/:country', auth.getAllLocationState);                                             // all State
        app.get('/api/v1/getAllLocationCityByCountry/:country', auth.getAllLocationCityByCountry);                             // all city
        app.get('/api/v1/getAllLocationCityByState/:state', auth.getAllLocationCityByState);                                   // all city
        app.post('/api/v1/Company', authJwt.verifyToken, auth.createCompany);                                                  // add Company
        app.get('/api/v1/Company/:companyId', auth.getCompanyById);                                                            // view Company
        app.put('/api/v1/Company/:companyId', auth.updateCompany);                                                             // view Company
        app.delete("/api/v1/Company/:id", authJwt.verifyToken, auth.deleteCompany);                                            // delete Company
        app.get('/api/v1/Company', auth.getAllCompany);                                                                        // all Company
        app.post('/api/v1/EventCategory', authJwt.verifyToken, auth.createEventCategory);                                      // add EventCategory
        app.get('/api/v1/EventCategory/:id', auth.getEventCategoryById);                                          // view EventCategory
        app.put('/api/v1/EventCategory/:id', auth.updateEventCategory);                                           // view EventCategory
        app.delete("/api/v1/EventCategory/:id", authJwt.verifyToken, auth.deleteEventCategory);                                // delete EventCategory
        app.get('/api/v1/EventCategory', auth.getAllEventCategories);                                                          // all EventCategory

}
