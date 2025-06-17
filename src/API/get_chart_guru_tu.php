<?php
session_start();
include '../config/config.php';

header('Content-Type: application/json');

// Ambil parameter bulan dari request GET
// Default ke bulan saat ini jika parameter tidak disediakan atau tidak valid
$requestedMonthParam = isset($_GET['month']) ? strtolower($_GET['month']) : date('F'); // 'F' untuk nama bulan lengkap (e.g., "June")

// Mapping nama bulan dari string ke angka
$monthNames = [
    'january' => 1, 'february' => 2, 'march' => 3, 'april' => 4,
    'may' => 5, 'june' => 6, 'july' => 7, 'august' => 8,
    'september' => 9, 'october' => 10, 'november' => 11, 'desember' => 12 // Perbaiki 'desember' di sini
];

// Pastikan bulan yang digunakan untuk query adalah bulan yang sesuai dari mapping
$bulan = isset($monthNames[$requestedMonthParam]) ? $monthNames[$requestedMonthParam] : date('n'); // 'n' untuk angka bulan (1-12)
$tahun = date('Y'); // Tahun saat ini (asumsi data absensi di tahun yang sama)

// Fungsi untuk menghitung jumlah hari kerja (Senin-Jumat)
function getWorkingDays($month, $year) {
    $workingDays = 0;
    $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $month, $year);
    for ($day = 1; $day <= $daysInMonth; $day++) {
        $date = strtotime("$year-$month-$day");
        $weekday = date('N', $date); // 1=Senin, 7=Minggu
        if ($weekday <= 5) { // Jika hari kerja (Senin sampai Jumat)
            $workingDays++;
        }
    }
    return $workingDays;
}

$totalHariKerja = getWorkingDays($bulan, $tahun);

// Inisialisasi variabel untuk menghitung statistik keseluruhan
$totalTepatWaktuDatang = 0;
$totalTerlambatDatang = 0;
$totalTepatWaktuPulang = 0;
$totalTerlambatPulang = 0;
$jumlahAbsensiTercatat = 0; // Total baris absensi yang tercatat

// Waktu batas untuk datang dan pulang
$batasDatang = strtotime("07:15:00");
$batasPulang = strtotime("15:00:00");

$sql = "SELECT tanggal, jam_datang, jam_pulang 
        FROM absen_guru 
        WHERE YEAR(tanggal) = ? 
          AND MONTH(tanggal) = ?";

$stmt = null; 
try {
    $stmt = $conn->prepare($sql);
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $conn->error);
    }
    // Menggunakan $tahun dan $bulan yang sudah diproses dari parameter GET
    $stmt->bind_param("ii", $tahun, $bulan); 
    $stmt->execute();
    $result = $stmt->get_result();

    $hadirDatesOverall = []; // Untuk melacak tanggal-tanggal unik yang memiliki absensi
    while ($row = $result->fetch_assoc()) {
        $jamDatang = strtotime($row['jam_datang']);
        
        $jumlahAbsensiTercatat++; 

        // Catat tanggal ini sebagai tanggal yang ada absensinya
        $hadirDatesOverall[$row['tanggal']] = true;

        // Klasifikasi datang
        if ($jamDatang <= $batasDatang) {
            $totalTepatWaktuDatang++;
        } else {
            $totalTerlambatDatang++;
        }

        // Klasifikasi pulang (pastikan jam_pulang tidak kosong)
        if (!empty($row['jam_pulang'])) {
            $jamPulang = strtotime($row['jam_pulang']);
            if ($jamPulang >= $batasPulang) {
                $totalTepatWaktuPulang++;
            } else {
                $totalTerlambatPulang++;
            }
        }
    }

    // Hitung 'absen_tidak_dilakukan' sebagai hari kerja di bulan yang tidak memiliki absensi dari guru manapun
    $hariDenganAbsensi = count($hadirDatesOverall);
    $absenTidakDilakukanOverall = max(0, $totalHariKerja - $hariDenganAbsensi); 

    echo json_encode([
        'datang' => [
            'tepat_waktu' => $totalTepatWaktuDatang,
            'terlambat' => $totalTerlambatDatang,
            'absen_tidak_dilakukan' => $absenTidakDilakukanOverall
        ],
        'pulang' => [
            'tepat_waktu' => $totalTepatWaktuPulang,
            'terlambat' => $totalTerlambatPulang,
            'absen_tidak_dilakukan' => $absenTidakDilakukanOverall 
        ],
        'totalHariKerja' => $totalHariKerja,
        'jumlahAbsensiTercatat' => $jumlahAbsensiTercatat 
    ]);

} catch (Exception $e) {
    http_response_code(500); 
    echo json_encode(['error' => $e->getMessage()]);
} finally {
    if ($stmt) {
        $stmt->close();
    }
    if ($conn) {
        $conn->close();
    }
}
?>