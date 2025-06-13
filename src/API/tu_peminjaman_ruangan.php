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
// 2. Simpan data peminjaman
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

    // Validasi sederhana (bisa ditingkatkan)
    if (
        !$nama || !$nis || !$kelas || !$telepon || !$jenis_ruangan ||
        !$tanggal || !$deskripsi || !$jam_mulai || !$jam_selesai
    ) {
        echo json_encode(['success' => false, 'message' => 'Semua field wajib diisi.']);
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

    echo json_encode([
        'items' => $items,
        'total_pages' => $totalPages,
        'offset' => $offset
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
// 5. Default jika action tidak dikenali
// ===================================================
echo json_encode(['success' => false, 'message' => 'Action tidak valid']);
exit;
