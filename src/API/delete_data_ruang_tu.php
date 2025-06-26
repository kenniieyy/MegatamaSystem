<?php
header('Content-Type: application/json');

include "../config/config.php";

// Get the ID from the URL query parameter
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    die(json_encode(["success" => false, "message" => "Invalid ID provided."]));
}

$sql = "DELETE FROM ruangan WHERE id = $id";

if ($conn->query($sql) === TRUE) {
    if ($conn->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Ruangan deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "No ruangan found with that ID."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Error deleting record: " . $conn->error]);
}

$conn->close();
?>