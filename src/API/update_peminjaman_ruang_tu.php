<?php
header("Content-Type: application/json");
include '../config/config.php'; // Pastikan path ini benar untuk koneksi database Anda

$response = ["success" => false, "message" => ""];

// Ambil data JSON dari request body
$input = json_decode(file_get_contents("php://input"), true);

$id = $input["id"] ?? null;
$jenis_ruangan = $input["jenis_ruangan"] ?? null;
$tanggal_peminjaman = $input["tanggal_peminjaman"] ?? null;
$deskripsi_kegiatan = $input["deskripsi_kegiatan"] ?? null;
$jam_mulai = $input["jam_mulai"] ?? null;
$jam_selesai = $input["jam_selesai"] ?? null;
$penanggung_jawab = $input["penanggung_jawab"] ?? null;
$status = $input["status"] ?? null;

if (empty($jenis_ruangan) || empty($tanggal_peminjaman) || empty($deskripsi_kegiatan) || empty($jam_mulai) || empty($jam_selesai) || empty($penanggung_jawab)) {
    $response["message"] = "Data tidak lengkap untuk update.";
    echo json_encode($response);
    exit();
}

try {
    $stmt = $conn->prepare("UPDATE peminjaman_ruangan SET jenis_ruangan = ?, tanggal_peminjaman = ?, deskripsi_kegiatan = ?, jam_mulai = ?, jam_selesai = ?, penanggung_jawab = ?, status = ? WHERE id = ?");
    $stmt->bind_param("sssssssi", $jenis_ruangan, $tanggal_peminjaman, $deskripsi_kegiatan, $jam_mulai, $jam_selesai, $penanggung_jawab, $status, $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            $response["success"] = true;
            $response["message"] = "Data peminjaman berhasil diperbarui.";
        } else {
            $response["message"] = "Tidak ada perubahan data atau ID tidak ditemukan.";
        }
    } else {
        $response["message"] = "Gagal memperbarui data: " . $stmt->error;
    }
    $stmt->close();

} catch (Exception $e) {
    $response["message"] = "Error: " . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>