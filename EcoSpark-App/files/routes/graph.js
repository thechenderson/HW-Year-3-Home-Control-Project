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

function formatAverageData(dataArray) {
    console.log(dataArray.length);
    var deviceNameGraph = [], devicePowerGraph = [];
    for (var i = 0; i < dataArray.length; i++) {
        deviceNameGraph[i] = dataArray[i].date;
        devicePowerGraph[i] = dataArray[i].averOverallPower;
    }
    var jsonArray = [deviceNameGraph, devicePowerGraph];
    console.log("in FormatData()...\n");
    console.log(jsonArray);
    return jsonArray
}

function formatAverageRoomData(dataArray) {
    console.log(dataArray.length);
    var deviceNameGraph = [], devicePowerGraph = [];
    for (var i = 0; i < dataArray.length; i++) {
        deviceNameGraph[i] = dataArray[i].roomID;
        devicePowerGraph[i] = dataArray[i].averRoomPower;
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

router.get('/devices', function (req, res) {

    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
        var sqlRD = "SELECT runningdevices.rDeviceDisplayName, runningdevices.rDevicePower FROM runningdevices, homes, rooms WHERE runningdevices.roomID = rooms.roomID AND rooms.homeID = homes.homeID AND homes.homeID = '" + result[0].homeID + "'";

        connection.query(sqlRD, function (err, data, fields) {
            console.log(data);
            var formatedData = formatDataRoom(data);
            res.send(formatedData);
        });
    });
});

router.get('/home', function (req, res) {
    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
        var sqlRH = "SELECT rooms.roomDisplayName AS rDeviceDisplayName, SUM(runningDevices.rDevicePower) AS rDevicePower FROM runningDevices, homes, rooms  WHERE runningdevices.roomID = rooms.roomID AND rooms.homeID = homes.homeID AND homes.homeID = '" + result[0].homeID + "' GROUP BY runningDevices.roomID";
        connection.query(sqlRH, function (err, data, fields) {
            console.log(data);
            var formatedData = formatDataRoom(data);
            res.send(formatedData);
        });
    });
});

router.get('/averagesDay', function (req, res) {
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    // today = mm+'-'+dd+'-'+yyyy;
    today = yyyy + '-' + mm +'-' + dd;
    // var date = "2020-04-19";
    console.log(today);
    console.log(req.session.user);
    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
        var sqlRH = "SELECT averagesforr.roomID AS roomID, averagesforr.averRoomPower AS averRoomPower FROM averagesforr, homes, rooms WHERE averagesforr.roomID = rooms.roomID AND rooms.homeID = homes.homeID  AND homes.homeID = '" + result[0].homeID + "' AND averagesforr.date = '"+ today +"' GROUP BY averagesforr.roomID;"
        connection.query(sqlRH, function (err, data, fields) {
            console.log("average data : "+ data);
            var formatedData = formatAverageRoomData(data);
            res.send(formatedData);
        });
    });
});

router.get('/averagesWeek', function (req, res) {
    // var date = "2020-04-19";
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    // today = mm+'-'+dd+'-'+yyyy;
    today = yyyy + '-' + mm +'-' + dd;
    var week = dd-7;
    var weekDate = yyyy + '-' + mm +'-' + week;
    console.log(weekDate);
    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
        var sqlRH = "SELECT averagesforh.date AS date, averagesforh.averOverallPower AS averOverallPower FROM averagesforh WHERE averagesforh.homeID = '" + result[0].homeID + "' AND averagesforh.date <= '" +  today + "' AND averagesforh.date >= '" + weekDate + "'";
        connection.query(sqlRH, function (err, data, fields) {
            console.log("average data : "+ data);
            var formatedData = formatAverageData(data);
            res.send(formatedData);
        });
    });
});

router.get('/averagesMonth', function (req, res) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    var date =  [year, month, day].join('-');
    var sqlH = "SELECT homeID FROM users WHERE username = '" + req.session.user + "'";
    connection.query(sqlH, function (err, result, fields) {
        var sqlRH = "SELECT averagesforh.date AS date, averagesforh.averOverallPower AS averOverallPower FROM averagesforh WHERE averagesforh.homeID = '" + result[0].homeID + "' AND averagesforh.date <= '" +  date +"'";
        connection.query(sqlRH, function (err, data, fields) {
            console.log("average data : "+ data);
            var formatedData = formatAverageData(data);
            res.send(formatedData);
        });
    });
});

module.exports = router;