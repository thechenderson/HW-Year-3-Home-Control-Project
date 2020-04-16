var express = require('express');
var router = express.Router();
var mysql = require('mysql');



var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
});


function formatDataRoom(dataArray) {
    console.log(dataArray.length);
    var deviceNameGraph = [], devicePowerGraph = [];
    for (var i = 0; i < dataArray.length; i++) {
        deviceNameGraph[i] = dataArray[i].rDeviceDisplayName;
        devicePowerGraph[i] = dataArray[i].rDevicePower;
    }
    var jsonArray = [deviceNameGraph, devicePowerGraph];
    console.log("in FormatData()...\n");
    console.log(jsonArray);
    return jsonArray
}


router.get('/room', function (req, res) {

    var sqlRD = "SELECT rDeviceDisplayName, rDevicePower FROM runningdevices WHERE roomID = '" + req.session.room + "';";

    connection.query(sqlRD, function (err, data, fields) {
        console.log(data);
        var formatedData = formatDataRoom(data);
        res.send(formatedData);
    });
});
module.exports = router;