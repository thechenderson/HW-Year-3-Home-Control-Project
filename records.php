<?php
//Set up database connection
include_once 'connection.php';
?>


<!DOCTYPE html>
<html>
    <head>
      <title>Example Connection:</title>
    </head>

    <body>
      <?php
          //Select query 
		  $sql = "SELECT * FROM currentdevices;";
          $result = mysqli_query($conn, $sql);

          //check for any results from database
          $resultCheck = mysqli_num_rows($result);

          if ($resultCheck > 0){
              //any result
              //out put data
              while ($row = mysqli_fetch_assoc($result)){//for all data in the database
                  //saves each row of data to $row - aray of data
                  //row values are saved with column names
                  echo $row['DName'] . "  ";
				  echo $row['Power'] . " ";
				  echo $row['Time On'] . " ";
				  echo $row['Time Off'] . " <br>";
				  
              }
          }
      ?>

    </body>
</html>
