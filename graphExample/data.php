<?php
//setting header to json
header('Content-Type: application/json');

$servername = "localhost";
$usernameDB = "root";
$passwordDB = "countlich1";
$database = "ecosparknew";

$conn = new mysqli($servername, $usernameDB, $passwordDB, $database);
  
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//query to get data from the table
$query = "SELECT rDeviceDisplayName, rDevicePower FROM runningDevices";

//execute query
$result = $conn->query($query);

//loop through the returned data
$data = array();
foreach ($result as $row) {
  $data[] = $row;
}

//free memory associated with result
$result->close();

//close connection
$mysqli->close();

//now print the data
print json_encode($data);
?>