let AppError = require('./../util/appError');
const handleCastErrorDB = (err) => {
  let message = `The URL is nol valide ${err._id}:${err.value}`;
  return new AppError(message, 400);
};
const handleDublicateNameDB = (err) => {
  let value = err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  let message = `You are entered name ${value} is already exist. Please try another name.`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  let data = Object.values(err.errors).map((el) => el.message);
  let message = `Invalid Input Data.${data.join(' ')}`;
  return new AppError(message, 400);
};
const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      message: err.message,
      stackTrace: err.stack,
    });
  }

  return res.status(err.statusCode).render('error', {
    msg: err.message,
  });
};

const handleInvalidToken = (err) => {
  return new AppError('Invalid Token.Please login again...', 401);
};
const hangleExpiredToken = (err) => {
  return new AppError('Your session was expired please login again', 401);
};

const sendErrPro = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    return res.status(err.statusCode).json({
      status: 400,
      message: 'Something went wrong! Please try again later',
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      status: err.status,
      msg: err.message,
    });
  }

  return res.status(err.statusCode).render('error', {
    msg: 'Something went wrong! Please try again later',
  });
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_DEV === 'development') {
    sendErrDev(err, req, res);
  } else if (process.env.NODE_DEV === 'production') {
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDublicateNameDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') err = handleInvalidToken(err);
    if (err.name === 'TokenExpiredError') err = hangleExpiredToken(err);
    sendErrPro(err, req, res);
  }
  next();
};
