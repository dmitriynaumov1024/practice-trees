<?php
include '../webapi.php';

handlePost (function ($data) {
  $valid = isset($data["tree"]) 
    && (isset($data["id"]))
    && isset($data["newtext"]);

  if ($valid) {
    return useDatabase (function ($conn) use ($data) {
      $s = $conn->prepare("update TreeNodes set text=(?) where tree=(?) and id=(?) limit 1");
      $s->bind_param("sii", $data["newtext"], $data["tree"], $data["id"]);
      $s->execute();
      
      if ($s->affected_rows) return [
        "success" => true
      ];
      else return [
        "success" => false,
        "message" => "Failed to edit node"
      ];
    });
  }
  else {
    return [
      "success" => false,
      "message" => "Bad request.",
      "post" => $data 
    ];
  }
});

?>