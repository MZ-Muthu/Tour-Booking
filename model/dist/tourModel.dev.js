"use strict";

var mongoose = require('mongoose');

var slugify = require('slugify'); // let userModel = require('./userModel')


var tourSchema = new mongoose.Schema({
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
    required: [true, "A tour must have a Difficulty."]
  },
  ratingsAverage: {
    type: Number,
    "default": 4.0,
    max: 5,
    set: function set(val) {
      return Math.round(val * 10) / 10;
    }
  },
  ratingsQuantity: {
    type: Number,
    "default": 0
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price."]
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function validator(val) {
        return val < this.price;
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
    "default": Date.now()
  },
  startDates: [Date],
  secreatTour: {
    type: Boolean,
    "default": false
  },
  startLocation: {
    type: {
      type: String,
      "default": 'Point',
      "enum": ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String
  },
  locations: [{
    type: {
      type: String,
      "default": 'Point',
      "enum": ['Point']
    },
    coordinates: [Number],
    address: String,
    description: String,
    day: Number
  }],
  guides: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});
tourSchema.virtual("durationWeeks").get(function (next) {
  return this.duration / 7;
  next();
});
tourSchema.index({
  price: 1,
  ratingsAverage: true
});
tourSchema.index({
  slug: 1
});
tourSchema.index({
  startLocation: '2dsphere'
});
tourSchema.virtual('reviews').get(function (next) {
  return {
    ref: "Reviews",
    foreignField: 'tour',
    localField: "_id"
  };
});
tourSchema.pre('save', function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          this.slug = slugify(this.name, {
            lower: true
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
}); // tourSchema.pre('save', async function (next) {
//     const tourGuide = this.guides.map(async el => await userModel.findById(el));
//     this.guides = await Promise.all(tourGuide);
//     next();
// })

tourSchema.pre(/^find/, function (next) {
  this.find({
    secreatTour: {
      $ne: true
    }
  });
  next();
}); // tourSchema.pre("aggregate", function (next) {
//     this.pipeline().unshift({ $match: { secreatTour: { $ne: true } } });
//     next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangeAt'
  });
  next();
});
var tourModel = mongoose.model("tour", tourSchema);
module.exports = tourModel;