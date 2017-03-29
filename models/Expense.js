var mongoose = require('mongoose');

var expenseSchema = new mongoose.Schema({
  expense_name:{type:String, required:[true, 'Name this expense category']},
  expense_price:{type:Number, required:[true, 'How much do you spend on this a month']},
  expense_purchases:[{type:mongoose.Schema.Types.ObjectId, ref:'Purchase'}],
  user_id:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Expense', expenseSchema);
