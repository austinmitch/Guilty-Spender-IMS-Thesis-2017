var mongoose = require('mongoose');

var diologueSchema = new mongoose.Schema({
  dio_good:[String],
  dio_bad:[String],
  dio_very_good:[String],
  dio_very_bad:[String]
});

module.exports = mongoose.model('Diologue', diologueSchema);
