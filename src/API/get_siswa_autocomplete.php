<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Sesuaikan dengan domain frontend Anda di produksi
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Konfigurasi Database
include "../config/config.php";

$searchQuery = isset($_GET['query']) ? $conn->real_escape_string($_GET['query']) : '';

$sql = "SELECT nis, nama_siswa, kelas, no_hp FROM siswa";

if (!empty($searchQuery)) {
    // Tambahkan kondisi WHERE untuk mencari nama_siswa yang mirip
    $sql .= " WHERE nama_siswa LIKE '%" . $searchQuery . "%'";
}

$sql .= " ORDER BY nama_siswa ASC LIMIT 10"; // Batasi hasil untuk performa

$result = $conn->query($sql);

$students = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

echo json_encode($students);

$conn->close();
?>