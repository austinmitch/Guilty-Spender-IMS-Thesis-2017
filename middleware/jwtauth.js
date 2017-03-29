var User = require('../models/User.js');
var jwt = require('jwt-simple');
var config = require("../config/config.json");

module.exports = function(req,res,next) {
  var userToken = User.findOne({token:req.user.token});
  var token = userToken.token;
  if(token) {
    try {
      var decoded = jwt.decode(token, config.jwtTokenSecret);
      if(decoded.exp <= Date.now()) {
        res.redirect(config.urlBase+'login');
      } else {
        User.findOne({_id:decoded.iss}, function(err,currentUser) {
          res.json(currentUser);
        });
      }
    } catch(err) {
      return next();
    }
  } else {
    next();
  }
}
