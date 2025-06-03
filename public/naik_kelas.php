<?php 

session_start();

include "config/config.php";

// Cek apakah user sudah login
if (!isset($_SESSION['guru_id'])) {
    header("Location: login.html");
    exit();
}

$id_guru = $_SESSION['guru_id'];

$query_guru = mysqli_query($conn, "SELECT * FROM guru WHERE id_guru = '$id_guru'");
$profil_guru = mysqli_fetch_assoc($query_guru);

$nama = $_SESSION['nama_guru'];

if (!empty($profil_guru) && !empty($profil_guru['foto_profil'])) {
    $file_path = 'img/guru/' . $profil_guru['foto_profil'];
    if (file_exists($file_path)) {
        $foto = htmlspecialchars($profil_guru['foto_profil']);
    }
}


include "layout/header.php" 

?>

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
        <main class="p-4 bg-pattern">
            <!-- Tabel Data Siswa -->
            <div class="card mb-4">
                <div class="card-header flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h3 class="text-base font-medium text-gray-700">Tabel Data Kenaikan Kelas</h3>
                    <div class="flex flex-wrap gap-2">
                        <!-- Promote All Button -->
                        <button id="btn-promote-all" class="btn-success flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            Naikkan Semua Siswa
                        </button>
                        <!-- Export Button -->
                        <button id="btn-export-data" class="btn-gradient flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Data
                        </button>
                    </div>
                </div>
                <div class="p-3">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="table-header text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th class="px-4 py-3 text-left">No</th>
                                    <th class="px-4 py-3 text-left">Nama Lengkap</th>
                                    <th class="px-4 py-3 text-left">Jenis Kelamin</th>
                                    <th class="px-4 py-3 text-left">NIS</th>
                                    <th class="px-4 py-3 text-left">Kelas</th>
                                    <th class="px-4 py-3 text-left">No HP</th>
                                    <th class="px-4 py-3 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="student-data" class="bg-white divide-y divide-gray-200 text-sm">
                                <!-- Data diisi oleh JavaScript -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between mt-4">
                        <div id="pagination-info" class="text-sm text-gray-500">
                            Menampilkan 1-10 dari 30 data
                        </div>
                        <div class="flex items-center space-x-1">
                            <button id="prev-page" class="pagination-item text-gray-500" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div id="pagination-numbers" class="flex items-center space-x-1">
                                <!-- Nomor pagination akan diisi oleh JavaScript -->
                            </div>
                            <button id="next-page" class="pagination-item text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
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
    <script src="js/naik_kelas.js"></script>
</body>

</html>