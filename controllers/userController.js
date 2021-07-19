const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');

const getAllUsers = async (req, res, next) => {
  try {
    // Will return only active users, this is implemented in the query middleware
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    });
  } catch (error) {
    next(new AppError(error.message), 500);
  }
};

const filterObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const updateCurrentUser = async (req, res, next) => {
  try {
    // Send error if user sends password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('This route is not for password updates', 400));
    }

    // Update user document
    const filteredBody = filterObject(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(new AppError(error.message), 500);
  }
};

const deleteCurrentUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(new AppError(error.message), 500);
  }
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
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
  updateCurrentUser,
  deleteCurrentUser,
};
