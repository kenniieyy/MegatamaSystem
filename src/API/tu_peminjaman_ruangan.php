<?php
header('Content-Type: application/json');

// Koneksi database
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

// Ambil action dari GET, POST, atau JSON body
$rawInput = file_get_contents('php://input');
$decoded = json_decode($rawInput, true);
$action = $_GET['action'] ?? $_POST['action'] ?? ($decoded['action'] ?? '');

// ===================================================
// 1. Ambil daftar jenis ruangan dari tabel ruangan
// ===================================================
if ($action === 'get_rooms') {
    $result = $conn->query("SELECT namaRuangan FROM ruangan ORDER BY namaRuangan ASC");
    $rooms = [];
    while ($row = $result->fetch_assoc()) {
        $rooms[] = $row['namaRuangan'];
    }
    echo json_encode($rooms);
    exit;
}

// ===================================================
// 2. Simpan data peminjaman (dengan validasi bentrok)
// ===================================================
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

    if (
        !$nama || !$nis || !$kelas || !$telepon || !$jenis_ruangan ||
        !$tanggal || !$deskripsi || !$jam_mulai || !$jam_selesai
    ) {
        echo json_encode(['success' => false, 'message' => 'Semua field wajib diisi.']);
        exit;
    }

    // ✅ CEK BENTROK JADWAL
    $stmtCheck = $conn->prepare("
        SELECT id FROM peminjaman_ruangan
        WHERE jenis_ruangan = ? AND tanggal_peminjaman = ?
        AND (
            (jam_mulai <= ? AND jam_selesai >= ?)
        )
    ");
    $stmtCheck->bind_param("ssss", $jenis_ruangan, $tanggal, $jam_selesai, $jam_mulai);
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

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    $stmt->close();
    exit;
}

// ===================================================
// 3. Ambil riwayat peminjaman (dengan filter dan pagination)
// ===================================================
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
    if ($filterStatus !== '' && $filterStatus !== 'all') {
        $where .= " AND status = '" . $conn->real_escape_string($filterStatus) . "'";
    }
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

    $start = $offset + 1;
    $end = min($offset + $limit, $totalRows);

    echo json_encode([
        'items' => $items,
        'start' => $start,
        'end' => $end,
        'total_rows' => $totalRows,
        'total_pages' => $totalPages
    ]);
    exit;
}

// ===================================================
// 4. Hapus peminjaman
// ===================================================
if ($action === 'delete_reservation') {
    $id = $decoded['id'] ?? 0;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM peminjaman_ruangan WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Gagal menghapus data']);
    }
    $stmt->close();
    exit;
}

// ===================================================
// 5. Ambil detail peminjaman berdasarkan ID
// ===================================================
if ($action === 'get_detail') {
    $id = $_GET['id'] ?? 0;
    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID tidak ditemukan']);
        exit;
    }

    $stmt = $conn->prepare("SELECT * FROM peminjaman_ruangan WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $detail = $result->fetch_assoc();

    echo json_encode($detail ?: ['success' => false, 'message' => 'Data tidak ditemukan']);
    $stmt->close();
    exit;
}

// ===================================================
// 6. Update data peminjaman berdasarkan ID
// ===================================================
if ($action === 'update_reservation') {
    $data = $decoded ?? $_POST;

    $id = $data['id'] ?? 0;
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

    if (
        !$id || !$nama || !$nis || !$kelas || !$telepon || !$jenis_ruangan ||
        !$tanggal || !$deskripsi || !$jam_mulai || !$jam_selesai
    ) {
        echo json_encode(['success' => false, 'message' => 'Semua field wajib diisi.']);
        exit;
    }

    // ✅ CEK BENTROK JADWAL (kecuali dirinya sendiri)
    $stmtCheck = $conn->prepare("
        SELECT id FROM peminjaman_ruangan
        WHERE jenis_ruangan = ? AND tanggal_peminjaman = ?
        AND (
            (jam_mulai <= ? AND jam_selesai >= ?)
        ) AND id != ?
    ");
    $stmtCheck->bind_param("ssssi", $jenis_ruangan, $tanggal, $jam_selesai, $jam_mulai, $id);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ruangan sudah digunakan di waktu tersebut.']);
        exit;
    }

    // ✅ UPDATE DATA
    $stmt = $conn->prepare("UPDATE peminjaman_ruangan SET 
        nama_lengkap = ?, nis = ?, kelas = ?, no_telepon = ?, jenis_ruangan = ?, 
        tanggal_peminjaman = ?, deskripsi_kegiatan = ?, jam_mulai = ?, jam_selesai = ?, 
        penanggung_jawab = ?
        WHERE id = ?");
    $stmt->bind_param("ssssssssssi", $nama, $nis, $kelas, $telepon, $jenis_ruangan, $tanggal, $deskripsi, $jam_mulai, $jam_selesai, $penanggung_jawab, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    $stmt->close();
    exit;
}

// ===================================================
// 7. Default jika action tidak dikenali
// ===================================================
echo json_encode(['success' => false, 'message' => 'Action tidak valid']);
exit;
?>
