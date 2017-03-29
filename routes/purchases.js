var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Purchase = require('../models/Purchase.js');
var Expense = require('../models/Expense.js');
var config = require("../config/config.json");

/* GET users listing. */
router.get('/', function(req, res, next) {
  Purchase.find(function(err, purchases){
    if(err) return next(err);
    res.json(purchases);
  })
});

router.post('/api/newPurchase', function(req,res,next) {
  var currentUser = global.myuser._id;
  var name = req.body.name;
  var expense = req.body.expense;
  // research uploading photos and moving them to the correct folder
  var price = req.body.price;
  var newPurchase = new Purchase({
    purchase_name:name,
    purchase_price:price,
    expense_id:expense,
    user_id:currentUser
  });
  newPurchase.save();
  var purchaseId = newPurchase._id;
  Expense.update({_id:expense}, {$push:{'expense_purchases':purchaseId}}, {upsert:true}, function(err) {
if(err) return next(err);
  });
  res.redirect(config.urlBase+'home');
});

module.exports = router;
