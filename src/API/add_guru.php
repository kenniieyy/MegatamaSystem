<?php
// save_guru.php - Menggabungkan Add dan Update
include '../config/config.php'; // Pastikan path ini benar untuk koneksi DB

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Sesuaikan dengan domain frontend Anda di produksi!
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Pastikan koneksi database ada dari config.php
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Koneksi database tidak tersedia."]);
    exit();
}

// Mengambil data dari $_POST (karena JavaScript mengirim FormData)
$id_guru = $_POST['id_guru'] ?? null; // Ini akan ada jika operasi UPDATE
$fullname = $_POST['fullname'] ?? '';
$nip = $_POST['nip'] ?? ''; // <--- Pastikan ini 'nip' dari JS
$gender = $_POST['gender'] ?? '';
$subject = $_POST['subject'] ?? '';
$waliKelas = $_POST['waliKelas'] ?? '';
$status = $_POST['status'] ?? '';
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
$current_photo_url = $_POST['current_photo_url'] ?? null; // URL foto lama dari JS (saat edit)

$foto_url_to_save = 'img/guru/default.png'; // Default photo

// **LANGKAH 1: Dapatkan URL Foto Lama dari Database jika ini Update dan TIDAK ada current_photo_url dari JS**
// Ini penting jika JS tidak mengirimkan current_photo_url, atau jika current_photo_url kosong/null
if ($id_guru !== null && $current_photo_url === null) { // Jika ada ID guru tapi tidak ada URL foto lama dari JS
    $sql_get_existing_photo = "SELECT foto_url FROM guru WHERE id_guru = ?"; // Gunakan id_guru sebagai primary key
    $stmt_existing_photo = $conn->prepare($sql_get_existing_photo);
    if ($stmt_existing_photo) {
        $stmt_existing_photo->bind_param("i", $id_guru); // Asumsi id_guru adalah integer
        $stmt_existing_photo->execute();
        $result_existing_photo = $stmt_existing_photo->get_result();
        if ($result_existing_photo && $result_existing_photo->num_rows > 0) {
            $row_existing_photo = $result_existing_photo->fetch_assoc();
            $foto_url_to_save = $row_existing_photo['foto_url']; // Gunakan foto yang sudah ada di DB
        }
        $stmt_existing_photo->close();
    } else {
        error_log("Failed to prepare statement for getting existing photo: " . $conn->error);
    }
} elseif ($id_guru !== null && $current_photo_url !== null) {
    // Jika current_photo_url ada dari JS, gunakan itu.
    $foto_url_to_save = $current_photo_url;
}


// === Handle Upload Foto Profil ===
// Ini akan menimpa $foto_url_to_save jika ada file baru yang diunggah
if (isset($_FILES['foto_profil']) && $_FILES['foto_profil']['error'] === UPLOAD_ERR_OK) {
    $original_foto_name = $_FILES['foto_profil']['name'];
    $foto_tmp = $_FILES['foto_profil']['tmp_name'];

    $file_ext = pathinfo($original_foto_name, PATHINFO_EXTENSION);
    // Bersihkan NIP untuk nama file agar tidak ada karakter aneh
    $clean_nip = preg_replace('/[^a-zA-Z0-9_.-]/', '', $nip);
    $new_foto_name_disk = $clean_nip . '.' . $file_ext; // Nama file baru berdasarkan NIP
    $foto_path = '../img/guru/' . $new_foto_name_disk;

    // Jika ini adalah UPDATE, hapus foto lama dari server sebelum upload yang baru
    if ($id_guru !== null) {
        // Menggunakan $foto_url_to_save yang sudah diisi dari database/current_photo_url
        // atau tetap menggunakan query untuk mendapatkan foto_url lama jika tidak yakin $foto_url_to_save sudah benar
        // Untuk lebih aman, kita bisa fetch ulang foto lama jika $foto_url_to_save saat ini adalah default atau current_photo_url.
        // Tapi jika logikanya benar, $foto_url_to_save sudah berisi url foto yang *sedang* digunakan.
        $sql_get_current_db_photo = "SELECT foto_url FROM guru WHERE id_guru = ?";
        $stmt_current_db_photo = $conn->prepare($sql_get_current_db_photo);
        if ($stmt_current_db_photo) {
            $stmt_current_db_photo->bind_param("i", $id_guru);
            $stmt_current_db_photo->execute();
            $result_current_db_photo = $stmt_current_db_photo->get_result();
            if ($result_current_db_photo && $result_current_db_photo->num_rows > 0) {
                $db_old_foto_url = $result_current_db_photo->fetch_assoc()['foto_url'];
                // Hapus foto lama jika ada, berbeda dengan nama baru, dan bukan URL default
                if ($db_old_foto_url &&
                    $db_old_foto_url !== 'img/guru/default.png' &&
                    'img/guru/' . $new_foto_name_disk !== $db_old_foto_url
                ) {
                    $old_file_path = '../' . $db_old_foto_url;
                    if (file_exists($old_file_path) && is_file($old_file_path)) {
                        unlink($old_file_path);
                        error_log("Deleted old photo: " . $old_file_path);
                    }
                }
            }
            $stmt_current_db_photo->close();
        } else {
            error_log("Failed to prepare statement for getting current DB photo: " . $conn->error);
        }
    }

    if (move_uploaded_file($foto_tmp, $foto_path)) {
        $foto_url_to_save = 'img/guru/' . $new_foto_name_disk; // URL yang akan disimpan di DB
    } else {
        error_log("Error uploading file for NIP: $nip, error: " . $_FILES['foto_profil']['error'] . " to " . $foto_path);
        // Jika upload gagal, tetap gunakan foto yang sudah ada (dari $foto_url_to_save yang sebelumnya sudah diatur)
        // Atau ambil kembali dari database jika ada keraguan.
        // Dalam kasus ini, kita sudah menetapkan $foto_url_to_save di atas, jadi tidak perlu reset ke default.
    }
}

// === Tentukan apakah ini operasi INSERT atau UPDATE ===
if ($id_guru === null || $id_guru === '') { // Jika ID tidak ada, ini INSERT
    $sql = "INSERT INTO guru (nama_guru, ID, jenis_kelamin, mata_pelajaran, wali_kelas, status, username, password, foto_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssss", $fullname, $nip, $gender, $subject, $waliKelas, $status, $username, $password, $foto_url_to_save);
    $message = "Guru berhasil ditambahkan!";
    $error_message = "Gagal menambahkan guru: ";
} else { // Jika ID ada, ini UPDATE
    $sql = "UPDATE guru SET 
                nama_guru = ?, 
                ID = ?, 
                jenis_kelamin = ?, 
                mata_pelajaran = ?, 
                wali_kelas = ?, 
                status = ?,
                username = ?,
                password = ?,
                foto_url = ? 
            WHERE id_guru = ?"; 
    $stmt = $conn->prepare($sql);
    // Urutan: fullname, nip, gender, subject, waliKelas, status, foto_url_to_save, id_guru
    $stmt->bind_param("sssssssssi", $fullname, $nip, $gender, $subject, $waliKelas, $status, $username, $password, $foto_url_to_save, $id_guru);
    $message = "Profil guru berhasil diperbarui.";
    $error_message = "Gagal memperbarui profil di database: ";
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => $message]);
} else {
    echo json_encode(["success" => false, "message" => $error_message . $stmt->error]);
}

$stmt->close();
$conn->close();
?>