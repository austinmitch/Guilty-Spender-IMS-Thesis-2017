var mongoose = require('mongoose');

var incomeSchema = new mongoose.Schema({
  // income_name:{type:String, required:[true,'Pleasae provide a name for this income total']},
  income_total:{type:Number, required:[true, 'We need to know your income']},
  income_frequency:{type:Number, required:[true, 'How often do you get paid']},
  user_id:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Income', incomeSchema);
