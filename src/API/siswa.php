<?php
header("Content-Type: application/json");
include_once "../config/proyek_ppsi.php";

$sql = "SELECT * FROM siswa";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
