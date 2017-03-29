var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username:{type:String, required:[true,'Please enter your name']},
  email:{type:String, required:[true,'Email is required to create an account']},
  user_image:String,
  // user_pass:{type:String, required:[true,'Please create a password']},
  user_income:[{type:mongoose.Schema.Types.ObjectId, ref:'Income'}],
  user_expenses:[{type:mongoose.Schema.Types.ObjectId, ref:'Expense'}],
  user_purchases:[{type:mongoose.Schema.Types.ObjectId, ref:'Purchase'}],
  user_achievements:[{type:mongoose.Schema.Types.ObjectId, ref:'Achievement'}]
});

var options = ({missingUsernameError: "unsername incorrect", missingPasswordError: "password incorrect"});
userSchema.plugin(plm,options);

module.exports = mongoose.model('User', userSchema);
