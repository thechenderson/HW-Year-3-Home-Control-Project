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
      var sql = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.roomID AS roomID, devices.devicePower AS devicePower FROM rooms, devices, homes, users WHERE users.username = homes.username AND homes.roomID = devices.roomID AND users.username = '" + req.session.user + "'";
      connection.query(sql, function (err, result, fields) {
        res.render('devices', ({ title: 'Express' },{devices: result}));
      });
    } else {
      res.redirect('/');
    }
});

router.get('/add-device', function(req, res, next) {
  if (req.session.loggedin){
    res.render('add-device', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
});

router.get('/:deviceID', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.roomID AS roomID, devices.devicePower AS devicePower FROM devices, devices, homes WHERE users.username = homes.username AND homes.roomID = devices.deviceID AND users.username = '" + req.session.user + "' AND devices.deviceID =  '" + req.params.deviceID + "'";
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

router.post('/:deviceID/updateDeviceName', function(request, response) {
  var sql =  "UPDATE devices SET deviceDisplayName = '" + request.body.deviceDisplayName + "' WHERE deviceID = '" + request.params.deviceID + "'";
    connection.query(sql, function (err, result, fields) {
      if(result== ""){
        response.redirect('/home');
      } else {
        response.redirect('/devices/' +request.params.deviceID );
      }
    });
});

router.post('/createDevice', function(request, response) {
  var deviceDisplayNameOld = request.body.deviceName;
  var deviceIDOld = request.body.deviceID;
  var deviceTypeOld = request.body.deviceType;
  var devicePowerOld = request.body.devicePower;
  var roomIDOld = request.body.roomID;

  var deviceDisplayName = deviceDisplayNameOld.replace(/[^a-zA-Z0-9\s]/g,"");
  var deviceID = deviceIDOld.replace(/[^a-zA-Z0-9]/g,"");
  var deviceType = deviceTypeOld.replace(/[^a-zA-Z0-9]/g,"");
  var devicePower = devicePowerOld.replace(/[^a-zA-Z0-9]/g,"");
  var roomID = roomIDOld.replace(/[^a-zA-Z0-9]/g,"");
  
  if (deviceDisplayName && deviceType && deviceID && devicePower && roomID) {
    
        var sql9 = "INSERT INTO devices VALUES ('" + deviceID + "', '" + deviceDisplayName + "', '" + devicePower + "', '" + deviceType + "', '" + roomID + "')";
        connection.query(sql9, function (err, result4, fields) {
          console.log(result4);
          
          if (!result4) {
            response.redirect('/devices/add-device');
          } else {
    
            var sql8 = "SELECT deviceDisplayName FROM devices WHERE deviceDisplayName = '" + deviceDisplayName + "'";
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


router.post('/addDeviceCode', function(request, response) {
  var deviceIDOld = request.body.deviceIDC;
  var deviceID = deviceIDOld.replace(/[^a-zA-Z0-9]/g,"");

  console.log(deviceID);
  
  if (deviceID) {
        var sql10 = "INSERT INTO rooms VALUES('" + request.session.user + "', '" + deviceID + "')";
        connection.query(sql10, function (err, result5, fields) {
          if (!result5) {
            console.log(result5);
            response.redirect('/add-device');
          } else {
            var sql11 = "SELECT username FROM homes WHERE username = '" + request.session.user + "'";
            connection.query(sql11, function (err, result6, fields) {
            if (result6 != "") {
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