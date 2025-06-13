<?php
include "./config/config.php";

$id_guru = $_SESSION['guru_id']; // Pastikan ini ada
$bulan = isset($_GET['bulan']) ? $_GET['bulan'] : date('m');
$tahun = date('Y');


$sql = "SELECT tanggal, jam_datang FROM absen_guru 
        WHERE id_guru = '$id_guru' 
        AND MONTH(tanggal) = '$bulan' 
        AND YEAR(tanggal) = '$tahun'";
$result = $conn->query($sql);

$batas_jam = "08:00:00";
$tepat = 0;
$terlambat = 0;
$hadir_hari = [];

// Konfigurasi batas waktu pulang
$batas_pulang = "15:00:00";
$tepat_pulang = 0;
$cepat_pulang = 0;
$tidak_absen_pulang = 0;

$sql_pulang = "SELECT tanggal, jam_pulang FROM absen_guru 
               WHERE id_guru = '$id_guru' 
               AND MONTH(tanggal) = '$bulan' 
               AND YEAR(tanggal) = '$tahun'";
$result_pulang = $conn->query($sql_pulang);

$hadir_pulang_hari = [];

while ($row = $result->fetch_assoc()) {
    $hadir_hari[] = $row['tanggal'];
    if (!empty($row['jam_datang'])) {
        if ($row['jam_datang'] <= $batas_jam) {
            $tepat++;
        } else {
            $terlambat++;
        }
    }
}

while ($row = $result_pulang->fetch_assoc()) {
    if (!empty($row['jam_pulang'])) {
        $hadir_pulang_hari[] = $row['tanggal'];
        if ($row['jam_pulang'] >= $batas_pulang) {
            $tepat_pulang++;
        } else {
            $cepat_pulang++;
        }
    }
}

$hari_kerja = 0;
$start = strtotime("$tahun-$bulan-01");
$end = strtotime(date("Y-m-t", $start));
for ($i = $start; $i <= $end; $i += 86400) {
    if (date("N", $i) <= 5) {
        $hari_kerja++;
    }
}

$tidak_absen = $hari_kerja - count(array_unique($hadir_hari));
$persen_tepat = round(($tepat / $hari_kerja) * 100);
$persen_terlambat = round(($terlambat / $hari_kerja) * 100);
$persen_tidak_absen = 100 - $persen_tepat - $persen_terlambat;

// Kirim ke JS
$chartDatangData = [$persen_tepat, $persen_terlambat, $persen_tidak_absen];

$tidak_absen_pulang = $hari_kerja - count(array_unique($hadir_pulang_hari));

$persen_tepat_pulang = round(($tepat_pulang / $hari_kerja) * 100);
$persen_cepat_pulang = round(($cepat_pulang / $hari_kerja) * 100);
$persen_tidak_pulang = 100 - $persen_tepat_pulang - $persen_cepat_pulang;

$chartPulangData = [$persen_tepat_pulang, $persen_cepat_pulang, $persen_tidak_pulang];
?>

<script>
    const datangDataFromPHP = <?= json_encode($chartDatangData); ?>;
    const pulangDataFromPHP = <?= json_encode($chartPulangData); ?>;
</script>
