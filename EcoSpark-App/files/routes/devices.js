var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});

const queryWrapper = (statement) => {
  return new Promise((resolve, reject) => {
      connection.query(statement, (err, result) => {
          if(err)
              return reject(err);
          resolve(result);
      });
  });
};


router.get('/', function(req, res, next) {
  if (req.session.loggedin){
    
    var sqlR = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";
    var sqlD = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.devicePower AS devicePower, devices.roomID AS roomID FROM devices, rooms, users, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND rooms.roomID = devices.roomID AND users.username = '" + req.session.user + "'";
    var sqlF = "SELECT faults.deviceID AS fDeviceID, faults.deviceDisplayName AS fDeviceDisplayName, faults.roomDisplayName AS fRoomDisplayName, faults.faultInfo AS faultInfo FROM faults";
    var sqlC = "SELECT runningdevices.rDeviceID AS rDeviceID, runningdevices.rDeviceDisplayName AS rDeviceDisplayName, runningdevices.rDevicePower AS rDevicePower, runningdevices.roomID AS rRoomID FROM runningdevices";
   
    Promise.all([
      queryWrapper(sqlR),
      queryWrapper(sqlD),
      queryWrapper(sqlF),
      queryWrapper(sqlC)
    ])
    .then(([roomInfo, deviceInfo, faultInfo, runningDeviceInfo]) => {
        res.render('devices', {
            title: 'Express',
            roomInfo,
            deviceInfo,
            faultInfo,
            runningDeviceInfo
        });
    });
    } else {
    res.redirect('/');
  }
});


router.get('/add-device', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "';";
    connection.query(sql, function (err, result, fields) {
      res.render('add-device', ({ title: 'Express' },{rooms: result}));
    });
  } else {
    res.redirect('/home/devices');
  }
});

router.get('/:deviceID', function(req, res, next) {
  if (req.session.loggedin){
    var sqlD = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID FROM devices, homes, users WHERE  users.username = 'Rebecca' AND homes.homeID = users.homeID AND homes.homeID = users.homeID AND devices.deviceID =  '" + req.params.deviceID + "'";
    var sqlR = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM rooms WHERE rooms.roomID = "+ req.params.deviceID + ";"; 
    var sqlC = "SELECT runningdevices.rDeviceID AS rDeviceID, runningdevices.rDevicePower AS rDevicePower FROM runningdevices WHERE runningdevices.rDeviceID = '" + req.params.deviceID + "';";
   
    Promise.all([
      queryWrapper(sqlR),
      queryWrapper(sqlD),
      queryWrapper(sqlC)
    ])
    .then(([roomInfo, deviceInfo, runningDeviceInfo]) => {
      res.render('specific-device', {
          title: 'Express',
          roomInfo,
          deviceInfo,
          runningDeviceInfo
      });
  });
  } else {
    res.redirect('/');
  }
});

router.post('/:deviceID/updateDeviceName', function(request, response) {
  var sql =  "UPDATE devices SET deviceDisplayName = '" + request.body.deviceName + "' WHERE deviceID = '" + request.params.deviceID + "'";
    connection.query(sql, function (err, result, fields) {
      if(result== ""){
        response.redirect('/home');
      } else {
        response.redirect('/home/devices/' +request.params.deviceID );
      }
    });
});

router.post('/createDevice', function(request, response) {
  var deviceNameOld = request.body.deviceName;
  var deviceType = request.body.deviceType;
  var deviceRoomID = request.body.deviceRoomID
  console.log(deviceRoomID);

  var deviceName = deviceNameOld.replace(/[^a-zA-Z0-9\s]/g,"");
  
  if (deviceName && deviceType && deviceRoomID) { 
        var sql9 = "INSERT INTO devices VALUES ('0', '" + deviceName + "', '0', '" + deviceType + "', '" + deviceRoomID + "')";
        connection.query(sql9, function (err, result4, fields) {
          console.log(result4);
          if (!result4) {
            response.redirect('/home/devices/add-device');
          } else {
            var sql8 = "SELECT deviceDisplayName FROM devices WHERE deviceDisplayName = '" + deviceName + "'";
            connection.query(sql8, function (err, result3, fields) {
            if (result3 != "") {
                response.redirect('/home/devices');
              } else {
                response.redirect('/home/devices/add-device');
              }			
              response.end();
            });
          }
        });
  } else {
    response.redirect('/home/devices/add-device');
    response.end();
  }
});



module.exports = router;
