const jwt = require('jsonwebtoken');
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

module.exports = {
  signUp,
  login,
};
