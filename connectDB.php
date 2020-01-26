<?php
	
    $servername = "mysql-server-1.macs.hw.ac.uk";
	$usernameDB = "tg37";
	$passwordDB = "7INB446Kle";
	$database = "tg37";

	$conn = new mysqli($servername, $usernameDB, $passwordDB, $database);
	
	if ($conn->connect_error) {
	 	die("Connection failed: " . $conn->connect_error);
	} else {
	return $conn;	
	}
?>
