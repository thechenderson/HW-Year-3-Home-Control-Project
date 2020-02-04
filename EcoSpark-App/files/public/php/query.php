<?php
	session_start();

	$servername = "mysql-server-1.macs.hw.ac.uk";
	$usernameDB = "tg37";
	$passwordDB = "7INB446Kle";
	$database = "tg37";

	$conn = new mysqli($servername, $usernameDB, $passwordDB, $database);
		
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}

	if ($_SERVER["REQUEST_METHOD"] == "POST") {
		$userName = $_POST["username"];
		$passWord = $_POST["password"];

		$query = "SELECT username, passwords FROM accounts WHERE username ='".$userName."' AND passwords ='".$passWord."'";
		$result = $conn->query($query);
		if ($result->num_rows == 1) {
			$_SESSION["user"] = $userName;
			$_SESSION["passW"] = $passWord;
			header("location: http://www2.macs.hw.ac.uk/~tg37/EcoSpark/homePage.php");
			exit();
		} else if ($result->num_rows == 0) {
			header("location: http://www2.macs.hw.ac.uk/~tg37/EcoSpark/login.php");
			exit();
		}
	}
?>