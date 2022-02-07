let express = require('express');

let reviewControllers = require('./../controllers/reviewControllers');
let authControllers = require('./../controllers/authController');

let router = express.Router({ mergeParams: true });

router.use(authControllers.protect);
router
    .route('/')
    .get(reviewControllers.getAllReview)
    .post(
        authControllers.restrictTo('user'),
        reviewControllers.getTourUserIdForCreate,
        reviewControllers.createReview
    );

router
    .route('/:id')
    .get(reviewControllers.getReview)
    .patch(
        authControllers.restrictTo('user', 'admin'),
        reviewControllers.updateReview
    )
    .delete(
        authControllers.restrictTo('user', 'admin'),
        reviewControllers.deleteReview
    );

module.exports = router;
