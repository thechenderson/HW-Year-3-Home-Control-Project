var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      var sql = "SELECT devices.deviceID AS deviceID, devices.deviceDisplayName AS deviceDisplayName FROM devices, users, rooms, homes WHERE users.username ='" + req.session.user +"' AND users.homeID = homes.homeID AND rooms.homeID = homes.homeID AND devices.roomID = rooms.roomID;"
      connection.query(sql, function(err, result, fields) {
        res.render('manage-devices', ({ title: 'Express' }, {devices: result}));
      });
    } else {
      res.redirect('/');
    }
  });
module.exports = router;
