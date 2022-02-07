let multer = require('multer');
let sharp = require('sharp');

let tourModel = require('./../model/tourModel');
let catchAsync = require('./../util/catchAsync');
let AppError = require('./../util/appError');
let factory = require('./handleFactory');

exports.getAllTour = factory.getAll(tourModel);
exports.createTour = factory.createOne(tourModel);
exports.getTour = factory.getOne(tourModel, { path: 'reviews' });
exports.updateTour = factory.updateOne(tourModel);
exports.deleteTour = factory.deleteOne(tourModel);

let multerStorage = multer.memoryStorage();

function multerFilter(req, file, cb) {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not a image type please upload the image', 400),
            false
        );
    }
}

let upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.images || !req.files.imageCover) return next();

    // image cover
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    // images
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async (el, i) => {
            let filenameofimage = `tour-${req.params.id}-${Date.now()}-${
                i + 1
            }.jpeg`;
            await sharp(el.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filenameofimage}`);

            req.body.images.push(filenameofimage);
        })
    );
    next();
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    let tourStats = await tourModel.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                tours: { $sum: 1 },
                averageRatings: { $avg: '$ratingsAverage' },
                averagePrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: {
                averagePrice: 1
            }
        }
    ]);
    res.json({
        status: 'success',
        data: {
            data: tourStats
        }
    });
});

exports.getTopTours = catchAsync(async (req, res, next) => {
    let year = req.params.year * 1;
    let getTours = await tourModel.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: `$startDates` },
                Tours: { $sum: 1 },
                NameOftheTour: {
                    $push: '$name'
                }
            }
        },
        {
            $addFields: {
                month: '$_id'
            }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: {
                Tours: -1
            }
        },
        {
            $limit: 6
        }
    ]);
    res.json({
        status: 'success',
        data: {
            data: getTours
        }
    });
});

exports.toursWithin = catchAsync(async (req, res, next) => {
    let { distance, latlug, unit } = req.params;

    let [lat, lug] = latlug.split(',');
    let radios = unit === 'ml' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lug) {
        next(
            AppError(
                'Please enter the lattitude and longtiutde in proper format',
                400
            )
        );
    }

    let tours = await tourModel.find({
        startLocation: { $geoWithin: { $centerSphere: [[lug, lat], radios] } }
    });

    res.json({
        status: 'Success',
        data: tours
    });
});

exports.toursDistance = catchAsync(async (req, res, next) => {
    let { latlug, unit } = req.params;

    let [lat, lug] = latlug.split(',');

    if (!lat || !lug) {
        next(
            AppError(
                'Please enter the lattitude and longtiutde in proper format',
                400
            )
        );
    }
    let multiplier = unit === 'ml' ? 0.000621371 : 0.001;
    let distance = await tourModel.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lug * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                distance: 1,
                name: 1
            }
        },
        {
            $limit: 3
        }
    ]);
    res.json({
        status: 'Success',
        data: distance
    });
});
