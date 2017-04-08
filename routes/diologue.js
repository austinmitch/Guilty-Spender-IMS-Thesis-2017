var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Diologue = require('../models/Diologue.js');
var config = require("../config/config.json");

router.get('/api/bad', function(req,res,next){
  Diologue.find(function(err,dioResponse){
    if(err) return next(err);
    var dio = dioResponse[0].dio_bad;
    res.json(dio);
  });
});

router.get('/api/good', function(req,res,next){
  Diologue.find(function(err,dioResponse){
    if(err) return next(err);
    var dio = dioResponse[0].dio_good;
    console.log(dio);
    res.json(dio);
  });
});

module.exports = router;
