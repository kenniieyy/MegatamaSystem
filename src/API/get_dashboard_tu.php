<?php
include "../src/config/config.php";

$tanggal = date('Y-m-d');

$q_datang = $conn->query("SELECT COUNT(*) as total_datang FROM absen_guru WHERE tanggal = CURDATE() AND jam_datang IS NOT NULL");
$datang = $q_datang->fetch_assoc()['total_datang'];

$q_pulang = $conn->query("SELECT COUNT(*) as total_pulang FROM absen_guru WHERE tanggal = CURDATE() AND jam_pulang IS NOT NULL");
$pulang = $q_pulang->fetch_assoc()['total_pulang'];

$q_total = $conn->query("SELECT COUNT(*) AS total_guru FROM guru;");
$total = $q_total->fetch_assoc()['total_guru'];

$q_total_siswa = $conn->query("SELECT COUNT(*) AS total_siswa FROM siswa;");
$total_siswa = $q_total_siswa->fetch_assoc()['total_siswa'];

$q_total_ruang = $conn->query("SELECT COUNT(*) AS total_ruang FROM peminjaman_ruangan WHERE tanggal_peminjaman = '$tanggal'");
$total_ruang = $q_total_ruang->fetch_assoc()['total_ruang'];
?>
