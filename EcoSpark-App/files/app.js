var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var signUpRouter = require('./routes/sign-up');
var roomsRouter = require('./routes/rooms');
var energyDataRouter = require('./routes/energy-data');
var usersRouter = require('./routes/users');
var devicesRouter = require('./routes/devices');
var addRoomRouter = require('./routes/add-room');


var app = express();

var mysql = require('mysql');
var session = require('express-session');
var bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/sign-up', signUpRouter);
app.use('/rooms', roomsRouter);
app.use('/energy-data', energyDataRouter);
app.use('/devices', devicesRouter);
app.use('/users', usersRouter);
app.use('/add-room', addRoomRouter);



  var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    password: "countlich1",
    database: "ecoSpark",
  });
  
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("OK");
  });



  app.post('/validate', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    console.log(username);
    console.log(password);
    if (username && password) {
      var sql = "SELECT displayName FROM users WHERE username = '" + username + "' AND password ='" + password + "'";
      connection.query(sql, function (err, result, fields) {
      console.log(result[0].displayName);
      if (result != "") {
          request.session.loggedin = true;
          request.session.nickname = result[0].displayName;
          request.session.user = username;
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


  app.post('/signUp', function(request, response) {
    var username = request.body.username;
    var password1 = request.body.password1;
    var password2 = request.body.password2;
    var nickname = request.body.nickname;
    console.log(username);
    console.log(nickname);
    if (username && (password1 == password2)) {
      var sql = "INSERT INTO users VALUES ('" + username + "', '" + password1 + "','1', '" + nickname + "')";
      connection.query(sql, function (err, result, fields) {
        console.log(result);
      });
        
      var sql = "SELECT displayName FROM users WHERE username = '" + username + "'";
      connection.query(sql, function (err, result, fields) {
        console.log(result);
        if (result != "") {
            request.session.loggedin = true;
            request.session.nickname = result[0].displayName;
            request.session.user = username;
            response.redirect('/home');
          } else {
            response.redirect('/sign-up');
          }			
          response.end();
      });
    } else {
      response.redirect('/sign-up');
      response.end();
    }
  });

  app.post('/addRoom', function(request, response) {
    var roomName = request.body.roomName;
    var roomType = request.body.roomType;
    console.log(roomName);
    console.log(roomType);
    if (roomName && roomType) {
      var sql = "INSERT INTO rooms(roomDisplayName,roomType) VALUES ('" + roomName + "', '" + roomType + "')";
      connection.query(sql, function (err, result, fields) {
        console.log(result);
      });
      
      console.log("user" + request.session.user);
      var sql = "INSERT INTO homes(username) VALUES('" + request.session.user + "')";
      connection.query(sql, function (err, result, fields) {
        console.log(result);
      });
      
        
      var sql = "SELECT roomDisplayName FROM rooms WHERE roomDisplayName = '" + roomName + "'";
      connection.query(sql, function (err, result, fields) {
      if (result != "") {
          response.redirect('/rooms');
        } else {
          response.redirect('/add-room');
        }			
        response.end();
      });
    } else {
      response.redirect('/add-room');
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