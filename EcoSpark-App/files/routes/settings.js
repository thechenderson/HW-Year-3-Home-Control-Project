
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser')

var app = express();
var jsonParser = bodyParser.json();

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
    var sql = "SELECT users.username AS username, users.displayName AS displayName FROM users, rooms, homes WHERE users.username = '" + req.session.user +"' AND users.homeID = homes.homeID AND rooms.homeID = homes.homeID";
    connection.query(sql, function(err, result, fields) {
      res.render('manage-users', ({ title: 'Express' },{users: result}));
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