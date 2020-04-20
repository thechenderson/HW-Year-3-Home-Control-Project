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
    var sqlU = "SELECT users.displayName, users.password, users.username, users.isAdmin, users.homeID FROM users WHERE users.username = '"+ req.session.user + "'";
    Promise.all([
      queryWrapper(sqlU)
    ])
      .then(([userInfo]) => {
        res.render('my-account', {
          title: 'Express',
          userInfo
        });
      });
  } else {
    res.redirect('/');
  }
});


router.post('/updateUsername', function (req, response) {
  var username = req.params.username;
  var usernameOld = req.body.username;
  var usernameNew = usernameOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET username = '" + usernameNew + "' WHERE users.username = '" + username + "'";
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
  var username = req.params.username;
  var displayNameOld = req.body.displayName;
  var displayName = displayNameOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET displayName = '" + displayName + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users/' + req.params.username);
    }
  });
});




// update password
router.post('/updateUserPW', function (req, response) {
  var username = req.params.username;
  var PWOld = req.body.password;
  var passwordNew = PWOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET password = '" + passwordNew + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users/' + req.params.username);
    }
  });
});



// delete user
router.post('/deleteUser', function (req, response) {
  var username = req.params.username;
  var sql = "DELETE FROM users WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/settings/manage-users/' + req.params.username);
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users/');
    }
  });
});




// checks to see if its not the last admin in the home 
router.post('/removeFromHome', function (req, response) {
  var sql1 = "SELECT homeID FROM users WHERE username = '" + req.params.username + "'";
  connection.query(sql1, function (err, result1, fields) {
    console.log(result1[0]);
    var sql2 = "SELECT COUNT(username) AS number FROM users WHERE homeID ='" + result1[0].homeID + "' AND isAdmin = 'Yes'";
    connection.query(sql2, function (err, result2, fields) {
      console.log(result2[0]);
      console.log(result2[0].number == 1);
      console.log(req.params.username);
      console.log(req.session.user);
      var userParamO = req.params.username;
      var userLoginO = req.session.user;
      var userParamN = userParamO.toLowerCase();
      var userLoginN = userLoginO.toLowerCase();
      console.log(userParamN);
      console.log(userLoginN);

      if ((result2[0].number == 1) && (userParamN == userLoginN)) {
        console.log("fail0" + (userParamN == userLoginN));
        response.redirect('/home/settings/manage-users/' + req.params.username);
      } else {
        var sql3 = "UPDATE users SET homeID = NULL WHERE username ='" + req.params.username + "'";
        connection.query(sql3, function (err, result3, fields) {
          if (result3 == "") {
            console.log("fail1");
            response.redirect('/home/settings/manage-users/' + req.params.username);
          } else {
            var sql4 = "UPDATE users SET isAdmin = 'No' WHERE username ='" + req.params.username + "'";
            connection.query(sql4, function (err, result4, fields) {
              if (result4 == "") {
                console.log("fail2");
                response.redirect('/home/settings/manage-users/' + req.params.username);
              }
              if (userParamN == userLoginN) {
                if (req.session.homeID) {
                  req.session.homeID.destroy();
                }
                response.redirect('/home');
              } else {
                response.redirect('/home/settings/manage-users/');
              }
            });
          }
        });
      }
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