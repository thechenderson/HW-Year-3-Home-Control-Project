<?php
//Database Connection Details
$host = "localhost";
$username = "root";
$password = "password";
$dbName = "ecospark";

//mySQL connection
$conn = mysqli_connect($host, $username, $password, $dbName);

    //Select query 
	$sql = "SELECT * FROM runningdevices;";

    //$result = $conn->query("SELECT deviceDisplayName, currentDevicePower FROM runningdevices");


    if($result->num_rows > 0){
        while($row = $result->fetch_assoc()){
            echo "['".$row['deviceDisplayName']."', ".$row['currentDevicePower']."],";
        }
    }
    $result = mysqli_query($conn,"SELECT rDeviceDisplayName, rDevicePower FROM runningdevices");

    $data = array();
    while ($row = mysqli_fetch_object($result))
    {
        array_push($data, $row);
    }
    echo json_encode($data);
    exit();
?>