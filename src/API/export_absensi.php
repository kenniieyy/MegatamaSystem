<?php
require_once __DIR__ . '/dompdf/autoload.inc.php';

use Dompdf\Dompdf;

$koneksi = new mysqli("localhost", "root", "", "proyek_ppsi");

$tipe = $_GET['tipe'] ?? 'siswa';
$html = "<h2>Rekap Absensi ".ucfirst($tipe)."</h2><table border='1' cellpadding='5' cellspacing='0'><thead>";

if ($tipe === 'guru') {
    $query = "SELECT r.*, g.nama_guru FROM rekap_absen_guru r 
              JOIN guru g ON r.id_guru = g.id_guru ORDER BY r.tanggal DESC";
    $result = $koneksi->query($query);

    $html .= "<tr><th>Nama</th><th>Tanggal</th><th>Waktu</th><th>Status</th><th>Keterangan</th></tr>";
    while ($row = $result->fetch_assoc()) {
        $html .= "<tr>
            <td>{$row['nama_guru']}</td>
            <td>{$row['tanggal']}</td>
            <td>{$row['waktu']}</td>
            <td>{$row['status']}</td>
            <td>{$row['keterangan']}</td>
        </tr>";
    }
} else {
    $query = "SELECT r.*, s.nama_siswa FROM rekap_absen_siswa r 
              JOIN siswa s ON r.nis = s.nis ORDER BY r.tanggal DESC";
    $result = $koneksi->query($query);

    $html .= "<tr><th>Nama</th><th>Tanggal</th><th>Status</th></tr>";
    while ($row = $result->fetch_assoc()) {
        $html .= "<tr>
            <td>{$row['nama_siswa']}</td>
            <td>{$row['tanggal']}</td>
            <td>{$row['status']}</td>
        </tr>";
    }
}

$html .= "</thead></table>";

$dompdf = new Dompdf();
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream("rekap_absensi_{$tipe}.pdf");
?>