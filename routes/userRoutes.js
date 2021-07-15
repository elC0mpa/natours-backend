const express = require('express');

const {
  getAllUsers,
  getUser,
  signUp,
  deleteUser,
  updateUser,
} = require('../controllers/userController');

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
