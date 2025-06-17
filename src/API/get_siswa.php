<?php
include '../config/config.php';
session_start(); // Start the session to access session variables

header('Content-Type: application/json');

$teacher_class = null;

// Assuming you store the teacher's class in a session variable named 'user_class'
if (isset($_SESSION['kelas_wali'])) {
    $teacher_class = mysqli_real_escape_string($conn, $_SESSION['kelas_wali']);
}

$sql = "SELECT * FROM siswa";
if ($teacher_class) {
    $sql .= " WHERE kelas = '$teacher_class'"; // Filter by teacher's class
}
$sql .= " ORDER BY kelas, nis";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(['error' => 'Database query failed: ' . mysqli_error($conn)]);
    exit;
}

// Inisialisasi array untuk menyimpan data yang dikelompokkan berdasarkan kelas
$groupedData = [];

while ($row = mysqli_fetch_assoc($result)) {
    $class = $row['kelas']; // Ambil nilai kelas dari baris saat ini

    // Jika kelas ini belum ada dalam array groupedData, inisialisasi sebagai array kosong
    if (!isset($groupedData[$class])) {
        $groupedData[$class] = [];
    }

    // Tambahkan data siswa ke array kelas yang sesuai
    $groupedData[$class][] = [
        'id' => $row['nis'],
        'name' => $row['nama_siswa'],
        'gender' => $row['jenis_kelamin'],
        'class' => $row['kelas'],
        'phone' => $row['no_hp'],
        'status' => $row['status_siswa']
    ];
}

// Encode array yang sudah dikelompokkan ke JSON
echo json_encode($groupedData);
?>