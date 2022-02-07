let express = require('express');

let tourControllers = require('./../controllers/tourControllers');
let authControllers = require('./../controllers/authController');
let reveiwRoutes = require('./reviewRoutes');
let router = express.Router();
router.route('/aggregate').get(tourControllers.getTourStats);
router
    .route('/topTours/:year')
    .get(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide', 'guides'),
        tourControllers.getTopTours
    );

router
    .route('/tour-within/distance/:distance/latlug/:latlug/unit/:unit')
    .get(tourControllers.toursWithin);
router
    .route('/tourdistance/latlug/:latlug/unit/:unit')
    .get(tourControllers.toursDistance);
router
    .route('/')
    .get(authControllers.protect, tourControllers.getAllTour)
    .post(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.createTour
    );

router
    .route('/:id')
    .get(tourControllers.getTour)
    .patch(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.uploadTourImages,
        tourControllers.resizeTourImages,
        tourControllers.updateTour
    )
    .delete(
        authControllers.protect,
        authControllers.restrictTo('admin', 'lead-guide'),
        tourControllers.deleteTour
    );

router.use('/:tourId/reviews', reveiwRoutes);

module.exports = router;
