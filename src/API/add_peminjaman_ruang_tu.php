<?php
header('Content-Type: application/json');
include "../config/config.php"; 

// Pastikan $conn sudah terdefinisi dari config.php
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Koneksi database gagal atau tidak terinisialisasi.']);
    exit();
}

// Periksa apakah request adalah POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil data dari input JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    // Validasi dan sanitasi input (penting!)
    // Sesuaikan dengan nama kolom di tabel 'peminjaman_ruangan'
    $nama_lengkap       = filter_var($data['nama_lengkap'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $nis                = filter_var($data['nis'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $kelas              = filter_var($data['kelas'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $no_telepon         = filter_var($data['no_telepon'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $jenis_ruangan      = filter_var($data['jenis_ruangan'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $tanggal_peminjaman = filter_var($data['tanggal_peminjaman'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $deskripsi_kegiatan = filter_var($data['deskripsi_kegiatan'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $jam_mulai          = filter_var($data['jam_mulai'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $jam_selesai        = filter_var($data['jam_selesai'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $penanggung_jawab   = filter_var($data['penanggung_jawab'] ?? '', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    // Contoh validasi tambahan: format tanggal/waktu
    if (!preg_match("/^\d{4}-\d{2}-\d{2}$/", $tanggal_peminjaman)) {
        echo json_encode(['success' => false, 'message' => 'Format tanggal tidak valid (YYYY-MM-DD).']);
        $conn->close();
        exit();
    }
    if (!preg_match("/^\d{2}:\d{2}$/", $jam_mulai) || !preg_match("/^\d{2}:\d{2}$/", $jam_selesai)) {
        echo json_encode(['success' => false, 'message' => 'Format waktu tidak valid (HH:MM).']);
        $conn->close();
        exit();
    }

    // Validasi waktu: jam_mulai harus sebelum jam_selesai
    if (strtotime($jam_mulai) >= strtotime($jam_selesai)) {
        echo json_encode(['success' => false, 'message' => 'Waktu mulai harus sebelum waktu selesai.']);
        $conn->close();
        exit();
    }

    // Cek ketersediaan ruangan (penting untuk menghindari tabrakan)
    // Sesuaikan query ini dengan nama kolom dan tabel yang baru
    $check_sql = "SELECT COUNT(*) AS count FROM peminjaman_ruangan 
                  WHERE jenis_ruangan = ? 
                  AND tanggal_peminjaman = ? 
                  AND (
                      (jam_mulai < ? AND jam_selesai > ?) OR 
                      (jam_mulai < ? AND jam_selesai > ?) OR 
                      (jam_mulai >= ? AND jam_selesai <= ?)
                  ) 
                  AND status = 'disetujui'"; // Pastikan status ini ada di ENUM kolom status
    $stmt_check = $conn->prepare($check_sql);
    
    if ($stmt_check === false) {
        echo json_encode(['success' => false, 'message' => 'Error persiapan statement cek ketersediaan: ' . $conn->error]);
        $conn->close();
        exit();
    }
    
    $stmt_check->bind_param("ssssssss", 
        $jenis_ruangan, 
        $tanggal_peminjaman, 
        $jam_selesai, $jam_mulai, 
        $jam_mulai, $jam_selesai, 
        $jam_mulai, $jam_selesai
    );
    $stmt_check->execute();
    $result_check = $stmt_check->get_result();
    $row_check = $result_check->fetch_assoc();

    if ($row_check['count'] > 0) {
        echo json_encode(['success' => false, 'message' => 'Ruangan sudah dipesan pada waktu tersebut dan sudah disetujui.']);
        $stmt_check->close();
        $conn->close();
        exit();
    }
    $stmt_check->close();

    // Siapkan statement SQL untuk INSERT
    // default status 'pending'
    $status = 'pending';
    // Kolom `id` biasanya AUTO_INCREMENT, jadi tidak perlu di-insert secara manual
    $sql = "INSERT INTO peminjaman_ruangan (nama_lengkap, nis, kelas, no_telepon, jenis_ruangan, tanggal_peminjaman, deskripsi_kegiatan, jam_mulai, jam_selesai, penanggung_jawab, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Gunakan prepared statements untuk mencegah SQL Injection
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Error persiapan statement insert: ' . $conn->error]);
        $conn->close();
        exit();
    }

    // Bind parameter (jenis string 'sssssssssss' untuk 11 parameter string)
    // Sesuaikan urutan dan tipe data dengan urutan kolom di query INSERT
    $stmt->bind_param("sssssssssss", 
        $nama_lengkap, 
        $nis, 
        $kelas, 
        $no_telepon, 
        $jenis_ruangan, 
        $tanggal_peminjaman, 
        $deskripsi_kegiatan, 
        $jam_mulai, 
        $jam_selesai, 
        $penanggung_jawab, 
        $status
    );

    // Eksekusi statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Permintaan peminjaman berhasil dikirim. Menunggu persetujuan.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan data: ' . $stmt->error]);
    }

    // Tutup statement
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Metode request tidak diizinkan.']);
}

// Tutup koneksi database
$conn->close();
?>