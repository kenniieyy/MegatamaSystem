<?php
include "../config/config.php"; // Asumsikan file ini berisi koneksi database

session_start();

// Cek apakah user sudah login dan memiliki izin (opsional, karena sudah dicek di kelulusan_siswa.php)
if (!isset($_SESSION['guru_id'])) {
    header("Location: login.html");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $kelas = $_POST['kelas'];
    $siswa_lulus_ids = isset($_POST['lulus_siswa']) ? $_POST['lulus_siswa'] : [];

    if (!empty($siswa_lulus_ids)) {
        // Contoh: Update status siswa di database
        // Anda mungkin ingin menambahkan kolom 'status' (misal: 'aktif', 'lulus', 'pindah')
        // atau memindahkan data ke tabel lain (misal: 'siswa_lulus')

        $ids_string = implode(",", array_map('intval', $siswa_lulus_ids)); // Sanitasi input
        $sql = "UPDATE siswa SET status_kelulusan = 'Lulus' WHERE id_siswa IN ($ids_string) AND kelas = '$kelas'";

        if (mysqli_query($conn, $sql)) {
            // Redirect ke halaman sukses atau riwayat kelulusan
            header("Location: kelulusan_sukses.html"); // Buat halaman ini juga
            exit();
        } else {
            echo "Error: " . mysqli_error($conn);
            // Handle error, redirect to an error page
        }
    } else {
        // Tidak ada siswa yang dipilih
        header("Location: kelulusan_siswa.php?message=no_selection");
        exit();
    }
} else {
    // Jika diakses langsung tanpa POST
    header("Location: kelulusan_siswa.php");
    exit();
}
?>