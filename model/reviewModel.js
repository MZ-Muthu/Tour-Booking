let mongoose = require('mongoose');
let tourModel = require('./tourModel');

let reviewSchema = new mongoose.Schema(
    {
        review: {
            type: String,
            required: [true, "Review can't be empty."]
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: [true, "Rating can't be empty"]
        },
        createAt: {
            type: Date,
            defauld: Date.now()
        },
        tour: {
            type: mongoose.Schema.ObjectId,
            ref: 'tour',
            required: [true, 'Review must contain tour.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must contain User']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, async function (next) {
    this.populate([
        {
            path: 'tour',
            select: 'name'
        },
        {
            path: 'user',
            select: 'name photo '
        }
    ]);

    next();
});

reviewSchema.statics.createAverageRatingTour = async function (tourId) {
    let stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: '$tour',
                length: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    if (stats.length > 0) {
        await tourModel.findByIdAndUpdate(tourId, {
            ratingsAverage: stats[0].avgRating,
            ratingsQuantity: stats[0].length
        });
    } else {
        await tourModel.findByIdAndUpdate(tourId, {
            ratingsAverage: 0,
            ratingsQuantity: 0
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.createAverageRatingTour(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();

    next();
});
reviewSchema.post(/^findOneAnd/, async function () {
    this.r.constructor.createAverageRatingTour(this.r.tour._id);
});
let reviewModel = mongoose.model('Reviews', reviewSchema);

module.exports = reviewModel;
