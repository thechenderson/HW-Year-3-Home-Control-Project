var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: "root",
  password: "countlich1",
  database: "ecoSpark",
});

router.get('/', function(req, res, next) {
    if (req.session.loggedin){

      var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType FROM users, rooms, homes WHERE users.username = homes.username AND homes.roomID = rooms.roomID AND users.username = '" + req.session.user + "'";
      connection.query(sql, function (err, result, fields) {
        console.log("quer rooms " + result);
      
      
        res.render('rooms', ({ title: 'Express' },{rooms: result}));
      });
    } else {
      res.render('index', { title: 'Express' });
    }
  });
module.exports = router;
