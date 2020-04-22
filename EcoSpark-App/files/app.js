require('dotenv').config()

// require packages
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// declare routers from routes folder to be used
var indexRouter = require('./routes/index'); //Login page
var signUpRouter = require('./routes/sign-up'); //Sign up page
var homeRouter = require('./routes/home'); //Dashboard
var energyDataRouter = require('./routes/energy-data'); //Energy data
var myAccountRouter = require('./routes/my-account'); //View current account details
var settingsRouter = require('./routes/settings'); //Settings
var helpRouter = require('./routes/help'); //Help usng the site
var graphRouter = require('./routes/graph'); //Graph creation

// declare the express engine
var app = express();
var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');

// start the engines and link views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// start sessions
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
// link routers
app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/home', homeRouter);
app.use('/energy-data', energyDataRouter);
app.use('/my-account', myAccountRouter);
app.use('/settings', settingsRouter);
app.use('/graph', graphRouter);
app.use('/help', helpRouter);

// declare sql connection
  var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
  });
  
  // check connected
  connection.connect(function(err) {
    if (err) {
      throw (err);
    }
      console.log("OK");
  });

  // validate users login details
  app.post('/validate', function(request, response) {
    // retrieve details from form
    var usernameOld = request.body.username;
    var passwordOld = request.body.password;
    // strip illegal tags
    var username = usernameOld.replace(/[^a-zA-Z0-9]/g,"");
    var password = passwordOld.replace(/[^a-zA-Z0-9]/g,"");
    console.log(username);
    console.log(password);
    // checks to make sure the users inputs arent empty
    if (username && password) {
      // prepare sql
      var sql = "SELECT displayName FROM users WHERE username = '" + username + "' AND password ='" + password + "'";
      connection.query(sql, function (err, result, fields) {
        // checks that the sql has worked
      if (result != "") {
        // create a loggin session
          request.session.loggedin = true;
          request.session.nickname = result[0].displayName;
          request.session.user = username;
          // redirect to home
          response.redirect('/home');
        } else {
          response.redirect('/');
          console.log(result);
        }			
        response.end();
      });
    } else {
      response.redirect('/');
      response.end();
    }
  });

  // create a new account from user
  app.post('/signUp', function(request, response) {
    var usernameOld = request.body.username;
    var password1Old = request.body.password1;
    var password2Old = request.body.password2;
    var nicknameOld = request.body.nickname;

    var username = usernameOld.replace(/[^a-zA-Z0-9]/g,"");
    var password1 = password1Old.replace(/[^a-zA-Z0-9]/g,"");
    var nickname = nicknameOld.replace(/[^a-zA-Z0-9]/g,"");
    var password2 = password2Old.replace(/[^a-zA-Z0-9]/g,"");

    
      if (username && nickname && (password1 == password2)) {
        var sql = "INSERT INTO users (username,password,isAdmin,displayName) VALUES ('" + username + "', '" + password1 + "','No', '" + nickname + "')";
        connection.query(sql, function (err, result, fields) {
        console.log(result);
          if (!result) {
            //when user already exists
            response.redirect('/sign-up');
          } else {
            var sql = "SELECT displayName FROM users WHERE username = '" + username + "'";
            connection.query(sql, function (err, result2, fields) {
              console.log(result2);
              if (result2 != "") {
                request.session.loggedin = true;
                request.session.nickname = result2[0].displayName;
                request.session.user = username;
                response.redirect('/home');
              } else {
                response.redirect('/sign-up');
              }			
              response.end();
            });
          }
        });
      } else {
        response.redirect('/sign-up');
        response.end();
      }
    
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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