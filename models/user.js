var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String
  },
  email: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
