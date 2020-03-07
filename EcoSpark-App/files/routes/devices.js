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
      var sql = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID FROM devices, homes WHERE  homes.roomID = devices.roomID AND homes.username = '" + req.session.user + "'";
      connection.query(sql, function (err, result, fields) {
        res.render('devices', ({ title: 'Express' },{devices: result}));
      });
    } else {
      res.redirect('/');
    }
  });


router.get('/add-device', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM users,rooms, homes WHERE users.username = homes.username AND homes.roomID = rooms.roomID AND users.username = '" + req.session.user + "'";
    connection.query(sql, function (err, result, fields) {
      res.render('add-device', ({ title: 'Express' },{rooms: result}));
    });
  } else {
    res.redirect('/');
  }
});


router.get('/:deviceID', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID FROM devices, homes WHERE  homes.roomID = devices.roomID AND homes.username = '" + req.session.user + "' AND devices.deviceID =  '" + req.params.deviceID + "'";
    connection.query(sql, function (err, result, fields) {
      if(result== ""){
        res.redirect('/devices');
      } else {
        res.render('specific-device', ({ title: 'Express' },{deviceInfo: result}));
      }
    });
    
  } else {
    res.redirect('/');
  }
});






router.post('/updateDeviceName', function(request, response) {
  var deviceName = request.body.deviceName;
  response.redirect('/devices');
});



router.post('/createDevice', function(request, response) {
  var deviceNameOld = request.body.deviceName;
  var deviceType = request.body.deviceType;
  var deviceRoomID = request.body.deviceLocation
  console.log(deviceRoomID);

  var deviceName = deviceNameOld.replace(/[^a-zA-Z0-9\s]/g,"");
  
  if (deviceName && deviceType && deviceRoomID) {
    
        var sql9 = "INSERT INTO devices VALUES ('0', '" + deviceName + "', '0', '" + deviceType + "', '" + deviceRoomID + "')";
        connection.query(sql9, function (err, result4, fields) {
          console.log(result4);
          if (!result4) {
            response.redirect('/devices/add-device');
          } else {
            var sql8 = "SELECT deviceDisplayName FROM devices WHERE deviceDisplayName = '" + deviceName + "'";
            connection.query(sql8, function (err, result3, fields) {
            if (result3 != "") {
                response.redirect('/devices');
              } else {
                response.redirect('/devices/add-device');
              }			
              response.end();
            });
          }
        });
  } else {
    response.redirect('/devices/add-device');
    response.end();
  }
});





module.exports = router;
