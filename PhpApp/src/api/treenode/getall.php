<?php
include '../webapi.php';

handleGet (function ($request) {
  $valid = isset($request["tree"]); 

  if ($valid) {
    return useDatabase (function ($conn) use ($request) {
      $q = $conn->prepare("select 1 from Trees where id=(?)");
      $q->bind_param("i", $request["tree"]);
      $q->execute();
      if ($q->get_result()->num_rows == 0) {
        return [
          "success" => false,
          "message" => "Tree not found."
        ];
      }

      $q = $conn->prepare("select id, parent, text from TreeNodes where tree=(?)");
      $q->bind_param("i", $request["tree"]);
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
      "message" => "Request parameter 'tree' not set."
    ];
  }
});

?>