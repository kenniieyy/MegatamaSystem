<?php

include "../config/config.php";

$result = $conn->query("SELECT * FROM guru");
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = [
        'id' => $row['id_guru'],
        'nip' => $row['ID'], 
        'name' => $row['nama_guru'],
        'gender' => $row['jenis_kelamin'],
        'subject' => $row['mata_pelajaran'],
        'waliKelas' => $row['wali_kelas'],
        'status' => $row['status'],
        'username' => $row['username'],
        'password' => $row['password'],
        'photo' => $row['foto_url'],
    ];
}

echo json_encode($data);
$conn->close();
?>
