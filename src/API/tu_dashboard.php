<?php
// === HEADER DAN DEBUGGING ===
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// === KONEKSI DATABASE ===
include __DIR__ . '/../config/koneksi.php';
date_default_timezone_set('Asia/Jakarta');
$today = date('Y-m-d');

// === STATUS CARD ===
$totalGuru = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM guru WHERE status = 'Aktif'"));
$totalSiswa = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM siswa"));
$absenDatang = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM rekap_absen_guru WHERE tanggal = '$today' AND tipe = 'datang' AND status = 'hadir'"));
$absenPulangCount = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM rekap_absen_guru WHERE tanggal = '$today' AND tipe = 'pulang' AND status = 'hadir'"));
$ruanganDipinjam = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM peminjaman_ruangan WHERE tanggal_peminjaman = '$today'"));

$statusCards = [
    'absen_datang_hari_ini' => $absenDatang,
    'absen_pulang_hari_ini' => $absenPulangCount > 0 ? "$absenPulangCount Sudah Pulang" : "Belum Absen Pulang",
    'total_guru' => $totalGuru,
    'total_siswa' => $totalSiswa,
    'ruangan_dipinjam_hari_ini' => $ruanganDipinjam
];

// === AKTIVITAS TERBARU ===
$aktivitas = [];
$queryAktivitas = mysqli_query($conn, "SELECT * FROM log_aktivitas ORDER BY waktu DESC LIMIT 5");
while ($row = mysqli_fetch_assoc($queryAktivitas)) {
    $aktivitas[] = [
        'keterangan' => $row['keterangan'],
        'waktu' => date('d-m-Y H:i:s', strtotime($row['waktu'])) . " WIB",
        'icon' => $row['tipe'] ?? 'teacher'
    ];
}

// === FUNGSI CHART ===
function getMonthlyCount($conn, $table, $tanggalField, $extraWhere = '') {
    $data = [];
    $year = date('Y');
    for ($i = 1; $i <= 12; $i++) {
        $month = str_pad($i, 2, '0', STR_PAD_LEFT);
        $query = "SELECT COUNT(*) as total FROM $table WHERE MONTH($tanggalField) = '$month' AND YEAR($tanggalField) = '$year' $extraWhere";
        $res = mysqli_query($conn, $query);
        $row = mysqli_fetch_assoc($res);
        $namaBulan = strtolower(date('F', mktime(0, 0, 0, $i, 10)));
        $data[$namaBulan] = (int) $row['total'];
    }
    return $data;
}

function getKehadiranPersen($conn, $tipe) {
    $data = [];
    $totalGuru = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM guru WHERE status = 'Aktif'"));
    $year = date('Y');
    for ($i = 1; $i <= 12; $i++) {
        $month = str_pad($i, 2, '0', STR_PAD_LEFT);
        $query = "SELECT COUNT(*) as hadir FROM rekap_absen_guru WHERE tipe = '$tipe' AND status = 'hadir' AND MONTH(tanggal) = '$month' AND YEAR(tanggal) = '$year'";
        $res = mysqli_query($conn, $query);
        $row = mysqli_fetch_assoc($res);
        $persen = $totalGuru > 0 ? round(($row['hadir'] / $totalGuru) * 100) : 0;
        $namaBulan = strtolower(date('F', mktime(0, 0, 0, $i, 10)));
        $data[$namaBulan] = $persen;
    }
    return $data;
}

function getJumlahSiswaPerKelas($conn) {
    $result = [];
    $query = "SELECT kelas, COUNT(*) as jumlah FROM siswa GROUP BY kelas";
    $res = mysqli_query($conn, $query);
    while ($row = mysqli_fetch_assoc($res)) {
        $result[$row['kelas']] = (int)$row['jumlah'];
    }
    return $result;
}

// === CHARTS DATA ===
$charts = [
    'peminjaman_ruangan' => getMonthlyCount($conn, 'peminjaman_ruangan', 'tanggal_peminjaman'),
    'kehadiran_guru_datang' => getKehadiranPersen($conn, 'datang'),
    'kehadiran_guru_pulang' => getKehadiranPersen($conn, 'pulang'),
    'jumlah_siswa' => getJumlahSiswaPerKelas($conn)
];

// === KIRIM JSON RESPONSE ===
echo json_encode([
    'success' => true,
    'data' => [
        'status_cards' => $statusCards,
        'aktivitas_terbaru' => $aktivitas,
        'charts' => $charts
    ]
]);