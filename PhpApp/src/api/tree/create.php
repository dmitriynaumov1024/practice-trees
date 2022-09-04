<?php
include '../webapi.php';

handleGet (function ($data) {
  return useDatabase (function ($conn) {
    $conn->query("insert into Trees (id, nodesEncoded) values (NULL, \"[]\")");
    if ($conn->affected_rows) return [
      "success" => true,
      "id" => $conn->insert_id
    ];
    else return [
      "success" => false,
      "message" => "Can not create new tree."
    ];
  });
});

?>