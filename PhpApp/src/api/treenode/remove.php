<?php
include '../webapi.php';

handlePost (function ($data) {
  $valid = isset($data["tree"]) 
    && (isset($data["id"]));

  if ($valid) {
    return useDatabase (function ($conn) use ($data) {
      $s = $conn->prepare("delete from TreeNodes where tree=(?) and id=(?)");
      $s->bind_param("ii", $data["tree"], $data["id"]);
      $s->execute();
      
      if (! $s->affected_rows) return [
        "success" => false,
        "message" => "Failed to remove node"
      ];

      $q = $conn->prepare("select id, parent, text from TreeNodes where tree=(?)");
      $q->bind_param("i", $data["tree"]);
      $q->execute();

      $result = $q->get_result()->fetch_all(MYSQLI_ASSOC);
      return [
        "success" => true,
        "nodes" => $result
      ];
    });
  }
  else {
    return [
      "success" => false,
      "message" => "Bad request",
      "post" => $data 
    ];
  }
});

?>