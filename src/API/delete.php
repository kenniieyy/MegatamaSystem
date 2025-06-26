<?php
// delete_guru.php
include '../config/config.php'; // Pastikan path ini benar

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Koneksi database tidak tersedia: " . $conn->connect_error]);
    exit();
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input."]);
    exit();
}

$id_guru = $data['id'] ?? null; // Parameter 'id' dari JS.

// Log ID yang diterima untuk debugging
error_log("Attempting to delete guru with ID: " . var_export($id_guru, true));


if ($id_guru === null || !is_numeric($id_guru)) { // Tambah pengecekan is_numeric
    echo json_encode(["success" => false, "message" => "ID Guru tidak valid atau tidak diterima."]);
    exit();
}

// Mulai transaksi (opsional, tapi disarankan)
$conn->begin_transaction();

try {
    // === Hapus file foto dari server sebelum menghapus record dari DB ===
    $sql_get_photo = "SELECT foto_url FROM guru WHERE ID = ?";
    $stmt_get_photo = $conn->prepare($sql_get_photo);
    if (!$stmt_get_photo) {
        throw new Exception("Prepare statement for getting photo failed: " . $conn->error);
    }
    $stmt_get_photo->bind_param("i", $id_guru);
    $stmt_get_photo->execute();
    $result_get_photo = $stmt_get_photo->get_result();

    if ($result_get_photo && $result_get_photo->num_rows > 0) {
        $row_photo = $result_get_photo->fetch_assoc();
        $foto_url_to_delete = $row_photo['foto_url'];
        
        if ($foto_url_to_delete && $foto_url_to_delete !== 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face') {
            // Path relatif dari lokasi delete_guru.php ke root proyek
            $file_path = '../' . $foto_url_to_delete; 
            if (file_exists($file_path) && is_file($file_path)) {
                unlink($file_path);
                error_log("Deleted old photo file: " . $file_path);
            }
        }
    }
    $stmt_get_photo->close();

    // === Hapus data dari database ===
    $stmt = $conn->prepare("DELETE FROM guru WHERE ID = ?");
    if (!$stmt) {
        throw new Exception("Prepare statement for deleting guru failed: " . $conn->error);
    }
    $stmt->bind_param("i", $id_guru); // 'i' untuk integer ID

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $conn->commit(); // Commit transaksi jika berhasil
            echo json_encode(["success" => true, "message" => "Data guru berhasil dihapus."]);
        } else {
            // Ini akan terpicu jika ID tidak ditemukan di database
            $conn->rollback(); // Rollback jika tidak ada baris yang terpengaruh
            echo json_encode(["success" => false, "message" => "Guru dengan ID tersebut tidak ditemukan di database."]); // Pesan lebih spesifik
        }
    } else {
        throw new Exception("Execute delete statement failed: " . $stmt->error);
    }

    $stmt->close();

} catch (Exception $e) {
    $conn->rollback(); // Rollback transaksi jika terjadi error
    error_log("Error in delete_guru.php: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "Terjadi kesalahan server saat menghapus: " . $e->getMessage()]);
} finally {
    if (isset($conn) && $conn->ping()) { // Check if connection is still alive before closing
        $conn->close();
    }
}
?>