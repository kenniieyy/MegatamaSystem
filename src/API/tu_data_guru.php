<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *"); // Untuk akses cross-domain (jika perlu)
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "peoyek_ppsi"; // Ganti sesuai DB kamu

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Koneksi database gagal"]);
    exit;
}

// Fungsi: Sanitasi
function clean($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Ambil data guru (semua atau pakai search)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $result = $conn->query("SELECT * FROM guru WHERE id = $id");
        echo json_encode($result->fetch_assoc());
    } else {
        $search = isset($_GET['search']) ? "%" . $conn->real_escape_string($_GET['search']) . "%" : "%";
        $sql = "SELECT * FROM guru WHERE nama_lengkap LIKE ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $search);
        $stmt->execute();
        $res = $stmt->get_result();
        $data = [];
        while ($row = $res->fetch_assoc()) {
            $row['foto_url'] = $row['foto'] ? 'uploads/' . $row['foto'] : null;
            $data[] = $row;
        }
        echo json_encode($data);
    }
    exit;
}

// Tambah / update data guru
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id              = isset($_POST['id']) ? intval($_POST['id']) : null;
    $nama_lengkap    = clean($_POST['teacherName']);
    $jenis_kelamin   = clean($_POST['teacherGender']);
    $nip             = clean($_POST['teacherNIP']);
    $mapel           = clean($_POST['teacherSubject']);
    $wali_kelas      = clean($_POST['teacherWaliKelas']);
    $status          = clean($_POST['teacherStatus']);
    $username        = clean($_POST['teacherUsername']);
    $password        = clean($_POST['teacherPassword']);
    
    // Upload foto jika ada
    $foto = null;
    if (!empty($_FILES['teacherPhoto']['name'])) {
        $targetDir = "../uploads/";
        if (!file_exists($targetDir)) mkdir($targetDir, 0777, true);
        $filename = uniqid() . "_" . basename($_FILES["teacherPhoto"]["name"]);
        $targetFile = $targetDir . $filename;
        move_uploaded_file($_FILES["teacherPhoto"]["tmp_name"], $targetFile);
        $foto = $filename;
    }

    if ($id) {
        // UPDATE
        $sql = "UPDATE guru SET nama_lengkap=?, jenis_kelamin=?, nip=?, mata_pelajaran=?, wali_kelas=?, status_guru=?, username=?, password=?" .
               ($foto ? ", foto=?" : "") . " WHERE id=?";
        if ($foto) {
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssssssi", $nama_lengkap, $jenis_kelamin, $nip, $mapel, $wali_kelas, $status, $username, $password, $foto, $id);
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssssssi", $nama_lengkap, $jenis_kelamin, $nip, $mapel, $wali_kelas, $status, $username, $password, $id);
        }
    } else {
        // INSERT
        $sql = "INSERT INTO guru (nama_lengkap, jenis_kelamin, nip, mata_pelajaran, wali_kelas, status_guru, username, password, foto) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssssss", $nama_lengkap, $jenis_kelamin, $nip, $mapel, $wali_kelas, $status, $username, $password, $foto);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Gagal menyimpan data"]);
    }
    exit;
}

// Hapus guru
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $del_vars);
    $id = intval($del_vars['id']);
    $conn->query("DELETE FROM guru WHERE id=$id");
    echo json_encode(["success" => true]);
    exit;
}

?>
