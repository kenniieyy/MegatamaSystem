<?php
header('Content-Type: application/json');

include "../config/config.php";

$sql = "SELECT id, namaRuangan, lokasi, keterangan FROM ruangan"; // Ensure 'ruangan' is your table name
$result = $conn->query($sql);

$ruanganData = [];

if ($result->num_rows > 0) {
    // Fetch all rows and add to the array
    while($row = $result->fetch_assoc()) {
        $ruanganData[] = $row;
    }
}

$conn->close();

echo json_encode($ruanganData);
?>