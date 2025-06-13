<?php
include '../config/config.php';

$id_guru = $_POST['id_guru'];
$fullname = $_POST['fullname'];
$nip = $_POST['id'];
$gender = $_POST['gender'];
$status = $_POST['status'];
$subject = $_POST['subject']; // string dari combobox input

$new_foto_name = null;

// === Upload dan handle foto profil ===
if (isset($_FILES['foto_profil']) && $_FILES['foto_profil']['error'] === UPLOAD_ERR_OK) {
    $original_foto_name = $_FILES['foto_profil']['name'];
    $foto_tmp = $_FILES['foto_profil']['tmp_name'];

    $file_ext = pathinfo($original_foto_name, PATHINFO_EXTENSION);
    $new_foto_name = $nip . '.' . $file_ext;
    $foto_path = '../img/guru/' . $new_foto_name;

    $sql_get_old_photo = "SELECT foto_profil FROM guru WHERE id_guru = '$id_guru'";
    $result_old_photo = $conn->query($sql_get_old_photo);
    if ($result_old_photo && $result_old_photo->num_rows > 0) {
        $row_old_photo = $result_old_photo->fetch_assoc();
        $old_foto_name = $row_old_photo['foto_profil'];
        if ($old_foto_name && $old_foto_name !== $new_foto_name && file_exists('../img/guru/' . $old_foto_name)) {
            unlink('../img/guru/' . $old_foto_name);
        }
    }

    if (!move_uploaded_file($foto_tmp, $foto_path)) {
        error_log("Error uploading file for guru_id: $id_guru, error: " . $_FILES['foto_profil']['error'] . " to " . $foto_path);
        $new_foto_name = null;
    }
}

// === Update data guru ===
$query_parts = [];
$query_parts[] = "nip='$nip'";
$query_parts[] = "nama_guru='$fullname'";
$query_parts[] = "gender='$gender'";
$query_parts[] = "status='$status'";
if ($new_foto_name !== null) {
    $query_parts[] = "foto_profil='$new_foto_name'";
}
$query = "UPDATE guru SET " . implode(', ', $query_parts) . " WHERE id_guru = '$id_guru'";

// Eksekusi update guru
if (isset($conn) && $conn->query($query)) {

    // === Tambahan: proses bidang tugas ===

    // 1. Cek apakah bidang tugas sudah ada di tabel
    $subject = trim($subject);
    $stmt = $conn->prepare("SELECT id_bidang FROM bidang_tugas WHERE nama_bidang = ?");
    $stmt->bind_param("s", $subject);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id_bidang);
        $stmt->fetch();
    } else {
        // Jika belum ada, tambahkan ke tabel
        $stmt_insert = $conn->prepare("INSERT INTO bidang_tugas (nama_bidang) VALUES (?)");
        $stmt_insert->bind_param("s", $subject);
        $stmt_insert->execute();
        $id_bidang = $stmt_insert->insert_id;
        $stmt_insert->close();
    }
    $stmt->close();

    // 2. Hapus bidang tugas lama dari guru
    $conn->query("DELETE FROM guru_bidang_tugas WHERE id_guru = '$id_guru'");

    // 3. Masukkan yang baru
    $stmt_assign = $conn->prepare("INSERT INTO guru_bidang_tugas (id_guru, id_bidang) VALUES (?, ?)");
    $stmt_assign->bind_param("ii", $id_guru, $id_bidang);
    $stmt_assign->execute();
    $stmt_assign->close();

    // --- MULAI PERUBAHAN DI SINI ---
    // Re-evaluasi dan perbarui variabel sesi setelah bidang_tugas diperbarui
    session_start(); // Pastikan sesi sudah dimulai untuk akses $_SESSION
    $_SESSION['is_wali_kelas_9_or_12'] = false; // Reset dulu

    $id_bidang_query = mysqli_query($conn, "SELECT id_bidang FROM guru_bidang_tugas WHERE id_guru = '$id_guru'");
    if ($id_bidang_query && mysqli_num_rows($id_bidang_query) > 0) {
        $id_bidang_row = mysqli_fetch_assoc($id_bidang_query);
        $id_bidang_wali = $id_bidang_row['id_bidang'];

        $nama_bidang_query = mysqli_query($conn, "SELECT nama_bidang FROM bidang_tugas WHERE id_bidang = '$id_bidang_wali'");
        if ($nama_bidang_query && mysqli_num_rows($nama_bidang_query) > 0) {
            $nama_bidang = mysqli_fetch_assoc($nama_bidang_query)['nama_bidang'];
            if (preg_match('/Wali Kelas (9|12)/', $nama_bidang, $matches)) {
                $_SESSION['is_wali_kelas_9_or_12'] = true;
            }
        }
    }
    // --- AKHIR PERUBAHAN ---

    echo "Berhasil memperbarui profil dan bidang tugas.";
} else {
    echo "Gagal memperbarui profil di database: " . (isset($conn) ? $conn->error : "Koneksi database belum diinisialisasi.");
}
?>