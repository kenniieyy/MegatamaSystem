<?php

session_start();

include "../config/config.php";

// Ambil data dari form
$identity = $_POST['identity'];
$password = $_POST['password'];

// Ekstrak NIP dari identity_display (ambil sebelum " - ")
$parts = explode(' - ', $identity);
$nip = trim($parts[0]); // hasilnya misal: "197201231995011002"

// Query sederhana tanpa prepared statement (bisa ditingkatkan nanti)
$sql = "SELECT * FROM guru WHERE (nip = '$nip')";
$result = $conn->query($sql);

// Cek apakah data ditemukan
if (mysqli_num_rows($result) === 1) {
    $data = mysqli_fetch_assoc($result);

    // Cek password
    if ($password === $data['password']) { // Ganti dengan password_hash kalau kamu pakai hash
        // Simpan data ke session (opsional)
        $_SESSION['guru_id'] = $data['id']; // atau nip/nama sesuai kebutuhan

        // Redirect ke dashboard
        header("Location: ../dashboard_guru.html");
        exit();
    } else {
        echo "<script>alert('Password salah!'); window.history.back();</script>";
    }
} else {
    echo "<script>alert('Guru tidak ditemukan!'); window.history.back();</script>";
}

$conn->close();

?>