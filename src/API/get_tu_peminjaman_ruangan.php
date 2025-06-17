<?php

include "../../src/config/config.php";
// Ambil data jumlah peminjaman per bulan per jenis ruangan
$sql = "SELECT 
            jenis_ruangan, 
            MONTHNAME(tanggal_peminjaman) AS bulan, 
            COUNT(*) AS jumlah
        FROM 
            peminjaman_ruangan
        GROUP BY 
            bulan, jenis_ruangan
        ORDER BY 
            MONTH(tanggal_peminjaman), jenis_ruangan";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $bulan = strtolower($row['bulan']);
    if (!isset($data[$bulan])) {
        $data[$bulan] = ['labels' => [], 'data' => []];
    }
    $data[$bulan]['labels'][] = $row['jenis_ruangan'];
    $data[$bulan]['data'][] = (int)$row['jumlah'];
}

// Output JSON
header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>
