<?php
session_start();
include '../config/config.php';

header('Content-Type: application/json');

$id_guru = $_SESSION['guru_id'];

$bulan = date('m');
$tahun = date('Y');
function getWorkingDays($month, $year) {
    $workingDays = 0;
    $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);

    for ($day = 1; $day <= $daysInMonth; $day++) {
        $date = strtotime("$year-$month-$day");
        $weekday = date('N', $date); // 1 (Senin) - 7 (Minggu)
        if ($weekday < 7) { // Senin-Jumat
            $workingDays++;
        }
    }
    return $workingDays;
}

$totalHariKerja = getWorkingDays($bulan, $tahun);

$sql = "SELECT COUNT(DISTINCT tanggal) AS hari_hadir 
        FROM absen_guru
        WHERE id_guru = ? 
          AND YEAR(tanggal) = ? 
          AND MONTH(tanggal) = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $id_guru, $tahun, $bulan);
$stmt->execute();
$result = $stmt->get_result();

$hariHadir = 0;
if ($row = $result->fetch_assoc()) {
    $hariHadir = $row['hari_hadir'];
}

echo json_encode([
    'hadir' => $hariHadir,
    'total' => $totalHariKerja
]);

$stmt->close();
$conn->close();
?>