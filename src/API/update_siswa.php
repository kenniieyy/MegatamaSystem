<?php
include '../config/config.php';

header('Content-Type: application/json');

$nis_lama = $_POST['nis_lama'];
$nis_baru = $_POST['nis']; // NIS yang baru (boleh sama kalau tidak diubah)
$nama = $_POST['namaLengkap'];
$jenis_kelamin = $_POST['jenisKelamin'];
$kelas = $_POST['kelas'];
$no_hp = $_POST['noHp'];
$status = $_POST['status'];

$sql = "UPDATE siswa SET
            nis = '$nis_baru',
            nama_siswa = '$nama',
            jenis_kelamin = '$jenis_kelamin',
            kelas = '$kelas',
            no_hp = '$no_hp',
            status_siswa = '$status'
        WHERE nis = '$nis_lama'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Gagal mengupdate data: ' . mysqli_error($conn)
    ]);
}
?>
