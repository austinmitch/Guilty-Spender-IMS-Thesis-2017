var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
var User = require('../models/User.js');
var Purchase = require('../models/Purchase.js');
var Expense = require('../models/Expense.js');
var config = require("../config/config.json");

var storage = multer.diskStorage({
  destination: __dirname + '/../public/www/img/reciept',
  filename: function(req, file, name){
    name(null,file.fieldname + Date.now() + path.extname(file.originalname));
  }
});

var uploading = multer({storage:storage});

/* GET purchase listing. */
router.get('/', function(req, res, next) {
  Purchase.find(function(err, purchases){
    if(err) return next(err);
    res.json(purchases);
  })
});

router.post('/api/newPurchase', uploading.single('photo'),  function(req,res,next) {
  var currentUser = global.myuser._id;
  var name = req.body.name;
  var expense = req.body.expense;
  if(!req.file) {
    var photo = "";
  }else{
    var photo = req.file.filename;
  }
  var price = req.body.price;
  var currentMonth = (new Date().getMonth())+1;
  var currentYear = new Date().getFullYear();
  // var date = currentMonth+"/"+currentYear;
  var newPurchase = new Purchase({
    purchase_name:name,
    purchase_price:price,
    purchase_photo:photo,
    purchase_month:currentMonth,
    purchase_year:currentYear,
    expense_id:expense,
    user_id: global.myuser._id
  });
  newPurchase.save();
  var purchaseId = newPurchase._id;
  Expense.update({_id:expense}, {$push:{'expense_purchases':purchaseId}}, {upsert:true}, function(err) {
if(err) return next(err);
  });
  res.redirect(config.urlBase+'home');
});

router.post('/api/oneclick', function(req,res,next){
  var currentUser = global.myuser._id;
});

router.get('/api/list', function(req,res,next){
  Purchase.find({user_id:global.myuser._id}, function(err, purchases){
    if(err) return next(err);
    console.log(purchases);
    res.json(purchases);
  });
});

router.get('/api/:id', function(req,res,next){
  var purchId = req.params.id;
  console.log(purchId);
  Purchase.findOne({_id:purchId})
  .populate('expense_id')
  .exec(function(err, purchDetails){
    if(err){console.log(err);}
    console.log(purchDetails);
    res.json(purchDetails);
  })
});

module.exports = router;
