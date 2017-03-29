var mongoose = require('mongoose');

var purchaseSchema = new mongoose.Schema({
  purchase_name:{type:String, required:[true,'You need to name your purchase']},
  purchase_price:{type:Number, required:[true,'How much was this purchase']},
  purchase_photo:String,
  expense_id:{type:mongoose.Schema.Types.ObjectId, ref:'Expenses', required:[true,'Please specify which expense to categorize this purchase in']},
  user_id:{type:mongoose.Schema.Types.ObjectId, ref:'User'}
});

module.exports = mongoose.model('Purchase', purchaseSchema);
