<?php
header("Content-Type: application/json");
include '../config/config.php'; // Pastikan path ini benar untuk koneksi database Anda

$response = ["success" => false, "message" => "", "data" => []];

try {
    // Query untuk mengambil semua data peminjaman ruangan, diurutkan dari yang terbaru
    $stmt = $conn->prepare("SELECT id, nama_lengkap, nis, kelas, no_telepon, jenis_ruangan, tanggal_peminjaman, deskripsi_kegiatan, jam_mulai, jam_selesai, penanggung_jawab, status, created_at FROM peminjaman_ruangan ORDER BY created_at DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    $reservations = [];
    while ($row = $result->fetch_assoc()) {
        // Map kolom database ke nama properti JavaScript yang sesuai
        $reservations[] = [
            "id" => $row["id"],
            "studentName" => $row["nama_lengkap"],
            "studentNIS" => $row["nis"],
            "studentClass" => $row["kelas"],
            "studentPhone" => $row["no_telepon"],
            "roomType" => $row["jenis_ruangan"], // Ini harus sesuai dengan key di `roomData` JS
            "roomName" => $row["jenis_ruangan"], // Akan diganti di JS menggunakan `roomData`
            "date" => $row["tanggal_peminjaman"],
            "startTime" => $row["jam_mulai"],
            "endTime" => $row["jam_selesai"],
            "activityDescription" => $row["deskripsi_kegiatan"],
            "responsibleTeacher" => $row["penanggung_jawab"],
            "status" => $row["status"], // Asumsi database menyimpan status yang sesuai (upcoming, ongoing, completed)
            "createdAt" => $row["created_at"],
        ];
    }

    $response["success"] = true;
    $response["data"] = $reservations;
    $response["message"] = "Data riwayat peminjaman berhasil dimuat.";

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>