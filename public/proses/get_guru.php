<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include "../config/config.php";

$response = [];

if (isset($_GET['nip'])) {
    $nip = $_GET['nip'];

    $stmt = $conn->prepare("SELECT * FROM guru WHERE nip = ?");
    $stmt->bind_param("s", $nip);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        if (empty($row['foto_profil'])) {
            $row['foto_profil'] = '1.png';
        }
        $response = $row;
    } else {
        http_response_code(404);
        $response = ['error' => 'Guru tidak ditemukan'];
    }
    $stmt->close();
} else {
    http_response_code(400);
    $response = ['error' => 'NIP parameter tidak diberikan'];
}

echo json_encode($response);
$conn->close();
?>
