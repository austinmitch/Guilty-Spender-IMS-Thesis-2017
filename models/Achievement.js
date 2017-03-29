var mongoose = require('mongoose');

var achievementSchema = new mongoose.Schema({
  ach_name:String,
  ach_image:String,
  ach_number:Number,
  ach_message:String
});

module.exports = mongoose.model('Achievement', achievementSchema);
