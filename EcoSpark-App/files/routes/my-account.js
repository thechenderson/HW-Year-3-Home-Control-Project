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


router.get('/:username/updateUserDetails', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "UPDATE users SET password = '" + req.body.password + "', isAdmin = '" + req.body.isAdmin + "', displayName = '" + req.body.displayName + "' WHERE username ='" + req.session.user + "';" ;
    connection.query(sql, function(err, result, fields) {
      res.render('my-account', ({ title: 'Express' }, {users: result}));
    });
  } else {
    res.redirect('/');
  }
});
  
module.exports = router;