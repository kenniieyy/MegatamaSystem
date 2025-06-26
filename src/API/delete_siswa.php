<?php
include '../config/config.php';

header('Content-Type: application/json');

if (!isset($_POST['nis'])) {
    echo json_encode(['success' => false, 'message' => 'NIS tidak diberikan']);
    exit;
}

$nis = mysqli_real_escape_string($conn, $_POST['nis']);

$sql = "DELETE FROM siswa WHERE nis = '$nis'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal menghapus data: ' . mysqli_error($conn)
    ]);
}
?>
