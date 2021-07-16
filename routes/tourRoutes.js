const express = require('express');

const {
  getAllTours,
  getTour,
  createTour,
  deleteTour,
  updateTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

const {
  protectRoute,
  restrictRoute,
} = require('../controllers/authController');

const router = express.Router();

router.route('/').get(protectRoute, getAllTours).post(createTour);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protectRoute, restrictRoute('admin'), deleteTour);

module.exports = router;
