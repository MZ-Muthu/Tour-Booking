let stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
let tourModels = require('./../model/tourModel');
let catchAsync = require('./../util/catchAsync');
let AppError = require('./../util/appError');
let bookingModel = require('./../model/bookingModel');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
    let tour = await tourModels.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/?tour=${
            req.params.tourId
        }&user=${req.user._id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tour,
        line_items: [
            {
                name: `${tour.name} Tour`,
                description: tour.summary,
                // images:[''],
                amount: tour.price,
                currency: 'usd',
                quantity: 1
            }
        ]
    });
    res.json({
        status: 'success',
        data: {
            data: session
        }
    });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
    let { tour, user, price } = req.query;

    if (!tour && !user && !price) return next();

    await bookingModel.create({ tour, user, price, paid: true });
    return res.redirect(req.originalUrl.split('?')[0]);
});
