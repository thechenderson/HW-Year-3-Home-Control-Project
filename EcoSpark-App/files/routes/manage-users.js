var express = require('express');
var router = express.Router();

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});


router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      res.render('manage-users', { title: 'Express' });
    } else {
      res.redirect('/');
    }
  });



  connection.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM customers", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });

module.exports = router;
