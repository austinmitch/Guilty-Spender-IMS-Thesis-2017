var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var router = express.Router();
var multer = require('multer');
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
  var date = currentMonth+""+currentYear;
  var newPurchase = new Purchase({
    purchase_name:name,
    purchase_price:price,
    purchase_photo:photo,
    purchase_date:date,
    expense_id:expense,
  });
  newPurchase.save();
  var purchaseId = newPurchase._id;
  Expense.update({_id:expense}, {$push:{'expense_purchases':purchaseId}}, {upsert:true}, function(err) {
if(err) return next(err);
  });
  res.redirect(config.urlBase+'home');
});

module.exports = router;
