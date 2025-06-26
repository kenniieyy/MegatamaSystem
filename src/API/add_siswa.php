<?php
include '../config/config.php';

header('Content-Type: application/json');

// Ambil data dari POST
$nama = $_POST['namaLengkap'];
$nis = $_POST['nis'];
$jk = $_POST['jenisKelamin'];
$kelas = $_POST['kelas'];
$noHp = $_POST['noHp'];
$status = $_POST['status'];

// Validasi sederhana
if (!$nama || !$nis) {
    echo json_encode(['success' => false, 'message' => 'Data tidak lengkap']);
    exit;
}

// Insert ke database
$query = "INSERT INTO siswa (nis, nama_siswa, jenis_kelamin, kelas, no_hp, status_siswa)
          VALUES ('$nis', '$nama', '$jk', '$kelas', '$noHp', '$status')";

if (mysqli_query($conn, $query)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => mysqli_error($conn)]);
}
?>
