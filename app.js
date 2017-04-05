var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require('./models/User.js');
var config = require('./config/config.json');

mongoose.connect('mongodb://localhost/guilty_spender', function(err) {
  if(err) {
    console.log('error connecting '+err);
  }else{
    console.log('connected');
  }
});

var index = require('./routes/index');
var users = require('./routes/users');
var expenses = require('./routes/expenses');
var purchases = require('./routes/purchases');
var avatar = require('./routes/avatar');
var diologue = require('./routes/diologue');

var app = express();

var storage = multer.diskStorage({
  destination: __dirname+'/public/www/img',
    filename: function (req, file, name) {
        name(null, file.fieldname + Date.now() + path.extname(file.originalname));
  }
});

var uploading = multer({storage:storage});

//login and regoister routes that store the user info in a global variable
//so it can be accessed by all routes
global.myuser;
users.post('/api/login', passport.authenticate('local'), function(req,res,next) {
  if(!req.user) {
    console.log('denied');
    res.redirect(config.urlBase+'login');
  }
  global.myuser = req.user;
  res.redirect(config.urlBase+'home');
});

users.post('/api/register', function(req, res) {
  User.register(new User({
      username: req.body.username,
      email: req.body.email
    }), req.body.password, function(err){
      if(err) {
        console.log('Registration failed');
      }
      passport.authenticate('local')(req, res, function() {
        myuser = req.user;
        res.redirect(config.urlBase+"information");
      });
  });
});

index.post('/upload', uploading.single('profilePic'), function(req,res){
  console.log(req.file.filename);
  res.send('Uploaded');
});


//allow access from other locations
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST","PUT", "OPTIONS");
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//login stuff
app.use(expressSession({ secret: 'SpottedRainbowTrucks', resave: false,
  saveUninitialized: true, key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', index);
app.use('/users', users);
app.use('/expenses', expenses);
app.use('/purchases', purchases);
app.use('/avatar', avatar);
app.use('/diologue', diologue);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
