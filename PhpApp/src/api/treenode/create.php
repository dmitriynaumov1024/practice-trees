<?php
include '../webapi.php';

handlePost (function ($data) {
  $valid = isset($data["tree"]) 
    && (isset($data["parent"]) || $data["parent"] == null)
    && isset($data["text"]);

  if ($valid) {
    return useDatabase (function ($conn) use ($data) {
      $s = $conn->prepare("insert into TreeNodes(parent, tree, text) values (?, ?, ?)");
      $s->bind_param("iis", $data["parent"], $data["tree"], $data["text"]);
      $s->execute();
      
      if ($id = $s->insert_id) return [
        "success" => true,
        "id" => $id
      ];
      else return [
        "success" => false,
        "message" => "Failed to create new node"
      ];
    });
  }
  else {
    return [
      "success" => false,
      "message" => "Something went wrong.",
      "post" => $data 
    ];
  }
});

?>