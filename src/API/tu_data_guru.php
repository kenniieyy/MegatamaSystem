<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Inisialisasi koneksi database
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
    return htmlspecialchars(strip_tags(trim($data)));
}

// Direktori upload foto guru
// __DIR__ memastikan path absolut dari lokasi script ini
$uploadDir = __DIR__ . '/uploads/guru_photos/'; 
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0777, true)) { // Coba buat direktori jika belum ada
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Gagal membuat direktori upload foto. Periksa izin folder di server: " . $uploadDir]);
        exit;
    }
}
$allowedTypes = ['jpg', 'jpeg', 'png'];
$maxFileSize = 5 * 1024 * 1024; // 5 MB

// --- Penanganan Permintaan GET ---
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $sql = "SELECT id_guru, nama_guru, jenis_kelamin, ID, mata_pelajaran, wali_kelas, status, username, foto_url FROM guru WHERE id_guru = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Prepare GET by ID gagal: " . $conn->error]);
            exit;
        }
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            $guruData = $result->fetch_assoc();
            $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            // ***** PENTING: SESUAIKAN public_path INI *****
            // Ini adalah path dari root web server Anda ke folder API
            $public_path = '/MegatamaSystem/src/API/'; 
            
            if ($guruData['foto_url'] && !filter_var($guruData['foto_url'], FILTER_VALIDATE_URL)) {
                $guruData['foto_url'] = $base_url . $public_path . $guruData['foto_url'];
            }
            echo json_encode($guruData);
        } else {
            http_response_code(404);
            echo json_encode(["success" => false, "error" => "Data guru tidak ditemukan."]);
        }
        $stmt->close();
    } else {
        $search = isset($_GET['search']) ? "%" . $conn->real_escape_string($_GET['search']) . "%" : "%";
        $sql = "SELECT id_guru, nama_guru, jenis_kelamin, ID, mata_pelajaran, wali_kelas, status, username, foto_url FROM guru WHERE nama_guru LIKE ? OR ID LIKE ? ORDER BY nama_guru ASC";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Prepare GET all/search gagal: " . $conn->error]);
            exit;
        }
        $stmt->bind_param("ss", $search, $search);
        $stmt->execute();
        $res = $stmt->get_result();
        $data = [];
        while ($row = $res->fetch_assoc()) {
            $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://$_SERVER[HTTP_HOST]";
            // ***** PENTING: SESUAIKAN public_path INI *****
            $public_path = '/MegatamaSystem/src/API/'; 

            if ($row['foto_url'] && !filter_var($row['foto_url'], FILTER_VALIDATE_URL)) {
                 $row['foto_url'] = $base_url . $public_path . $row['foto_url'];
            }
            $data[] = $row;
        }
        echo json_encode($data);
        $stmt->close();
    }
    exit; // Pastikan script berhenti setelah GET request
}

// --- Penanganan Permintaan POST (Termasuk Override untuk PUT dan DELETE) ---
// Semua permintaan dari JavaScript yang menggunakan FormData akan masuk ke sini (POST)
// Kemudian, kita periksa '_method' parameter untuk menentukan operasi sebenarnya.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Log semua data POST yang diterima untuk debugging
    error_log("POST Request received. POST data: " . print_r($_POST, true));
    error_log("FILES data: " . print_r($_FILES, true));

    $method_override = $_POST['_method'] ?? null;

    if ($method_override === 'DELETE') {
        error_log("Detected method override: DELETE");
        handleDeleteRequest($conn, $uploadDir);
    } elseif ($method_override === 'PUT') {
        error_log("Detected method override: PUT");
        handlePutRequest($conn, $uploadDir, $allowedTypes, $maxFileSize);
    } else {
        error_log("Detected method: INSERT (default POST)");
        handlePostRequest($conn, $uploadDir, $allowedTypes, $maxFileSize);
    }
    exit; // Sangat penting: Hentikan eksekusi script setelah selesai memproses POST/PUT/DELETE
}

// --- Fungsi Terpisah untuk Handle POST (INSERT) ---
function handlePostRequest($conn, $uploadDir, $allowedTypes, $maxFileSize) {
    // Variabel global harus dideklarasikan di sini agar fungsi bisa mengaksesnya
    global $conn, $uploadDir, $allowedTypes, $maxFileSize; 

    $nama_guru     = isset($_POST['nama_guru']) ? clean($_POST['nama_guru']) : '';
    $jenis_kelamin = isset($_POST['jenis_kelamin']) ? clean($_POST['jenis_kelamin']) : '';
    $ID            = isset($_POST['ID']) ? clean($_POST['ID']) : ''; 
    $mapel         = isset($_POST['mata_pelajaran']) ? clean($_POST['mata_pelajaran']) : '';
    $wali_kelas    = isset($_POST['wali_kelas']) ? clean($_POST['wali_kelas']) : '';
    $status        = isset($_POST['status']) ? clean($_POST['status']) : '';
    $username      = isset($_POST['username']) ? clean($_POST['username']) : '';
    $password      = isset($_POST['password']) ? clean($_POST['password']) : '';

    if (!$nama_guru || !$jenis_kelamin || !$ID || !$username || !$status) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Field wajib (Nama, Jenis Kelamin, NIP/UID, Username, Status) harus diisi."]);
        return;
    }

    $checkStmt = $conn->prepare("SELECT id_guru FROM guru WHERE username = ? OR ID = ? LIMIT 1");
    if (!$checkStmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare cek duplikasi gagal: " . $conn->error]);
        return;
    }
    $checkStmt->bind_param("ss", $username, $ID);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    if ($checkResult->num_rows > 0) {
        http_response_code(409);
        echo json_encode(["success" => false, "error" => "Username atau NIP/UID sudah terdaftar."]);
        $checkStmt->close();
        return;
    }
    $checkStmt->close();

    if (empty($password)) {
         http_response_code(400);
         echo json_encode(["success" => false, "error" => "Password harus diisi saat menambahkan guru baru."]);
         return;
    }
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $foto_url = null;
    if (isset($_FILES['foto_wajah']) && $_FILES['foto_wajah']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['foto_wajah'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedTypes)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Format file tidak diizinkan. Hanya JPG, JPEG, PNG."]);
            return;
        }
        if ($fileSize > $maxFileSize) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Ukuran file terlalu besar. Maksimal 5MB."]);
            return;
        }

        $newFileName = uniqid('guru_') . '.' . $fileExt;
        $destination = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpName, $destination)) {
            $foto_url = 'uploads/guru_photos/' . $newFileName; // Simpan path relatif dari folder API
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Gagal mengunggah foto."]);
            return;
        }
    }

    $sql = "INSERT INTO guru (nama_guru, jenis_kelamin, ID, mata_pelajaran, wali_kelas, status, username, password, foto_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare insert gagal: " . $conn->error]);
        return;
    }
    $stmt->bind_param("sssssssss", $nama_guru, $jenis_kelamin, $ID, $mapel, $wali_kelas, $status, $username, $hashed_password, $foto_url);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Data guru berhasil ditambahkan."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Gagal menyimpan data: " . $stmt->error]);
    }
    $stmt->close();
}

// --- Fungsi Terpisah untuk Handle PUT (UPDATE) ---
function handlePutRequest($conn, $uploadDir, $allowedTypes, $maxFileSize) {
    global $conn, $uploadDir, $allowedTypes, $maxFileSize; 

    $id_guru       = isset($_POST['id_guru']) ? intval($_POST['id_guru']) : 0;
    $nama_guru     = isset($_POST['nama_guru']) ? clean($_POST['nama_guru']) : '';
    $jenis_kelamin = isset($_POST['jenis_kelamin']) ? clean($_POST['jenis_kelamin']) : '';
    $ID            = isset($_POST['ID']) ? clean($_POST['ID']) : '';
    $mapel         = isset($_POST['mata_pelajaran']) ? clean($_POST['mata_pelajaran']) : '';
    $wali_kelas    = isset($_POST['wali_kelas']) ? clean($_POST['wali_kelas']) : '';
    $status        = isset($_POST['status']) ? clean($_POST['status']) : '';
    $username      = isset($_POST['username']) ? clean($_POST['username']) : '';
    $password      = isset($_POST['password']) ? clean($_POST['password']) : '';

    if ($id_guru <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID guru tidak valid untuk update."]);
        return;
    }

    if (!$nama_guru || !$jenis_kelamin || !$ID || !$username || !$status) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Field wajib (Nama, Jenis Kelamin, NIP/UID, Username, Status) harus diisi."]);
        return;
    }

    $foto_url = null;
    if (isset($_FILES['foto_wajah']) && $_FILES['foto_wajah']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['foto_wajah'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedTypes)) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Format file tidak diizinkan. Hanya JPG, JPEG, PNG."]);
            return;
        }
        if ($fileSize > $maxFileSize) {
            http_response_code(400);
            echo json_encode(["success" => false, "error" => "Ukuran file terlalu besar. Maksimal 5MB."]);
            return;
        }

        $newFileName = uniqid('guru_') . '.' . $fileExt;
        $destination = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpName, $destination)) {
            $foto_url = 'uploads/guru_photos/' . $newFileName;
            
            $stmt_old_photo = $conn->prepare("SELECT foto_url FROM guru WHERE id_guru = ?");
            if (!$stmt_old_photo) {
                error_log("Prepare select old photo gagal: " . $conn->error);
            } else {
                $stmt_old_photo->bind_param("i", $id_guru);
                $stmt_old_photo->execute();
                $result_old_photo = $stmt_old_photo->get_result();
                if ($row = $result_old_photo->fetch_assoc()) {
                    $old_photo_path = $uploadDir . basename($row['foto_url']); 
                    if ($row['foto_url'] && file_exists($old_photo_path)) {
                        unlink($old_photo_path);
                        error_log("Foto lama dihapus: " . $old_photo_path);
                    }
                }
                $stmt_old_photo->close();
            }
        } else {
            http_response_code(500);
            echo json_encode(["success" => false, "error" => "Gagal mengunggah foto baru."]);
            return;
        }
    }

    $sql = "UPDATE guru SET nama_guru=?, jenis_kelamin=?, ID=?, mata_pelajaran=?, wali_kelas=?, status=?, username=?";
    $params = [$nama_guru, $jenis_kelamin, $ID, $mapel, $wali_kelas, $status, $username];
    $types = "sssssss";

    if (!empty($password)) {
        $sql .= ", password=?";
        $params[] = password_hash($password, PASSWORD_DEFAULT);
        $types .= "s";
    }
    if ($foto_url) {
        $sql .= ", foto_url=?";
        $params[] = $foto_url;
        $types .= "s";
    }

    $sql .= " WHERE id_guru = ?";
    $params[] = $id_guru;
    $types .= "i";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare update gagal: " . $conn->error]);
        return;
    }
    $stmt->bind_param($types, ...$params);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Data guru berhasil diperbarui."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Gagal memperbarui data: " . $stmt->error]);
    }
    $stmt->close();
}


// --- Fungsi Terpisah untuk Handle DELETE ---
function handleDeleteRequest($conn, $uploadDir) {
    global $conn, $uploadDir; 
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    error_log("DELETE (via POST) id received: " . $id);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID guru tidak valid untuk dihapus."]);
        return;
    }

    $sql_select_photo = "SELECT foto_url FROM guru WHERE id_guru = ?";
    $stmt_select_photo = $conn->prepare($sql_select_photo);
    if (!$stmt_select_photo) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare select photo for delete gagal: " . $conn->error]);
        return;
    }
    $stmt_select_photo->bind_param("i", $id);
    $stmt_select_photo->execute();
    $result_photo = $stmt_select_photo->get_result();
    $row_photo = $result_photo->fetch_assoc();
    $stmt_select_photo->close();

    $foto_path_to_delete = $row_photo['foto_url'] ?? null;
    
    $sql_delete = "DELETE FROM guru WHERE id_guru = ?";
    $stmt_delete = $conn->prepare($sql_delete);
    if (!$stmt_delete) {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Prepare delete gagal: " . $conn->error]);
        return;
    }
    $stmt_delete->bind_param("i", $id);

    if ($stmt_delete->execute()) {
        if ($foto_path_to_delete) {
            $full_local_path = $uploadDir . basename($foto_path_to_delete); 
            if (file_exists($full_local_path)) {
                if (unlink($full_local_path)) {
                    error_log("Berhasil menghapus file: " . $full_local_path);
                } else {
                    error_log("Gagal menghapus file: " . $full_local_path . ". Periksa izin file.");
                }
            } else {
                error_log("File tidak ditemukan di path lokal: " . $full_local_path);
            }
        }
        echo json_encode(["success" => true, "message" => "Data guru berhasil dihapus."]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "error" => "Gagal menghapus data: " . $stmt_delete->error]);
    }
    $stmt_delete->close();
}

// Respon default jika metode request tidak diizinkan oleh skrip utama
// Ini akan tercapai hanya jika REQUEST_METHOD bukan GET atau POST (misalnya TRACE, HEAD, dll.)
http_response_code(405);
echo json_encode(["success" => false, "error" => "Metode request tidak diizinkan."]);

$conn->close();
?>