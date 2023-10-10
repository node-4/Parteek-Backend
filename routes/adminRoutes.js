const express = require('express');
const auth = require('../controllers/adminController');
const authJwt = require("../middlewares/authJwt");
const { productUpload, upload, bannerUpload, blogUpload, gallaryUpload, NutritionUpload, ProductTypeUpload, SkinConditionUpload, SkinTypeUpload, aboutusUpload, subCategoryUpload, categoryUpload, userProfileUpload, serviceUpload, BrandUpload, E4UUpload, offerUpload } = require('../middlewares/imageUpload')
module.exports = (app) => {
        app.post("/api/v1/admin/createAdmin", auth.createAdmin);
        app.post("/api/v1/admin/login", auth.login);
        app.post('/api/v1/company-categories', auth.createCompanyCategory);                                                      // add
        app.get("/api/v1/company-categories/:id", authJwt.verifyToken, auth.getCompanyCategoryById);                             // view
        app.put("/api/v1/company-categories/update/:id", authJwt.verifyToken, auth.updateCompanyCategory);                       // edit
        app.delete("/api/v1/company-categories/:id", authJwt.verifyToken, auth.deleteCompanyCategory);                           // delete
        app.get('/api/v1/company-categories', auth.getAllCompanyCategories);                                                     // all
        app.post('/api/v1/location', authJwt.verifyToken, auth.createLocation);                                                  // add
        app.get('/api/v1/location/:locationId', auth.getLocationById);                                                           // view
        app.put('/api/v1/locations/:locationId', authJwt.verifyToken, auth.updateLocation);                                      // edit
        app.get('/api/v1/getAllLocationCountry', authJwt.verifyToken, auth.getAllLocationCountry);                               // all Country
        app.get('/api/v1/getAllLocationState/:country', auth.getAllLocationStateByCountry);        // all State
        app.get('/api/v1/getAll/LocationState', auth.getAllLocationState);                                             // all State
        app.get('/api/v1/getAllLocationCityByCountry/:country', auth.getAllLocationCityByCountry);                               // all city
        app.get('/api/v1/getAllLocationCityByState/:state', auth.getAllLocationCityByState);                                     // all city
        app.get('/api/v1/getAllLocationCity', auth.getAllLocationCity);                                     // all city
        app.post('/api/v1/Company', authJwt.verifyToken, auth.createCompany);                                                    // add Company
        app.get('/api/v1/Company/:companyId', auth.getCompanyById);                                                              // view Company
        app.put('/api/v1/Company/:companyId', auth.updateCompany);                                                               // edit Company
        app.delete("/api/v1/Company/:id", authJwt.verifyToken, auth.deleteCompany);                                              // delete Company
        app.get('/api/v1/Company', auth.getAllCompany);                                                                          // all Company
        app.post('/api/v1/EventCategory', authJwt.verifyToken, auth.createEventCategory);                                        // add EventCategory
        app.get('/api/v1/EventCategory/:id', auth.getEventCategoryById);                                                         // view EventCategory
        app.put('/api/v1/EventCategory/:id', auth.updateEventCategory);                                                          // edit EventCategory
        app.delete("/api/v1/EventCategory/:id", authJwt.verifyToken, auth.deleteEventCategory);                                  // delete EventCategory
        app.get('/api/v1/EventCategory', auth.getAllEventCategories);                                                            // all EventCategory
        app.post('/api/v1/EventOrganiser', upload.single('image'), authJwt.verifyToken, auth.createEventOrganiser);              // add EventOrganiser
        app.get('/api/v1/EventOrganiser/:eventOrganiserId', auth.getEventOrganiserById);                                         // view EventOrganiser
        app.put('/api/v1/EventOrganiser/:eventOrganiserId', upload.single('image'), auth.updateEventOrganiser);                  // edit EventOrganiser
        app.delete("/api/v1/EventOrganiser/:id", authJwt.verifyToken, auth.deleteEventOrganiser);                                // delete EventOrganiser
        app.get('/api/v1/EventOrganiser', auth.getAllEventOrganiser);                                                            // all EventOrganiser
        app.post('/api/v1/Event', upload.single('image'), authJwt.verifyToken, auth.createEvent);                                // add Event
        app.get('/api/v1/Event/:eventId', auth.getEventById);                                                                    // view Event
        app.put('/api/v1/Event/:eventId', upload.single('image'), auth.updateEvent);                                             // edit Event
        app.delete("/api/v1/Event/:id", authJwt.verifyToken, auth.deleteEvent);                                                  // delete Event
        app.get('/api/v1/Event', auth.getAllEvent);                                                                              // all Event
        app.post('/api/v1/EventSession', authJwt.verifyToken, auth.createEventSession);                                          // add Event Session
        app.get('/api/v1/EventSession/:eventSessionId', auth.getEventSessionById);                                               // view Event Session
        app.put('/api/v1/EventSession/:eventSessionId', auth.updateEventSession);                                                // edit Event Session
        app.delete("/api/v1/EventSession/:id", authJwt.verifyToken, auth.deleteEventSession);                                    // delete Event Session
        app.get('/api/v1/EventSession', auth.getAllEventSession);                                                                // all Event Session
        app.post('/api/v1/Paper', authJwt.verifyToken, auth.createPaper);                                                        // add Paper
        app.get('/api/v1/Paper/:paperId', auth.getPaperById);                                                                    // view Paper
        app.put('/api/v1/Paper/:paperId', auth.updatePaper);                                                                     // edit Paper
        app.delete("/api/v1/Paper/:id", authJwt.verifyToken, auth.deletePaper);                                                  // delete Paper
        app.get('/api/v1/Paper', auth.getAllPaper);                                                                              // all Paper
        app.post('/api/v1/Speaker', upload.single('image'), authJwt.verifyToken, auth.createSpeaker);                            // add Speaker
        app.get('/api/v1/Speaker/:speakerId', auth.getSpeakerById);                                                              // view Speaker
        app.put('/api/v1/Speaker/:speakerId', upload.single('image'), authJwt.verifyToken, auth.updateSpeaker);                  // edit Speaker
        app.delete("/api/v1/Speaker/:id", authJwt.verifyToken, auth.deleteSpeaker);                                              // delete Speaker
        app.get('/api/v1/Speaker', auth.getAllSpeaker);                                                                          // all Speaker
        app.post('/api/v1/Sponser', upload.single('image'), authJwt.verifyToken, auth.createSponser);                            // add Sponser
        app.get('/api/v1/Sponser/:sponserId', auth.getSponserById);                                                              // view Sponser
        app.put('/api/v1/Sponser/:sponserId', upload.single('image'), authJwt.verifyToken, auth.updateSponser);                  // edit Sponser
        app.delete("/api/v1/Sponser/:id", authJwt.verifyToken, auth.deleteSponser);                                              // delete Sponser
        app.get('/api/v1/Sponser', auth.getAllSponser);                                                                          // all Sponser
        app.post('/api/v1/Exhibitor', upload.single('image'), authJwt.verifyToken, auth.createExhibitor);                        // add Exhibitor
        app.get('/api/v1/Exhibitor/:exhibitorId', auth.getExhibitorById);                                                        // view Exhibitor
        app.put('/api/v1/Exhibitor/:exhibitorId', upload.single('image'), authJwt.verifyToken, auth.updateExhibitor);            // edit Exhibitor
        app.delete("/api/v1/Exhibitor/:id", authJwt.verifyToken, auth.deleteExhibitor);                                          // delete Exhibitor
        app.get('/api/v1/Exhibitor', auth.getAllExhibitor);                                                                      // all Exhibitor
        app.post('/api/v1/EventSchedule', upload.single('image'), authJwt.verifyToken, auth.createEventSchedule);                // add EventSchedule
        app.get('/api/v1/EventSchedule/:eventScheduleId', auth.getEventScheduleById);                                            // view EventSchedule
        app.put('/api/v1/EventSchedule/:eventScheduleId', upload.single('image'), authJwt.verifyToken, auth.updateEventSchedule);// edit EventSchedule
        app.delete("/api/v1/EventSchedule/:id", authJwt.verifyToken, auth.deleteEventSchedule);                                  // delete EventSchedule
        app.get('/api/v1/EventSchedule', auth.getAllEventSchedule);                                                              // all Exhibitor
        app.post('/api/v1/Delegate', upload.single('image'), authJwt.verifyToken, auth.createDelegate);                          // add Delegate
        app.get('/api/v1/Delegate/:delegateId', auth.getDelegateById);                                                           // view Delegate
        app.put('/api/v1/Delegate/:delegateId', upload.single('image'), authJwt.verifyToken, auth.updateDelegate);               // edit Delegate
        app.delete("/api/v1/Delegate/:id", authJwt.verifyToken, auth.deleteDelegate);                                            // delete Delegate
        app.get('/api/v1/Delegate', auth.getAllDelegate);                                                                        // all Delegate
        app.get('/api/v1/getAllDelegateForApp', auth.getAllDelegateForApp);                                                                        // all Delegate
        app.post('/api/v1/Helpline', authJwt.verifyToken, auth.createHelpline);                                                  // add Helpline
        app.get('/api/v1/Helpline/:helplineId', auth.getHelplineById);                                                           // view Helpline
        app.put('/api/v1/Helpline/:helplineId', authJwt.verifyToken, auth.updateHelpline);                                       // edit Helpline
        app.delete("/api/v1/Helpline/:id", authJwt.verifyToken, auth.deleteHelpline);                                            // delete Helpline
        app.get('/api/v1/Helpline', auth.getAllHelpline);                                                                        // all Helpline
        app.post('/api/v1/FeedbackParameter', authJwt.verifyToken, auth.createFeedbackParameter);                                // add FeedbackParameter
        app.get('/api/v1/FeedbackParameter/:feedbackParameterId', auth.getFeedbackParameterById);                                // view FeedbackParameter
        app.put('/api/v1/FeedbackParameter/:feedbackParameterId', authJwt.verifyToken, auth.updateFeedbackParameter);            // edit FeedbackParameter
        app.delete("/api/v1/FeedbackParameter/:id", authJwt.verifyToken, auth.deleteFeedbackParameter);                          // delete FeedbackParameter
        app.get('/api/v1/FeedbackParameter', auth.getAllFeedbackParameter);                                                      // all FeedbackParameter
        app.post('/api/v1/Advertisement', authJwt.verifyToken, auth.createAdvertisement);                                        // add Advertisement
        app.get('/api/v1/Advertisement/:advertisementId', auth.getAdvertisementById);                                            // view Advertisement
        app.put('/api/v1/Advertisement/:advertisementId', authJwt.verifyToken, auth.updateAdvertisement);                        // edit Advertisement
        app.delete("/api/v1/Advertisement/:id", authJwt.verifyToken, auth.deleteAdvertisement);                                  // delete Advertisement
        app.get('/api/v1/Advertisement', auth.getAllAdvertisement);                                                              // all Advertisement
        app.post('/api/v1/UploadAlbum', upload.single('image'), authJwt.verifyToken, auth.createUploadAlbum);                    // add UploadAlbum
        app.get('/api/v1/UploadAlbum/:uploadAlbumId', auth.getUploadAlbumById);                                                  // view UploadAlbum
        app.put('/api/v1/UploadAlbum/:uploadAlbumId', upload.single('image'), authJwt.verifyToken, auth.updateUploadAlbum);      // edit UploadAlbum
        app.delete("/api/v1/UploadAlbum/:id", authJwt.verifyToken, auth.deleteUploadAlbum);                                      // delete UploadAlbum
        app.get('/api/v1/UploadAlbum', auth.getAllUploadAlbum);                                                                  // all UploadAlbum
        app.get('/api/v1/getAllUploadAlbumBydocumentCategory/:documentCategory', auth.getAllUploadAlbumBydocumentCategory);                                                                  // all UploadAlbum
        app.post('/api/v1/Banner', upload.single('image'), authJwt.verifyToken, auth.createBanner);                              // add Banner
        app.get('/api/v1/Banner/:bannerId', auth.getBannerById);                                                                 // view Banner
        app.put('/api/v1/Banner/:bannerId', upload.single('image'), authJwt.verifyToken, auth.updateBanner);                     // edit Banner
        app.delete("/api/v1/Banner/:id", authJwt.verifyToken, auth.deleteBanner);                                                // delete Banner
        app.get('/api/v1/Banner', auth.getAllBanner);                                                                            // all Banner
        app.post('/api/v1/DgDesk', authJwt.verifyToken, auth.createDgDesk);                                                      // add DgDesk
        app.get('/api/v1/DgDesk/:dgDeskId', auth.getDgDeskById);                                                                 // view DgDesk
        app.put('/api/v1/DgDesk/:dgDeskId', authJwt.verifyToken, auth.updateDgDesk);                                             // edit DgDesk
        app.delete("/api/v1/DgDesk/:id", authJwt.verifyToken, auth.deleteDgDesk);                                                // delete DgDesk
        app.get('/api/v1/DgDesk', auth.getAllDgDesk);                                                                            // all DgDesk
        app.post('/api/v1/LocationFact', authJwt.verifyToken, auth.createLocationFact);                                          // add LocationFact
        app.get('/api/v1/LocationFact/:locationFactId', auth.getLocationFactById);                                               // view LocationFact
        app.put('/api/v1/LocationFact/:locationFactId', authJwt.verifyToken, auth.updateLocationFact);                           // edit LocationFact
        app.delete("/api/v1/LocationFact/:id", authJwt.verifyToken, auth.deleteLocationFact);                                    // delete LocationFact
        app.get('/api/v1/LocationFact', auth.getAllLocationFact);                                                                // all LocationFact
        app.post('/api/v1/LocationFactsBanner', upload.single('image'), authJwt.verifyToken, auth.createLocationFactsBanner);    // add LocationFactsBanner
        app.get('/api/v1/LocationFactsBanner/:locationFactsBannerId', auth.getLocationFactsBannerById);                          // view LocationFactsBanner
        app.put('/api/v1/LocationFactsBanner/:locationFactsBannerId', upload.single('image'), authJwt.verifyToken, auth.updateLocationFactsBanner);// edit LocationFactsBanner
        app.delete("/api/v1/LocationFactsBanner/:id", authJwt.verifyToken, auth.deleteLocationFactsBanner);                      // delete LocationFactsBanner
        app.get('/api/v1/LocationFactsBanner', auth.getAllLocationFactsBanner);                                                  // all LocationFactsBanner
        app.post('/api/v1/RegistrationDetails', authJwt.verifyToken, auth.createRegistrationDetails);                            // add RegistrationDetails
        app.get('/api/v1/RegistrationDetails/:registrationDetailsId', auth.getRegistrationDetailsById);                          // view RegistrationDetails
        app.put('/api/v1/RegistrationDetails/:registrationDetailsId', authJwt.verifyToken, auth.updateRegistrationDetails);      // edit RegistrationDetails
        app.delete("/api/v1/RegistrationDetails/:id", authJwt.verifyToken, auth.deleteRegistrationDetails);                      // delete RegistrationDetails
        app.get('/api/v1/RegistrationDetails', auth.getAllRegistrationDetails);                                                  // all RegistrationDetails
        app.post('/api/v1/ExhibitionDetail', authJwt.verifyToken, auth.createExhibitionDetail);                                  // add ExhibitionDetail
        app.get('/api/v1/ExhibitionDetail/:exhibitionDetailId', auth.getExhibitionDetailById);                                   // view ExhibitionDetail
        app.put('/api/v1/ExhibitionDetail/:exhibitionDetailId', authJwt.verifyToken, auth.updateExhibitionDetail);               // edit ExhibitionDetail
        app.delete("/api/v1/ExhibitionDetail/:id", authJwt.verifyToken, auth.deleteExhibitionDetail);                            // delete ExhibitionDetail
        app.get('/api/v1/ExhibitionDetail', auth.getAllExhibitionDetail);                                                        // all ExhibitionDetail
        app.post('/api/v1/AboutOrganisation', authJwt.verifyToken, auth.createAboutOrganisation);                                // add AboutOrganisation
        app.get('/api/v1/AboutOrganisation/:aboutOrganisationId', auth.getAboutOrganisationById);                                // view AboutOrganisation
        app.put('/api/v1/AboutOrganisation/:aboutOrganisationId', authJwt.verifyToken, auth.updateAboutOrganisation);            // edit AboutOrganisation
        app.delete("/api/v1/AboutOrganisation/:id", authJwt.verifyToken, auth.deleteAboutOrganisation);                          // delete AboutOrganisation
        app.get('/api/v1/AboutOrganisation', auth.getAllAboutOrganisation);                                                      // all AboutOrganisation
        app.post('/api/v1/Meeting', authJwt.verifyToken, auth.createMeeting);                                                    // add Meeting
        app.get('/api/v1/Meeting/:meetingId', auth.getMeetingById);                                                              // view Meeting
        app.put('/api/v1/Meeting/:meetingId', authJwt.verifyToken, auth.updateMeeting);                                          // edit Meeting
        app.delete("/api/v1/Meeting/:id", authJwt.verifyToken, auth.deleteMeeting);                                              // delete Meeting
        app.get('/api/v1/Meeting', auth.getAllMeeting);                                                                          // all Meeting
        app.post('/api/v1/NearByType', upload.single('image'), authJwt.verifyToken, auth.createNearByType);                      // add NearByType
        app.get('/api/v1/NearByType/:nearByTypeId', auth.getNearByTypeById);                                                     // view NearByType
        app.put('/api/v1/NearByType/:nearByTypeId', upload.single('image'), authJwt.verifyToken, auth.updateNearByType);         // edit NearByType
        app.delete("/api/v1/NearByType/:id", authJwt.verifyToken, auth.deleteNearByType);                                        // delete NearByType
        app.get('/api/v1/NearByType', auth.getAllNearByType);                                                                    // all NearByType
        app.post('/api/v1/InterestType', upload.single('image'), authJwt.verifyToken, auth.createInterestType);                  // add InterestType
        app.get('/api/v1/InterestType/:interestTypeId', auth.getInterestTypeById);                                               // view InterestType
        app.put('/api/v1/InterestType/:interestTypeId', upload.single('image'), authJwt.verifyToken, auth.updateInterestType);   // edit InterestType
        app.delete("/api/v1/InterestType/:id", authJwt.verifyToken, auth.deleteInterestType);                                    // delete InterestType
        app.get('/api/v1/InterestType', auth.getAllInterestType);                                                                // all InterestType
        app.post('/api/v1/NearByPlace', authJwt.verifyToken, auth.createNearByPlace);                                             // add NearByPlace
        app.get('/api/v1/NearByPlace/:nearByPlaceId', auth.getNearByPlaceById);                                                  // view NearByPlace
        app.put('/api/v1/NearByPlace/:nearByPlaceId', authJwt.verifyToken, auth.updateNearByPlace);                              // edit NearByPlace
        app.delete("/api/v1/NearByPlace/:id", authJwt.verifyToken, auth.deleteNearByPlace);                                      // delete NearByPlace
        app.get('/api/v1/NearByPlace', auth.getAllNearByPlace);                                                                  // all NearByPlace
        app.get('/api/v1/getAllNearByPlaceByTypeId/:typeId', auth.getAllNearByPlaceByTypeId);                                                                  // all NearByPlace
        app.post('/api/v1/PlaceOfInterest', authJwt.verifyToken, auth.createPlaceOfInterest);                                    // add PlaceOfInterest
        app.get('/api/v1/PlaceOfInterest/:nearByPlaceId', auth.getPlaceOfInterestById);                                          // view PlaceOfInterest
        app.put('/api/v1/PlaceOfInterest/:nearByPlaceId', authJwt.verifyToken, auth.updatePlaceOfInterest);                      // edit PlaceOfInterest
        app.delete("/api/v1/PlaceOfInterest/:id", authJwt.verifyToken, auth.deletePlaceOfInterest);                              // delete PlaceOfInterest
        app.get('/api/v1/PlaceOfInterest', auth.getAllPlaceOfInterest);                                                          // all PlaceOfInterest
        app.post('/api/v1/AppHelpline', upload.single('image'), authJwt.verifyToken, auth.createAppHelpline);                    // add AppHelpline
        app.get('/api/v1/getAllPlaceOfInterestByTypeId/:typeId', auth.getAllPlaceOfInterestByTypeId);                                                                  // all NearByPlace
        app.get('/api/v1/AppHelpline/:appHelplineId', auth.getAppHelplineById);                                                  // view AppHelpline
        app.put('/api/v1/AppHelpline/:appHelplineId', upload.single('image'), authJwt.verifyToken, auth.updateAppHelpline);      // edit AppHelpline
        app.delete("/api/v1/AppHelpline/:id", authJwt.verifyToken, auth.deleteAppHelpline);                                      // delete AppHelpline
        app.get('/api/v1/AppHelpline', auth.getAllAppHelpline);                                                                  // all AppHelpline
        app.post("/api/v1/FAQ", authJwt.verifyToken, auth.createFaq);                                                            // add FAQ
        app.get("/api/v1/FAQ/:id", auth.getFaqById);                                                                             // view FAQ
        app.put("/api/v1/FAQ/:id", authJwt.verifyToken, auth.updateFaq);                                                         // edit FAQ
        app.delete("/api/v1/FAQ/:id", authJwt.verifyToken, auth.deleteFaq);                                                      // delete FAQ
        app.get("/api/v1/FAQ", auth.getAllFaqs);                                                                                 // all FAQ
        app.get("/api/v1/Feedback/:id", auth.getFeedBackById);                                                                   // view Feedback
        app.get("/api/v1/Feedback", auth.getAllFeedBack);                                                                        // all Feedback
        app.post('/api/v1/BookCabs', upload.single('image'), authJwt.verifyToken, auth.createBookCabs);                          // add BookCabs
        app.get('/api/v1/BookCabs/:bookCabsId', auth.getBookCabsById);                                                           // view BookCabs
        app.put('/api/v1/BookCabs/:bookCabsId', upload.single('image'), authJwt.verifyToken, auth.updateBookCabs);               // edit BookCabs
        app.delete("/api/v1/BookCabs/:id", authJwt.verifyToken, auth.deleteBookCabs);                                            // delete BookCabs
        app.get('/api/v1/BookCabs', auth.getAllBookCabs);                                                                        // all BookCabs
        app.post('/api/v1/ChairmanDesk', authJwt.verifyToken, auth.createChairmanDesk);                                          // add ChairmanDesk
        app.get('/api/v1/ChairmanDesk/:chairmanDeskId', auth.getChairmanDeskById);                                               // view ChairmanDesk
        app.delete("/api/v1/ChairmanDesk/:id", authJwt.verifyToken, auth.deleteChairmanDesk);                                    // delete ChairmanDesk
        app.get('/api/v1/ChairmanDesk', auth.getAllChairmanDesk);                                                                // all ChairmanDesk
        app.post('/api/v1/AboutFai', authJwt.verifyToken, auth.createAboutFai);                                                  // add AboutFai
        app.get('/api/v1/AboutFai/:aboutFaiId', auth.getAboutFaiById);                                                           // view AboutFai
        app.delete("/api/v1/AboutFai/:id", authJwt.verifyToken, auth.deleteAboutFai);                                            // delete AboutFai
        app.get('/api/v1/AboutFai', auth.getAllAboutFai);                                                                        // all AboutFai
        app.post('/api/v1/SeminarTheme', authJwt.verifyToken, auth.createSeminarTheme);                                          // add SeminarTheme
        app.get('/api/v1/SeminarTheme/:seminarThemeId', auth.getSeminarThemeById);                                               // view SeminarTheme
        app.delete("/api/v1/SeminarTheme/:id", authJwt.verifyToken, auth.deleteSeminarTheme);                                    // delete SeminarTheme
        app.get('/api/v1/SeminarTheme', auth.getAllSeminarTheme);                                                                // all SeminarTheme
        app.post('/api/v1/CulturalPrograms', upload.single('image'), authJwt.verifyToken, auth.createCulturalPrograms);          // add CulturalPrograms
        app.get('/api/v1/CulturalPrograms/:culturalProgramsId', auth.getCulturalProgramsById);                                   // view CulturalPrograms
        app.put('/api/v1/CulturalPrograms', upload.single('image'), authJwt.verifyToken, auth.updateCulturalPrograms);           // edit CulturalPrograms
        app.delete("/api/v1/CulturalPrograms/:id", authJwt.verifyToken, auth.deleteCulturalPrograms);                            // delete CulturalPrograms
        app.get('/api/v1/CulturalPrograms', auth.getAllCulturalPrograms);                                                        // all CulturalPrograms
        app.post('/api/v1/createRegistration', authJwt.verifyToken, auth.createRegistration);                                    // add Registration
        app.get('/api/v1/Registration/:registrationId', auth.getRegistrationById);                                               // view Registration
        app.put('/api/v1/Registration/:registrationId', authJwt.verifyToken, auth.updateRegistration);                           // edit Registration
        app.delete("/api/v1/Registration/:id", authJwt.verifyToken, auth.deleteRegistration);                                    // delete Registration
        app.get('/api/v1/Registration', auth.getAllRegistration);                                                                // all Registration
        app.get('/api/v1/RegistrationbyType/:type', auth.getAllRegistrationbyType);                                                // all Registration
        app.post('/api/v1/createExhibition', authJwt.verifyToken, auth.createExhibition);                                    // add Registration
        app.get('/api/v1/Exhibition/:ExhibitionId', auth.getExhibitionById);                                               // view Exhibition
        app.put('/api/v1/Exhibition/:ExhibitionId', authJwt.verifyToken, auth.updateExhibition);                           // edit Exhibition
        app.delete("/api/v1/Exhibition/:id", authJwt.verifyToken, auth.deleteExhibition);                                    // delete Exhibition
        app.get('/api/v1/Exhibition', auth.getAllExhibition);                                                                // all Exhibition
        app.get('/api/v1/ExhibitionbyType/:type', auth.getAllExhibitionbyType);                                                                // all Exhibition]
        app.post("/api/v1/notification/sendNotification", authJwt.verifyToken, auth.sendNotification);
        app.get("/api/v1/notification/allNotification", authJwt.verifyToken, auth.allNotification);
        app.delete("/api/v1/notification/:id", authJwt.verifyToken, auth.deleteNotification);                                    // delete Exhibition
        app.post('/api/v1/createProgram', authJwt.verifyToken, auth.createProgram);
        app.get('/api/v1/Program/:id', auth.getProgramById);                                                                // view Program                          
        app.get("/api/v1/program/get/All", auth.getAllProgram);
        app.delete("/api/v1/Program/:id", authJwt.verifyToken, auth.deleteProgram);                                    // delete Program
        app.post('/api/v1/Gallery', upload.single('image'), authJwt.verifyToken, auth.createGallery);              // add Gallery
        app.get('/api/v1/Gallery/:galleryId', auth.getGalleryById);                                         // view Gallery
        app.put('/api/v1/Gallery/:galleryId', upload.single('image'), auth.updateGallery);                  // edit Gallery
        app.delete("/api/v1/Gallery/:id", authJwt.verifyToken, auth.deleteGallery);                                // delete Gallery
        app.get('/api/v1/Gallery', auth.getAllGallery);  // all Gallery
        app.post('/api/v1/createGalleryFolder', upload.single('image'), authJwt.verifyToken, auth.createGalleryFolder);              // add Gallery
        app.get('/api/v1/GalleryFolder/:galleryFolderId', auth.getGalleryFolderById);
        app.get('/api/v1/GalleryFolderBygalleryId/:galleryId', auth.getGalleryFolderBygalleryId);                                         // view Gallery        // view Gallery
        app.delete("/api/v1/GalleryFolder/:id", authJwt.verifyToken, auth.deleteGalleryFolder);                                // delete Gallery
        app.get('/api/v1/GalleryFolder', auth.getAllGalleryFolder);                                                            // all Gallery
        app.post('/api/v1/creategallerySubFolder', upload.single('image'), authJwt.verifyToken, auth.creategallerySubFolder);              // add Gallery
        app.get('/api/v1/GallerySubFolder/:gallerySubFolderId', auth.getGallerySubFolderById);
        app.get('/api/v1/GallerySubFolder/:galleryFolderId', auth.getGallerySubFolderBygalleryFolderId);                                         // view Gallery        // view Gallery
        app.delete("/api/v1/GallerySubFolder/:id", authJwt.verifyToken, auth.deleteGallerySubFolder);                                // delete Gallery
        app.get('/api/v1/GallerySubFolder', auth.getAllGallerySubFolder);                                                            // all Gallery
}