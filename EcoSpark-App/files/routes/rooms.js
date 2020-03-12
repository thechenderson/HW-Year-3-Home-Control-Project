var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      var sql = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.username = homes.username AND homes.roomID = rooms.roomID AND users.username = '" + req.session.user + "'";
      connection.query(sql, function (err, result, fields) {
        res.render('rooms', ({ title: 'Express' },{rooms: result}));
      });
    } else {
      res.redirect('/');
    }
  });


router.get('/add-room', function(req, res, next) {
  if (req.session.loggedin){
    res.render('add-room', ({ title: 'Express' }));
  } else {
    res.redirect('/');
  }
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


router.get('/:roomID', function(req, res, next) {

  var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database,
    multipleStatements: true
  });

  if (req.session.loggedin){

    var sqlR = "SELECT rooms.roomDisplayName AS roomDisplayName, rooms.roomType AS roomType, rooms.roomID AS roomID FROM users, rooms, homes WHERE users.username = homes.username AND homes.roomID = rooms.roomID AND users.username = '" + req.session.user + "' AND rooms.roomID =  '" + req.params.roomID + "';";
    var sqlD = "SELECT devices.deviceDisplayName AS deviceDisplayName, devices.devicePower AS devicePower, devices.deviceType AS deviceType FROM devices WHERE devices.roomID = " + req.params.roomID + ";"; 
    // connection.query(sqlR + sqlD, function (err, results) {
    //   if (err) throw err;
    //   if(results== ""){
    //     res.redirect('/rooms');
    //   } else {
    //     console.log("info", results[0]);
    //     console.log("info", results[1]);
    //     var r = results[0];
    //     var d = results[1];
    //     //res.render('specific-room', ({ title: 'Express' }, {roomInfo: results[0]}, {deviceInfo: results[1]}));
    //     res.render('specific-room', ({ title: 'Express' }, {roomInfo: r}));
    //     res.render('specific-room', ({ title: 'Express' }, {deviceInfo: d}));
    //   }
      
    Promise.all([
        queryWrapper(sqlR),
        queryWrapper(sqlD)
    ])
    .then(([roomInfo, deviceInfo]) => {
        res.render('specific-room', {
            title: 'Express',
            roomInfo,
            deviceInfo
        });
    });
  } else {
    res.redirect('/');
  }

});


router.post('/:roomID/updateRoomName', function(request, response) {
    var sql =  "UPDATE rooms SET roomDisplayName = '" + request.body.roomName + "' WHERE roomID = '" + request.params.roomID + "'";
    connection.query(sql, function (err, result, fields) {
      if(result== ""){
        response.redirect('/home');
      } else {
        response.redirect('/rooms/' +request.params.roomID );
      }
    });
});



router.post('/createRoom', function(request, response) {
  var roomNameOld = request.body.roomName;
  var roomIDOld = request.body.roomID;
  var roomTypeOld = request.body.roomType;

  var roomName = roomNameOld.replace(/[^a-zA-Z0-9\s]/g,"");
  var roomID = roomIDOld.replace(/[^a-zA-Z0-9]/g,"");
  var roomType = roomTypeOld.replace(/[^a-zA-Z0-9]/g,"");
  
  if (roomName && roomType && roomID) {
    
        var sql4 = "INSERT INTO rooms VALUES ('" + roomID + "', '" + roomName + "', '" + roomType + "')";
        connection.query(sql4, function (err, result4, fields) {
          if (!result4) {
            response.redirect('/rooms/add-room');
          } else {
         
        
            var sql2 = "INSERT INTO homes VALUES('" + request.session.user + "', '" + roomID + "')";
            connection.query(sql2, function (err, result2, fields) {
            });
    
            var sql3 = "SELECT roomDisplayName FROM rooms WHERE roomDisplayName = '" + roomName + "'";
            connection.query(sql3, function (err, result3, fields) {
            if (result3 != "") {
                response.redirect('/rooms');
              } else {
                response.redirect('/rooms/add-room');
              }			
              response.end();
            });
          }
        });
  } else {
    response.redirect('/home/rooms/add-room');
    response.end();
  }
});





router.post('/addRoomCode', function(request, response) {
  var roomIDOld = request.body.roomIDC;
  var roomID = roomIDOld.replace(/[^a-zA-Z0-9]/g,"");
  if (roomID) {
        var sql5 = "INSERT INTO homes VALUES('" + request.session.user + "', '" + roomID + "')";
        connection.query(sql5, function (err, result5, fields) {
          if (!result5) {
            response.redirect('/rooms/add-room');
          } else {
            var sql6 = "SELECT username FROM homes WHERE username = '" + request.session.user + "'";
            connection.query(sql6, function (err, result6, fields) {
            if (result6 != "") {
                response.redirect('/rooms');
              } else {
                response.redirect('/rooms/add-room');
              }			
              response.end();
            });
          }
        });
  } else {
    response.redirect('/rooms/add-room');
    response.end();
  }
});






module.exports = router;
