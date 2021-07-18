const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/email');

// eslint-disable-next-line no-undef
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });

const signUp = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // Select funtion is necessary because by default password is not read from database
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password'), 401);
    }

    const token = signToken(user._id);

    res.status(201).json({
      status: 'sucess',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Checking if authorization header was sent and if it starts with `Bearer`
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Getting token from authorization header
      token = req.headers.authorization.replace('Bearer ', '').trim();
    }
    if (!token) {
      next(
        new AppError(
          'You need to be logged in in order to access this route',
          401,
        ),
      );
    }
    // Verifying if the token is correct
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY,
    );
    // Verifying if the user to which this token belongs still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token does no longer exists'),
      );
    }

    // Verifying if the user changed its password after the token was issued
    if (currentUser.passwordChangedAfterToken(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again',
          401,
        ),
      );
    }
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError(error.message));
  }
};

const restrictRoute =
  (roles) =>
  // Input = 'admin user'
  // roles = ['admin', 'user']
  (req, res, next) => {
    roles = roles.split(' ');
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You don´t have permission to perform this action', 403),
      );
    }

    next();
  };

const forgotPassword = async (req, res, next) => {
  try {
    // Get user based on received email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('This email doesn´t belong to any user', 404));
    }
    // Create random secret token
    const resetToken = user.createPassResetToken();
    await user.save({ validateBeforeSave: false });

    // Send secret token to user's email
    const resetUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Change it by clicking this link: ${resetUrl}.\nIf you didn´t forget it, ignore this message`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token',
        message,
      });
      res.status(201).json({
        status: 'sucess',
        message: 'Token sent to email',
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpirationDate = undefined;
      await user.save({ validateBeforeSave: false });
      next(new AppError('There was an error sending the email', 500));
    }
  } catch (error) {
    next(new AppError(error.message));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    // Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpirationDate: { $gt: Date.now() },
    });
    // If token has not expired and there is a user, change the password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 401));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpirationDate = undefined;
    await user.save(); // Middleware will update the passwordChangedAt property

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(new AppError(error.message));
  }
};

const updatePassword = async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user._id).select('+password');

  // Check if posted current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('This is not your current password', 401));
  }

  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
};

module.exports = {
  signUp,
  login,
  protectRoute,
  restrictRoute,
  forgotPassword,
  resetPassword,
  updatePassword,
};
