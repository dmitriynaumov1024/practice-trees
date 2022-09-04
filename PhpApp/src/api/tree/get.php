<?php
include '../webapi.php';

handleGet (function ($data) {
  if (! isset($data["id"])) return [
    "success" => false,
    "message" => "Bad request: parameter 'id' not set"
  ];

  return useDatabase (function ($conn) use ($data) {
    $q = $conn->prepare("select id, nodesEncoded from Trees where id=(?) limit 1");
    $q->bind_param("i", $data["id"]);
    $q->execute();
    $result = $q->get_result()->fetch_assoc();
    if ($conn->affected_rows) return [
      "success" => true,
      "nodes" => json_decode($result["nodesEncoded"])
    ];
    else return [
      "success" => false,
      "message" => "Tree with id=".$data['id']." not found"
    ];
  });
});

?>