var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  if( req.user ) {
    res.render('index', { title: 'Express', username: req.user.displayName });
  } else {
    res.render('index', { title: 'Express' });
  }
});

module.exports = router;
