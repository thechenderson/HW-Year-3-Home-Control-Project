var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var today = new Date();
console.log(today);

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

module.exports = router;