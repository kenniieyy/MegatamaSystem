<?php
include "../config/config.php"; // koneksi DB
$bulanList = ["januari", "februari", "maret", "april", "mei", "juni"];

$stmt = $pdo->prepare("
  SELECT s.nama_siswa, MONTH(a.tanggal) AS bulan, sa.status, COUNT(*) AS jumlah
  FROM absen_siswa sa
  JOIN absensi a ON sa.id_absen = a.id_absen
  JOIN siswa s ON sa.nis = s.nis
  WHERE MONTH(a.tanggal) BETWEEN 1 AND 6
  GROUP BY s.nama_siswa, MONTH(a.tanggal), sa.status
  ORDER BY s.nama_siswa
");
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

$tempData = [];

foreach ($result as $row) {
    $nama = $row['nama_siswa'];
    $bulanIndex = (int)$row['bulan'];
    $status = strtolower($row['status']);
    $jumlah = (int)$row['jumlah'];
    $bulanKey = $bulanList[$bulanIndex - 1];

    if (!isset($tempData[$nama])) {
        $tempData[$nama] = [
            'nama' => $nama,
            'bulan' => [],
            'total' => ['s' => 0, 'i' => 0, 'a' => 0]
        ];
    }

    if (!isset($tempData[$nama]['bulan'][$bulanKey])) {
        $tempData[$nama]['bulan'][$bulanKey] = ['s' => 0, 'i' => 0, 'a' => 0];
    }

    if ($status === 'sakit') {
        $tempData[$nama]['bulan'][$bulanKey]['s'] += $jumlah;
        $tempData[$nama]['total']['s'] += $jumlah;
    } elseif ($status === 'izin') {
        $tempData[$nama]['bulan'][$bulanKey]['i'] += $jumlah;
        $tempData[$nama]['total']['i'] += $jumlah;
    } elseif ($status === 'alpa') {
        $tempData[$nama]['bulan'][$bulanKey]['a'] += $jumlah;
        $tempData[$nama]['total']['a'] += $jumlah;
    }
}

$data = array_values($tempData);

// Load template
$template = file_get_contents("../file/rekap_absensi.rtf");

// Ganti placeholder dengan data dari database
foreach ($data as $i => $siswa) {
    $idx = $i + 1;
    $template = str_replace("{{nama_$idx}}", $siswa['nama'], $template);
    foreach ($bulanList as $bulan) {
        $sakit = $siswa['bulan'][$bulan]['s'] ?? 0;
        $izin = $siswa['bulan'][$bulan]['i'] ?? 0;
        $alpa = $siswa['bulan'][$bulan]['a'] ?? 0;

        $template = str_replace("{{{$bulan}{$idx}_s}}", $sakit, $template);
        $template = str_replace("{{{$bulan}{$idx}_i}}", $izin, $template);
        $template = str_replace("{{{$bulan}{$idx}_a}}", $alpa, $template);
    }

    $template = str_replace("{{total{$idx}_s}}", $siswa['total']['s'], $template);
    $template = str_replace("{{total{$idx}_i}}", $siswa['total']['i'], $template);
    $template = str_replace("{{total{$idx}_a}}", $siswa['total']['a'], $template);
}

// Simpan & kirim file
shell_exec("libreoffice --headless --convert-to pdf rekap-absensi.rtf");
$output = "rekap-absensi.pdf";
file_put_contents($output, $template);

header("Content-Type: application/pdf");
header("Content-Disposition: attachment; filename=$output");
readfile($output);
unlink($output);
exit;
