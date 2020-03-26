var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser')

var app = express();
var jsonParser = bodyParser.json();

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});


router.get('/:username', function(req, res, next) {

  var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database,
  });

  if (req.session.loggedin){
    let currDate = new Date().toLocaleDateString('en-GB');
    var sqlD = "SELECT users.username AS username, users.displayName AS displayName, users.isAdmin AS isAdmin FROM users, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";

    Promise.all([
        queryWrapper(sqlD),
    ])
    .then(([userInfo]) => {
        res.render('specific-users', {
            title: 'Express',
            userInfo
        });
    });
  } else {
    res.redirect('/');
  }

});


module.exports = router;