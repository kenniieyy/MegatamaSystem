<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$password = "";
$database = "proyek_ppsi";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Koneksi database gagal"]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);

    // Validasi semua input harus ada dan tidak kosong
    if (
        empty($input['namasiswa']) ||
        empty($input['jenisKelamin']) ||
        empty($input['nis']) ||
        empty($input['kelas']) ||
        empty($input['noHp']) ||
        empty($input['status'])
    ) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Semua data wajib diisi"]);
        exit;
    }

    // Escape string inputan
    $nama = $conn->real_escape_string($input['namasiswa']);
    $jk = $conn->real_escape_string($input['jenisKelamin']);
    $nis = $conn->real_escape_string($input['nis']);
    $kelas = $conn->real_escape_string($input['kelas']);
    $noHp = $conn->real_escape_string($input['noHp']);
    $status = $conn->real_escape_string($input['status']);

    $sql = "INSERT INTO siswa (nama_siswa, jenis_kelamin, nis, kelas, no_hp, status) 
            VALUES ('$nama', '$jk', '$nis', '$kelas', '$noHp', '$status')";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "id" => $conn->insert_id]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Gagal simpan: " . $conn->error]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Metode tidak diizinkan"]);
}

$conn->close();
?>
