<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Koneksi Database
$host = "localhost";
$user = "root";
$pass = "";
$db   = "proyek_ppsi";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Koneksi database gagal: " . $conn->connect_error]);
    exit;
}

// Fungsi bersih-bersih input
function clean($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// --- GET Data Guru ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $conn->query("SELECT * FROM guru WHERE id_guru = $id");
        if ($result) {
            echo json_encode($result->fetch_assoc());
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Data tidak ditemukan"]);
        }
    } else {
        $search = isset($_GET['search']) ? "%" . $conn->real_escape_string($_GET['search']) . "%" : "%";
        $sql = "SELECT * FROM guru WHERE nama_guru LIKE ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Prepare gagal: " . $conn->error]);
            exit;
        }
        $stmt->bind_param("s", $search);
        $stmt->execute();
        $res = $stmt->get_result();
        $data = [];
        while ($row = $res->fetch_assoc()) {
            // Kalau nanti mau tambah foto, bisa tambahkan di sini
            $data[] = $row;
        }
        echo json_encode($data);
    }
    exit;
}

// --- POST Tambah Data Guru ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil data dan bersihkan
    $nama_guru     = isset($_POST['teacherName']) ? clean($_POST['teacherName']) : '';
    $jenis_kelamin = isset($_POST['teacherGender']) ? clean($_POST['teacherGender']) : '';
    $ID            = isset($_POST['teacherID']) ? clean($_POST['teacherID']) : ''; 
    $mapel         = isset($_POST['teacherSubject']) ? clean($_POST['teacherSubject']) : '';
    $wali_kelas    = isset($_POST['teacherWaliKelas']) ? clean($_POST['teacherWaliKelas']) : '';
    $status        = isset($_POST['teacherStatus']) ? clean($_POST['teacherStatus']) : ''; 
    $username      = isset($_POST['teacherUsername']) ? clean($_POST['teacherUsername']) : '';
    $password      = isset($_POST['teacherPassword']) ? password_hash(clean($_POST['teacherPassword']), PASSWORD_DEFAULT) : '';

    // Validasi sederhana, bisa dikembangkan
    if (!$nama_guru || !$jenis_kelamin || !$ID || !$username || !$password) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Field wajib belum diisi"]);
        exit;
    }

    $sql = "INSERT INTO guru (nama_guru, jenis_kelamin, ID, mata_pelajaran, wali_kelas, status, username, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare gagal: " . $conn->error]);
        exit;
    }

    $stmt->bind_param("ssssssss", $nama_guru, $jenis_kelamin, $ID, $mapel, $wali_kelas, $status, $username, $password);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Gagal menyimpan data: " . $stmt->error]);
    }
    exit;
}

// --- DELETE Data Guru ---
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
    $id = intval($del_vars['id']);
    if ($conn->query("DELETE FROM guru WHERE id_guru = $id")) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Gagal menghapus data"]);
    }
    exit;
}

// Default response jika method tidak dikenal
http_response_code(405);
echo json_encode(["success" => false, "error" => "Metode tidak diizinkan"]);

?>
