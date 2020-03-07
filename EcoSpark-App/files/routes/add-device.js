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
    var sql = "SELECT rooms.roomDisplayName AS roomDisplayName FROM users,rooms,homes WHERE users.username = homes.username AND homes.roomID = rooms.roomID AND users.username = '" + req.session.user + "'";
    connection.query(sql, function (err, result, fields) {
      res.render('add-device', ({ title: 'Express' },{rooms: result}));
    });
  } else {
    res.redirect('/');
  }
});


module.exports = router;
