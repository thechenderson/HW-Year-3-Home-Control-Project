
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
    res.render('manage-users', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});

router.get('/manage-devices', function(req, res, next) {
  if (req.session.loggedin){
    res.render('manage-devices', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});

// router.use('/manage-users', manageusers);
// router.use('/manage-devices', managedevices);
// router.use('/manage-rooms', managerooms);
// router.use('/help', help);

module.exports = router;