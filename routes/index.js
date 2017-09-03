var express = require('express');
var router = express.Router();

const models = require('../models');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);

  // Find all gabs in the messages table and display them appropriately
  // if the user is logged in or logged out
  models.message.findAll()
    .then( (messages) => {
      console.log(messages);
      if( req.user ) {
        res.render('index', { title: 'Express',
                              username: req.user.profile.displayName,
                              messages: messages
                             });
      } else {
        res.render('index', { title: 'Express' });
      }
    })
});

router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Express', username: req.user.profile.displayName });
});

router.post('/create', function(req, res, next) {
  console.dir(req.body);
  models.message.create({
    body: req.body.gab,
    user_id: req.user.user_id
  })
  .then( (doc) => {
    console.log(`Gab created!`);
    res.redirect('/');
  })
})

module.exports = router;
