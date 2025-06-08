<?php
header('Content-Type: application/json');
ini_set('display_errors', 1); // Tampilkan error di output (untuk debugging)
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Koneksi ke database MySQL
$host = "localhost";
$user = "root";
$password = "";
$dbname = "proyek_ppsi"; 

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    // Log error koneksi database
    error_log("Koneksi database gagal: " . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => 'Koneksi database gagal: ' . $conn->connect_error]);
    exit;
}

// Ambil input JSON
$input = json_decode(file_get_contents('php://input'), true);

// Log input JSON yang diterima
error_log("Input JSON diterima: " . print_r($input, true));

$action = $_GET['action'] ?? ($input['action'] ?? '');

// Log aksi yang terdeteksi
error_log("Aksi terdeteksi: " . $action);

if ($action == 'get') {
    // Ambil data ruangan
    $result = $conn->query("SELECT * FROM ruangan ORDER BY id DESC");
    if ($result) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $data]);
    } else {
        // Log error query
        error_log("Query GET gagal: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Gagal mengambil data: ' . $conn->error]);
    }
    exit;
} elseif ($action == 'add') {
    // Tambah data ruangan
    $namaRuangan = $conn->real_escape_string($input['namaRuangan'] ?? '');
    $lokasi = $conn->real_escape_string($input['lokasi'] ?? '');
    $keterangan = $conn->real_escape_string($input['keterangan'] ?? '');

    // Log data yang akan ditambahkan
    error_log("Data ADD: namaRuangan=" . $namaRuangan . ", lokasi=" . $lokasi . ", keterangan=" . $keterangan);

    if (!$namaRuangan || !$lokasi) {
        echo json_encode(['success' => false, 'message' => 'Nama Ruangan dan Lokasi wajib diisi.']);
        exit;
    }

    $sql = "INSERT INTO ruangan (namaRuangan, lokasi, keterangan) VALUES ('$namaRuangan', '$lokasi', '$keterangan')";
    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        // Log error query
        error_log("Query ADD gagal: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $conn->error]);
    }
    exit;
} elseif ($action == 'delete') {
    // Hapus data ruangan
    $id = (int) ($input['id'] ?? 0);

    // Log ID yang akan dihapus
    error_log("Data DELETE: id=" . $id);

    if ($id <= 0) {
        echo json_encode(['success' => false, 'message' => 'ID tidak valid.']);
        exit;
    }
    $sql = "DELETE FROM ruangan WHERE id = $id";
    if ($conn->query($sql)) {
        echo json_encode(['success' => true]);
    } else {
        // Log error query
        error_log("Query DELETE gagal: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus data: ' . $conn->error]);
    }
    exit;
} else {
    // Log aksi tidak dikenali
    error_log("Aksi tidak dikenali: " . $action);
    echo json_encode(['success' => false, 'message' => 'Aksi tidak dikenali.']);
    exit;
}
?>