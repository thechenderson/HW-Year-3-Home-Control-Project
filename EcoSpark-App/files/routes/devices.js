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
      if (err)
        return reject(err);
      resolve(result);
    });
  });
};

router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    // var $ = require('jQuery');

    var sqlR = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";
    var sqlD = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.devicePower AS devicePower, devices.roomID AS roomID FROM devices, rooms, users, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND rooms.roomID = devices.roomID AND users.username = '" + req.session.user + "'";
    var sqlF = "SELECT faults.deviceID AS fDeviceID, faults.deviceDisplayName AS fDeviceDisplayName, faults.roomDisplayName AS fRoomDisplayName, faults.faultInfo AS faultInfo FROM faults";
    var sqlC = "SELECT runningdevices.rID AS rDeviceID, runningdevices.rDeviceDisplayName AS rDeviceDisplayName, runningdevices.rDevicePower AS rDevicePower, runningdevices.roomID AS rRoomID FROM runningdevices, rooms, users, homes WHERE runningdevices.roomID = rooms.roomID AND users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";
    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
      console.log(result[0].homeID);
      home = result[0].homeID;
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
            runningDeviceInfo,
            home
          });
        });
    });
  } else {
    res.redirect('/');
  }
});

router.get('/add-device', function (req, res, next) {
  if (req.session.loggedin) {
    var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "';";
    connection.query(sql, function (err, result, fields) {
      res.render('add-device', ({ title: 'Express' }, { rooms: result }));
    });
  } else {
    res.redirect('/home/devices');
  }
});

router.get('/:deviceID', function (req, res, next) {
  if (req.session.loggedin) {
    var sqlD = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID FROM devices, homes, users, rooms WHERE  users.username = '" + req.session.user + "' AND homes.homeID = users.homeID AND rooms.homeID = homes.homeID AND rooms.roomID = devices.roomID AND devices.deviceID =  '" + req.params.deviceID + "'";
    var sqlR = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomID AS roomID FROM rooms WHERE rooms.roomID = " + req.params.deviceID + ";";
    var sqlC = "SELECT runningdevices.rID AS rDeviceID, runningdevices.rDeviceDisplayName AS rDeviceDisplayName, runningdevices.rDevicePower AS rDevicePower, runningdevices.rDeviceType AS rDeviceType FROM runningdevices WHERE runningdevices.deviceID = '" + req.params.deviceID + "';";
    var sqlU = "SELECT users.isAdmin AS isAdmin FROM users WHERE users.username = '" + req.session.user + "'";
    Promise.all([
      queryWrapper(sqlR),
      queryWrapper(sqlD),
      queryWrapper(sqlC),
      queryWrapper(sqlU)
    ])
      .then(([roomInfo, deviceInfo, runningDeviceInfo, userInfo]) => {
        res.render('specific-device', {
          title: 'Express',
          roomInfo,
          deviceInfo,
          runningDeviceInfo,
          userInfo
        });
      });
  } else {
    res.redirect('/');
  }
});

router.post('/:deviceID/updateDeviceName', function (request, response) {
  var sql = "UPDATE devices SET deviceDisplayName = '" + request.body.deviceName + "' WHERE deviceID = '" + request.params.deviceID + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home');
    } else {
      response.redirect('/home/devices/' + request.params.deviceID);
    }
  });
});

router.post('/:deviceID/deleteDevice', function (request, response) {
  // console.log(request.body.Update);
  var sqlF = "DELETE FROM faults WHERE deviceID = '" + request.params.deviceID + "';";
  connection.query(sqlF, function (err, result, fields) {
    var sqlC = "DELETE FROM changes WHERE deviceID = '" + request.params.deviceID + "';";
    connection.query(sqlC, function (err, result, fields) {
      var sqlR = "DELETE FROM runningdevices WHERE deviceID = '" + request.params.deviceID + "';";
      connection.query(sqlR, function (err, result, fields) {
        var sqlD = "DELETE FROM devices WHERE deviceID = '" + request.params.deviceID + "'";
        connection.query(sqlD, function (err, result, fields) {
          if (result == "") {
            response.redirect('/home');
          } else {
            console.log("Record deleted");
            response.redirect('/home/devices/');
          }
        });
      });
    });
  });
});


router.post('/:deviceID/On-Off', function (request, response) {
  // console.log(request.params.roomID);
  var sqlCheck = "SELECT deviceID FROM runningDevices WHERE deviceID = '" + request.params.deviceID + "'";
  connection.query(sqlCheck, function (err, result, fields) {
    if (result == "") {
      var sql1 = "SELECT devicePower, deviceType, deviceDisplayName, roomID FROM devices WHERE deviceID = '" + request.params.deviceID + "'";
      connection.query(sql1, function (err, result2, fields) {
        var power = result2[0].devicePower;
        var type = result2[0].deviceType;
        var deviceDisplayName = result2[0].deviceDisplayName;
        var roomID = result2[0].roomID;
        console.log(roomID);
        var sql2 = "INSERT INTO runningDevices VALUES ('0', '" + deviceDisplayName + "', '" + power + "', '" + type + "', '" + request.params.deviceID + "', '" + roomID + "')";
        connection.query(sql2, function (err, result2, fields) {
          if (result2 == "") {
            response.redirect('/home/');
          } else {
            response.redirect('/home/devices/' + request.params.deviceID);
          }
        });
      });
    } else {
      var sql3 = "DELETE FROM runningDevices WHERE runningDevices.deviceID='" + request.params.deviceID + "';"
      connection.query(sql3, function (err, result3, fields) {
        if (result3 == "") {
          response.redirect('/home/');
        } else {
          response.redirect('/home/devices/' + request.params.deviceID);
        }
      });
    }
  });
});

router.post('/turnOffDevice:rdeviceID', function (request, response) {
  console.log(request.params.deviceID);
  var sql = "DELETE FROM runningDevices WHERE runningDevices.rID='" + request.params.rdeviceID + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home');
    } else {
      response.redirect('/home/devices/');
    }
  });
});

router.post('/createDevice', function (request, response) {
  var deviceNameOld = request.body.deviceName;
  var deviceType = request.body.deviceType;
  var deviceRoomID = request.body.deviceRoomID

  var deviceName = deviceNameOld.replace(/[^a-zA-Z0-9\s]/g, "");

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

router.get('/my-account', function (req, res, next) {
  if (req.session.loggedin) {
    console.log(req.session.user);
    var sql = "SELECT users.username AS username, users.password AS password, users.isAdmin AS isAdmin, users.displayName AS displayName, users.homeID AS homeID, homes.homeName AS homeName FROM users, homes WHERE users.username ='" + req.session.user + "' AND users.homeID = homes.homeID;";
    connection.query(sql, function (err, result, fields) {
      res.render('my-account', ({ title: 'Express' }, { users: result }));
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
