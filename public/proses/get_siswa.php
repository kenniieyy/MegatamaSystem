<?php
include '../config/config.php'; // sesuaikan path koneksi database

header('Content-Type: application/json');


$sql = "SELECT * FROM siswa ORDER BY kelas, id_siswa";
$result = mysqli_query($conn, $sql);

$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $kelas = $row['kelas'];
    if (!isset($data[$kelas])) {
        $data[$kelas] = [];
    }

    $data[$kelas][] = [
        'id' => $row['id_siswa'],
        'name' => $row['nama_siswa'],
        'gender' => $row['jenis_kelamin']
    ];
}

echo json_encode($data);
?>
