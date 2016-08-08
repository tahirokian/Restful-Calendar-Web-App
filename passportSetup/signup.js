var passportLocal = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

// Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

module.exports = function(passport){
  passport.use('signup', new passportLocal(
    {passReqToCallback: true},    // allows to pass the entire request (req) to the callback
    function(req, username, password, done) {
      User.findOne({ 'username' :  username }, function(err, user) {
        if (err){
          console.log('Error in SignUp: ' + err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('This username exists already.');
          //return done(null, false, {message: 'Someone already has this username. Please try another.'});
          return done(null, false, req.flash('signupMessage', 'Username is already taken.'));
        } else {
          // create the user, if there is no user present with that email.
          var newUser = new User();
          newUser.username = username;
          newUser.password = createHash(password);
          newUser.email = req.body.email;
          newUser.fullname = req.body.fullname;
          newUser.save(function(err) {
            if (err){
              console.log('Error while saving the user: ' + err);  
              throw err;  
            }
            return done(null, newUser);
          });
        }
      });
    }
  ));
};
