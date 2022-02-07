let mongoose = require('mongoose');

let bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'tour',
        required: [true, 'Booking must have tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must have user']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have price']
    },
    Date: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: false
    }
});

bookingSchema.pre(/^find/, function (next) {
    this.populate([
        {
            path: 'tour',
            select: 'name price date'
        },
        {
            path: 'user',
            select: 'name '
        }
    ]);
    next();
});

let bookingModel = mongoose.model('booking', bookingSchema);

module.exports = bookingModel;
