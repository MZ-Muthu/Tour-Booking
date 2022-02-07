let catchAsync = require('./../util/catchAsync');
let AppError = require('./../util/appError');
let tourFeatures = require('./../util/tourAPIFeatrures');
let fs = require('fs');
exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
            return next(
                new AppError("can't find a document with this id", 404)
            );
        }
        res.json({
            status: 'Success',
            data: doc
        });
    });

exports.createOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.create(req.body);
        res.json({
            status: 'Success',
            data: {
                data: doc
            }
        });
    });

exports.updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
        let doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!doc) {
            return next(
                new AppError("can't find a Document with this id", 404)
            );
        }

        res.json({
            status: 'success',
            data: {
                data: doc
            }
        });
    });
exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.getOne = (Model, populateOption) =>
    catchAsync(async (req, res, next) => {
        let query = Model.findById(req.params.id);
        if (populateOption) query = query.populate(populateOption);
        let doc = await query;

        if (!doc) {
            return next(
                new AppError("can't find a document with this id", 404)
            );
        }

        res.json({
            status: 'Success',
            data: {
                data: doc
            }
        });
    });

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        let filter = {};

        if (req.params.tourId) filter = { tour: req.params.tourId };

        let docClass = new tourFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .fieldSelect()
            .pagenate();
        let doc = await docClass.query;
        res.json({
            status: 'Success',
            length: doc.length,
            data: {
                data: doc
            }
        });
    });
