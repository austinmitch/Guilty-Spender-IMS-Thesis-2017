var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/User.js');
var Expense = require('../models/Expense.js');
var Purchase = require('../models/Purchase.js');
var Diologue = require('../models/Diologue.js');
var Avatar = require('../models/Avatar.js');
var config = require("../config/config.json");

var myuser;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get home page information
router.get('/api/home', function(req,res,next) {
  var currentMonth = (new Date().getMonth())+1;
  var currentYear = new Date().getFullYear();
  var date = currentMonth+""+currentYear;
  console.log("month"+currentMonth);
  User.findOne({_id:global.myuser._id})
    .populate({
      path:'user_expenses',
      populate:{
        path:'expense_purchases',
        match:{purchase_date:{$eq:date}}
      }
    })
    .exec(function(err, userHome) {
      if(err) return next(err);
      console.log(userHome);
      res.json(userHome);
    });
});

router.get('/api/diologue', function(req,res,next) {
  Diologue.find(function(err, dioResponse) {
    if(err) return next(err);
    res.json(dioResponse);
  });
});

router.get('/api/avatar', function(req,res,next) {
  Avatar.find(function(err, aviResponse) {
    if(err) return next(err);
    res.json(aviResponse);
  });
});

module.exports = router;
