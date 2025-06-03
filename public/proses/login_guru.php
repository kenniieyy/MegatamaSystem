<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Izinkan permintaan dari semua origin (untuk pengembangan, batasi di produksi)
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

include "../config/config.php";

$input = json_decode(file_get_contents('php://input'), true);

$nip = $input['nip'] ?? '';
$password = $input['password'] ?? '';

if (empty($nip) || empty($password)) {
    echo json_encode(['status' => 'error', 'message' => 'NIP dan password harus diisi.']);
    exit();
}

// Siapkan pernyataan untuk mencegah SQL injection
$stmt = $conn->prepare("SELECT nip, nama_guru, password FROM guru WHERE nip = ?");
$stmt->bind_param("s", $nip);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    // Verifikasi kata sandi (dengan asumsi Anda menyimpan kata sandi yang di-hash)
    if ($password == $row['password']) {
        echo json_encode(['status' => 'success', 'message' => 'Login berhasil!', 'nama_guru' => $row['nama_guru']]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Password salah.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'NIP tidak ditemukan.']);
}

$stmt->close();
$conn->close();
?>