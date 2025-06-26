<?php
header('Content-Type: application/json');

include "../config/config.php";

// Get the PUT data (for PUT requests, use php://input)
// Note: Some servers/frameworks might not directly support PUT, you might use POST and check a hidden field or URL param
$input = json_decode(file_get_contents('php://input'), true);

$id = intval($input['id']); // Ensure ID is an integer
$namaRuangan = $conn->real_escape_string($input['namaRuangan']);
$lokasi = $conn->real_escape_string($input['lokasi']);
$keterangan = $conn->real_escape_string($input['keterangan']);

$sql = "UPDATE ruangan SET namaRuangan='$namaRuangan', lokasi='$lokasi', keterangan='$keterangan' WHERE id=$id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["success" => true, "message" => "Ruangan updated successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Error updating record: " . $conn->error]);
}

$conn->close();
?>