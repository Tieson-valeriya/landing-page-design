<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_carmodel";


// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$status = $_POST['status'];


if($status == 'c_make'){
    $sql = "SELECT * FROM tbl_make_model GROUP BY make";
    $result = $conn->query($sql);
    $make = '';
    if ($result->num_rows > 0) {
      // output data of each row
      while($row = $result->fetch_assoc()) {
        $make .= '<option>'.$row['make'].'</option>';
      }
    } else {
      echo "0 results";
    }
    echo json_encode($make);
}else if($status == 'c_model'){
    $make = $_POST["make"];
    $sql = "SELECT * FROM tbl_make_model where make = '$make'";
    $result = $conn->query($sql);
    $model = '';
    $newArray = array();
    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        array_push($newArray, $row['model']);
        // $model .= '<option>'.$row['model'].'</option>';
      }
    } else {
      echo "0 results";
    }
    print_r(json_encode($newArray));
}

$conn->close();
?>