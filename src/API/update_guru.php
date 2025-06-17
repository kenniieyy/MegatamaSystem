<?php
include '../config/config.php';

session_start();

$id_guru = $_POST['id_guru'];
$fullname = $_POST['fullname'];
$nip = $_POST['id'];
$gender = $_POST['gender'];
$status = $_POST['status'];

$new_foto_name = null;

// === Upload dan handle foto profil ===
if (isset($_FILES['foto_profil']) && $_FILES['foto_profil']['error'] === UPLOAD_ERR_OK) {
    $original_foto_name = $_FILES['foto_profil']['name'];
    $foto_tmp = $_FILES['foto_profil']['tmp_name'];

    $file_ext = pathinfo($original_foto_name, PATHINFO_EXTENSION);
    $new_foto_name = $nip . '.' . $file_ext;
    $foto_path = '../img/guru/' . $new_foto_name;

    $sql_get_old_photo = "SELECT foto_url FROM guru WHERE id_guru = ?";
    $stmt_old_photo = $conn->prepare($sql_get_old_photo);
    $stmt_old_photo->bind_param("i", $id_guru);
    $stmt_old_photo->execute();
    $result_old_photo = $stmt_old_photo->get_result();

    if ($result_old_photo && $result_old_photo->num_rows > 0) {
        $row_old_photo = $result_old_photo->fetch_assoc();
        $old_foto_name = $row_old_photo['foto_profil'];
        if ($old_foto_name && $old_foto_name !== $new_foto_name && file_exists('../img/guru/' . $old_foto_name)) {
            unlink('../img/guru/' . $old_foto_name);
        }
    }
    $stmt_old_photo->close();

    if (!move_uploaded_file($foto_tmp, $foto_path)) {
        error_log("Error uploading file for guru_id: $id_guru, error: " . $_FILES['foto_profil']['error'] . " to " . $foto_path);
        $new_foto_name = null;
    }
}

// === Update data guru ===
$sql = "UPDATE guru SET 
            ID = ?, 
            nama_guru = ?, 
            jenis_kelamin = ?, 
            status = ?"; // Tambahkan mata_pelajaran
if ($new_foto_name !== null) {
    $sql .= ", foto_url = ? ";
}

$sql .= " WHERE id_guru = ?";

$stmt = $conn->prepare($sql);

$param_types = "ssss"; // ID, nama_guru, jenis_kelamin, status, mata_pelajaran
$params = [&$nip, &$fullname, &$gender, &$status];

// Jika wali_kelas bukan NULL atau kosong, tambahkan ke parameter
if ($wali_kelas_value !== null && $wali_kelas_value !== '') {
    $param_types .= "s"; // Tambah tipe string untuk wali_kelas
    $params[] = &$wali_kelas_value;
}

if ($new_foto_name !== null) {
    $param_types .= "s"; // Tambah tipe string untuk foto_profil
    $params[] = &$new_foto_name;
}

$param_types .= "i"; // id_guru (integer) selalu terakhir
$params[] = &$id_guru;

call_user_func_array([$stmt, 'bind_param'], array_merge([$param_types], $params));

if ($stmt->execute()) {
    // Re-evaluasi dan perbarui variabel sesi untuk 'is_wali_kelas_9_or_12'
    $_SESSION['is_wali_kelas_9_or_12'] = false; // Reset dulu

    if ($wali_kelas_value !== null && $wali_kelas_value !== '') {
        if (preg_match('/Wali Kelas (9|12)/i', $wali_kelas_value, $matches)) {
            $_SESSION['is_wali_kelas_9_or_12'] = true;
        }
    }

    echo "Berhasil memperbarui profil guru.";
} else {
    echo "Gagal memperbarui profil di database: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>