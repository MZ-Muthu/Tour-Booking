let express = require('express');

let authControllers = require('./../controllers/authController');
let bookingController = require('./../controllers/bookingController')

let router = express.Router();

router.get(
    '/checkout-session/:tourId',
    authControllers.protect,
    bookingController.getCheckoutSession
);

module.exports = router;
