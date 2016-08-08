var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
  startDate: String,
  endDate: String,
  startTime: String,
  endTime: String,
  description: String,
  place: String,
  username: String
  //googleeventid: String
});

module.exports = mongoose.model('Event', eventSchema);
