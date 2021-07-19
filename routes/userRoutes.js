const express = require('express');

const {
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  updateCurrentUser,
  deleteCurrentUser,
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
router.route('/delete-me').delete(protectRoute, deleteCurrentUser);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
