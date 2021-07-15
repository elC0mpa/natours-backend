const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'This is not a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a password confirmation'],
    validate: {
      // eslint-disable-next-line object-shorthand
      validator: function (passConf) {
        // THIS ONLY WORKS ON CREATE AND SAVE
        return passConf === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

const model = mongoose.model('User', userSchema);

module.exports = model;
