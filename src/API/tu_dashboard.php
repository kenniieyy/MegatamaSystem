<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

// Koneksi database
$host = "localhost";
$user = "root";
$pass = "";
$db = "proyek_ppsi";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Koneksi gagal: " . $conn->connect_error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

// === Handle GET list ===
if ($method === 'GET' && isset($_GET["action"]) && $_GET["action"] === "list") {
    $result = $conn->query("SELECT * FROM peminjaman_ruangan ORDER BY id DESC");
    if (!$result) {
        echo json_encode(["success" => false, "message" => "Query gagal: " . $conn->error]);
        $conn->close();
        exit;
    }

    $rows = [];
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }

    echo json_encode(["success" => true, "data" => $rows]);
    $conn->close();
    exit;
}

// === Handle POST create new reservation ===
if ($method === 'POST') {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);

    if (is_null($data)) {
        echo json_encode(["success" => false, "message" => "Gagal membaca data JSON. Data mentah: " . $raw]);
        exit;
    }

    // Sanitasi dan trim input
    $nama = trim($data["nama_lengkap"] ?? "");
    $nis = trim($data["nis"] ?? "");
    $kelas = trim($data["kelas"] ?? "");
    $telepon = trim($data["no_telepon"] ?? "");
    $ruangan = trim($data["jenis_ruangan"] ?? "");
    $tanggal = trim($data["tanggal_peminjaman"] ?? "");
    $deskripsi = trim($data["deskripsi_kegiatan"] ?? "");
    $jam_mulai = trim($data["jam_mulai"] ?? "");
    $jam_selesai = trim($data["jam_selesai"] ?? "");
    $penanggung = trim($data["penanggung_jawab"] ?? "");

    // Cek jika ada data kosong
    if ($nama === "" || $nis === "" || $kelas === "" || $ruangan === "" || $tanggal === "" || $deskripsi === "" || $jam_mulai === "" || $jam_selesai === "" || $penanggung === "") {
        echo json_encode(["success" => false, "message" => "Semua field wajib diisi."]);
        exit;
    }

    // Prepared statement untuk insert
    $stmt = $conn->prepare("INSERT INTO peminjaman_ruangan (nama_lengkap, nis, kelas, no_telepon, jenis_ruangan, tanggal_peminjaman, deskripsi_kegiatan, jam_mulai, jam_selesai, penanggung_jawab) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Prepare statement gagal: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssssssss", $nama, $nis, $kelas, $telepon, $ruangan, $tanggal, $deskripsi, $jam_mulai, $jam_selesai, $penanggung);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Peminjaman berhasil disimpan."]);
    } else {
        echo json_encode(["success" => false, "message" => "Query gagal: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// Jika bukan GET list atau POST maka beri respon error
echo json_encode(["success" => false, "message" => "Metode request tidak diizinkan atau action tidak dikenali."]);
$conn->close();
exit;
