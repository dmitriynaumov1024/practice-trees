<?php
include '../webapi.php';

handlePost (function ($data) {
  $valid = isset($data["id"]);
  
  if ($valid) {
    return useDatabase (function ($conn) use ($data) {
      if ($s = $conn->prepare("delete from Trees where id=(?) limit 1")) {
        $s->bind_param("i", $data["id"]);
        $s->execute();
        if ($conn->affected_rows) return [
          "success" => true
        ];
      }
      return [
        "success" => false
      ];
    });
  }
  else {
    return [
      "success" => false
    ];
  }
});

?>