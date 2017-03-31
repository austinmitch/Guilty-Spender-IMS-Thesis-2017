var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Avatar = require('../models/Avatar.js');
var config = require("../config/config.json");

router.get('/api/angry', function(req,res,next) {
  Avatar.find(function(err, aviResponse) {
    if(err) return next(err);
    var avi = aviResponse[0].avatar_angry;
    res.json(avi);
  });
});

router.get('/api/happy', function(req,res,next) {
  Avatar.find(function(err, aviResponse) {
    if(err) return next(err);
    var avi = aviResponse[0].avatar_happy;
    res.json(avi);
  });
});

module.exports = router;
