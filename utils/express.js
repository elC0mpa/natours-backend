const express = require('express');
const morgan = require('morgan');
const tourRouter = require('../routes/tourRoutes');
const userRouter = require('../routes/userRoutes');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can´t find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
