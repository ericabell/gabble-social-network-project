var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
let passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

let session = require('express-session');

var index = require('./routes/index');
var auth = require('./routes/auth');

const models = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://localhost:3000/auth/redirect"
  },
  function(accessToken, refreshToken, profile, cb) {
    // check if we have any record of this user before by looking
    // for their Google ID in our users table
    models.user.findAll({
      where: {
        google_id: profile.id
      }
    })
    .then( (users) => {
      console.log(`Looked up Google ID and found:`);
      console.log(users);
      // if no results, we need to add an entry to our users table
      if( users.length === 0 ) {
        models.user.create({
          display_name: profile.displayName,
          google_profile_image_link: profile['_json'].image.url,
          username: null,
          password: null,
          google_id: profile.id
        })
        .then( (user) => {
          console.log('Created new user in users table!');
          return cb(null, {profile: profile['_json'], user_id: user.dataValues.id });
        })
      } else {
        console.log('We have seen this person before.');
        return cb(null, {profile: profile['_json'], user_id: users[0].dataValues.id })
      }
    })

    // There are two things I'm going to pass on to serializeUser
    // 1. the entire Google Profile object
    // 2. the user id in my users table for this user

    // I need item #2 because when a user creates a new message, this is
    // the number that I will need for the messages table entry.


  }
));

// serializeUser will specify what data we want to be stored in session for
// this authenticated user. It receives the user object from Google Strategy

passport.serializeUser(function(user, done) {

  done(null, {profile: user.profile, user_id: user.user_id});
});

// id gets passed whatever Express found in the session for the cookie sent
// by the user. id is going to be assigned the object we gave as the second
// argument to done at the end of serializeUser.
passport.deserializeUser(function(id, done) {
  let err = null;

  // I could also use the id passed to do some sort of local database lookup
  // and get that data to place into req.user. That would save space in session.

  // now this second argument is what gets placed in req.user by passport.
  // I could place everything in req.user, but here I'm only putting the
  // displayName and the link to a Google profile image for the user.
  done(err, {profile: id.profile, user_id: id.user_id});
});

app.use(session({ secret: 'key', // used to sign the session ID cookie
                  resave: false, // forces session to be saved, even if it didn't change
                  saveUninitialized: false, // forces an uninitialized session to be saved to the store
                })
        );

app.use(passport.initialize());
app.use(passport.session()); // be sure express-session is BEFORE passport-session


app.use('/', index);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
