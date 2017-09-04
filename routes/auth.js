var express = require('express');
var router = express.Router();

let passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;


/* OAuth2 with Google */
router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

// this is the redirect that Google calls once the user has passed Google Auth.
router.get('/redirect',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/logout', (req,res,next) => {
  req.logout();
  res.redirect('/');
});


router.get('/local', (req, res, next) => {
  res.send('login');
});

router.post('/local', (req, res, next) => {

})

router.get('/register', (req, res, next) => {
  res.send('register');
});

router.post('/register', (req, res, next) => {
  
})

module.exports = router;
