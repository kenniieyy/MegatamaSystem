<?php
header('Content-Type: application/json; charset=utf-8'); // wajib buat fetch bisa baca JSON

$host = 'localhost';
$user = 'root';
$pass = '';
$db   = 'proyek_ppsi';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Koneksi gagal: " . $conn->connect_error
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // validasi form data dari JavaScript
    $namaRuangan = isset($_POST['namaRuangan']) ? $_POST['namaRuangan'] : '';
    $lokasi = isset($_POST['lokasi']) ? $_POST['lokasi'] : '';
    $keterangan = isset($_POST['keterangan']) ? $_POST['keterangan'] : '';

    if (empty($namaRuangan) || empty($lokasi)) {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Nama ruangan dan lokasi wajib diisi."
        ]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO ruangan (nama_ruangan, lokasi, keterangan) VALUES (?, ?, ?)");
    if (!$stmt) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Prepare statement gagal: " . $conn->error
        ]);
        exit;
    }

    $stmt->bind_param("sss", $namaRuangan, $lokasi, $keterangan);

    if ($stmt->execute()) {
        echo json_encode([
            "status" => "success",
            "message" => "Data berhasil disimpan"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menyimpan data: " . $stmt->error
        ]);
    }

    $stmt->close();
} else {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Metode tidak diizinkan"
    ]);
}

$conn->close();
?>
