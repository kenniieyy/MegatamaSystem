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

$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    $data[] = [ // Flatten the data, as filtering by class is already done
        'id' => $row['nis'],
        'name' => $row['nama_siswa'],
        'gender' => $row['jenis_kelamin'],
        'class' => $row['kelas'],
        'phone' => $row['no_hp'],
        'status' => $row['status_siswa']
    ];
}

echo json_encode($data);
?>