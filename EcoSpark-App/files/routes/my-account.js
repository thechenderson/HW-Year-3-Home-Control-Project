var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const queryWrapper = (statement) => {
  return new Promise((resolve, reject) => {
    connection.query(statement, (err, result) => {
      if (err)
        return reject(err);
      resolve(result);
    });
  });
};


var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});




router.get('/', function (req, res, next) {
  if (req.session.loggedin) {
    var sqlU = "SELECT users.displayName, users.password, users.username, users.isAdmin, users.homeID FROM users WHERE users.username = '" + req.session.user + "'";
    var sql2 = "SELECT homes.homeID, homes.homeName FROM users, homes WHERE users.username = '" + req.session.user + "' AND users.homeID = homes.homeID";
    connection.query(sql2, function (err, result2, fields) {
      var home = result2
      Promise.all([
        queryWrapper(sqlU)
      ])
        .then(([userInfo]) => {
          res.render('my-account', {
            title: 'Express',
            userInfo,
            home
          });
        });
    });
  } else {
    res.redirect('/');
  }
});


router.post('/updateUsername', function (req, response) {
  var userID = req.session.user;
  var usernameOld = req.body.username;
  var usernameNew = usernameOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET username = '" + usernameNew + "' WHERE username = '" + userID + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/my-account');
    } else {
      console.log(result);
      req.session.user = usernameNew;
      response.redirect('/home/my-account');
    }
  });
});


//update display name
router.post('/updateDisplayName', function (req, response) {
  var username = req.session.user;
  var displayNameOld = req.body.displayName;
  var displayName = displayNameOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET displayName = '" + displayName + "' WHERE username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/my-account');
    } else {
      console.log(result);
      response.redirect('/home/my-account');
    }
  });
});




// update password
router.post('/updateUserPW', function (req, response) {
  var username = req.session.user;
  var PWOld = req.body.password;
  var passwordNew = PWOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET password = '" + passwordNew + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/my-account');
    } else {
      console.log(result);
      response.redirect('/home/my-account');
    }
  });
});



// delete user
router.post('/deleteUser', function (req, response) {
  var username = req.session.user;
  var sqlH = "SELECT homeID FROM users WHERE username = '" + username + "'";
  connection.query(sqlH, function (err, result1, field) {
    if (result1 == "") {
      var sqlD = "DELETE FROM users WHERE users.username = '" + username + "'";
      connection.query(sqlD, function (err, result2, fields) {
        if (result2 == "") {
          response.redirect('/home/my-account');
        } else {
          response.redirect('/');
        }
      });
    }
    var sqlC = "SELECT COUNT(username) AS number FROM users WHERE homeID ='" + result1[0].homeID + "' AND isAdmin = 'Yes'";
    connection.query(sqlC, function (err, result3, fields) {
      var sqlA = "SELECT isAdmin FROM users WHERE username = '" + username + "'";
      connection.query(sqlA, function (err, result5, fields) {
        if ((result3[0].number == 1) && (result5[0].isAdmin == "Yes")) {
          response.redirect('/home/my-account');
        } else {
          var sqlD2 = "DELETE FROM users WHERE users.username = '" + username + "'";
          connection.query(sqlD2, function (err, result4, fields) {
            if (result4 == "") {
              response.redirect('/home/my-account');
            } else {
              response.redirect('/');
            }
          });
        }
      });
    });
  });
});




// checks to see if its not the last admin in the home 
router.post('/removeFromHome', function (req, response) {
  var username = req.session.user;
  var sqlH = "SELECT homeID FROM users WHERE username = '" + username + "'";
  connection.query(sqlH, function (err, result1, field) {

    var sql2 = "SELECT COUNT(username) AS number FROM users WHERE homeID ='" + result1[0].homeID + "' AND isAdmin = 'Yes'";
    connection.query(sql2, function (err, result2, fields) {
      var sqlA = "SELECT isAdmin FROM users WHERE username = '" + username + "'";
      connection.query(sqlA, function (err, result5, fields) {
        if ((result2[0].number == 1) && (result5[0].isAdmin == "Yes")) {
          response.redirect('/home/my-account');
        } else {
          var sql3 = "UPDATE users SET homeID = NULL WHERE username ='" + username + "'";
          connection.query(sql3, function (err, result3, fields) {
            if (result3 == "") {
              response.redirect('/home/my-account');
            } else {
              var sql4 = "UPDATE users SET isAdmin = 'No' WHERE username ='" + username + "'";
              connection.query(sql4, function (err, result4, fields) {
                if (result4 == "") {
                  response.redirect('/home/my-account');
                } else {
                  response.redirect('/home/');
                }
              });
            }
          });
        }
      });
    });
  });
});


// checks if admin, and updates to the oposite
router.post('/updateUserAdmin', function (req, response) {
  var sqlCheck = "SELECT isAdmin FROM users WHERE username = '" + req.params.username + "'";
  connection.query(sqlCheck, function (err, result, fields) {
    if (result[0].isAdmin == "Yes") {
      var sql = "UPDATE users SET isAdmin = 'No' WHERE username = '" + req.params.username + "'";
      connection.query(sql, function (err, result, fields) {
        if (result == "") {
          response.redirect('/home/settings/manage-users/');
        } else {
          console.log(result);
          response.redirect('/home/settings/manage-users/' + req.params.username);
        }
      });
    }
    if (result[0].isAdmin == "No") {
      var sql = "UPDATE users SET isAdmin = 'Yes' WHERE username = '" + req.params.username + "'";
      connection.query(sql, function (err, result, fields) {
        if (result == "") {
          response.redirect('/home/settings/manage-users/');
        } else {
          console.log(result);
          response.redirect('/home/settings/manage-users/' + req.params.username);
        }
      });
    }
  });
});


module.exports = router;