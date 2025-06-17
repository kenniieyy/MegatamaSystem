<?php
include "../config/config.php";

header('Content-Type: application/json');

// Ambil parameter kelas dari permintaan GET
$kelas = isset($_GET['kelas']) ? $_GET['kelas'] : '';

// Validasi input kelas untuk mencegah SQL Injection (sangat penting!)
// Sesuaikan dengan format kelas di database Anda (misal: "7", "8", "9", dst.)
$allowed_classes = ['7', '8', '9', '10', '11', '12']; // Sesuaikan jika ada kelas lain
if (!in_array($kelas, $allowed_classes)) {
    die(json_encode(["error" => "Kelas tidak valid."]));
}

// Persiapkan query SQL
// Pastikan nama tabel dan kolom sesuai dengan database Anda
$sql = "SELECT jenis_kelamin, COUNT(*) as count FROM siswa WHERE kelas = ? GROUP BY jenis_kelamin";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    die(json_encode(["error" => "Error mempersiapkan statement: " . $conn->error]));
}

$stmt->bind_param("s", $kelas);
$stmt->execute();
$result = $stmt->get_result();

$male_count = 0;
$female_count = 0;

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (strtoupper($row['jenis_kelamin']) == 'L') {
            $male_count = (int)$row['count'];
        } elseif (strtoupper($row['jenis_kelamin']) == 'P') {
            $female_count = (int)$row['count'];
        }
    }
}

$stmt->close();
$conn->close();

echo json_encode([
    "labels" => ["Laki-laki", "Perempuan"],
    "data" => [$male_count, $female_count]
]);
?>