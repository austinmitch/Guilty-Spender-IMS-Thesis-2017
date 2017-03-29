var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = require('../models/User.js');
var Income = require('../models/Income.js');
var Expense = require('../models/Expense.js');
var Purchase = require('../models/Purchase.js');
var config = require("../config/config.json");

var myuser;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get home page information

router.get('/api/home', function(req,res,next) {
  User.findOne({_id:global.myuser._id})
    .populate('user_income')
    .populate({
      path:'user_expenses',
      populate:{path:'expense_purchases'}
    })
    .exec(function(err, userHome) {
      if(err) return next(err);
      console.log(userHome);
      res.json(userHome);
    });
});


router.get('/api/test', function(req,res,next) {

});


module.exports = router;