<?php

include "../config/config.php";

$result = $conn->query("SELECT nip, nama_guru FROM guru");
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = ['id' => $row['nip'], 'name' => $row['nama_guru']];
}

echo json_encode($data);
$conn->close();
?>
