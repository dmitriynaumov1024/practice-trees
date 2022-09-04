<?php
include '../webapi.php';

handlePost (function ($data) {

  if (! isset($data["id"])) return [
    "success" => false,
    "message" => "Bad request: parameter 'id' not set"
  ];

  if (! isset($data["nodes"])) return [
    "success" => false,
    "message" => "Bad request: parameter 'nodes' not set"
  ];
  
  return useDatabase (function ($conn) use ($data) {
    $s = $conn->prepare("update Trees set nodesEncoded=(?) where id=(?) limit 1");
    $nodes = json_encode($data["nodes"]); $id = $data["id"];
    $s->bind_param("si", $nodes, $id);
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