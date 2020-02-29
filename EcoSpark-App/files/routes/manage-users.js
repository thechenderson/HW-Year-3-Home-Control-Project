var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      res.render('manage-users', { title: 'Express' });
    } else {
      res.redirect('/');
    }
  });
module.exports = router;
