var express = require('express');
var router = express.Router();

var rooms = require('./rooms');
var energydata = require('./energy-data');
var devices = require('./devices');
var settings = require('./settings');
var myaccount = require('./my-account');
var mysql = require('mysql');


var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});


router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      const https = require('https');

      https.get('https://api.darksky.net/forecast/f54fa35918d8224632c548e17c835047/25.2048, 55.2708?units=uk2', (resp) => {
      let data = '';
  
      resp.on('data', (chunk) => {
        data += chunk;
      });
      
      resp.on('end', () => {
        console.log(JSON.parse(data).currently.windSpeed);
        console.log(JSON.parse(data).currently.precipProbability);
        console.log("YES");
        var sqlF = "SELECT faults.faultID AS faultID, faults.deviceID AS deviceID, faults.deviceDisplayName AS deviceDisplayName, faults.roomDisplayName AS roomDisplayName, faults.faultInfo AS faultInfo, devices.deviceDisplayName AS deviceDisplayName FROM faults, devices, rooms, users, homes WHERE faults.deviceID = devices.deviceID AND users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND rooms.roomID = devices.roomID AND users.username = '"+ req.session.user + "';";
        var sqlU = "SELECT users.username AS username, users.isAdmin AS isAdmin FROM users WHERE users.username = '"+ req.session.user + "';";
        
        connection.query(sqlF, function(err, resultF, fields) {
          connection.query(sqlU, function(err, resultU, fields) {
            res.render('home', ({ title: 'Express' },{user:req.session.nickname , timezone: JSON.parse(data).timezone, time: 
              JSON.parse(data).currently.time, summary: JSON.parse(data).currently.summary, precipProbability: JSON.parse(data).currently.precipProbability,
              precipType: JSON.parse(data).currently.precipType, temperature: JSON.parse(data).currently.temperature, windSpeed: JSON.parse(data).currently.windSpeed, faultInfo: resultF, userInfo: resultU}));
          });
        });
    });
  
      }).on("error", (err) => {
        console.log("Error: " + err.message);
        console.log("NO");
      });
      

      } else {
        res.redirect('/');
    }
});

router.use('/rooms', rooms);
router.use('/energy-data', energydata);
router.use('/devices', devices);
router.use('/settings', settings);

router.get('/my-account', function(req, res, next) {
  if (req.session.loggedin){
    console.log(req.session.user);
    var sql = "SELECT users.username AS username, users.password AS password, users.isAdmin AS isAdmin, users.displayName AS displayName, users.homeID AS homeID, homes.homeName AS homeName FROM users, homes WHERE users.username ='" + req.session.user + "' AND users.homeID = homes.homeID;";
    connection.query(sql, function(err, result, fields) {
      res.render('my-account', ({ title: 'Express' }, {users: result}));
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
