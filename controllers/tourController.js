const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/ApiFeatures');
const AppError = require('../utils/AppError');

const aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = async (req, res, next) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getTour = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'sucess',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updateTour = async (req, res, next) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'sucess',
      data: {
        tour,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const deleteTour = async (req, res, next) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'sucess',
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getTourStats = async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: '$difficulty',
          totalTours: { $sum: 1 },
          totalratings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);
    res.status(200).json({
      status: 'sucess',
      data: {
        stats,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const getMonthlyPlan = async (req, res, next) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates', // if an objects contains three startDates, then it would be separated in three items each containing just one startDate
      },
      {
        $match: {
          // match only the objects which startDate belongs to the year passed in the URL as param
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          // groups the matched objects in previous section and organize them in groups
          // taking month as criteria
          _id: { $month: '$startDates' },
          totalTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        // add a new month field and its value will be the same as id
        $addFields: { month: '$_id' },
      },
      {
        // _id field hidden
        $project: { _id: 0 },
      },
      {
        // sorts objects by totalTourStarts in descending order
        $sort: { totalTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({
      status: 'sucess',
      data: {
        plan,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

module.exports = {
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
  createTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
