<?php
session_start();
header('Content-Type: application/json');

include "../config/config.php";

// Cek jika guru sudah login
if (!isset($_SESSION['guru_id'])) {
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$id_guru = $_SESSION['guru_id'];

$sql = "
    SELECT 
        p.id_absen, p.kelas, p.tanggal, p.jam_mulai, p.jam_selesai, p.dibuat_pada,
        s.id_siswa, s.nama_siswa, s.kelas AS kelas_siswa, s.jenis_kelamin, ps.status
    FROM absen p
    JOIN absen_siswa ps ON p.id_absen = ps.id_absen
    JOIN siswa s ON ps.id_siswa = s.id_siswa
    WHERE p.id_guru = '$id_guru'
    ORDER BY p.tanggal DESC, s.nama_siswa ASC
";

$result = mysqli_query($conn, $sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $id_presensi = $row['id_absen'];
    if (!isset($data[$id_presensi])) {
        $data[$id_presensi] = [
            'id' => $id_presensi,
            'kelas' => $row['kelas'],
            'tanggal' => $row['tanggal'],
            'jam_mulai' => $row['jam_mulai'],
            'jam_selesai' => $row['jam_selesai'],
            'dibuat_pada' => $row['dibuat_pada'],
            'siswa' => []
        ];
    }

    $data[$id_presensi]['siswa'][] = [
        'id' => $row['id_siswa'],
        'nama' => $row['nama_siswa'],
        'jenis_kelamin' => $row['jenis_kelamin'],
        'status' => $row['status']
    ];
}

echo json_encode(array_values($data));
$conn->close();
?>
