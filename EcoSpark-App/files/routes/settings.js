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
    res.render('settings', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});

router.get('/manage-users', function (req, res, next) {
  if (req.session.loggedin) {
    // sql to get the users homeID
    var sql = "SELECT homeID FROM users WHERE users.username = '" + req.session.user + "'";
    connection.query(sql, function (err, result, fields) {
      // index result to get the homeID without sql jargon
      var homeID = result[0].homeID;
      // query using homeID
      var sql2 = "SELECT username, displayName FROM users WHERE homeID = '" + homeID + "'";
      connection.query(sql2, function (err, result2, fields) {
        // render page 
        res.render('manage-users', ({ title: 'Express' }, { users: result2 }));
      });
    });
  } else {
    res.redirect('/');
  }
});

// when clicking on a user
router.get('/manage-users/:username', function (req, res, next) {
  if (req.session.loggedin) {
    var sqlD = "SELECT users.username AS username, users.displayName AS displayName, users.isAdmin AS isAdmin, users.password AS password, users.homeID AS homeID, homes.homeName AS homeName FROM users, homes WHERE users.homeID = homes.homeID AND users.username ='" + req.params.username + "'";
    Promise.all([
      queryWrapper(sqlD)
    ])
      .then(([userInfo]) => {
        res.render('specific-user', {
          title: 'Express',
          userInfo
        });
      });
  } else {
    res.redirect('/');
  }
});


// update username
router.post('/manage-users/:username/updateUsername', function (req, response) {
  var username = req.params.username;
  var usernameOld = req.body.username;
  var usernameNew = usernameOld.replace(/[^a-zA-Z0-9]/g, "");
  var sql = "UPDATE users SET username = '" + usernameNew + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      req.session.user = usernameNew;
      response.redirect('/home/settings/manage-users/' + usernameNew);
    }
  });
});



//update display name
router.post('/manage-users/:username/updateDisplayName', function (req, response) {
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
router.post('/manage-users/:username/updateUserPW', function (req, response) {
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
router.post('/manage-users/:username/deleteUser', function (req, response) {
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
router.post('/manage-users/:username/removeFromHome', function (req, response) {
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
router.post('/manage-users/:username/updateUserAdmin', function (req, response) {
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




router.post('/manage-home/:homeID/updateHome', function (req, response) {
  var homeID = req.params.homeID;
  console.log(homeID);
  var homeName = req.body.homeName;
  console.log(homeName);

  var sql = "UPDATE homes SET homeName = '" + homeName + "' WHERE homeID = '" + homeID + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home/settings/manage-home');
    } else {
      response.redirect('/home/settings/manage-home/');
    }
  });
});

router.get('/manage-devices', function (req, res, next) {
  if (req.session.loggedin) {
    // sql to get the users homeID
    var sql = "SELECT homeID FROM users WHERE users.username = '" + req.session.user + "'";
    connection.query(sql, function (err, result, fields) {
      // index result to get the homeID without sql jargon
      var homeID = result[0].homeID;
      // query using homeID
      var sql2 = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.devicePower AS devicePower, devices.roomID AS roomID FROM devices, rooms, homes WHERE homes.homeID = rooms.homeID AND rooms.roomID = devices.roomID AND homes.homeID = '" + homeID + "'";
      connection.query(sql2, function (err, result2, fields) {
        // render page 
        res.render('manage-devices', ({ title: 'Express' }, { devices: result2 }));
      });
    });
  } else {
    res.redirect('/');
  }
});

// delete rooms and re-assign home?
router.get('/manage-home', function (req, res, next) {
  if (req.session.loggedin) {
    var sql = "SELECT homes.homeID AS homeID, homes.homeName AS homeName, homes.homeCreator AS homeCreator FROM users, homes WHERE users.homeID = homes.homeID AND users.username = '" + req.session.user + "'";
    connection.query(sql, function (err, result, fields) {
      var sql2 = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.homeID = homes.homeID AND homes.homeID = rooms.homeID AND users.username = '" + req.session.user + "'"
      connection.query(sql2, function (err, result2, fields) {



        res.render('manage-home', ({ title: 'Express' }, { homes: result, rooms: result2 }));
      });
    });
  } else {
    res.redirect('/');
  }
});

/* 
router.get('/manage-home/:homeID/homeUpdate', function (req, res, next) {
  var sql = "UPDATE homes SET homeName = '" + request.params.homeName + "' WHERE homeID = '" + request.params.homeID + "'";
  connection.query(sql, function (err, result, fields) {
    if (result == "") {
      response.redirect('/home');
    } else {
      response.redirect('/home/manage-home/');
    }
  });
});*/

router.get('/help', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('help', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
});


router.post('/manage-home/deleteRoom:roomID', function (req, res, next) {
  if (req.session.loggedin) {
    var sql1 = "DELETE FROM runningDevices WHERE roomID = '" + req.params.roomID + "'";
    connection.query(sql1, function (err, result1, fields) {
      var sql2 = "DELETE FROM devices WHERE roomID = '" + req.params.roomID + "'";
      connection.query(sql2, function (err, result2, fields) {
        var sql3 = "DELETE FROM rooms WHERE roomID = '" + req.params.roomID + "'";
        connection.query(sql3, function (err, result3, fields) {
          if ((result3 == "") && (result1 == "") && (result2 == "")) {
            res.redirect('/home');
          } else {
            res.redirect('/home/settings/manage-home/');
          }
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

router.post('/manage-home/deleteHome:homeID', function (req, res, next) {
  if (req.session.loggedin) {
    var sql1 = "DELETE FROM runningdevices WHERE EXISTS (SELECT * FROM rooms WHERE rooms.roomID = runningdevices.roomID AND rooms.homeID = '" + req.params.homeID + "')";
    connection.query(sql1, function (err, result1, fields) {
      var sql2 = "DELETE FROM devices WHERE EXISTS (SELECT * FROM rooms WHERE rooms.roomID = devices.roomID AND rooms.homeID = '" + req.params.homeID + "')";
      connection.query(sql2, function (err, result2, fields) {
        var sql3 = "DELETE FROM rooms WHERE homeID = '" + req.params.homeID + "'";
        connection.query(sql3, function (err, result3, fields) {
          var sql5 = "UPDATE users SET isAdmin = 'No' WHERE homeID = '" + req.params.homeID + "'";
          connection.query(sql5, function (err, result5, fields) {
            var sql4 = "UPDATE users SET homeID = NULL WHERE homeID = '" + req.params.homeID + "'";
            connection.query(sql4, function (err, result4, fields) {

              var sql6 = "DELETE FROM homes WHERE homeID = '" + req.params.homeID + "'";
              connection.query(sql6, function (err, result6, fields) {
                if ((result3 == "") || (result1 == "") || (result2 == "") || (result4 == "") || (result5 == "") || (result6 == "")) {
                  res.redirect('/home/settings/manage-home/');
                } else {
                  res.redirect('/home');
                }
              });
            });
          });
        });
      });
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;