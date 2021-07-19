const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('../routes/tourRoutes');
const userRouter = require('../routes/userRoutes');
const AppError = require('./AppError');
const errorHandler = require('./errorHandler');

const app = express();

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later',
});
app.use(helmet());
app.use(morgan('dev'));

app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Clenaing parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
    ],
  }),
);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can´t find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
