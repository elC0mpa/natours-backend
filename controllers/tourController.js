const Tour = require('../models/tourModel');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error,
    });
  }
};

const updateTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
};

const deleteTour = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not implemented route',
  });
};

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
};
