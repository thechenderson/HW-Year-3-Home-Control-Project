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
      var sql = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID FROM rooms, devices, homes, users WHERE users.username = homes.username AND homes.roomID = devices.roomID AND users.username = '" + req.session.user + "'";
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
    var sql = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID FROM devices, devices, homes WHERE users.username = homes.username AND homes.roomID = devices.deviceID AND users.username = '" + req.session.user + "' AND devices.deviceID =  '" + req.params.deviceID + "'";
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
  var deviceIDOld = request.body.deviceID;
  var deviceTypeOld = request.body.deviceType;

  var deviceName = deviceNameOld.replace(/[^a-zA-Z0-9\s]/g,"");
  var deviceID = deviceIDOld.replace(/[^a-zA-Z0-9]/g,"");
  var deviceType = deviceTypeOld.replace(/[^a-zA-Z0-9]/g,"");
  
  if (deviceName && deviceType && deviceID) {
    
        var sql9 = "INSERT INTO devices VALUES ('" + deviceID + "', '" + deviceName + "', '" + deviceType + "')";
        connection.query(sql9, function (err, result4, fields) {
          console.log(result4);
          if (!result4) {
            response.redirect('/add-device');
          } else {
         
        
            var sql7 = "INSERT INTO rooms VALUES('" + request.session.user + "', '" + deviceID + "')";
            connection.query(sql7, function (err, result2, fields) {
              console.log(result2);
            });
    
            var sql8 = "SELECT deviceDisplayName FROM devices WHERE deviceDisplayName = '" + deviceName + "'";
            connection.query(sql8, function (err, result3, fields) {
            if (result3 != "") {
                response.redirect('/devices');
              } else {
                response.redirect('/add-device');
              }			
              response.end();
            });
          }
        });
  } else {
    response.redirect('/add-device');
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
                response.redirect('/add-device');
              }			
              response.end();
            });
          }
        });
  } else {
    response.redirect('/add-device');
    response.end();
  }
});



module.exports = router;
