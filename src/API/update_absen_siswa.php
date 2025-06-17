<?php
include '../config/config.php';
header('Content-Type: application/json');

// Ambil data dari JSON
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['id_presensi']) || !isset($data['students'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

$id_presensi = $data['id_presensi'];
$students = $data['students'];

$success = true;

foreach ($students as $student) {
    $id_siswa = $student['id_siswa']; // <- Perhatikan key-nya 'nis'
    $status = $student['status'];

    $query = "UPDATE absen_siswa SET status = ? WHERE id_absen = ? AND nis = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Prepare failed: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('sis', $status, $id_presensi, $id_siswa);

    if (!$stmt->execute()) {
        echo json_encode(['success' => false, 'message' => 'Execute failed: ' . $stmt->error]);
        exit;
    }

    $stmt->close();
}

$conn->close();

echo json_encode(['success' => true]);
exit;
