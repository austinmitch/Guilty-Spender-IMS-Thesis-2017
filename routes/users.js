var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var passport = require('passport');
var User = require('../models/User.js');
var Expense = require('../models/Expense.js');
var Achievement = require('../models/Achievement.js');
var config = require("../config/config.json");


var storage = multer.diskStorage({
  destination: __dirname + '/../public/www/img',
    filename: function (req, file, name) {
        name(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});

var uploading = multer({storage:storage});






/* GET users listing. */
router.get('/api/users', function(req, res, next) {

});

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

    User.update({_id:currentUser}, {$set: {'user_income':{'income_total':income,'income_frequency':freq}}},{upsert:true}, function(err) {
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
    .populate('user_expenses')
    .exec(function(err, userDetails) {
      if(err) return next(err);
      console.log(userDetails);
      res.json(userDetails);
    });
});

//update profile info
router.post('/api/profile', uploading.single('profilePic'), function(req,res,next) {
  var username = req.body.username;
  var profilePic = req.file.filename;

  if(username) {
    User.update({_id:global.myuser._id},{$set:{username:username}},{upsert:true}, function(err){
      if(err){console.log(err);}
    });
  }
  if(profilePic) {
    User.update({_id:global.myuser._id},{$set:{user_image:profilePic}},{upsert:true},function(err){
      if(err){console.log(err);}
    });
  }
  res.redirect(config.urlBase+'home');
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
