let express = require('express');
let viewController = require('./../controllers/viewController');
let authController = require('./../controllers/authController');
let bookingController = require('./../controllers/bookingController');

let router = express.Router();

router.use(authController.isLoggedin);

router
    .route('/')
    .get(
        bookingController.createBookingCheckout,
        authController.isLoggedin,
        viewController.getOverview
    );
router
    .route('/tour/:slug')
    .get(authController.isLoggedin, viewController.getTour);
router.route('/login').get(authController.isLoggedin, viewController.login);
router.route('/me').get(authController.protect, viewController.myAccount);
router
    .route('/update-user-data')
    .patch(authController.protect, viewController.updateUserPData);
router
    .route('/update-user-password-data')
    .patch(authController.protect, viewController.updateUserPassword);

router.get('/my-tour',authController.protect, viewController.getMyBookedTours);

module.exports = router;
