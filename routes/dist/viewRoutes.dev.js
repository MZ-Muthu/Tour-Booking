"use strict";

var express = require('express');

var viewController = require('./../controllers/viewController');

var router = express.Router();
router.route('/').get(viewController.getOverview);
router.route('/tour/:slug').get(viewController.getTour);
module.exports = router;