"use strict";

var tourModel = require('./../model/tourModel');

var catchAsync = require('./../util/catchAsync');

exports.getOverview = catchAsync(function _callee(req, res, next) {
  var tours;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(tourModel.find());

        case 2:
          tours = _context.sent;
          res.status(200).render('overview', {
            title: "Home - Tours",
            tours: tours
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
});
exports.getTour = catchAsync(function _callee2(req, res, next) {
  var tour;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(tourModel.findOne({
            slug: req.params.slug
          }).populate('reviews'));

        case 2:
          tour = _context2.sent;
          res.status(200).render('tour', {
            title: "".concat(tour.name, " Tour"),
            tour: tour
          });

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
});
exports.login = catchAsync(function (req, res, next) {
  res.status(200).render('login');
});
exports.login = catchAsync(function (req, res, next) {
  res.status(200).set('Content-Security-Policy', "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;").render('login');
});