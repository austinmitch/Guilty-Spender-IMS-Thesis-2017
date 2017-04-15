var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Expense = require('../models/Expense.js');
var config = require("../config/config.json");

/* GET users listing. */
router.get('/', function(req, res, next) {
  Expense.find(function(err, expenses){
    if(err) return next(err);
    res.json(expenses);
  })
});

//delete and expense
router.post('/api/delete/:id', function(req,res,next){
  var id = req.params.id;
  Expense.remove({_id:id}, function(err){
    if(err){console.log(err)}
    res.send("deleted");
  });
});

module.exports = router;
