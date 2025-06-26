<?php
header('Content-Type: application/json');
$koneksi = new mysqli("localhost", "root", "", "revisi_ppsi");

$tipe = $_GET['tipe'] ?? '';
$tanggal = $_GET['tanggal'] ?? '';
$kelas = $_GET['kelas'] ?? '';
$absen = $_GET['absen'] ?? 'datang';

if ($tipe == 'siswa') {
    $sql = "SELECT r.*, s.nama_siswa, s.jenis_kelamin, s.kelas 
            FROM rekap_absen_siswa r 
            JOIN siswa s ON r.nis = s.nis";

    $result = $koneksi->query($sql);
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "name" => $row['nama_siswa'],
            "jenis_kelamin" => $row['jenis_kelamin'],
            "nis" => $row['nis'],
            "kelas" => $row['kelas'],
            "tanggal" => date('d-F-Y', strtotime($row['tanggal'])),
            "status" => ucfirst($row['status'])
        ];
    }

    echo json_encode($data);
} elseif ($tipe == 'guru') {
    $sql = "SELECT r.*, g.nama_guru, g.foto 
            FROM rekap_absen_guru r 
            JOIN guru g ON r.nip = g.nip 
            WHERE tipe = '$absen'";

    $result = $koneksi->query($sql);
    $data = [];

    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "name" => $row['nama_guru'],
            "avatar" => $row['foto'],
            "date" => date('d-F-Y', strtotime($row['tanggal'])),
            "time" => $row['waktu'],
            "status" => ucfirst($row['status']),
            "note" => $row['keterangan']
        ];
    }

    echo json_encode($data);
}
?>
