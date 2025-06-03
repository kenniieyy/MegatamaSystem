<?php
include '../config/config.php';

// Ambil raw input dari fetch
$input = json_decode(file_get_contents("php://input"), true);

// Ambil data
$kelas = $input['kelas'];
$tanggal = $input['tanggal'];
$jam_mulai = $input['jam_mulai'];
$jam_selesai = $input['jam_selesai'];
$kehadiran = $input['kehadiran'];

// Simpan ke tabel `absen`
$query_absen = "INSERT INTO absen (kelas, tanggal, jam_mulai, jam_selesai, dibuat_pada)
                VALUES ('$kelas', '$tanggal', '$jam_mulai', '$jam_selesai', NOW())";

if (mysqli_query($conn, $query_absen)) {
    $id_presensi = mysqli_insert_id($conn); // Ambil ID absen terakhir

    foreach ($kehadiran as $id_siswa => $status) {
        $query_siswa = "INSERT INTO absen_siswa (id_presensi, id_siswa, status)
                        VALUES ('$id_presensi', '$id_siswa', '$status')";
        mysqli_query($conn, $query_siswa);
    }
} else {
    echo "Error: " . mysqli_error($conn);
}

mysqli_close($conn);
?>
