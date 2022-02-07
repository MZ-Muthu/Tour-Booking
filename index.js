let express = require('express');
let path = require('path');
let morgan = require('morgan');
let dotenv = require('dotenv');
let mongoose = require('mongoose');
let rateLimit = require('express-rate-limit');
let helmet = require('helmet');
let sanitization = require('express-mongo-sanitize');
let xss = require('xss-clean');
let hpp = require('hpp');
let cookieParser = require('cookie-parser');

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message, err.stack);
    process.exit(1);
});
dotenv.config({ path: './env/config.env' });
let AppError = require('./util/appError');
let tourRouter = require(`./routes/tourRoutes`);
let userRouter = require(`./routes/userRoutes`);
let reviewRouter = require(`./routes/reviewRoutes`);
let viewRouter = require(`./routes/viewRoutes`);
let bookingRouter = require('./routes/bookingRoutes');
let globalErrorController = require('./controllers/errorController');

let mongo_url = process.env.DATABASE_URL;

let app = express();

app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

let limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message:
        'To many requests used from this IP. Please Try again after an hour.'
});

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(morgan('dev'));
app.use(sanitization());
app.use(xss());

app.use(
    hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'maxGroupSize',
            'difficulty',
            'price'
        ]
    })
);
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);
mongoose
    .connect(mongo_url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    .then((con) => {
        console.log('connection was successfull');
    });

// app.use((req, res, next) => {
//     console.log(req.cookies);
//     next();
// });
/////////////////////////////
//////Routes//////////

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`undefiefd url ${req.originalUrl}`, 404));
});

app.use(globalErrorController);
let server = app.listen(process.env.PORT);

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled Rejection... Server is Shutting Down');
    server.close(() => {
        process.exit(1);
    });
});
