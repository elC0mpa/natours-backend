const express = require('express');

const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updateCurrentUser,
} = require('../controllers/userController');

const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protectRoute,
} = require('../controllers/authController');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').patch(resetPassword);
router.route('/update-password').patch(protectRoute, updatePassword);

router.route('/update-me').patch(protectRoute, updateCurrentUser);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
