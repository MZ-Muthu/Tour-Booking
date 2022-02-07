"use strict";

var express = require('express');

var path = require('path');

var morgan = require('morgan');

var dotenv = require('dotenv');

var mongoose = require('mongoose');

var rateLimit = require('express-rate-limit');

var helmet = require('helmet');

var sanitization = require('express-mongo-sanitize');

var xss = require('xss-clean');

var hpp = require('hpp');

var cookieParser = require('cookie-parser');

process.on('uncaughtException', function (err) {
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});
dotenv.config({
  path: './env/config.env'
});

var AppError = require("./util/appError");

var tourRouter = require("./routes/tourRoutes");

var userRouter = require("./routes/userRoutes");

var reviewRouter = require("./routes/reviewRoutes");

var viewRouter = require("./routes/viewRoutes");

var globalErrorController = require("./controllers/errorController");

var mongo_url = process.env.DATABASE_URL;
var app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express["static"](path.join(__dirname, 'public')));
var limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "To many requests used from this IP. Please Try again after an hour."
});
app.use('/api', limiter);
app.use(express.json({
  limit: '10kb'
}));
app.use(cookieParser);
app.use(morgan('dev'));
app.use(sanitization());
app.use(xss());
app.use(hpp({
  whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(function (con) {
  console.log("connection was successfull");
}); // app.use((req, res, next) => {
//     console.log(req.cookies);
//     next();
// });
/////////////////////////////
//////Routes//////////

app.use('/', viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.all('*', function (req, res, next) {
  next(new AppError("undefied url ".concat(req.originalUrl), 404));
});
app.use(globalErrorController);
var server = app.listen(process.env.PORT);
process.on("unhandledRejection", function (err) {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection... Server is Shutting Down");
  server.close(function () {
    process.exit(1);
  });
});