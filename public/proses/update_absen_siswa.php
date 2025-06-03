<?php
include '../config/config.php'; // Ubah path sesuai strukturmu

header('Content-Type: application/json');

// Ambil data dari JSON body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_presensi']) || !isset($data['students'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

$id_presensi = $data['id_presensi'];
$students = $data['students'];

$success = true;

// Loop dan update status presensi siswa
foreach ($students as $student) {
    $id_siswa = $student['id_siswa'];
    $status = $student['status'];

    $query = "UPDATE absen_siswa SET status = ? WHERE id_presensi = ? AND id_siswa = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('sii', $status, $id_presensi, $id_siswa);

    if (!$stmt->execute()) {
        $success = false;
        break;
    }
}

echo json_encode(['success' => $success]);
