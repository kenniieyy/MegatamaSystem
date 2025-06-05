<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start(); // Mulai output buffering
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

$host = "localhost";
$user = "root";
$password = "";
$database = "proyek_ppsi";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Koneksi database gagal: " . $conn->connect_error]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

function clean_input($data, $conn) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $conn->real_escape_string($data);
}

$response = ["success" => false, "message" => "Operasi tidak dikenal."];
$http_status_code = 405;

try {
    switch ($method) {
        case 'POST':
            $input = json_decode(file_get_contents("php://input"), true);
            if (empty($input['namasiswa']) || empty($input['jenisKelamin']) || empty($input['nis']) || empty($input['kelas']) || empty($input['noHp']) || empty($input['status'])) {
                $http_status_code = 400;
                $response = ["success" => false, "message" => "Semua data wajib diisi."];
                break;
            }
            $nama = clean_input($input['namasiswa'], $conn);
            $jk = clean_input($input['jenisKelamin'], $conn);
            $nis = clean_input($input['nis'], $conn); // NIS akan menjadi primary key
            $kelas = clean_input($input['kelas'], $conn);
            $noHp = clean_input($input['noHp'], $conn);
            $status = clean_input($input['status'], $conn);

            // Periksa apakah NIS sudah ada (karena NIS adalah PRIMARY KEY)
            $check_nis_sql = "SELECT COUNT(*) AS count FROM siswa WHERE nis = '$nis'";
            $nis_result = $conn->query($check_nis_sql);
            $nis_row = $nis_result->fetch_assoc();
            if ($nis_row['count'] > 0) {
                $http_status_code = 409;
                $response = ["success" => false, "message" => "NIS ini sudah terdaftar."];
                break;
            }

            $sql = "INSERT INTO siswa (nis, nama_siswa, jenis_kelamin, kelas, no_hp, status) VALUES ('$nis', '$nama', '$jk', '$kelas', '$noHp', '$status')";
            if ($conn->query($sql)) {
                $http_status_code = 201;
                // Jika NIS adalah primary key, kita bisa mengembalikannya sebagai "id" yang terinsert
                $response = ["success" => true, "message" => "Data siswa berhasil ditambahkan.", "id" => $nis];
            } else {
                $http_status_code = 500;
                $response = ["success" => false, "message" => "Gagal menyimpan data: " . $conn->error];
            }
            break;

        case 'GET':
            if (isset($_GET['id_siswa'])) { // Parameter dari JS akan tetap 'id_siswa'
                $nis_value = clean_input($_GET['id_siswa'], $conn); // Ambil nilai ID dari parameter
                $sql = "SELECT * FROM siswa WHERE nis = '$nis_value'"; // Gunakan 'nis' di klausa WHERE
                $result = $conn->query($sql);
                if ($result && $result->num_rows > 0) {
                    $http_status_code = 200;
                    $response = ["success" => true, "data" => $result->fetch_assoc()];
                } else {
                    $http_status_code = 404;
                    $response = ["success" => false, "message" => "Data siswa tidak ditemukan."];
                }
            } else {
                $search_query = isset($_GET['search']) ? clean_input($_GET['search'], $conn) : '';
                $kelas_filter = isset($_GET['kelas']) ? clean_input($S_GET['kelas'], $conn) : '';
                $sql = "SELECT * FROM siswa WHERE 1=1";
                if (!empty($search_query)) {
                    $sql .= " AND (nama_siswa LIKE '%$search_query%' OR nis LIKE '%$search_query%')";
                }
                if (!empty($kelas_filter)) {
                    $sql .= " AND kelas = '$kelas_filter'";
                }
                $sql .= " ORDER BY nama_siswa ASC";
                $result = $conn->query($sql);
                if ($result) {
                    $data = [];
                    while ($row = $result->fetch_assoc()) {
                        $data[] = $row;
                    }
                    $http_status_code = 200;
                    $response = ["success" => true, "data" => $data];
                } else {
                    $http_status_code = 500;
                    $response = ["success" => false, "message" => "Gagal mengambil data: " . $conn->error];
                }
            }
            break;

        case 'PUT':
            $input = json_decode(file_get_contents("php://input"), true);
            // file_put_contents('php_put_debug.log', "Received PUT input: " . print_r($input, true) . "\n", FILE_APPEND); // Debug
            if (empty($input['id_siswa'])) { // Parameter dari JS akan tetap 'id_siswa'
                $http_status_code = 400;
                $response = ["success" => false, "message" => "NIS siswa tidak ditemukan untuk update."]; // Pesan disesuaikan
                break;
            }
            $nis_to_update = clean_input($input['id_siswa'], $conn); // Ambil nilai ID dari parameter dan sebut sebagai NIS
            $updates = [];
            $fields_map = [
                'namasiswa' => 'nama_siswa', 'jenisKelamin' => 'jenis_kelamin',
                'nis' => 'nis', // 'nis' di sini adalah kolom yang akan diupdate
                'kelas' => 'kelas', 'noHp' => 'no_hp', 'status' => 'status'
            ];
            foreach ($fields_map as $js_field => $db_field) {
                if (isset($input[$js_field])) {
                    // Jika NIS yang diupdate sama dengan NIS lama, tidak perlu dimasukkan ke klausa UPDATE
                    // Namun, karena NIS bisa berubah (walau jarang), kita tetap masukkan ke updates
                    $updates[] = "$db_field = '" . clean_input($input[$js_field], $conn) . "'";
                }
            }
            if (empty($updates)) {
                $http_status_code = 400;
                $response = ["success" => false, "message" => "Tidak ada data yang dikirim untuk diperbarui."];
                break;
            }

            // Periksa duplikasi NIS saat update (jika NIS diubah dan sudah ada di siswa lain)
            if (isset($input['nis'])) { // Jika NIS disertakan dalam data update
                $new_nis_value = clean_input($input['nis'], $conn);
                // Cek apakah NIS baru berbeda dengan NIS lama (yang kita gunakan untuk identifikasi)
                if ($new_nis_value !== $nis_to_update) {
                    $check_nis_sql = "SELECT COUNT(*) AS count FROM siswa WHERE nis = '$new_nis_value'"; // NIS harus unik di seluruh tabel
                    $nis_result = $conn->query($check_nis_sql);
                    $nis_row = $nis_result->fetch_assoc();
                    if ($nis_row['count'] > 0) {
                        $http_status_code = 409;
                        $response = ["success" => false, "message" => "NIS yang diinput sudah terdaftar pada siswa lain."];
                        break;
                    }
                }
            }

            $sql = "UPDATE siswa SET " . implode(", ", $updates) . " WHERE nis = '$nis_to_update'"; // Gunakan 'nis' di klausa WHERE
            // file_put_contents('php_put_debug.log', "Generated SQL: " . $sql . "\n", FILE_APPEND); // Debug
            if ($conn->query($sql)) {
                if ($conn->affected_rows > 0) {
                    $http_status_code = 200;
                    $response = ["success" => true, "message" => "Data siswa berhasil diperbarui."];
                } else {
                    $http_status_code = 200;
                    $response = ["success" => false, "message" => "Data siswa ditemukan, tetapi tidak ada perubahan yang dilakukan (data sama atau NIS tidak valid)." ];
                }
            } else {
                $http_status_code = 500;
                $response = ["success" => false, "message" => "Gagal memperbarui data: " . $conn->error];
            }
            break;

        case 'DELETE':
            $input = json_decode(file_get_contents("php://input"), true);
            // file_put_contents('php_delete_debug.log', "Received DELETE input: " . print_r($input, true) . "\n", FILE_APPEND); // Debug
            if (empty($input['id_siswa'])) { // Parameter dari JS akan tetap 'id_siswa'
                $http_status_code = 400;
                $response = ["success" => false, "message" => "NIS siswa tidak ditemukan untuk dihapus."]; // Pesan disesuaikan
                break;
            }
            $nis_to_delete = clean_input($input['id_siswa'], $conn); // Ambil nilai ID dari parameter dan sebut sebagai NIS
            $sql = "DELETE FROM siswa WHERE nis = '$nis_to_delete'"; // Gunakan 'nis' di klausa WHERE
            // file_put_contents('php_delete_debug.log', "Generated SQL: " . $sql . "\n", FILE_APPEND); // Debug
            if ($conn->query($sql)) {
                if ($conn->affected_rows > 0) {
                    $http_status_code = 200;
                    $response = ["success" => true, "message" => "Data siswa berhasil dihapus."];
                } else {
                    $http_status_code = 404;
                    $response = ["success" => false, "message" => "Data siswa tidak ditemukan atau sudah dihapus."];
                }
            } else {
                $http_status_code = 500;
                $response = ["success" => false, "message" => "Gagal menghapus data: " . $conn->error];
            }
            break;

        default:
            $http_status_code = 405;
            $response = ["success" => false, "message" => "Metode tidak diizinkan"];
            break;
    }
} catch (Throwable $e) {
    $http_status_code = 500;
    $response = ["success" => false, "message" => "Terjadi kesalahan server internal: " . $e->getMessage()];
    error_log("Unhandled API Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile());
}

$conn->close();
ob_end_clean();
http_response_code($http_status_code);
echo json_encode($response);
?>