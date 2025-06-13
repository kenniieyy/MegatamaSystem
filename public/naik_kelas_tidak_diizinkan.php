<?php

include "config/config.php";

session_start();


// Cek apakah user sudah login sebagai guru
if (empty($_SESSION['guru_id']) || empty($_SESSION['nama_guru'])) {
    // Redirect ke halaman login jika belum login
    header("Location: login.html");
    exit();
}
$id_guru = $_SESSION['guru_id'];


$query_guru = mysqli_query($conn, "SELECT * FROM guru WHERE id_guru = '$id_guru'");
$profil_guru = mysqli_fetch_assoc($query_guru);

$nama = $_SESSION['nama_guru'];
$foto = "1.png";

if (!empty($profil_guru) && !empty($profil_guru['foto_profil'])) {
    $file_path = 'img/guru/' . $profil_guru['foto_profil'];
    if (file_exists($file_path)) {
        $foto = htmlspecialchars($profil_guru['foto_profil']);
    }
}


?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kenaikan Kelas-Yayasan Megatama Jambi</title>
    <link rel="stylesheet" href="css/final.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
</head>

<body class="font-poppins mode-2">
    <!-- Mobile overlay -->
    <div id="overlay" class="overlay"></div>

    <!-- Sidebar -->
    <div id="sidebar" class="sidebar text-white flex flex-col">
        <!-- Logo -->
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

        <!-- Menu -->
        <div class="p-3">
            <p class="text-xs text-blue-300 mb-2 logo-text">Menu</p>
            <nav class="space-y-1">
                <a href="dashboard_guru.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
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
                    class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="menu-text">Riwayat Presensi</span>
                </a>
                <a href="presensi_siswa.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <span class="menu-text">Presensi Siswa</span>
                </a>
                <a href="naik_kelas.php" class="menu-item active px-3 py-2 text-sm font-medium rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <span class="menu-text">Kenaikan Kelas</span>
                </a>
                <a href="settings_guru.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
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

        <!-- Logout at bottom -->
        <div class="mt-auto p-3 border-t border-blue-800">
            <a href="login.html" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
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
    <!-- Main Content -->
    <div id="main-content" class="main-content">
        <!-- Top Navigation -->
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
                    <h1 class="ml-3 text-lg font-semibold text-gray-800">Kenaikan Kelas</h1>
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

        <!-- Page Content -->
        <div id="content-container">
            <!-- Content will be dynamically loaded here -->
        </div>
    </div>

    <!-- Modal Konfirmasi -->
    <div id="confirmation-modal" class="modal-overlay-naik-kelas">
        <div class="modal-container-naik-kelas">
            <div class="modal-header-naik-kelas">
                <h3 class="modal-title-naik-kelas">Konfirmasi Kenaikan Kelas</h3>
                <button class="modal-close-naik-kelas" onclick="closeModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="modal-body-naik-kelas">
                <p id="modal-message-naik-kelas" class="text-gray-600 text-center mb-2"></p>
                <p id="modal-submessage-naik-kelas" class="text-sm text-gray-500 text-center"></p>
            </div>
            <div class="modal-footer-naik-kelas">
                <button onclick="closeModal()"
                    class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                    Batal
                </button>
                <button id="confirm-action" class="btn-gradient">
                    Konfirmasi
                </button>
            </div>
        </div>
    </div>
     <!-- Toast Notification -->
    <div id="toast-notification" class="fixed top-4 right-4 z-50 toast-enter toast-transition">
        <div class="bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm">
            <div class="flex items-center">
                <div id="toast-icon" class="mr-3"></div>
                <div class="flex-1">
                    <h4 id="toast-title" class="font-semibold text-gray-800"></h4>
                    <p id="toast-message" class="text-sm text-gray-600"></p>
                </div>
                <button id="toast-close" class="ml-2 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>

    <script src="js/naik_kelas_tidak_diizinkan.js"></script>
</body>

</html>