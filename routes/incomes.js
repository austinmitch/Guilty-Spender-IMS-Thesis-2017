var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Income = require('../models/Income.js');
var config = require("../config/config.json");

/* GET users listing. */
router.get('/', function(req, res, next) {
  Income.find(function(err, incomes){
    if(err) return next(err);
    res.json(incomes);
  })
});

module.exports = router;
