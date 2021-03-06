const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
const router = require('express').Router()

module.exports = function(DB, app) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
      DB.findOrCreateUser(profile, accessToken, refreshToken)
      .then(user => {
        cb(null, user)
      })
      .catch(error => {
        cb(error)
      })
    }
  ));

  passport.serializeUser(function(user,done){
    done(null,user.id)
  })
  passport.deserializeUser(function(id,done){
    DB.findUserById(id)
    .then(user => {
      done(null,user)
    })
    .catch(error => {
      done(error)
    })
  })
  app.use(passport.initialize());
  app.use(passport.session());
  
  router.get('/login', (req,res) => {
    res.render('login');
  })

  router.post('/login',
    passport.authenticate('facebook', { scope: ['public_profile'] }));
  
  router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/');
  });

  return router
}
