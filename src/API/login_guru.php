<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 0);

include "../config/config.php";

$id = $_POST['id'];
$password = $_POST['password'];

// Ambil data guru, termasuk kolom wali_kelas
$stmt = $conn->prepare("SELECT id_guru, ID, nama_guru, password, wali_kelas FROM guru WHERE ID = ?");
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $guru = $result->fetch_assoc();

    if ($password === $guru['password']) {
        $kelasWali = $guru['wali_kelas'];
        $kelasAngka = null;

        // Ekstrak angka dari string seperti "Wali Kelas 9"
        if (preg_match('/(\d+)/', $kelasWali, $matches)) {
            $kelasAngka = $matches[1]; // Ambil angka dari hasil pencocokan
        }


        // Simpan ke session
        $_SESSION['guru_id'] = $guru['id_guru'];
        $_SESSION['nama_guru'] = $guru['nama_guru'];
        $_SESSION['ID'] = $guru['ID'];
        $_SESSION['kelas_wali'] = $kelasAngka; // Hanya angka, misal '8'

        echo json_encode([
            'success' => true,
            'name' => $guru['nama_guru'],
            'kelas_wali' => $kelasAngka
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'ID/Nama atau password Pegawai tidak valid']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'ID/Nama tidak ditemukan']);
}

$conn->close();
