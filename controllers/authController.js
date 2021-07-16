const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
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

module.exports = {
  signUp,
};
