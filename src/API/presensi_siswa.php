<?php
include '../config/config.php';
session_start();

header('Content-Type: application/json'); // supaya JS tahu ini JSON
error_reporting(0); // untuk produksi, matikan error HTML
// error_reporting(E_ALL); ini_set('display_errors', 1); // aktifkan ini jika debug

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !isset($_SESSION['guru_id'])) {
    echo json_encode(['success' => false, 'message' => 'Data tidak valid atau belum login.']);
    exit;
}

$id_guru = $_SESSION['guru_id'];

$kelas = $input['kelas'];
$tanggal = $input['tanggal'];
$jam_mulai = $input['jam_mulai'];
$jam_selesai = $input['jam_selesai'];
$students = $input['students']; // ini array of objects: [{id_siswa:..., status:...}]

$query_absen = "INSERT INTO absen (kelas, id_guru, tanggal, jam_mulai, jam_selesai, dibuat_pada)
                VALUES ('$kelas', '$id_guru', '$tanggal', '$jam_mulai', '$jam_selesai', NOW())";

if (mysqli_query($conn, $query_absen)) {
    $id_presensi = mysqli_insert_id($conn);

    foreach ($students as $student) {
        $id_siswa = $student['nis'];
        $status = $student['status'];

        $query_siswa = "INSERT INTO absen_siswa (id_absen, nis, status)
                        VALUES ('$id_presensi', '$id_siswa', '$status')";
        mysqli_query($conn, $query_siswa);
    }

    // Tambahkan log aktivitas
    $judul = 'Input Absensi Kelas ' . $kelas;
    $tipe = 'absensi';
    $waktu = date('Y-m-d H:i:s');

    $conn->query("INSERT INTO aktivitas (id_guru, judul, tipe, waktu) VALUES ('$id_guru','$judul', '$tipe', '$waktu')");

    echo json_encode(['success' => true, 'message' => 'Presensi berhasil disimpan']);
} else {
    echo json_encode(['success' => false, 'message' => 'Gagal menyimpan presensi: ' . mysqli_error($conn)]);
}

mysqli_close($conn);
?>
