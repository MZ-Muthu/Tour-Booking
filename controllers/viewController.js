let tourModel = require('./../model/tourModel');
let catchAsync = require('./../util/catchAsync');
let appError = require('./../util/appError');
let bookingModel = require('./../model/bookingModel');
 
exports.getOverview = catchAsync(async (req, res, next) => {
    let tours = await tourModel.find(); 
    res.status(200).render('overview', {
        title: 'Home - Tours',
        tours
    });
});
exports.getTour = catchAsync(async (req, res, next) => {
    let tour = await tourModel
        .findOne({ slug: req.params.slug })
        .populate('reviews');
    if (!tour) {
        return next(new appError('There is no tour in this name', 404));
    }
    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

exports.login = (req, res) => {
    res.status(200).render('login');
};

exports.myAccount = (req, res) => {
    res.status(200).render('account');
};
exports.updateUserPData = (req, res, next) => {
    res.status(200).render('account', {
        user
    });
};
exports.updateUserPassword = (req, res, next) => {
    res.status(200).render('account', {
        user
    });
};

exports.getMyBookedTours = catchAsync(async (req, res, next) => {
    let booking = await bookingModel.find({ user: req.user.id });

    let bookingIds = booking.map((el) => el.tour);

    let tours = await tourModel.find({ _id: { $in: bookingIds } });

    res.status(200).render('overview',{
        title:"User | My Tours",
        tours
    })
});
