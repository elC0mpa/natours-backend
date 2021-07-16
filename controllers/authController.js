const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

// eslint-disable-next-line no-undef
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'sucess',
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Select funtion is necessary because by default password is not read from database
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password'), 401);
    }

    const token = signToken(user._id);

    res.status(201).json({
      status: 'sucess',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Checking if authorization header was sent and if it starts with `Bearer`
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Getting token from authorization header
      token = req.headers.authorization.replace('Bearer ', '').trim();
    }
    if (!token) {
      next(
        new AppError(
          'You need to be logged in in order to access this route',
          401,
        ),
      );
    }
    // Verifying if the token is correct
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY,
    );
    // Verifying if the user to which this token belongs still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token does no longer exists'),
      );
    }

    // Verifying if the user changed its password after the token was issued
    if (currentUser.passwordChangedAfterToken(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again',
          401,
        ),
      );
    }

    next();
  } catch (error) {
    next(new AppError(error.message));
  }
};

module.exports = {
  signUp,
  login,
  protectRoute,
};
