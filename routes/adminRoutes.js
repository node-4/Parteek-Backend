const express = require('express');
const auth = require('../controllers/adminController');
const authJwt = require("../middlewares/authJwt");
const { productUpload, upload, bannerUpload, blogUpload, gallaryUpload, NutritionUpload, ProductTypeUpload, SkinConditionUpload, SkinTypeUpload, aboutusUpload, subCategoryUpload, categoryUpload, userProfileUpload, serviceUpload, BrandUpload, E4UUpload, offerUpload } = require('../middlewares/imageUpload')
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
        app.put('/api/v1/Company/:companyId', auth.updateCompany);                                                             // edit Company
        app.delete("/api/v1/Company/:id", authJwt.verifyToken, auth.deleteCompany);                                            // delete Company
        app.get('/api/v1/Company', auth.getAllCompany);                                                                        // all Company
        app.post('/api/v1/EventCategory', authJwt.verifyToken, auth.createEventCategory);                                      // add EventCategory
        app.get('/api/v1/EventCategory/:id', auth.getEventCategoryById);                                                       // view EventCategory
        app.put('/api/v1/EventCategory/:id', auth.updateEventCategory);                                                        // edit EventCategory
        app.delete("/api/v1/EventCategory/:id", authJwt.verifyToken, auth.deleteEventCategory);                                // delete EventCategory
        app.get('/api/v1/EventCategory', auth.getAllEventCategories);                                                          // all EventCategory
        app.post('/api/v1/EventOrganiser', upload.single('image'), authJwt.verifyToken, auth.createEventOrganiser);            // add EventOrganiser
        app.get('/api/v1/EventOrganiser/:eventOrganiserId', auth.getEventOrganiserById);                                       // view EventOrganiser
        app.put('/api/v1/EventOrganiser/:eventOrganiserId', upload.single('image'), auth.updateEventOrganiser);                // edit EventOrganiser
        app.delete("/api/v1/EventOrganiser/:id", authJwt.verifyToken, auth.deleteEventOrganiser);                              // delete EventOrganiser
        app.get('/api/v1/EventOrganiser', auth.getAllEventOrganiser);                                                          // all EventOrganiser
        app.post('/api/v1/Event', upload.single('image'), authJwt.verifyToken, auth.createEvent);                              // add Event
        app.get('/api/v1/Event/:eventId', auth.getEventById);                                                                  // view Event
        app.put('/api/v1/Event/:eventId', upload.single('image'), auth.updateEvent);                                           // edit Event
        app.delete("/api/v1/Event/:id", authJwt.verifyToken, auth.deleteEvent);                                                // delete Event
        app.get('/api/v1/Event', auth.getAllEvent);                                                                            // all Event
        app.post('/api/v1/EventSession', authJwt.verifyToken, auth.createEventSession);                                        // add Event Session
        app.get('/api/v1/EventSession/:eventSessionId', auth.getEventSessionById);                                             // view Event Session
        app.put('/api/v1/EventSession/:eventSessionId', auth.updateEventSession);                                              // edit Event Session
        app.delete("/api/v1/EventSession/:id", authJwt.verifyToken, auth.deleteEventSession);                                  // delete Event Session
        app.get('/api/v1/EventSession', auth.getAllEventSession);                                                              // all Event Session
        app.post('/api/v1/Paper', authJwt.verifyToken, auth.createPaper);                                                      // add Paper
        app.get('/api/v1/Paper/:paperId', auth.getPaperById);                                                                  // view Paper
        app.put('/api/v1/Paper/:paperId', auth.updatePaper);                                                                   // edit Paper
        app.delete("/api/v1/Paper/:id", authJwt.verifyToken, auth.deletePaper);                                                // delete Paper
        app.get('/api/v1/Paper', auth.getAllPaper);                                                                            // all Paper
        app.post('/api/v1/Speaker', upload.single('image'), authJwt.verifyToken, auth.createSpeaker);                          // add Speaker
        app.get('/api/v1/Speaker/:speakerId', auth.getSpeakerById);                                                            // view Speaker
        app.put('/api/v1/Speaker/:speakerId', upload.single('image'), authJwt.verifyToken, auth.updateSpeaker);                // edit Speaker
        app.delete("/api/v1/Speaker/:id", authJwt.verifyToken, auth.deleteSpeaker);                                            // delete Speaker
        app.get('/api/v1/Speaker', auth.getAllSpeaker);                                                                        // all Speaker
        app.post('/api/v1/Sponser', upload.single('image'), authJwt.verifyToken, auth.createSponser);                          // add Sponser
        app.get('/api/v1/Sponser/:sponserId', auth.getSponserById);                                                            // view Sponser
        app.put('/api/v1/Sponser/:sponserId', upload.single('image'), authJwt.verifyToken, auth.updateSponser);                // edit Sponser
        app.delete("/api/v1/Sponser/:id", authJwt.verifyToken, auth.deleteSponser);                                            // delete Sponser
        app.get('/api/v1/Sponser', auth.getAllSponser);                                                                        // all Sponser
        app.post('/api/v1/Exhibitor', upload.single('image'), authJwt.verifyToken, auth.createExhibitor);                      // add Exhibitor
        app.get('/api/v1/Exhibitor/:exhibitorId', auth.getExhibitorById);                                                      // view Exhibitor
        app.put('/api/v1/Exhibitor/:exhibitorId', upload.single('image'), authJwt.verifyToken, auth.updateExhibitor);          // edit Exhibitor
        app.delete("/api/v1/Exhibitor/:id", authJwt.verifyToken, auth.deleteExhibitor);                                        // delete Exhibitor
        app.get('/api/v1/Exhibitor', auth.getAllExhibitor);                                                                    // all Exhibitor
        app.post('/api/v1/EventSchedule', upload.single('image'), authJwt.verifyToken, auth.createEventSchedule);                      // add EventSchedule
        app.get('/api/v1/EventSchedule/:eventScheduleId', auth.getEventScheduleById);                                                      // view EventSchedule
        app.put('/api/v1/EventSchedule/:eventScheduleId', upload.single('image'), authJwt.verifyToken, auth.updateEventSchedule);          // edit EventSchedule
        app.delete("/api/v1/EventSchedule/:id", authJwt.verifyToken, auth.deleteEventSchedule);                                        // delete EventSchedule
        app.get('/api/v1/EventSchedule', auth.getAllEventSchedule);                                                            // all Exhibitor

        app.post('/api/v1/Delegate', upload.single('image'), authJwt.verifyToken, auth.createDelegate);                    // add Delegate
        app.get('/api/v1/Delegate/:delegateId', auth.getDelegateById);                                                      // view Delegate
        app.delete("/api/v1/Delegate/:id", authJwt.verifyToken, auth.deleteDelegate);                                        // delete Delegate
        app.get('/api/v1/Delegate', auth.getAllDelegate);                                                                  // all Delegate
}
