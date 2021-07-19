const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

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
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can´t find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
