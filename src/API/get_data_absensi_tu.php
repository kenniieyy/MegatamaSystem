<?php
include "../config/config.php";

// Cek request type
$tipe = $_GET['tipe'] ?? 'siswa';
$bulan = $_GET['bulan'] ?? date('m');
$tahun = $_GET['tahun'] ?? date('Y');

header('Content-Type: application/json');

if ($tipe == 'guru') {
    $query = "
    SELECT
        ag.id_absen_guru,
        ag.id_guru,
        g.nama_guru AS nama,
        g.foto_url,
        ag.tanggal,
        ag.jam_datang,
        ag.jam_pulang,
        ag.foto_datang,
        ag.foto_pulang
    FROM absen_guru AS ag
    INNER JOIN guru AS g ON ag.id_guru = g.id_guru
    WHERE MONTH(ag.tanggal) = $bulan AND YEAR(ag.tanggal) = $tahun
    ";
} else {
    $query = "
SELECT
  siswa.nama_siswa AS nama,
  siswa.jenis_kelamin,
  siswa.nis,
  siswa.kelas,
  absen.tanggal,
  absen.jam_mulai,
  absen.jam_selesai,
  absen_siswa.status
FROM absen_siswa
INNER JOIN siswa ON absen_siswa.nis = siswa.nis
INNER JOIN absen ON absen_siswa.id_absen = absen.id_absen
WHERE MONTH(absen.tanggal) = $bulan AND YEAR(absen.tanggal) = $tahun
";
}

$result = $conn->query($query);
$data = [];

// Tambahkan pengecekan jika query gagal
if (!$result) {
    // Log error dan kirimkan pesan error ke client (opsional, untuk debugging)
    error_log("Query failed: " . $conn->error . " for query: " . $query);
    echo json_encode(["error" => "Failed to fetch data", "details" => $conn->error]);
    exit(); // Hentikan eksekusi script
}

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>