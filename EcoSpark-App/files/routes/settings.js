var express = require('express');
var router = express.Router();

var manageusers = require('./manage-users');
var managedevices = require('./manage-devices');
var managerooms = require('./manage-rooms');
var help = require('./help');


router.get('/', function(req, res, next) {
  if (req.session.loggedin){
    res.render('settings', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});


router.use('/manage-users', manageusers);
router.use('/manage-devices', managedevices);
router.use('/manage-rooms', managerooms);
router.use('/help', help);

module.exports = router;