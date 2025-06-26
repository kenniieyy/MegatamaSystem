<?php
header('Content-Type: application/json');

include "../config/config.php";

// Get the POST data
$input = json_decode(file_get_contents('php://input'), true);

$namaRuangan = $conn->real_escape_string($input['namaRuangan']);
$lokasi = $conn->real_escape_string($input['lokasi']);
$keterangan = $conn->real_escape_string($input['keterangan']);

$sql = "INSERT INTO ruangan (namaRuangan, lokasi, keterangan) VALUES ('$namaRuangan', '$lokasi', '$keterangan')";

if ($conn->query($sql) === TRUE) {
    $newId = $conn->insert_id; // Get the ID of the newly inserted row
    echo json_encode(["success" => true, "message" => "Ruangan added successfully", "newId" => $newId]);
} else {
    echo json_encode(["success" => false, "message" => "Error: " . $sql . "<br>" . $conn->error]);
}

$conn->close();
?>