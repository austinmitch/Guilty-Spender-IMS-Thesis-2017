var mongoose = require('mongoose');

var avatarSchema = new mongoose.Schema({
  avatar_happy:[{file:String}],
  avatat_angry:[{file:String}]
});

module.exports = mongoose.model('Avatar', avatarSchema);
