<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$userName = $_POST["username"];
	$passWord = $_POST["password"];
	
	$conn = include 'connectDB.php';
		
	$sql = "SELECT username, passwords FROM accounts WHERE username ='".$userName."' AND passwords ='".$passWord."'";

	$result = $conn->query($sql);


	if ($result->num_rows == 1) {
		header("location: http://www2.macs.hw.ac.uk/~tg37/EcoSpark/homePage.html");
		exit();
	} else if ($result->num_rows == 0) {
		header("location: http://www2.macs.hw.ac.uk/~tg37/EcoSpark/login.html");
		exit();
	}
}
?>