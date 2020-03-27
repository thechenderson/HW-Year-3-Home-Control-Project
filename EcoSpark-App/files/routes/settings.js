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
    var sqlD = "SELECT users.username AS username, users.displayName AS displayName, users.isAdmin AS isAdmin, users.password AS password, users.homeID AS homeID FROM users, homes WHERE users.homeID = homes.homeID AND users.username ='" + req.params.username + "'";
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
    // sql to get the users homeID
    var sql = "SELECT homeID FROM users WHERE users.username = '" + req.session.user +"'";
    connection.query(sql, function(err, result, fields) {
      // index result to get the homeID without sql jargon
      var homeID = result[0].homeID;
      // query using homeID
      var sql2 = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.devicePower AS devicePower, devices.roomID AS roomID FROM devices, rooms, homes WHERE homes.homeID = rooms.homeID AND rooms.roomID = devices.roomID AND homes.homeID = '"+homeID+"'";
      connection.query(sql2, function(err, result2, fields) {
        // render page 
        res.render('manage-devices', ({ title: 'Express' },{devices: result2}));
      });
    });
  } else {
    res.redirect('/');
  }
});



// delete rooms and re-assign home?
router.get('/manage-home', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'";
    connection.query(sql, function(err, result, fields) {
      res.render('manage-home', ({ title: 'Express' }, {rooms: result}));
    });
  } else {
    res.redirect('/');
  }
});

router.get('/help', function(req, res, next) {
  if (req.session.loggedin){
      res.render('help', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
});

module.exports = router;