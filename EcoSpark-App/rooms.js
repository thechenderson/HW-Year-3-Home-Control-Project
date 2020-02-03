var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if (req.session.loggedin){
      var rooms = [
        { roomName: 'livingRoom', roomType: 'livingRoom'},
        { roomName: 'Bathroom', roomType: 'Bathroom'},
        { roomName: 'Kitchen', roomType: 'Kitchen'},
        { roomName: 'Toms Room', roomType: 'Bedroom'},
    ];
      res.render('rooms', ({ title: 'Express' },{rooms: rooms}));
    } else {
      res.render('index', { title: 'Express' });
    }
  });
module.exports = router;
