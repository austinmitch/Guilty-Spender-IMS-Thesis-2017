var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var passport = require('passport');
var User = require('../models/User.js');
var Income = require('../models/Income.js');
var Expense = require('../models/Expense.js');
var Achievement = require('../models/Achievement.js');
var config = require("../config/config.json");

/* GET users listing. */
router.get('/api/users', function(req, res, next) {
  User.find(function(err, users){
    if(err) return next(err);
    res.json(users);
  })
});

//these 2 routes are in the app.js file
//so the user data can be saved as a global variable
//register new user
// router.post('/api/register', function(req, res) {
//   User.register(new User({
//       username: req.body.username,
//       email: req.body.email
//     }), req.body.password, function(err){
//       if(err) {
//         console.log('Registration failed');
//       }
//       passport.authenticate('local')(req, res, function() {
//         myuser = req.user;
//         res.redirect(config.urlBase+"home");
//       });
//   });
//   res.redirect(config.urlBase+"home");
// });

//login
// router.post('/api/login', passport.authenticate('local'), function(req,res,next) {
//   if(!req.user) {
//     console.log('denied');
//     res.redirect(config.urlBase+'login');
//   }
//   myuser = req.user;
//   res.redirect(config.urlBase+'home');
// });

//add in initial user financial infos
router.post('/api/infoinput', function(req,res,next) {
  var currentUser = global.myuser._id;
  var income = req.body.income;
  var freq = req.body.freq;
  var account = req.body.account;
  var expenseName = req.body.expenseName;
  var expenseTotal = req.body.expenseTotal;
  var oneClickName = req.body.oneClickName;
  var oneClickTotal = req.body.oneClickTotal;
  if(income) {
    var newIncome = new Income({
      income_total: income,
      income_frequency: freq,
      user_id: currentUser
    });
    newIncome.save();
    var incomeId = newIncome._id;
    User.update({_id:currentUser}, {$push: {'user_income':incomeId}},{upsert:true}, function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
  if(expenseName && expenseTotal) {
    var newExpense = new Expense ({
      expense_name: expenseName,
      expense_price: expenseTotal,
      user_id: currentUser
    });
    newExpense.save();
    var expenseId = newExpense._id;
    User.update({_id:currentUser}, {$push: {'user_expenses':expenseId}},{upsert:true}, function(err) {
      if(err) {
        console.log(err);
      }
    });
  }

  res.redirect(config.urlBase+'home');

});

router.get('/api/profile', function(req,res,next) {
  User.findOne({_id:global.myuser._id})
    .populate('user_income')
    .populate('user_expenses')
    .exec(function(err, userDetails) {
      if(err) return next(err);
      console.log(userDetails);
      res.json(userDetails);
    });

});

router.get('/api/achievements', function(req,res,next) {
  User.findOne({_id:global.myuser._id})
  .populate('user_achievements')
  .exec(function(err, achieve){
    if(err) return next(err);
    console.log(achieve);
    res.json(achieve);
  })
});

module.exports = router;
