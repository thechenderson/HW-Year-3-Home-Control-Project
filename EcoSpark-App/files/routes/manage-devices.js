var express = require('express');
var router = express.Router();
var mysql = require('mysql');



var connection = mysql.createConnection({
  host: process.env.hostname,
  user: process.env.username,
  password: process.env.password,
  database: process.env.database
});


module.exports = router;
