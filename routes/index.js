var express = require('express');
var router = express.Router();

const models = require('../models');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);

  // Find all gabs in the messages table and display them appropriately
  // if the user is logged in or logged out
  models.message.findAll({
    order: [[ "createdAt", "DESC"]],
    include: [
      {
        model: models.user,
        as: "author"
      },
      {
        model: models.like,
        as: "likes",
        include: {
          model: models.user,
          as: "user"
        }
      }
    ]
  })
    .then( (messages) => {
      console.dir(messages);
      if( req.user ) {
        res.render('index', { title: 'Express',
                              username: req.user.profile.displayName,
                              messages: messages
                             });
      } else {
        res.render('index', { title: 'Express' });
      }
    })
    .catch( (err) => {
      res.status(500).send(err);
    })
});

// handle when the user clicks the like button next to a gab
router.post('/like/:id', function(req, res, next) {
  let newLike = models.like.build({
    messageId: req.params.id,
    userId: req.user.user_id
  });

  newLike.save()
    .then( function(savedLike) {
      res.redirect('/');
    })
    .catch( function(err) {
      res.status(500).send(err);
    })
})

router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Express', username: req.user.profile.displayName });
});

router.post('/create', function(req, res, next) {
  console.dir(req.body);

  let newGab = models.message.build({
    body: req.body.gab,
    authorId: req.user.user_id
  });
  newGab.save()
    .then( (savedGab) => {
      res.redirect('/');
    })
    .catch( (err) => {
      res.status(500).send(err);
    });
});

router.post('/delete/:id', function(req, res, next) {
  // get rid of a gab, get all the likes first
  models.like
    .destroy({
      where: {
        messageId: req.params.id
      }
    })
    .then( () => {
      models.message
        .destroy({
          where: {
            id: req.params.id
          }
        })
    })
    .then( () => {
      res.redirect('/');
    })
    .catch( (err) => {
      res.status(500).send(err);
    })
})

module.exports = router;
