var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var deviceNameGraph = [], devicePowerGraph = [];
var jsonArray;

var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
});


function formatData(dataArray) {
    console.log(dataArray);
    for (var i = 0; i < dataArray.length; i++) {
        deviceNameGraph[i] = dataArray[i].rDeviceDisplayName;
        devicePowerGraph[i] = dataArray[i].rDevicePower;
    }
    jsonArray = [deviceNameGraph, devicePowerGraph];
    console.log("in FormatData()...\n");
    console.log(jsonArray);
}


router.get('/', function (req, res) {

    var sqlRD = "SELECT rDeviceDisplayName, rDevicePower FROM runningdevices WHERE roomID = '" + req.session.room + "';";

    connection.query(sqlRD, function (err, data, fields) {
        console.log(data);
        formatData(data);
        res.send(jsonArray);
    });
});
module.exports = router;