<?php
// get_students.php
include "../config/config.php"; // Sesuaikan path jika file config.php berada di direktori yang berbeda

header('Content-Type: application/json'); // Memberi tahu browser bahwa respons adalah JSON

// Pastikan request method adalah GET dan parameter 'class' ada
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['class'])) {
    $selectedClass = mysqli_real_escape_string($conn, $_GET['class']); // Amankan input

    // Query untuk mengambil siswa berdasarkan kelas
    // Pastikan nama kolom di tabel 'siswa' sesuai dengan kebutuhan (misal: id_siswa, nama_siswa, jenis_kelamin, nis, kelas, no_hp)
    // Dalam get_students.php, di bagian query
    $query = "SELECT 
            id_siswa AS id, 
            nama_siswa AS name, 
            jenis_kelamin AS gender, 
            nis, 
            kelas AS class, 
            no_hp AS phone,
            status_siswa AS status  -- TAMBAHKAN INI
          FROM siswa 
          WHERE kelas = '$selectedClass'
          ORDER BY nama_siswa ASC";

    $result = mysqli_query($conn, $query);

    $students = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            // Ubah 'jenis_kelamin' menjadi format 'Laki-laki' atau 'Perempuan' jika disimpan sebagai 'L'/'P'
            // Asumsi di database 'L' atau 'P'
            if (isset($row['gender'])) {
                $row['gender'] = ($row['gender'] === 'L') ? 'Laki-laki' : 'Perempuan';
            }
            // Tambahkan status default untuk presensi di sisi frontend
            // Jika Anda memiliki kolom status kenaikan kelas di database, Anda bisa mengambilnya di sini
            $row['id'] = (int)$row['id']; // Pastikan id dikirim sebagai integer
            $row['status'] = 'pending';   // Inisialisasi status di frontend
            $students[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $students]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal mengambil data siswa: ' . mysqli_error($conn)]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Permintaan tidak valid.']);
}

mysqli_close($conn); // Tutup koneksi database
