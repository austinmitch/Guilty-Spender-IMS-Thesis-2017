var mongoose = require('mongoose');

var avatarSchema = new mongoose.Schema({
  avatar_happy:[String],
  avatar_angry:[String]
});

module.exports = mongoose.model('Avatar', avatarSchema);
