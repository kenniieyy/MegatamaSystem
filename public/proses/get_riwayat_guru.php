<?php
session_start();
include '../config/config.php';

header('Content-Type: application/json');

$guru_id = $_SESSION['guru_id'] ?? null;

if (!$guru_id) {
    echo json_encode(['status' => 'error', 'message' => 'Belum login']);
    exit;
}

// Query ambil data presensi dan NIP
$sql = "SELECT ag.tanggal, ag.jam_datang, ag.jam_pulang, g.nip 
        FROM absen_guru ag
        JOIN guru g ON ag.id_guru = g.id_guru
        WHERE ag.id_guru = '$guru_id' 
        ORDER BY ag.tanggal DESC"; // Tambahkan alias agar lebih jelas

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = [
        'date' => date('d-M-Y', strtotime($row['tanggal'])),
        'datang' => $row['jam_datang'] ?? "-",
        'pulang' => $row['jam_pulang'] ?? "-",
        'nip' => $row['nip'] // Tambahkan NIP ke dalam data
    ];
}

echo json_encode(['status' => 'success', 'data' => $data]);
?>