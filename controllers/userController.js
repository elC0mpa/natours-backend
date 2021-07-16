const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
};

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

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  signUp,
};
