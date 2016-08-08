var passportLocal = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

var validPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
}

module.exports = function(passport){ 
  passport.use('login', new passportLocal(
    {passReqToCallback: true},    // allows to pass the entire request (req) to the callback
    function(req, username, password, done) {
      User.findOne({username:username}, function(err, user) {
        if (err){
          console.log('Error writing to database' + err);
          return done(err);
        }
        if (!user){
          console.log('User does not exists with username ' + username);
          //return done(null, false, {message: 'User does not exists.'});
          return done(null, false, req.flash('loginMessage', 'No user found with this username.')); // req.flash is the way to set flashdata using connect-flash
        }
        if (!validPassword(user, password)){
          console.log('Wrong Password');
          //return done(null, false, {message: 'Entered Wrong Password'});
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
        }
        return done(null, user);
      });
    }
  ));
}
