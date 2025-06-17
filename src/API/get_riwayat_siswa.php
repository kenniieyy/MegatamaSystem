<?php
include '../config/config.php'; // Pastikan path ke file config.php benar
session_start();
header('Content-Type: application/json'); // Memberi tahu browser bahwa respons adalah JSON

// Cek apakah user sudah login
if (!isset($_SESSION['guru_id'])|| !isset($_SESSION['kelas_wali'])) {
    header("Location: ../../public/login.html");
    exit();
}

$id_guru = $_SESSION['guru_id'];

$kelas_wali = $_SESSION['kelas_wali'];

$response = []; // Array untuk menyimpan semua data riwayat presensi

$query_absen = "
    SELECT id_absen, id_guru, kelas, tanggal, jam_mulai, jam_selesai, dibuat_pada 
    FROM absen 
    WHERE id_guru = '$id_guru'
    ORDER BY tanggal DESC, dibuat_pada DESC
";

$result_absen = mysqli_query($conn, $query_absen);

if ($result_absen) {
    while ($row_absen = mysqli_fetch_assoc($result_absen)) {
        $id_presensi = $row_absen['id_absen'];

        // Untuk setiap presensi, ambil detail siswa yang absen
        $query_siswa_absen = "SELECT nis, status FROM absen_siswa WHERE id_absen = '$id_presensi'";
        $result_siswa_absen = mysqli_query($conn, $query_siswa_absen);

        $students_status = [];
        if ($result_siswa_absen) {
            while ($row_siswa = mysqli_fetch_assoc($result_siswa_absen)) {
                // Untuk menampilkan nama siswa, kita perlu query tabel 'siswa'
                // Diasumsikan Anda memiliki tabel 'siswa' dengan kolom 'id' dan 'name' serta 'gender'
                $id_siswa = $row_siswa['nis'];
                $query_get_student_info = "SELECT nama_siswa, jenis_kelamin FROM siswa WHERE nis = '$id_siswa'";
                $result_student_info = mysqli_query($conn, $query_get_student_info);
                $student_info = mysqli_fetch_assoc($result_student_info);

                $students_status[] = [
                    'id_siswa' => $id_siswa,
                    'nama_siswa' => $student_info ? $student_info['nama_siswa'] : 'Nama tidak ditemukan', // Fallback jika siswa tidak ditemukan
                    'jenis_kelamin' => $student_info ? $student_info['jenis_kelamin'] : '',
                    'status' => $row_siswa['status']
                ];
            }
        } else {
            error_log("Error fetching absen_siswa: " . mysqli_error($conn));
        }

        $response[] = [
            'id' => $row_absen['id_absen'],
            'class' => $row_absen['kelas'],
            'date' => $row_absen['tanggal'],
            'startTime' => $row_absen['jam_mulai'],
            'endTime' => $row_absen['jam_selesai'],
            'createdAt' => $row_absen['dibuat_pada'], // Tambahkan ini agar bisa dicek untuk edit
            'students' => $students_status
        ];
    }
} else {
    error_log("Error fetching absen: " . mysqli_error($conn));
    // Jika ada error pada query absen, kembalikan array kosong atau pesan error yang sesuai
    echo json_encode(["error" => "Gagal mengambil data absen: " . mysqli_error($conn)]);
    exit(); // Hentikan eksekusi script
}

echo json_encode($response);

mysqli_close($conn);
