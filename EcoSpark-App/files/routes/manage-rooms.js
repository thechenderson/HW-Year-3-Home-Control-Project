var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT rooms.roomID AS roomID, rooms.roomDisplayName AS roomDisplayName FROM users, rooms, homes WHERE users.username ='" + req.session.user  +"' AND users.homeID = homes.homeID AND rooms.homeID = homes.homeID;";
    connection.query(sql, function(err, result, fields) {
      res.render('manage-rooms', ({ title: 'Express' }, {rooms: result}));
    });
  } else {
    res.redirect('/');
  }
});
module.exports = router;
