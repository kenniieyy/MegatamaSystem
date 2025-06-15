<?php
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'proyek_ppsi';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Koneksi gagal']);
    exit;
}

$rawInput = file_get_contents('php://input');
$decoded = json_decode($rawInput, true);
$action = $_GET['action'] ?? $_POST['action'] ?? ($decoded['action'] ?? '');

// ====================== GET ROOMS ======================
if ($action === 'get_rooms') {
    $result = $conn->query("SELECT namaRuangan FROM ruangan ORDER BY namaRuangan ASC");
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row['namaRuangan'];
    }
    echo json_encode($rooms);
    exit;
}

// ====================== SUBMIT RESERVATION ======================
if ($action === 'submit_reservation') {
    $data = $decoded ?? $_POST;

    $nama = $data['nama_lengkap'] ?? '';
    $nis = $data['nis'] ?? '';
    $kelas = $data['kelas'] ?? '';
    $telepon = $data['telepon'] ?? '';
    $jenis_ruangan = $data['jenis_ruangan'] ?? '';
    $tanggal = $data['tanggal_peminjaman'] ?? '';
    $deskripsi = $data['deskripsi_kegiatan'] ?? '';
    $jam_mulai = $data['jam_mulai'] ?? '';
    $jam_selesai = $data['jam_selesai'] ?? '';
    $penanggung_jawab = $data['penanggung_jawab'] ?? '';

    if (!$nama || !$nis || !$kelas || !$jenis_ruangan || !$tanggal || !$deskripsi || !$jam_mulai || !$jam_selesai || !$penanggung_jawab) { // Perbaikan validasi
        echo json_encode(['success' => false, 'message' => 'Semua field wajib diisi.']);
        exit;
    }

    $stmtCheck = $conn->prepare("
        SELECT id FROM peminjaman_ruangan
        WHERE jenis_ruangan = ? AND tanggal_peminjaman = ?
        AND (
            (jam_mulai <= ? AND jam_selesai >= ?) OR
            (jam_mulai >= ? AND jam_mulai < ?) OR
            (jam_selesai > ? AND jam_selesai <= ?)
        )
    ");
    // Perbaikan: Menambah parameter untuk cek jam
    $stmtCheck->bind_param("ssssssss", $jenis_ruangan, $tanggal, $jam_selesai, $jam_mulai, $jam_mulai, $jam_selesai, $jam_mulai, $jam_selesai);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ruangan sudah digunakan di waktu tersebut.']);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO peminjaman_ruangan 
        (nama_lengkap, nis, kelas, no_telepon, jenis_ruangan, tanggal_peminjaman, deskripsi_kegiatan, jam_mulai, jam_selesai, penanggung_jawab, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Menunggu Konfirmasi')");
    $stmt->bind_param("ssssssssss", $nama, $nis, $kelas, $telepon, $jenis_ruangan, $tanggal, $deskripsi, $jam_mulai, $jam_selesai, $penanggung_jawab);

    echo $stmt->execute()
        ? json_encode(['success' => true])
        : json_encode(['success' => false, 'message' => $stmt->error]);
    $stmt->close();
    exit;
}

// ====================== GET HISTORY ======================
if ($action === 'get_history') {
    $page = intval($_GET['page'] ?? 1);
    $limit = 5;
    $offset = ($page - 1) * $limit;

    $filterRoom = $_GET['room'] ?? '';
    $filterStatus = $_GET['status'] ?? '';
    $filterMonth = $_GET['month'] ?? '';

    $where = "1=1";
    if ($filterRoom !== '') {
        $where .= " AND jenis_ruangan = '" . $conn->real_escape_string($filterRoom) . "'";
    }

    // Filter status berdasarkan waktu (jam_mulai & jam_selesai) - dihapus karena sudah di-handle di JS
    // if ($filterStatus !== '' && $filterStatus !== 'all') {
    //     $now = date('Y-m-d H:i:s');
    //     if ($filterStatus === 'upcoming') {
    //         $where .= " AND CONCAT(tanggal_peminjaman, ' ', jam_mulai) > '$now'";
    //     } elseif ($filterStatus === 'ongoing') {
    //         $where .= " AND CONCAT(tanggal_peminjaman, ' ', jam_mulai) <= '$now' AND CONCAT(tanggal_peminjaman, ' ', jam_selesai) >= '$now'";
    //     } elseif ($filterStatus === 'completed') {
    //         $where .= " AND CONCAT(tanggal_peminjaman, ' ', jam_selesai) < '$now'";
    //     }
    // }

    if ($filterMonth !== '' && $filterMonth !== 'all') {
        $where .= " AND MONTH(tanggal_peminjaman) = " . intval($filterMonth);
    }

    $query = "SELECT * FROM peminjaman_ruangan WHERE $where ORDER BY tanggal_peminjaman DESC LIMIT $limit OFFSET $offset";
    $result = $conn->query($query);

    $items = [];
    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    $countResult = $conn->query("SELECT COUNT(*) AS total FROM peminjaman_ruangan WHERE $where");
    $totalRows = $countResult->fetch_assoc()['total'];
    $totalPages = ceil($totalRows / $limit);

    echo json_encode([
        'items' => $items,
        'start' => $offset + 1,
        'end' => min($offset + $limit, $totalRows),
        'total_rows' => $totalRows,
        'total_pages' => $totalPages
    ]);
    exit;
}

// ====================== GET DETAIL ======================
if ($action === 'get_detail') {
    $id = $_GET['id'] ?? 0;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, nama_lengkap, nis, kelas, no_telepon, jenis_ruangan, tanggal_peminjaman, deskripsi_kegiatan, jam_mulai, jam_selesai, penanggung_jawab FROM peminjaman_ruangan WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $detail = $result->fetch_assoc();
    $stmt->close();

    if ($detail) {
        // Ubah key agar cocok dengan yang dibutuhkan JS
        $detail['telepon'] = $detail['no_telepon'];
        unset($detail['no_telepon']);

        echo json_encode($detail);
    } else {
        echo json_encode(['success' => false, 'message' => 'Data tidak ditemukan']);
    }
    exit;
}
// ====================== DELETE RESERVATION ======================
if ($action === 'delete_reservation') { // Ubah action menjadi delete_reservation
    $id = $decoded['id'] ?? $_GET['id'] ?? 0; // Mendukung id dari POST body atau GET parameter
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM peminjaman_ruangan WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    $stmt->close();
    exit;
}

// ====================== UPDATE RESERVATION ======================
if ($action === 'edit_reservation') { // Ubah action menjadi edit_reservation
    $data = $decoded ?? $_POST;
    $id = $data['id'] ?? '';
    $jenis_ruangan = $data['jenis_ruangan'] ?? '';
    $tanggal = $data['tanggal_peminjaman'] ?? '';
    $deskripsi = $data['deskripsi_kegiatan'] ?? '';
    $jam_mulai = $data['jam_mulai'] ?? '';
    $jam_selesai = $data['jam_selesai'] ?? '';
    $penanggung_jawab = $data['penanggung_jawab'] ?? '';

    // Perbaikan validasi: Pastikan semua field wajib diisi
    if (!$id || !$jenis_ruangan || !$tanggal || !$deskripsi || !$jam_mulai || !$jam_selesai || !$penanggung_jawab) {
        echo json_encode(['success' => false, 'message' => 'Semua field wajib diisi.']);
        exit;
    }

    // Cek ketersediaan ruangan untuk waktu yang dipilih, kecuali untuk peminjaman yang sedang diedit
    $stmtCheck = $conn->prepare("
        SELECT id FROM peminjaman_ruangan
        WHERE jenis_ruangan = ? AND tanggal_peminjaman = ?
        AND (
            (jam_mulai <= ? AND jam_selesai >= ?) OR
            (jam_mulai >= ? AND jam_mulai < ?) OR
            (jam_selesai > ? AND jam_selesai <= ?)
        ) AND id != ?
    ");
    // Perbaikan: Menambah parameter untuk cek jam dan ID
    $stmtCheck->bind_param("ssssssssi", $jenis_ruangan, $tanggal, $jam_selesai, $jam_mulai, $jam_mulai, $jam_selesai, $jam_mulai, $jam_selesai, $id);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ruangan sudah digunakan di waktu tersebut oleh peminjaman lain.']);
        exit;
    }

    // Perbaikan: Sesuaikan query UPDATE dan bind_param
    $stmt = $conn->prepare("UPDATE peminjaman_ruangan SET 
        jenis_ruangan = ?, tanggal_peminjaman = ?, deskripsi_kegiatan = ?, jam_mulai = ?, 
        jam_selesai = ?, penanggung_jawab = ? WHERE id = ?");
    $stmt->bind_param("ssssssi", $jenis_ruangan, $tanggal, $deskripsi, $jam_mulai, $jam_selesai, $penanggung_jawab, $id);

    echo $stmt->execute()
        ? json_encode(['success' => true])
        : json_encode(['success' => false, 'message' => $stmt->error]);
    $stmt->close();
    exit;
}

echo json_encode(['success' => false, 'message' => 'Action tidak valid']);
exit;

?>