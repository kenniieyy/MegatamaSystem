<?php
// Koneksi ke database
$conn = new mysqli("localhost", "root", "", "nama_database");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ambil semua data guru
    $result = $conn->query("SELECT * FROM guru");
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $row['foto_url'] = "uploads/" . $row['foto']; // path ke foto
        $data[] = $row;
    }
    header('Content-Type: application/json');
    echo json_encode($data);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Simpan data guru baru
    $nama = $_POST['nama_lengkap'];
    $jk = $_POST['jenis_kelamin'];
    $nip = $_POST['nip'];
    $mapel = $_POST['mata_pelajaran'];
    $wali = $_POST['wali_kelas'];
    $status = $_POST['status_guru'];
    $username = $_POST['username'];
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Handle file upload
    $foto_name = "";
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === 0) {
        $foto_name = uniqid() . "_" . $_FILES['foto']['name'];
        move_uploaded_file($_FILES['foto']['tmp_name'], "../uploads/" . $foto_name);
    }

    $stmt = $conn->prepare("INSERT INTO guru (nama_lengkap, jenis_kelamin, nip, mata_pelajaran, wali_kelas, status_guru, username, password, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssss", $nama, $jk, $nip, $mapel, $wali, $status, $username, $password, $foto_name);
    $stmt->execute();

    echo json_encode(["message" => "Guru berhasil ditambahkan"]);
}
?>
