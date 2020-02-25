require('dotenv').config()

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

var settingsRouter = require('./routes/settings');


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

app.use('/settings', settingsRouter);


  var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
  });
  
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("OK");
  });



  app.post('/validate', function(request, response) {
    var usernameOld = request.body.username;
    var passwordOld = request.body.password;
    var username = usernameOld.replace(/[^a-zA-Z0-9]/g,"");
    var password = passwordOld.replace(/[^a-zA-Z0-9]/g,"");
    console.log(username);
    console.log(password);
    if (username && password) {
      var sql = "SELECT displayName FROM users WHERE username = '" + username + "' AND password ='" + password + "'";
      connection.query(sql, function (err, result, fields) {
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
    var usernameOld = request.body.username;
    var password1Old = request.body.password1;
    var password2Old = request.body.password2;
    var nicknameOld = request.body.nickname;

    var username = usernameOld.replace(/[^a-zA-Z0-9]/g,"");
    var password1 = password1Old.replace(/[^a-zA-Z0-9]/g,"");
    var nickname = nicknameOld.replace(/[^a-zA-Z0-9]/g,"");
    var password2 = password2Old.replace(/[^a-zA-Z0-9]/g,"");


    if (username && nickname && (password1 == password2)) {

        var sql = "INSERT INTO users VALUES ('" + username + "', '" + password1 + "','1', '" + nickname + "')";
        connection.query(sql, function (err, result, fields) {
          if (!result) {
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

  app.post('/createRoom', function(request, response) {
    var roomNameOld = request.body.roomName;
    var roomIDOld = request.body.roomID;
    var roomTypeOld = request.body.roomType;

    var roomName = roomNameOld.replace(/[^a-zA-Z0-9\s]/g,"");
    var roomID = roomIDOld.replace(/[^a-zA-Z0-9]/g,"");
    var roomType = roomTypeOld.replace(/[^a-zA-Z0-9]/g,"");
    
    if (roomName && roomType && roomID) {
      
          var sql4 = "INSERT INTO rooms VALUES ('" + roomID + "', '" + roomName + "', '" + roomType + "')";
          connection.query(sql4, function (err, result4, fields) {
            console.log(result4);
            if (!result4) {
              response.redirect('/add-room');
            } else {
           
          
              var sql2 = "INSERT INTO homes VALUES('" + request.session.user + "', '" + roomID + "')";
              connection.query(sql2, function (err, result2, fields) {
                console.log(result2);
              });
      
              var sql3 = "SELECT roomDisplayName FROM rooms WHERE roomDisplayName = '" + roomName + "'";
              connection.query(sql3, function (err, result3, fields) {
              if (result3 != "") {
                  response.redirect('/rooms');
                } else {
                  response.redirect('/add-room');
                }			
                response.end();
              });
            }
          });
    } else {
      response.redirect('/add-room');
      response.end();
    }
  });





  app.post('/addRoomCode', function(request, response) {
    var roomIDOld = request.body.roomIDC;
    var roomID = roomIDOld.replace(/[^a-zA-Z0-9]/g,"");
    console.log(roomID);
    if (roomID) {
          var sql5 = "INSERT INTO homes VALUES('" + request.session.user + "', '" + roomID + "')";
          connection.query(sql5, function (err, result5, fields) {
            if (!result5) {
              console.log(result5);
              response.redirect('/add-room');
            } else {
              var sql6 = "SELECT username FROM homes WHERE username = '" + request.session.user + "'";
              connection.query(sql6, function (err, result6, fields) {
              if (result6 != "") {
                  response.redirect('/rooms');
                } else {
                  response.redirect('/add-room');
                }			
                response.end();
              });
            }
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
