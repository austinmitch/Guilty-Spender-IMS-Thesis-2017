var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
  username:{type:String, required:[true,'Please enter your name']},
  email:{type:String, required:[true,'Email is required to create an account']},
  user_image:{type:String, default:'profile-pic-default.svg'},
  user_income:[
    {
      income_total:Number,
      income_frequency:Number
    }
  ],
  user_oneclick:[
    {
      oneclick_name:String,
      oneclick_total:Number,
      oneclick_expense:{type:mongoose.Schema.Types.ObjectId, ref:'Expense'}
    }
  ],
  user_expenses:[{type:mongoose.Schema.Types.ObjectId, ref:'Expense'}],
  user_achievements:[{type:mongoose.Schema.Types.ObjectId, ref:'Achievement'}]
});

var options = ({missingUsernameError: "unsername incorrect", missingPasswordError: "password incorrect"});
userSchema.plugin(plm,options);

module.exports = mongoose.model('User', userSchema);
