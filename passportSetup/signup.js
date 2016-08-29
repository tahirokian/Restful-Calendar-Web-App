var passportLocal = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/user');

/* Generates hash using bCrypt. */
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(passport){
  passport.use('signup', new passportLocal(
    {passReqToCallback: true},    /* allows to pass the entire request (req) to the callback. */
    function(req, username, password, done) {
      User.findOne({ 'username' :  username }, function(err, user) {
        /* If there is some error in signup. */
        if (err){
          return done(err);
        }
        /* If user already exists. */
        if (user) {
          return done(null, false, req.flash('signupMessage', 'Username is already taken.'));
        } else {
          /* Create the user in database. */
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.body.email;
          newUser.fullname = req.body.fullname;
          newUser.save(function(err) {
            /* If there is some error in saving user to database. */
            if (err){
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    }
  ));
};
