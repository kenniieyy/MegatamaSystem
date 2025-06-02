<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Untuk development lokal
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Cek method request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Hanya menerima request POST'
    ]);
    exit;
}

// Ambil data JSON dari body
$data = json_decode(file_get_contents('php://input'), true);

// Validasi input
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Username dan password wajib diisi'
    ]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// Koneksi ke database
$host = 'localhost';
$dbname = 'proyek ppsi';
$dbuser = 'root';
$dbpass = ''; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $dbuser, $dbpass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Cari user
    $stmt = $pdo->prepare("SELECT * FROM operator WHERE username = :username LIMIT 1");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Verifikasi password (asumsi tidak dienkripsi; kalau sudah pakai password_hash, ganti bagian ini)
        if ($password === $user['password']) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Login berhasil',
                'data' => [
                    'id_operator' => $user['id_operator'],
                    'nama_operator' => $user['nama_operator'],
                    'username' => $user['username']
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Password salah'
            ]);
        }
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Akun tidak ditemukan'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Gagal koneksi database: ' . $e->getMessage()
    ]);
}
