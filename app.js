var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

/* Connect to mongo db. */
require('./db')();

var app = express();

/* View engine setup. */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Uncomment after placing your favicon in /public */
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Required for passport. */
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
/* Persistent login sessions. */
app.use(passport.session());
/* Use connect-flash for flash messages stored in session. */
app.use(flash());

/* Passport configuration. */
require('./passportSetup/initSession')(passport);

app.use('/', routes);
app.use('/users', users);

/* Catch 404 and forward to error handler. */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/* Error handlers. */

/* Development error handler will print stacktrace. */
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.ejs', {
      message: err.message,
      error: err
    });
  });
}

/* Production error handler no stacktraces leaked to user. */
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.ejs', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
