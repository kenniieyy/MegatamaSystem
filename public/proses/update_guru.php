<?php
include '../config/config.php';

$id_guru = $_POST['id_guru'];
$fullname = $_POST['fullname'];
$nip = $_POST['id'];
$gender = $_POST['gender'];
$status = $_POST['status'];
$subject = $_POST['subject'];

$new_foto_name = null;

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

    if (move_uploaded_file($foto_tmp, $foto_path)) {
    } else {
        error_log("Error uploading file for guru_id: $id_guru, error: " . $_FILES['foto_profil']['error'] . " to " . $foto_path);
        $new_foto_name = null;
    }
} 
$query_parts = [];
$query_parts[] = "nip='$nip'";
$query_parts[] = "nama_guru='$fullname'";
$query_parts[] = "gender='$gender'";

if ($new_foto_name !== null) {
    $query_parts[] = "foto_profil='$new_foto_name'";
}

$query = "UPDATE guru SET " . implode(', ', $query_parts) . " WHERE id_guru='$id_guru'";

if (isset($conn) && $conn->query($query)) {
    echo "Berhasil memperbarui profil.";
} else {
    echo "Gagal memperbarui profil di database: " . (isset($conn) ? $conn->error : "Koneksi database belum diinisialisasi.");
}

?>