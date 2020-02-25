
  var mysql = require('mysql');
  var connection = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.username,
    password: process.env.password,
    database: process.env.database
  });
  
  
  connection.connect(function(err) {
    if (err) throw err;
    var details = document.getElementById("login");
    var userInput = details.elements[0].value;
    var passwordInput = details.elements[1].value;
    var sql = "SELECT user, password FROM accounts WHERE user = '" + mysql.escape(userInput) + "' AND password '" + mysql.escape(passwordInput) + "'";
    connection.query(sql, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  
    connection.end();
    });
  });