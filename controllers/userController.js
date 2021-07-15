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
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'sucess',
      data: {
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
