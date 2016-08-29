var express = require('express');
var router = express.Router();
var passport = require('passport');
var Event = require('../models/event');
var User = require('../models/user');

/* Used to protect routes. */
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/* GET main page. */
router.get('/', function(req, res) {
  res.render('index.ejs');
});

/* GET login page. */
router.get('/login', function(req, res) {
  res.render('login.ejs', { message: req.flash('loginMessage') });
});

/* GET signup page. */
router.get('/signup', function(req, res) {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});

/* POST login page. */
router.post('/login',
  passport.authenticate('login', {
    successRedirect: '/validuser', failureRedirect: '/invaliduser', failureFlash : true
  })
);

/* POST signup page. */
router.post('/signup',
  passport.authenticate('signup', {
    successRedirect: '/validuser', failureRedirect: '/invaliduser', failureFlash : true
  })
);

/* User authenticated. signup/login successful. */
router.get('/validuser', function(req, res){
  res.json({'success': true});
});

/* If user login/signup credentails are not valid. */
router.get('/invaliduser', function(req, res){
  res.json({'success': false});
});

/* GET home page. */
router.get('/home', isAuthenticated, function(req, res){
  res.render('home.ejs', {user: req.user});
});

/* POST add an event. */
router.post('/addevent', isAuthenticated, function(req, res) {
  req.body.username = req.user.username;
  Event.create(req.body, function(error, docs){
    if (error){
      res.json(error);
    } else{
      res.json(docs);
    }
  });
});

/* GET all events. */
router.get('/getevents', isAuthenticated, function(req, res) {
  var query = Event.find({username: req.user.username});
  query.sort({startDate: 'asc'});
  query.exec(function(error, events){
    if (error) {
      res.json(error);
    } else {
      res.json(events);
    }
  });
});

/* GET event with google id. */
router.get('/getevent/:id', isAuthenticated, function(req, res) {
  var query = Event.find({username: req.user.username, googleId: req.params.id});
  query.exec(function(error, event){
    if (error) {
      res.json(error);
    } else {
      console.log(event);
      res.json(event);
    }
  });
});

/* POST search events based on start and end date. */
router.post('/searchevents', isAuthenticated, function(req, res) {
  var result = Event.find({username: req.user.username});
  if (req.body.startDate && !req.body.endDate) {
    result.where('startDate').eq(req.body.startDate);
  } else if (req.body.endDate && !req.body.startDate) {
    result.where('endDate').eq(req.body.endDate);
  } else if (req.body.endDate && req.body.startDate) {
    result.where('startDate').gte(req.body.startDate);
    result.where('endDate').lte(req.body.endDate);
  }
  result.sort({startDate: 'asc'});
  result.sort({startTime: 'asc'});
  result.exec(function(error, events){
    if (error) {
      res.json(error);
    } else {
      res.json(events);
    }
  });
});

/* Update evnet. */
router.put('/editevent/:id', isAuthenticated, function(req, res) {
  Event.update({_id: req.params.id}, req.body, {multi: true}, function(error, docs){
    if (error)
      res.json(error);
    else
      res.json(docs);
  });
});

/* DELETE event. */
router.delete('/delevent/:id', isAuthenticated, function(req, res) {
  Event.remove({_id: req.params.id}, function(error, docs){
    if (error)
      res.json(error);
    else
      res.json(docs);
  });
});

/* Update user information. */
router.put('/edituser', isAuthenticated, function(req, res) {
  User.update({username: req.user.username}, req.body, function(error, docs){
    if (error)
      res.json(error);
    else
      res.json(docs);
  });
});

/* GET logout page. */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
