var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});

const queryWrapper = (statement) => {
  return new Promise((resolve, reject) => {
      connection.query(statement, (err, result) => {
          if(err)
              return reject(err);
          resolve(result);
      });
  });
};

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      let currDate = new Date().toLocaleDateString('en-GB');
      var sqlAH = "SELECT averagesForH.homeID AS homeID, averagesForH.date AS date, averagesForH.averOverallPower AS averOverallPower, averagesForH.powerLimit AS powerLimit FROM averagesForH, homes, users WHERE users.homeID = homes.homeID AND homes.homeID = averagesForH.homeID AND users.username = '" + req.session.user + "' AND averagesForH.date = '" + currDate + "'";
      
      Promise.all([
        queryWrapper(sqlAH)
      ])
      .then(([averagesHInfo]) => {
          res.render('energy-data', {
              title: 'Express',
              averagesHInfo
          });
      });
      // res.render('energy-data', { title: 'Express' });
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