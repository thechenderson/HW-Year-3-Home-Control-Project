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


function totalUsage(dataArray) {
  var totalU = 0;
  for (var i = 0; i < dataArray.length; i++) {
    if (!(dataArray[i].rDeviceDisplayName == "Outside")) {
      totalU += dataArray[i].rDevicePower;
    }
  }
  console.log("in totalU()...\n");
  console.log(totalU);
  return totalU;
}


function totalGeneration(dataArray) {
  var totalG = 0;
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i].rDeviceDisplayName == "Outside") {
      totalG += dataArray[i].rDevicePower;
    }
  }
  console.log("in total()...\n");
  console.log(totalG);
  return totalG;
}




router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    let currDate = new Date().toLocaleDateString('en-GB');
    var sqlAH = "SELECT averagesForH.homeID AS homeID, averagesForH.date AS date, averagesForH.averOverallPower AS averOverallPower, averagesForH.powerLimit AS powerLimit FROM averagesForH, homes, users WHERE users.homeID = homes.homeID AND homes.homeID = averagesForH.homeID AND users.username = '" + req.session.user + "' AND averagesForH.date = '" + currDate + "'";
    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
      home = result[0].homeID;
      var sqlHN = "SELECT homeName FROM homes WHERE homeID = '" + home + "'";
      connection.query(sqlHN, function (err, result2, fields) {
        homeName = result2[0].homeName;
        var sqlT = "SELECT rooms.roomDisplayName AS rDeviceDisplayName, SUM(runningDevices.rDevicePower) AS rDevicePower FROM runningDevices, homes, rooms  WHERE runningdevices.roomID = rooms.roomID AND rooms.homeID = homes.homeID AND homes.homeID = '" + result[0].homeID + "' GROUP BY runningDevices.roomID";
        connection.query(sqlT, function (err, result3, fields) {
          var totalU = totalUsage(result3);
          var totalG = totalGeneration(result3);
          Promise.all([
            queryWrapper(sqlAH)
          ])
            .then(([averagesHInfo]) => {
              res.render('energy-data', {
                title: 'Express',
                averagesHInfo,
                home,
                homeName,
                totalU,
                totalG
              });
            });
        });
      });
    });
    // res.render('energy-data', { title: 'Express' });
  } else {
    res.redirect('/');
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