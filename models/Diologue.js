var mongoose = require('mongoose');

var diologueSchema = new mongoose.Schema({
  dio_good:[{body:String}],
  dio_bad:[{body:String}],
  dio_very_good:[{body:String}],
  dio_very_bad:[{body:String}]
});

module.exports = mongoose.model('Diologue', diologueSchema);
