
var express = require('express');
var router = express.Router();
var mysql = require('mysql');


const queryWrapper = (statement) => {
  return new Promise((resolve, reject) => {
      connection.query(statement, (err, result) => {
          if(err)
              return reject(err);
          resolve(result);
      });
  });
};


var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});

// var manageusers = require('./manage-users');
// var managedevices = require('./manage-devices');
// var managerooms = require('./manage-rooms');
// var help = require('./help');


router.get('/', function(req, res, next) {
  if (req.session.loggedin){
    res.render('settings', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});


router.get('/manage-users', function(req, res, next) {
  if (req.session.loggedin){
    // sql to get the users homeID
    var sql = "SELECT homeID FROM users WHERE users.username = '" + req.session.user +"'";
    connection.query(sql, function(err, result, fields) {
      // index result to get the homeID without sql jargon
      var homeID = result[0].homeID;
      // query using homeID
      var sql2 = "SELECT username, displayName FROM users WHERE homeID = '" + homeID + "'";
      connection.query(sql2, function(err, result2, fields) {
        // render page 
        res.render('manage-users', ({ title: 'Express' },{users: result2}));
      });
    });
  } else {
    res.redirect('/');
  }
});

// when clicking on a user
router.get('/manage-users/:username', function(req, res, next) {
  if (req.session.loggedin){
    var sqlD = "SELECT users.username AS username, users.displayName AS displayName, users.isAdmin AS isAdmin FROM users, homes, rooms WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";
    Promise.all([
        queryWrapper(sqlD),
    ])
    .then(([userInfo]) => {
        res.render('specific-user', {
            title: 'Express',
            userInfo
        });
    });
  } else {
    res.redirect('/');
  }
});





router.get('/manage-devices', function(req, res, next) {
  if (req.session.loggedin){
    console.log(req.session.user + "abcdefg");
    var sql = "SELECT devices.deviceID AS deviceID, devices.deviceDisplayName AS deviceDisplayName FROM devices, users, rooms, homes WHERE users.username ='" + req.session.user +"' AND users.homeID = homes.homeID AND rooms.homeID = homes.homeID AND devices.roomID = rooms.roomID";
    connection.query(sql, function(err, result, fields) {
      res.render('manage-devices', ({ title: 'Express' }, {devices: result}));
    });
  } else {
    res.redirect('/');
  }
});

// router.use('/manage-users', manageusers);
// router.use('/manage-devices', managedevices);
// router.use('/manage-rooms', managerooms);
// router.use('/help', help);

module.exports = router;