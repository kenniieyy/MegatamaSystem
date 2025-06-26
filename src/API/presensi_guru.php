<?php
session_start();
include "../config/config.php";

header('Content-Type: application/json');

// Validasi data
$identity = $_POST['identity'] ?? '';
$password = $_POST['password'] ?? '';
$imageData = $_POST['image'] ?? null;

if (!$identity || !$password || !$imageData) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Data tidak lengkap."
    ]);
    exit;
}

$nip = explode(' - ', $identity)[0];
$nip = trim($nip);

// Cek guru
$sql = "SELECT * FROM guru WHERE ID = '$nip'";
$result = $conn->query($sql);

if (!$result || $result->num_rows !== 1) {
    http_response_code(404);
    echo json_encode([
        "status" => "error",
        "message" => "Guru tidak ditemukan."
    ]);
    exit;
}

$data = $result->fetch_assoc();

// Verifikasi password
if ($password !== $data['password']) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Pasword tidak sesuai."
    ]);
    exit;
}

// Proses presensi
$guru_id = $data['id_guru'];
$tanggal = date('Y-m-d');
$jam_sekarang = date('H:i:s');

// Simpan foto
$uploadDir = __DIR__ . "/../img/upload/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filename = "presensi__" . time() . ".png";
$base64 = explode(',', $imageData)[1];
$decoded = base64_decode($base64);
file_put_contents($uploadDir . $filename, $decoded);

// Cek presensi hari ini
$cek = $conn->query("SELECT * FROM absen_guru WHERE id_guru = '$guru_id' AND tanggal = '$tanggal'");
$data_absen = mysqli_fetch_assoc($cek);

if ($cek->num_rows > 0) {
    // Sudah absen datang → update jam pulang
    $update = $conn->query("UPDATE absen_guru SET jam_pulang = '$jam_sekarang', foto_pulang = '$filename' WHERE id_guru = '$guru_id' AND tanggal = '$tanggal'");
    if ($update) {
        $presensi = "pulang";
        $message = "Presensi pulang berhasil.";
        $judul = 'Presensi Pulang Berhasil';
        $tipe = 'pulang';
        $waktu = date('Y-m-d H:i:s');

        $conn->query("INSERT INTO aktivitas (id_guru, judul, tipe, waktu) VALUES ('$guru_id','$judul', '$tipe', '$waktu')");
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menyimpan presensi pulang."
        ]);
        exit;
    }
} else {
    // Absen pertama (datang)
    $insert = $conn->query("INSERT INTO absen_guru (id_guru, tanggal, jam_datang, foto_datang) VALUES ('$guru_id', '$tanggal', '$jam_sekarang', '$filename')");
    if ($insert) {
        $_SESSION['nama_guru'] = $data['nama_guru'];
        $_SESSION['id_guru'] = $data['id_guru'];
        $presensi = "datang";
        $message = "Presensi datang berhasil.";

        $judul = 'Presensi Datang Berhasil';
        $tipe = 'datang';
        $waktu = date('Y-m-d H:i:s');

        $conn->query("INSERT INTO aktivitas (id_guru, judul, tipe, waktu) VALUES ('$guru_id','$judul', '$tipe', '$waktu')");
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menyimpan presensi datang."
        ]);
        exit;
    }
}

// Response akhir
echo json_encode([
    "status" => "success",
    "message" => $message,
    "presensi" => $presensi,
    "name" => $data['nama_guru'], // Tambahkan ini
    "nip" => $data['ID']          // Tambahkan ini
]);

$conn->close();
