<?php
header('Content-Type: application/json');
include '../config/config.php';

session_start();

// Cek jika guru sudah login
if (!isset($_SESSION['guru_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$id_guru = $_SESSION['guru_id'];

try {
    $sql = "SELECT id_guru, tanggal, jam_datang, jam_pulang, foto_datang, foto_pulang 
FROM absen_guru 
WHERE id_guru = '$id_guru' 
ORDER BY tanggal DESC, 
         GREATEST(IFNULL(jam_datang, '00:00:00'), IFNULL(jam_pulang, '00:00:00')) DESC;";
    $result = mysqli_query($conn, $sql);

    if (!$result) {
        throw new Exception("Query error: " . mysqli_error($conn));
    }

    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = [
            'nip' => $row['id_guru'],
            'date' => $row['tanggal'],
            'datang' => $row['jam_datang'],
            'pulang' => $row['jam_pulang'],
            'foto_datang' => $row['foto_datang'],
            'foto_pulang' => $row['foto_pulang']
        ];
    }

    echo json_encode(['status' => 'success', 'data' => $data]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
