<?php
include '../config/koneksi.php';

// Ambil data dari POST
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'];
$password = $data['password'];

// Hash kalau kamu simpan dalam bentuk hash (MD5, SHA, dll), kalau tidak ya langsung cocokkan.
$query = "SELECT * FROM operator WHERE username = '$username' AND password = '$password'";
$result = mysqli_query($conn, $query);

$response = [];

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    $response = [
        'status' => 'success',
        'message' => 'Login berhasil',
        'data' => [
            'id_operator' => $user['id_operator'],
            'nama_operator' => $user['nama_operator'],
            'username' => $user['username'],
            'role' => $user['role']
        ]
    ];
} else {
    $response = [
        'status' => 'error',
        'message' => 'Username atau password salah'
    ];
}

header('Content-Type: application/json');
echo json_encode($response);
?>
