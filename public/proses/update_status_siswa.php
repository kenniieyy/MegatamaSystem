<?php
session_start();
include "../config/config.php"; // Sesuaikan path

header('Content-Type: application/json');

// Cek apakah user sudah login dan memiliki id_guru
if (!isset($_SESSION['guru_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $action = $input['action'] ?? ''; // 'promote' atau 'not_promote'
    $studentId = $input['studentId'] ?? null;
    $class = $input['class'] ?? null; // Kelas siswa saat ini (sebelum kenaikan/kelulusan)
    $isBulk = $input['isBulk'] ?? false;
    $studentsToUpdate = $input['studentsToUpdate'] ?? []; // Digunakan untuk bulk update

    $response = ['success' => false, 'message' => ''];

    if ($action === 'not_promote') {
        // Logika untuk siswa TIDAK NAIK KELAS (individual)
        if ($studentId) {
            $studentId = mysqli_real_escape_string($conn, $studentId);
            // Anda bisa menambahkan kolom di tabel siswa untuk menandai 'tidak naik kelas'
            // Contoh: UPDATE siswa SET status_naik_kelas = 'tidak_naik' WHERE id_siswa = '$studentId'
            // Untuk demo ini, kita hanya akan memprosesnya di frontend, tapi untuk data persisten perlu kolom di DB
            $response = ['success' => true, 'message' => 'Status siswa berhasil diperbarui (tidak naik kelas).'];
        } else {
            $response['message'] = 'ID Siswa tidak valid.';
        }
    } elseif ($action === 'promote') {
        if ($isBulk) {
            // Logika untuk KENAIKAN KELAS MASSAL
            $updatedCount = 0;
            $failedUpdates = [];

            foreach ($studentsToUpdate as $student) {
                $sId = mysqli_real_escape_string($conn, $student['id']);
                $currentClass = mysqli_real_escape_string($conn, $student['class']);
                
                $newClass = null;
                $newStatus = null;

                if ($currentClass == 12) {
                    $newStatus = 'lulus'; // Siswa kelas 12 lulus
                    $newClass = null; // Atau Anda bisa set ke 'Lulus' jika ada kolom teks
                } else {
                    $newClass = (int)$currentClass + 1; // Naik kelas
                    $newStatus = 'naik_kelas'; // Status naik kelas
                }

                $update_query = "";
                if ($newStatus === 'lulus') {
                    // Jika lulus, mungkin pindahkan ke tabel 'lulusan' atau update status di tabel 'siswa'
                    // Contoh: UPDATE siswa SET kelas = 'Lulus', status_aktif = 'nonaktif' WHERE id_siswa = '$sId'
                    $update_query = "UPDATE siswa SET status_siswa = 'lulus' WHERE id_siswa = '$sId'";
                } else {
                    $update_query = "UPDATE siswa SET kelas = '$newClass', status_siswa = 'naik_kelas' WHERE id_siswa = '$sId'";
                }
                
                if (mysqli_query($conn, $update_query)) {
                    $updatedCount++;
                } else {
                    $failedUpdates[] = $student['name'] . ' (' . mysqli_error($conn) . ')';
                }
            }

            if ($updatedCount > 0) {
                $response['success'] = true;
                $response['message'] = "$updatedCount siswa berhasil diproses. " . (count($failedUpdates) > 0 ? "Beberapa gagal: " . implode(', ', $failedUpdates) : "");
            } else {
                $response['message'] = 'Tidak ada siswa yang diperbarui atau semua gagal: ' . implode(', ', $failedUpdates);
            }

        } else {
            // Logika untuk NAIK KELAS INDIVIDUAL
            if ($studentId && $class) {
                $studentId = mysqli_real_escape_string($conn, $studentId);
                $class = mysqli_real_escape_string($conn, $class);

                $newClass = null;
                $newStatus = null;

                if ($class == 12) {
                    $newStatus = 'lulus'; // Siswa kelas 12 lulus
                    $newClass = null; // Atau Anda bisa set ke 'Lulus' jika ada kolom teks
                } else {
                    $newClass = (int)$class + 1; // Naik kelas
                    $newStatus = 'naik_kelas';
                }

                $update_query = "";
                if ($newStatus === 'lulus') {
                    // Update status siswa menjadi 'lulus'
                    $update_query = "UPDATE siswa SET status_siswa = 'lulus' WHERE id_siswa = '$studentId'";
                } else {
                    // Update kelas siswa
                    $update_query = "UPDATE siswa SET kelas = '$newClass', status_siswa = 'naik_kelas' WHERE id_siswa = '$studentId'";
                }

                if (mysqli_query($conn, $update_query)) {
                    $response = ['success' => true, 'message' => 'Status siswa berhasil diperbarui (naik kelas).', 'new_class' => $newClass, 'new_status' => $newStatus];
                } else {
                    $response['message'] = 'Gagal memperbarui status siswa: ' . mysqli_error($conn);
                }
            } else {
                $response['message'] = 'ID Siswa atau Kelas tidak valid.';
            }
        }
    } else {
        $response['message'] = 'Aksi tidak valid.';
    }

    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'message' => 'Metode request tidak diizinkan.']);
}

mysqli_close($conn);
?>