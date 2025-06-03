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

include "layout/header.php";

?>

    <!-- Konten Utama -->
    <div id="main-content" class="main-content">
        <!-- Navigasi Atas -->
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
                    <h1 class="ml-3 text-lg font-semibold text-gray-800">Riwayat Presensi</h1>
                </div>
                <div class="flex items-center">
                    <div class="flex items-center">
                        <div class="avatar-ring">
                            <img class="h-8 w-8 rounded-full object-cover"
                                src="img/guru/<?= $foto ?>" alt="User avatar">
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-700"><?php echo ($nama) ?></span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Konten Halaman -->
        <main class="p-4 bg-pattern">
            <!-- Tabel Riwayat Presensi -->
            <div class="card mb-4">
                <div class="card-header flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h3 class="text-base font-medium text-gray-700">Tabel Riwayat Presensi</h3>
                    <div class="flex flex-wrap gap-2">
                        <!-- Filter bulan -->
                        <select id="month-filter"
                            class="border border-gray-300 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                            <option value="all" selected>Semua Bulan</option>
                            <option value="january">Januari</option>
                            <option value="february">Februari</option>
                            <option value="march">Maret</option>
                            <option value="april">April</option>
                            <option value="may">Mei</option>
                            <option value="june">Juni</option>
                            <option value="july">Juli</option>
                            <option value="august">Agustus</option>
                            <option value="september">September</option>
                            <option value="october">Oktober</option>
                            <option value="november">November</option>
                            <option value="december">Desember</option>
                        </select>
                        <!-- Tombol filter jenis absensi -->
                        <div class="flex space-x-2">
                            <button id="btn-absen-datang" class="btn-outline active px-3 py-1.5 text-sm">Absen
                                Datang</button>
                            <button id="btn-absen-pulang" class="btn-outline px-3 py-1.5 text-sm">Absen Pulang</button>
                        </div>

                        <!-- Tombol Export PDF -->
                        <button id="btn-export-pdf" class="btn-gradient flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            Export
                        </button>
                    </div>
                </div>
                <div class="p-3">
                    <div class="overflow-x-auto">
                        <!-- Tabel data presensi -->
                        <table class="w-full">
                            <thead class="table-header text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th class="px-4 py-3 text-left">Foto</th>
                                    <th class="px-4 py-3 text-left">Tanggal</th>
                                    <th class="px-4 py-3 text-left">Waktu</th>
                                    <th class="px-4 py-3 text-left">Status</th>
                                    <th class="px-4 py-3 text-left">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody id="attendance-data" class="bg-white divide-y divide-gray-200 text-sm">
                                <!-- Data akan diisi oleh JavaScript -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Kontrol Paginasi -->
                    <div class="flex items-center justify-between mt-4">
                        <div id="pagination-info" class="text-sm text-gray-500">
                            Menampilkan 1-9 dari 24 data
                        </div>
                        <div class="flex items-center space-x-1">
                            <!-- Tombol halaman sebelumnya -->
                            <button id="prev-page" class="pagination-item text-gray-500" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <!-- Nomor halaman akan diisi oleh JavaScript -->
                            <div id="pagination-numbers" class="flex items-center space-x-1">
                                <!-- Nomor halaman akan diisi oleh JavaScript -->
                            </div>
                            <!-- Tombol halaman berikutnya -->
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
    <script src="js/riwayat_presensi_guru.js"></script>
</body>

</html>