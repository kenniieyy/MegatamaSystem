<?php
header('Content-Type: application/json');
// Koneksi Database
$host = "localhost";
$user = "root";
$pass = "";
$db   = "proyek_ppsi";
$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    echo json_encode(['error' => 'Connection failed: ' . $conn->connect_error]);
    exit();
}

// Query data staf/guru
$sql = "SELECT id_guru, name, password FROM teachers"; // sesuaikan tabel dan field
$result = $conn->query($sql);

$data = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
$conn->close();
?>
