<?php
include '../webapi.php';

handlePost (function ($data) {
  if (! isset($data["id"])) return [
    "success" => false,
    "message" => "Bad request: parameter 'id' not set"
  ];
  
  return useDatabase (function ($conn) use ($data) {
    $s = $conn->prepare("delete from Trees where id=(?) limit 1");
    $s->bind_param("i", $data["id"]);
    $s->execute();
    if ($conn->affected_rows) return [
      "success" => true
    ];
    else return [
      "success" => false,
      "message" => "Tree with id=".$data['id']." not found"
    ];
  });
});

?>