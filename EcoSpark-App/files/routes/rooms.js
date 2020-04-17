var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var deviceNameGraph = [], devicePowerGraph = [];
var jsonArray;

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});







router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";
    connection.query(sql, function (err, result, fields) {
      var sql2 = "SELECT homes.homeID, homes.homeName FROM users, homes WHERE users.username = '" + req.session.user + "' AND users.homeID = homes.homeID";
      connection.query(sql2, function (err, result2, fields) {
        if (result2 != "") {
          req.session.homeID = result2[0].homeID;
          var homeName = result2[0].homeName;
        }
        res.render('rooms', ({ title: 'Express' }, { rooms: result, home: req.session.homeID, homeName: homeName }));
      });
    });
  } else {
    res.redirect('/');
  }
});


router.get('/add-room', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('add-room', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
});

router.get('/add-home', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('add-home', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
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

// after clicking on a room button, it redirects to here by the path /home/rooms/roomID
// remember on the rooms.js page, '/' is the same as /rooms/
router.get('/:roomID', function (req, res, next) {
  if (req.session.loggedin) {
    let currDate = new Date().toLocaleDateString('en-GB');
    var sqlR = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType, rooms.roomID AS roomID, rooms.temperature AS temperature FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "' AND rooms.roomID =  '" + req.params.roomID + "';";
    var sqlD = "SELECT devices.deviceID AS deviceID, devices.deviceDisplayName AS deviceDisplayName, devices.devicePower AS devicePower, devices.deviceType AS deviceType FROM devices WHERE devices.roomID = '" + req.params.roomID + "';";
    var sqlAR = "SELECT averagesForR.roomID AS roomID, averagesForR.date AS date, averagesForR.averRoomPower AS averRoomPower FROM averagesForR WHERE averagesForR.date = '" + currDate + "' AND averagesForR.roomID = '" + req.params.roomID + "';";
    var sqlRD = "SELECT rDeviceDisplayName, rDevicePower, deviceID FROM runningdevices WHERE roomID = '" + req.params.roomID + "';";
    var sqlT = "SELECT SUM(rDevicePower) AS rDevicePower FROM runningDevices  WHERE roomID ='" + req.params.roomID + "';";
    connection.query(sqlT, function (err, roomT, fields) {
      roomTotal = roomT[0].rDevicePower;
      req.session.room = req.params.roomID

      connection.query(sqlRD, function (err, data, fields) {
        


        connection.query(sqlD, function (err, result, fields) {
          if (result != "") {
            var isDevice = result[0].deviceID;
          }
          Promise.all([
            queryWrapper(sqlR),
            queryWrapper(sqlD),
            queryWrapper(sqlAR),
            queryWrapper(sqlRD)
          ])
            .then(([roomInfo, deviceInfo, averagesRInfo, runningDevices]) => {
              res.render('specific-room', {
                title: 'Express',
                roomInfo,
                deviceInfo,
                averagesRInfo,
                runningDevices,
                isDevice,
                roomTotal
              });
            });
        });
      });
    });
  } else {
    res.redirect('/');
  }
});


router.post('/:roomID/updateHeating', function (request, response) {
  var temperature = request.body.heating;
  console.log(temperature);
  var sql = "UPDATE rooms SET temperature = '" + temperature + "' WHERE roomID = '" + request.params.roomID + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home');
    } else {
      response.redirect('/home/rooms/' + request.params.roomID);
    }
  });
});



router.post('/:roomID/update:deviceID', function (request, response) {
  var sqlCheck = "SELECT deviceID FROM runningDevices WHERE deviceID = '" + request.params.deviceID + "'";
  connection.query(sqlCheck, function (err, result, fields) {
    if (result == "") {
      var sql1 = "SELECT devicePower, deviceType, deviceDisplayName FROM devices WHERE deviceID = '" + request.params.deviceID + "'";
      connection.query(sql1, function (err, result2, fields) {
        var power = result2[0].devicePower;
        var type = result2[0].deviceType;
        var deviceDisplayName = result2[0].deviceDisplayName;
        var sql2 = "INSERT INTO runningDevices VALUES ('0', '" + deviceDisplayName + "', '" + power + "', '" + type + "', '" + request.params.deviceID + "', '" + request.params.roomID + "')";
        connection.query(sql2, function (err, result2, fields) {
          if (result2 == "") {
            response.redirect('/home');
          } else {
            response.redirect('/home/rooms/' + request.params.roomID);
          }
        });
      });
    } else {
      var sql3 = "DELETE FROM runningDevices WHERE runningDevices.deviceID='" + request.params.deviceID + "';";
      connection.query(sql3, function (err, result3, fields) {
        if (result3 == "") {
          response.redirect('/home');
        } else {
          response.redirect('/home/rooms/' + request.params.roomID);
        }
      });
    }
  });
});



router.post('/assignHome', function (request, response) {
  var homeIdOld = request.body.homeID;
  var homeID = homeIdOld.replace(/[^a-zA-Z0-9]/g, "");
  if (homeID) {
    var sql = "UPDATE users SET homeID = '" + homeID + "' WHERE username = '" + request.session.user + "'";
    connection.query(sql, function (err, result, fields) {

      if (result != "") {
        response.redirect('/home/rooms');
      } else {
        response.redirect('/home/rooms/add-home');
      }
      response.end();
    });
  }
});

router.post('/createHome', function (request, response) {
  var homeIdOld = request.body.homeID;
  var homeNameOld = request.body.homeName;

  var homeID = homeIdOld.replace(/[^a-zA-Z0-9]/g, "");
  var homeName = homeNameOld.replace(/[^a-zA-Z0-9\s]/g, "");
  console.log(homeID + "   " + homeName);
  if (homeID && homeName) {

    var sql1 = "INSERT INTO homes VALUES ('" + homeID + "', '" + homeName + "', '" + request.session.user + "')";
    connection.query(sql1, function (err, result1, fields) {
      console.log(result1 + "      insert homes");
      if (!result1) {
        response.redirect('/home/rooms/add-home');
      } else {

        var sql2 = "UPDATE users SET homeID = '" + homeID + "' WHERE username = '" + request.session.user + "'";
        connection.query(sql2, function (err, result2, fields) {
        });

        var sql3 = "UPDATE users SET isAdmin = 'Yes' WHERE username = '" + request.session.user + "'";
        connection.query(sql3, function (err, result3, fields) {
        });

        var sql4 = "SELECT homeName FROM homes WHERE homeID = '" + homeID + "'";
        connection.query(sql4, function (err, result4, fields) {
          if (result4 != "") {
            response.redirect('/home/rooms');
          } else {
            response.redirect('/home/rooms/add-home');
          }
          response.end();
        });
      }
    });
  } else {
    response.redirect('/home/rooms');
    response.end();
  }

});

router.post('/createRoom', function (request, response) {
  var roomNameOld = request.body.roomName;
  var roomTypeOld = request.body.roomType;

  var roomName = roomNameOld.replace(/[^a-zA-Z0-9\s]/g, "");
  var roomType = roomTypeOld.replace(/[^a-zA-Z0-9]/g, "");

  if (roomName && roomType) {

    var sql4 = "INSERT INTO rooms VALUES ('0', '" + roomName + "', '" + roomType + "', NULL, '" + request.session.homeID + "')";
    connection.query(sql4, function (err, result4, fields) {
      if (!result4) {
        response.redirect('/home/rooms/add-room');
      } else {
        var sql3 = "SELECT roomDisplayName FROM rooms WHERE roomDisplayName = '" + roomName + "'";
        connection.query(sql3, function (err, result3, fields) {
          if (result3 != "") {
            response.redirect('/home/rooms');
          } else {
            response.redirect('/home/rooms/add-room');
          }
          response.end();
        });
      }
    });
  } else {
    response.redirect('/home/rooms/add-room');
    response.end();
  }
});

router.get('/my-account', function (req, res, next) {
  if (req.session.loggedin) {
    console.log("hello" + req.session.user);
    var sql = "SELECT users.username AS username, users.password AS password, users.isAdmin AS isAdmin, users.displayName AS displayName, users.homeID AS homeID, homes.homeName AS homeName FROM users, homes WHERE users.username ='" + req.session.user + "' AND users.homeID = homes.homeID;";
    connection.query(sql, function (err, result, fields) {
      res.render('my-account', ({ title: 'Express' }, {}));
    });
  } else {
    res.redirect('/');
  }
});


module.exports = router;