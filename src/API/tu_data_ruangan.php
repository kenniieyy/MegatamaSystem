<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Koneksi ke database
$host = "localhost";
$user = "root";
$password = "";
$dbname = "proyek_ppsi";

$conn = new mysqli($host, $user, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Koneksi database gagal: ' . $conn->connect_error
    ]);
    exit;
}

// Ambil method & input JSON
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? [];
$action = $_GET['action'] ?? ($input['action'] ?? '');

// Fungsi respon konsisten
function respond($success, $message = '', $data = null) {
    $res = ['success' => $success];
    if (!empty($message)) $res['message'] = $message;
    if (!is_null($data)) $res['data'] = $data;
    echo json_encode($res);
    exit;
}

//// ==== AMBIL DATA RUANGAN ====
if ($action === 'get' && $method === 'GET') {
    $result = $conn->query("SELECT * FROM ruangan ORDER BY id DESC");

    if (!$result) {
        respond(false, 'Gagal mengambil data: ' . $conn->error);
    }

    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    respond(true, '', $data);

//// ==== TAMBAH DATA RUANGAN ====
} elseif ($action === 'add' && $method === 'POST') {
    $nama = trim($input['namaRuangan'] ?? '');
    $lokasi = trim($input['lokasi'] ?? '');
    $keterangan = trim($input['keterangan'] ?? '');

    if ($nama === '' || $lokasi === '') {
        respond(false, 'Nama Ruangan dan Lokasi wajib diisi.');
    }

    $stmt = $conn->prepare("INSERT INTO ruangan (namaRuangan, lokasi, keterangan) VALUES (?, ?, ?)");
    if (!$stmt) {
        respond(false, 'Prepare gagal: ' . $conn->error);
    }

    $stmt->bind_param("sss", $nama, $lokasi, $keterangan);
    if ($stmt->execute()) {
        respond(true, 'Data ruangan berhasil ditambahkan.');
    } else {
        respond(false, 'Gagal menambahkan data: ' . $stmt->error);
    }

//// ==== HAPUS DATA RUANGAN ====
} elseif ($action === 'delete' && $method === 'POST') {
    $id = (int) ($input['id'] ?? 0);
    if ($id <= 0) {
        respond(false, 'ID tidak valid.');
    }

    $stmt = $conn->prepare("DELETE FROM ruangan WHERE id = ?");
    if (!$stmt) {
        respond(false, 'Prepare gagal: ' . $conn->error);
    }

    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        respond(true, 'Data ruangan berhasil dihapus.');
    } else {
        respond(false, 'Gagal menghapus data: ' . $stmt->error);
    }

//// ==== AKSI TIDAK DIKENALI ====
} else {
    respond(false, 'Aksi tidak dikenali atau method tidak sesuai.');
}
?>
