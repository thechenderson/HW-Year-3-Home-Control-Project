<?php
/* Open connection to "zing_db" MySQL database. */
$mysqli = new mysqli("localhost", "root", "password", "ecospark");

/* Check the connection. */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}


header('Content-Type: application/json');

$sqlQuery = "SELECT deviceDisplayName, devicePower FROM devices ORDER BY deviceDisplayName";

$result = mysqli_query($conn,$sqlQuery);

$data = array();
foreach ($result as $row) {
	$data[] = $row;
}

mysqli_close($conn);

echo json_encode($data);


?>