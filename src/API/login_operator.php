<?php
session_start();
header('Content-Type: application/json');
ini_set('display_errors', 0);

include "../config/config.php";

$username = $_POST['username'];
$password = $_POST['password'];

// Ambil data operator
$stmt = $conn->prepare("SELECT id_operator, nama_operator, username, password, role FROM operator WHERE username = ?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $operator = $result->fetch_assoc();

    if ($password === $operator['password']) {
        // Simpan ke session
        $_SESSION['operator_id'] = $operator['id_operator'];
        $_SESSION['nama_operator'] = $operator['nama_operator'];
        $_SESSION['username_operator'] = $operator['username'];
        $_SESSION['role_operator'] = $operator['role'];

        echo json_encode([
            'success' => true,
            'name' => $operator['nama_operator'],
            'role' => $operator['role']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Username atau password Operator tidak valid']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Username tidak ditemukan']);
}

$conn->close();

?>