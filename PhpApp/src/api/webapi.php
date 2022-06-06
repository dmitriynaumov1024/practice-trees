<?php
function handlePost ($callback) {
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    header("Content-Type: application/json");
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode($callback($data));
  }
}

function handleGet ($callback) {
  if ($_SERVER["REQUEST_METHOD"] == "GET") {
    header("Content-Type: application/json");
    echo json_encode($callback($_GET));
  }
}

function useDatabase ($callback) {
  $host = 'mysql-db';
  $user = 'MYSQL_USER';
  $pass = 'MYSQL_PASSWORD';
  $dbname = "MY_DATABASE";
  $conn = mysqli_connect($host, $user, $pass, $dbname);
  $result = $callback($conn);
  $conn->close();
  return $result;
}
?>