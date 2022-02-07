let reviewModel = require('./../model/reviewModel');
let catchAsync = require('./../util/catchAsync');
let factory = require("./handleFactory");



exports.getTourUserIdForCreate = (req, res, next) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user;
    next();
}

exports.getAllReview = factory.getAll(reviewModel);
exports.getReview = factory.getOne(reviewModel);
exports.createReview = factory.createOne(reviewModel);
exports.updateReview = factory.updateOne(reviewModel);
exports.deleteReview = factory.deleteOne(reviewModel);
