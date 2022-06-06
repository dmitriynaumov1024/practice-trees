<?php
include '../webapi.php';

handleGet (function ($data) {
  return useDatabase (function ($conn) {
    if ($conn->query("insert into Trees values (NULL)")) {
      return [
        "success" => true,
        "id" => $conn->insert_id
      ];
    }
    else {
      return [
        "success" => false
      ];
    }
  });
});

?>