var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});


router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      var sql = "SELECT users.username AS username, users.displayName AS displayName FROM users, homes WHERE users.homeID = homes.homeID";
      connection.query(sql, function(err, result, fields) {
      res.render('manage-users', ({ title: 'Express' }, {users: result}));
      });
    } else {
      res.redirect('/');
    }
  });

  
module.exports = router;
