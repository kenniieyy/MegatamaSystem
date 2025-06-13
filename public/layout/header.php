<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Cek apakah user sudah login sebagai guru
if (empty($_SESSION['guru_id']) || empty($_SESSION['nama_guru']) || empty($_SESSION['nip'])) {
    // Redirect ke halaman login jika belum login
    header("Location: login.html");
    exit();
}

$nama = $_SESSION['nama_guru'];
$id_guru = $_SESSION['guru_id'];
$nip = $_SESSION['nip'];
$tanggal = date('Y-m-d');


if (!isset($_SESSION['is_wali_kelas_9_or_12'])) {
    $_SESSION['is_wali_kelas_9_or_12'] = false;

    if (isset($_SESSION['guru_id'])) {
        $id_guru = $_SESSION['guru_id'];

        // 1. Ambil id_bidang dari guru_bidang_tugas
        // Pastikan $conn sudah terdefinisi dan merupakan koneksi database yang valid
        // Contoh: $conn = mysqli_connect("localhost", "user", "password", "database");
        // Jika tidak, Anda perlu menyertakan file koneksi database Anda di sini.

        // Dummy $conn for demonstration if not already included
        if (!isset($conn)) {
            // Include your database connection file here, e.g., include 'koneksi.php';
            // For now, let's assume it's defined elsewhere or mock it for testing purposes
            // This part of the code needs a real database connection to work.
            // For the purpose of this example, we'll just skip the DB part if $conn is not set
            // and proceed with assuming is_wali_kelas_9_or_12 might be false or set by other means.
             // As the prompt doesn't provide $conn, we will assume it's correctly handled before this code block.
             // If $conn is not available, the logic below dependent on it will fail.
        }

        if (isset($conn)) {
            $id_bidang_query = mysqli_query($conn, "SELECT id_bidang FROM guru_bidang_tugas WHERE id_guru = '$id_guru'");

            if ($id_bidang_query && mysqli_num_rows($id_bidang_query) > 0) {
                $id_bidang_row = mysqli_fetch_assoc($id_bidang_query);
                $id_bidang_wali = $id_bidang_row['id_bidang'];

                // 2. Gunakan id_bidang untuk mendapatkan nama_bidang dari tabel bidang_tugas
                $nama_bidang_query = mysqli_query($conn, "SELECT nama_bidang FROM bidang_tugas WHERE id_bidang = '$id_bidang_wali'");
                if ($nama_bidang_query && mysqli_num_rows($nama_bidang_query) > 0) {
                    $nama_bidang_row = mysqli_fetch_assoc($nama_bidang_query);
                    $nama_bidang = $nama_bidang_row['nama_bidang'];

                    // 3. Ekstrak nomor kelas dari nama_bidang jika itu adalah Wali Kelas
                    if (preg_match('/Wali Kelas (\d+)/', $nama_bidang, $matches)) {
                        $assigned_class_number = (int)$matches[1];
                        if ($assigned_class_number == 9 || $assigned_class_number == 12) {
                            $_SESSION['is_wali_kelas_9_or_12'] = true;
                        }
                    }
                }
            }
        }
    }
}
$query_guru = mysqli_query($conn, "SELECT * FROM guru WHERE nip = '$nip'");
$profil_guru = mysqli_fetch_assoc($query_guru);

$foto = '1.png';

if (!empty($profil_guru) && !empty($profil_guru['foto_profil'])) {
    $file_path = 'img/guru/' . $profil_guru['foto_profil'];
    if (file_exists($file_path)) {
        $foto = htmlspecialchars($profil_guru['foto_profil']);
    }
}


$is_wali_kelas_9_or_12 = $_SESSION['is_wali_kelas_9_or_12'];
?>


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Guru-Yayasan Megatama Jambi</title>
    <link rel="stylesheet" href="css/final.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body class="font-poppins mode-2">
    <div id="overlay" class="overlay"></div>

    <?php
    $currentPage = basename($_SERVER['PHP_SELF']);  // ambil nama file

    // Tentukan judul dinamis berdasarkan halaman saat ini
    $dashboardTitle = 'Dashboard';
    switch ($currentPage) {
        case 'riwayat_presensi_guru.php':
            $dashboardTitle = 'Riwayat Presensi Guru';
            break;
        case 'presensi_siswa.php':
            $dashboardTitle = 'Presensi Siswa';
            break;
        case 'kelulusan_siswa.php':
            $dashboardTitle = 'Kelulusan Siswa';
            break;
        case 'naik_kelas.php':
            $dashboardTitle = 'Kenaikan Kelas';
            break;
        case 'settings_guru.php':
            $dashboardTitle = 'Pengaturan';
            break;
        default:
            $dashboardTitle = 'Dashboard';
            break;
    }
    ?>

    <div id="sidebar" class="sidebar text-white flex flex-col">
        <div class="flex items-center p-3 border-b border-blue-800">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                        d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <h1 class="text-base font-bold ml-3 logo-text">Yayasan Megatama</h1>
            </div>
        </div>

        <div class="p-3">
            <p class="text-xs text-blue-300 mb-2 logo-text">Menu</p>
            <nav class="space-y-1">
                <a href="dashboard_guru.php" class="menu-item px-3 py-2 text-sm font-medium rounded-md <?php echo ($currentPage == 'dashboard_guru.php') ? 'active' : 'text-blue-200'; ?>">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span class="menu-text">Dashboard</span>
                </a>
                <a href="riwayat_presensi_guru.php"
                    class="menu-item px-3 py-2 text-sm font-medium rounded-md <?php echo ($currentPage == 'riwayat_presensi_guru.php') ? 'active' : 'text-blue-200'; ?>">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="menu-text">Riwayat Presensi</span>
                </a>
                <a href="presensi_siswa.php" class="menu-item px-3 py-2 text-sm font-medium rounded-md <?php echo ($currentPage == 'presensi_siswa.php') ? 'active' : 'text-blue-200'; ?>">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span class="menu-text">Presensi Siswa</span>
                </a>

                <?php if ($is_wali_kelas_9_or_12): ?>
                    <a href="kelulusan_siswa.php" class="menu-item px-3 py-2 text-sm font-medium rounded-md <?php echo ($currentPage == 'kelulusan_siswa.php') ? 'active' : 'text-blue-200'; ?>">
                        <div class="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span class="menu-text">Kelulusan Siswa</span>
                    </a>
                <?php else: ?>
                    <a href="naik_kelas.php" class="menu-item px-3 py-2 text-sm font-medium rounded-md <?php echo ($currentPage == 'naik_kelas.php') ? 'active' : 'text-blue-200'; ?>">
                        <div class="menu-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <span class="menu-text">Kenaikan Kelas</span>
                    </a>
                <?php endif; ?>

                <a href="settings_guru.php" class="menu-item px-3 py-2 text-sm font-medium rounded-md <?php echo ($currentPage == 'settings_guru.php') ? 'active' : 'text-blue-200'; ?>">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span class="menu-text">Settings</span>
                </a>
            </nav>
        </div>

        <div class="mt-auto p-3 border-t border-blue-800">
            <a href="proses/logout.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                <div class="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <span class="menu-text">Logout</span>
            </a>
        </div>
    </div>
    <div id="main-content" class="main-content">
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-5 py-2 flex items-center justify-between">
            <div class="flex items-center">
                <button id="toggle-sidebar"
                    class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </button>
                <h1 class="ml-3 text-lg font-semibold text-gray-800"><?= $dashboardTitle ?></h1>
            </div>
            <div class="flex items-center">
                <div class="flex items-center">
                    <div class="avatar-ring">
                        <img class="h-8 w-8 rounded-full object-cover"
                            src="img/guru/<?= $foto ?>" alt="User avatar">
                    </div>
                    <span class="ml-2 text-sm font-medium text-gray-700"><?= $nama ?></span>
                </div>
            </div>
        </div>
    </header>