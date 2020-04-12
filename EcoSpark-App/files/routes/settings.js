var express = require('express');
var router = express.Router();
var mysql = require('mysql');

const queryWrapper = (statement) => {
  return new Promise((resolve, reject) => {
      connection.query(statement, (err, result) => {
          if(err)
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

router.get('/', function(req, res, next) {
  if (req.session.loggedin){
    res.render('settings', { title: 'Express' });
  } else {
    res.redirect('/');
  }
});

router.get('/manage-users', function(req, res, next) {
  if (req.session.loggedin){
    // sql to get the users homeID
    var sql = "SELECT homeID FROM users WHERE users.username = '" + req.session.user +"'";
    connection.query(sql, function(err, result, fields) {
      // index result to get the homeID without sql jargon
      var homeID = result[0].homeID;
      // query using homeID
      var sql2 = "SELECT username, displayName FROM users WHERE homeID = '" + homeID + "'";
      connection.query(sql2, function(err, result2, fields) {
        // render page 
        res.render('manage-users', ({ title: 'Express' },{users: result2}));
      });
    });
  } else {
    res.redirect('/');
  }
});

// when clicking on a user
router.get('/manage-users/:username', function(req, res, next) {
  if (req.session.loggedin){
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


router.post('/manage-users/:username/updateUserName', function(req, response) {
  var username = req.params.username;
  var displayNameOld = req.body.username;
  var displayName = displayNameOld.replace(/[^a-zA-Z0-9]/g,"");
  var sql = "UPDATE users SET displayName = '" + displayName + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if(result== ""){
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users/' + req.params.username );
    }
  });
});


router.post('/manage-users/:username/updateUserPW', function(req, response) {
  var username = req.params.username;
  var PWOld = req.body.password;
  var passwordNew = PWOld.replace(/[^a-zA-Z0-9]/g,"");
  var sql = "UPDATE users SET password = '" + passwordNew + "' WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if(result== ""){
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users/' + req.params.username );
    }
  });
});



router.post('/manage-users/:username/deleteUser', function(req, response) {
  var username = req.params.username;
  var sql = "DELETE FROM users WHERE users.username = '" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if(result== ""){
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users/');
    }
  });
});



router.post('/manage-users/:username/removeFromHome', function(req, response) {
  var username = req.params.username;
  var sql = "UPDATE users SET homeID = NULL WHERE username ='" + username + "'";
  connection.query(sql, function (err, result, fields) {
    if(result== ""){
      response.redirect('/home/settings/manage-users');
    } else {
      console.log(result);
      response.redirect('/home/settings/manage-users');
    }
  });
});








router.post('/manage-home/:homeID/updateHome', function(req, response) {
  var homeID = req.params.homeID;
  console.log(homeID);
  var homeName = req.body.homeName;
  console.log(homeName);
  var homeCreator = req.body.homeCreator;
  // console.log(homeName);
  console.log(homeCreator);

  var sql = "UPDATE homes SET homes.homeName = '" + homeName + "', homes.homeCreator = '"+ homeCreator +"' WHERE homes.homeID = '" + homeID + "'";
  connection.query(sql, function (err, result, fields) {
    if(result== ""){
      response.redirect('/home/settings/manage-home');
    } else {
      response.redirect('/home/settings/manage-home/');
    }
  });
});

router.get('/manage-devices', function(req, res, next) {
  if (req.session.loggedin){
    // sql to get the users homeID
    var sql = "SELECT homeID FROM users WHERE users.username = '" + req.session.user +"'";
    connection.query(sql, function(err, result, fields) {
      // index result to get the homeID without sql jargon
      var homeID = result[0].homeID;
      // query using homeID
      var sql2 = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.deviceType AS deviceType, devices.deviceID AS deviceID, devices.devicePower AS devicePower, devices.roomID AS roomID FROM devices, rooms, homes WHERE homes.homeID = rooms.homeID AND rooms.roomID = devices.roomID AND homes.homeID = '"+homeID+"'";
      connection.query(sql2, function(err, result2, fields) {
        // render page 
        res.render('manage-devices', ({ title: 'Express' },{devices: result2}));
      });
    });
  } else {
    res.redirect('/');
  }
});

// delete rooms and re-assign home?
router.get('/manage-home', function(req, res, next) {
  if (req.session.loggedin){
    var sql = "SELECT homes.homeID AS homeID, homes.homeName AS homeName, homes.homeCreator AS homeCreator FROM users, homes WHERE users.homeID = homes.homeID AND users.username = '" + req.session.user + "'";
    connection.query(sql, function(err, result, fields) {
      res.render('manage-home', ({ title: 'Express' }, {homes: result}));
    });
  } else {
    res.redirect('/');
  }
});

// when updating a home
router.get('/manage-home/:homeID/homeUpdate', function(req, res, next) {
  var sql =  "UPDATE homes SET homeName = '" + request.params.homeName + "' WHERE homeID = '" + request.params.homeID + "'";
  connection.query(sql, function (err, result, fields) {
    if(result== ""){
      response.redirect('/home');
    } else {
      response.redirect('/home/manage-home/' );
    }
  });
});

router.get('/help', function(req, res, next) {
  if (req.session.loggedin){
      res.render('help', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
});

//account page
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