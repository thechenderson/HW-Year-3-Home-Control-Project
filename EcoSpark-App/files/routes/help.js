var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if (req.session.loggedin){
    res.render('help', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});

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