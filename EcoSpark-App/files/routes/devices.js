var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      res.render('devices', { title: 'Express' });
    } else {
      res.render('index', { title: 'Express' });
    }
  });
module.exports = router;
