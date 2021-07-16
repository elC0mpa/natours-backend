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
};
