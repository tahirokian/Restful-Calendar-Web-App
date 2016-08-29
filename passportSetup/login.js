var passportLocal = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var User = require('../models/user');

/* Check if password entered match to the stored password. */
var validPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

module.exports = function(passport){
  passport.use('login', new passportLocal(
    {passReqToCallback: true},    /* allows to pass the entire request (req) to the callback. */
    function(req, username, password, done) {
      User.findOne({username:username}, function(err, user) {
        /* If there is some error in finding user in database. */
        if (err){
          return done(err);
        }
        /* If username does not exist in database. */
        if (!user){
          /* req.flash is the way to set flashdata using connect-flash. */
          return done(null, false, req.flash('loginMessage', 'No user found with this username.'));
        }
        /* If saved and entered passwords dont match for the user. */
        if (!validPassword(user, password)){
           /* Create the loginMessage and save it to session as flashdata. */
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        }
        return done(null, user);
      });
    }
  ));
}
