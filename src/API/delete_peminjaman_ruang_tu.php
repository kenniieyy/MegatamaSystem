<?php
header("Content-Type: application/json");
include '../config/config.php'; // Pastikan path ini benar untuk koneksi database Anda

$response = ["success" => false, "message" => ""];

// Ambil data JSON dari request body
$input = json_decode(file_get_contents("php://input"), true);

$id = $input["id"] ?? null;

if (empty($id)) {
    $response["message"] = "ID peminjaman tidak diberikan.";
    echo json_encode($response);
    exit();
}

try {
    $stmt = $conn->prepare("DELETE FROM peminjaman_ruangan WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $response["success"] = true;
            $response["message"] = "Data peminjaman berhasil dihapus.";
        } else {
            $response["message"] = "ID peminjaman tidak ditemukan.";
        }
    } else {
        $response["message"] = "Gagal menghapus data: " . $stmt->error;
    }
    $stmt->close();

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>