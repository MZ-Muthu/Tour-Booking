let mongoose = require('mongoose');
let slugify = require('slugify');
// let userModel = require('./userModel')
let tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Tour name is required"],
        trim: true
    },
    slug: {
    type: String,
    unique: true
  },
    duration: {
        type: Number,
        required: [true, "A Tour must have a duration."]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a Maximum Group size."]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a Difficulty."],

    },
    ratingsAverage: {
        type: Number,
        default: 4.0,
        max: 5,
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price."]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return (val < this.price);
            },
            message: "The discount value must be lesser then regular price."
        }
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summery."]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a Image Cover."]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secreatTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);
tourSchema.virtual("durationWeeks").get(function (next) {
    return this.duration / 7;
    next();
});

tourSchema.index({ price: 1, ratingsAverage: true });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('reviews',{
    ref: "Reviews",
    foreignField: 'tour',
    localField: "_id"
})

tourSchema.pre('save', async function (next) { 
    this.slug = slugify(this.name, { lower: true });
    next();
});
// tourSchema.pre('save', async function (next) {
//     const tourGuide = this.guides.map(async el => await userModel.findById(el));
//     this.guides = await Promise.all(tourGuide);
//     next();
// })
tourSchema.pre(/^find/, function (next) {
    this.find({ secreatTour: { $ne: true } })
    next();
});
// tourSchema.pre("aggregate", function (next) {
//     this.pipeline().unshift({ $match: { secreatTour: { $ne: true } } });
//     next();
// });
tourSchema.pre(/^find/, function (next) {
    this.populate(
        {
            path: 'guides',
            select: '-__v -passwordChangeAt'
        }
    );
    next();
});

let tourModel = mongoose.model("tour", tourSchema);
module.exports = tourModel;