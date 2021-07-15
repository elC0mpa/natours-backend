const express = require('express');
const morgan = require('morgan');

const tourRouter = require('../routes/tourRoutes');
const userRouter = require('../routes/userRoutes');
const AppError = require('./AppError');
const errorHandler = require('./errorHandler');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can´t find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
