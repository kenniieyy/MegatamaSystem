<?php
include "../config/config.php"; // Adjust path as needed
session_start();

header('Content-Type: application/json'); // Set header to indicate JSON response

// Check if user is logged in as guru
if (empty($_SESSION['guru_id']) || empty($_SESSION['nama_guru']) || empty($_SESSION['ID'])) {
    echo json_encode(['error' => 'Unauthorized access']);
    exit();
}

$id_guru = $_SESSION['guru_id'];
$nama_guru = $_SESSION['nama_guru'];
$nip = $_SESSION['nip'];
$tanggal = date('Y-m-d');

$response = [];

// 1. Get welcome name
$nama_depan = explode(',', $nama_guru)[0];
$response['welcome_name'] = trim($nama_depan);

// 2. Get today's attendance status
$query_absen = mysqli_query($conn, "SELECT jam_datang, jam_pulang FROM absen_guru WHERE id_guru = '$id_guru' AND tanggal = '$tanggal'");
$data_absen = mysqli_fetch_assoc($query_absen);

$response['status_datang'] = "Belum Absen Datang";
$response['status_pulang'] = "Belum Absen Pulang";

if ($data_absen) {
    if (!empty($data_absen['jam_datang'])) {
        $response['status_datang'] = "Sudah Absen Datang";
    }
    if (!empty($data_absen['jam_pulang'])) {
        $response['status_pulang'] = "Sudah Absen Pulang";
    }
}

// 3. Get monthly attendance count
// This logic was previously in `kehadiran_guru.php`. We'll integrate it here.
$bulan = isset($_GET['bulan']) ? (int)$_GET['bulan'] : date('n'); // Get month from query param, default to current month
$tahun = date('Y');

$query_kehadiran = "SELECT COUNT(DISTINCT tanggal) AS hadir_count FROM absen_guru WHERE id_guru = '$id_guru' AND MONTH(tanggal) = '$bulan' AND YEAR(tanggal) = '$tahun' AND jam_datang IS NOT NULL";
$result_kehadiran = mysqli_query($conn, $query_kehadiran);
$data_kehadiran = mysqli_fetch_assoc($result_kehadiran);
$hadir_count = $data_kehadiran['hadir_count'];

// Calculate total working days in the month (excluding weekends if necessary, or a fixed number)
// For simplicity, let's just get the number of days in the month
$total_days_in_month = cal_days_in_month(CAL_GREGORIAN, $bulan, $tahun);
$response['attendance_count'] = [
    'hadir' => $hadir_count,
    'total' => $total_days_in_month
];


// 4. Get chart data (for Absen Datang and Absen Pulang)
// This logic was previously in `proses/chart_guru.php`. We'll integrate it here or call it.
// Assuming chart_guru.php directly sets $datangDataFromPHP and $pulangDataFromPHP
// If chart_guru.php echoes HTML, you need to modify it to return JSON or integrate its logic here.
// For now, I'll put placeholder logic.

// --- Start of integrated chart_guru.php logic (simplified for example) ---
// You need to replace this with your actual logic from chart_guru.php
// This example assumes you want percentages based on statuses.
$datang_tepat_waktu = 0;
$datang_terlambat = 0;
$datang_tidak_dilakukan = 0;
$pulang_tepat_waktu = 0;
$pulang_terlambat = 0;
$pulang_tidak_dilakukan = 0;

$query_chart = "SELECT status_datang, status_pulang FROM absen_guru WHERE id_guru = '$id_guru' AND MONTH(tanggal) = '$bulan' AND YEAR(tanggal) = '$tahun'";
$result_chart = mysqli_query($conn, $query_chart);

$total_datang_records = 0;
$total_pulang_records = 0;

while ($row = mysqli_fetch_assoc($result_chart)) {
    // For Datang
    if (!empty($row['status_datang'])) {
        $total_datang_records++;
        if ($row['status_datang'] == 'Tepat Waktu') { // Assuming your status_datang field stores these strings
            $datang_tepat_waktu++;
        } elseif ($row['status_datang'] == 'Terlambat') {
            $datang_terlambat++;
        }
    } else { // If jam_datang is empty, it's 'Absen Tidak Dilakukan'
        $total_datang_records++; // Count even if not done
        $datang_tidak_dilakukan++;
    }

    // For Pulang
    if (!empty($row['status_pulang'])) {
        $total_pulang_records++;
        if ($row['status_pulang'] == 'Tepat Waktu') {
            $pulang_tepat_waktu++;
        } elseif ($row['status_pulang'] == 'Terlambat') {
            $pulang_terlambat++;
        }
    } else { // If jam_pulang is empty, it's 'Absen Tidak Dilakukan'
        $total_pulang_records++; // Count even if not done
        $pulang_tidak_dilakukan++;
    }
}

// Ensure total_datang_records is not zero to prevent division by zero
if ($total_datang_records > 0) {
    $response['datangDataFromPHP'] = [
        round(($datang_tepat_waktu / $total_datang_records) * 100, 2),
        round(($datang_terlambat / $total_datang_records) * 100, 2),
        round(($datang_tidak_dilakukan / $total_datang_records) * 100, 2)
    ];
} else {
    $response['datangDataFromPHP'] = [0, 0, 0]; // No data
}

if ($total_pulang_records > 0) {
    $response['pulangDataFromPHP'] = [
        round(($pulang_tepat_waktu / $total_pulang_records) * 100, 2),
        round(($pulang_terlambat / $total_pulang_records) * 100, 2),
        round(($pulang_tidak_dilakukan / $total_pulang_records) * 100, 2)
    ];
} else {
    $response['pulangDataFromPHP'] = [0, 0, 0]; // No data
}
// --- End of integrated chart_guru.php logic ---


// 5. Get latest activities
// This logic was previously in `proses/aktivitas.php`. Integrate it here.
$query_aktivitas = "SELECT * FROM aktivitas WHERE id_guru = '$id_guru' ORDER BY waktu DESC LIMIT 5";
$result_aktivitas = $conn->query($query_aktivitas);
$activities = [];
if ($result_aktivitas->num_rows > 0) {
    while($row = $result_aktivitas->fetch_assoc()) {
        $activities[] = [
            'deskripsi' => htmlspecialchars($row['deskripsi']),
            'waktu' => htmlspecialchars($row['waktu'])
        ];
    }
}
$response['latest_activities'] = $activities;


// 6. Get dashboard attendance history
// This logic was previously in `proses/riwayat.php` if `riwayat.js` uses it for the dashboard table.
// Assuming the dashboard table needs recent attendance.
$query_history = "SELECT * FROM absen_guru WHERE id_guru = '$id_guru' ORDER BY tanggal DESC, jam_datang DESC LIMIT 5"; // Adjust limit as needed
$result_history = mysqli_query($conn, $query_history);
$attendance_history = [];
if ($result_history->num_rows > 0) {
    while ($row = mysqli_fetch_assoc($result_history)) {
        // You'll need to fetch the photo path for the guru here if not already done.
        // For simplicity, let's assume a default photo or get it from $profil_guru if accessible.
        // Or you might need to join with the 'guru' table to get the photo.
        $foto_guru = 'img/guru/' . (isset($profil_guru['foto_profil']) ? $profil_guru['foto_profil'] : '1.png');

        $attendance_history[] = [
            'foto' => $foto_guru, // Placeholder, adjust based on your DB schema
            'tanggal' => htmlspecialchars($row['tanggal']),
            'jam_datang' => !empty($row['jam_datang']) ? htmlspecialchars($row['jam_datang']) : '-',
            'jam_pulang' => !empty($row['jam_pulang']) ? htmlspecialchars($row['jam_pulang']) : '-',
            'status_datang' => !empty($row['status_datang']) ? htmlspecialchars($row['status_datang']) : 'Belum Absen',
            'keterangan_datang' => !empty($row['keterangan_datang']) ? htmlspecialchars($row['keterangan_datang']) : '-',
            // Combine status and keterangan if you want a single 'Status' column like in the old HTML
            'status_gabungan' => (!empty($row['jam_datang']) ? 'Datang: ' . htmlspecialchars($row['status_datang']) : '') . (!empty($row['jam_pulang']) ? ', Pulang: ' . htmlspecialchars($row['status_pulang']) : ''),
            'keterangan_gabungan' => (!empty($row['keterangan_datang']) ? 'Datang: ' . htmlspecialchars($row['keterangan_datang']) : '') . (!empty($row['keterangan_pulang']) ? ' Pulang: ' . htmlspecialchars($row['keterangan_pulang']) : '')
        ];
    }
}
$response['attendance_history'] = $attendance_history;


echo json_encode($response);

// Close database connection
if (isset($conn)) {
    mysqli_close($conn);
}
?>