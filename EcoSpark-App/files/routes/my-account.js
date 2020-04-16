var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();
var jsonParser = bodyParser.json();

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      var sql = "SELECT users.username AS username, users.password AS password, users.isAdmin AS isAdmin, users.displayName AS displayName, users.homeID AS homeID FROM users WHERE users.username ='" + req.session.user + "'";
      connection.query(sql, function(err, result, fields) {
        res.render('my-account', ({ title: 'Express' }, {users: result}));
      });
    } else {
      res.redirect('/');
    }
});


//update name
router.post('/my-account/:username/updateUserName', function (req, response) {
  var username = req.params.username;
  var displayNameOld = req.body.username;
  var displayName = displayNameOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET displayName = '" + displayName + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/my-account');
    } else {
      console.log(result);
      response.redirect('/home/my-account/');
    }
  });
});

// update password
router.post('/my-account/:username/updateUserPW', function (req, response) {
  var username = req.params.username;
  var PWOld = req.body.password;
  var passwordNew = PWOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET password = '" + passwordNew + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/my-account');
    } else {
      console.log(result);
      response.redirect('/home/my-account/');
    }
  });
});

module.exports = router;