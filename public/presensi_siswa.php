<?php

include "config/config.php";

session_start();

// Cek apakah user sudah login
if (!isset($_SESSION['guru_id'])) {
    header("Location: login.html");
    exit();
}

$nama = $_SESSION['nama_guru'];
$id_guru = $_SESSION['guru_id'];

$query = "SELECT kelas, COUNT(*) as jumlah_siswa FROM siswa GROUP BY kelas";
$result = mysqli_query($conn, $query);

// 1. Ambil id_bidang dari guru_bidang_tugas berdasarkan id_guru
$id_bidang_query = mysqli_query($conn, "SELECT id_bidang FROM guru_bidang_tugas WHERE id_guru = '$id_guru'");
$assigned_class_number = null; // Inisialisasi
$is_wali_kelas = false; // Flag untuk menandai apakah guru ini adalah wali kelas

if ($id_bidang_query && mysqli_num_rows($id_bidang_query) > 0) {
    $id_bidang_row = mysqli_fetch_assoc($id_bidang_query);
    $id_bidang_wali = $id_bidang_row['id_bidang']; // Ini adalah id_bidang

    // 2. Gunakan id_bidang untuk mendapatkan nama_bidang dari tabel bidang_tugas
    $nama_bidang_query = mysqli_query($conn, "SELECT nama_bidang FROM bidang_tugas WHERE id_bidang = '$id_bidang_wali'");
    if ($nama_bidang_query && mysqli_num_rows($nama_bidang_query) > 0) {
        $nama_bidang_row = mysqli_fetch_assoc($nama_bidang_query);
        $nama_bidang = $nama_bidang_row['nama_bidang']; // Contoh: "Wali Kelas 8" atau "Bahasa Indonesia"

        // 3. Ekstrak nomor kelas dari nama_bidang jika itu adalah Wali Kelas
        if (preg_match('/Wali Kelas (\d+)/', $nama_bidang, $matches)) {
            $assigned_class_number = (int)$matches[1]; // Ini akan menjadi 7, 8, 9, dst.
            $is_wali_kelas = true; // Set flag menjadi true jika ditemukan sebagai wali kelas
        }
    }
}

// Jika guru bukan wali kelas, arahkan ke halaman 'tidak diizinkan'
if (!$is_wali_kelas) {
    // Karena presensi_siswa_tidak_diizinkan.html adalah halaman HTML lengkap, kita redirect.
    // Jika Anda ingin menampilkan pesan di halaman ini tanpa redirect, Anda bisa:
    // 1. Include atau tampilkan sebagian dari konten presensi_siswa_tidak_diizinkan.html
    // 2. Atau tampilkan pesan kustom PHP/HTML di sini.
    header("Location: presensi_siswa_tidak_diizinkan.php"); //
    exit();
}

// Lanjutkan dengan logika untuk Wali Kelas
$jumlah_siswa_per_kelas = [];
while ($row = mysqli_fetch_assoc($result)) {
    $jumlah_siswa_per_kelas[$row['kelas']] = $row['jumlah_siswa'];
}

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

include "layout/header.php";
?>


<!-- Page Content -->
<main class="p-0 bg-pattern" style="height: calc(100vh - 60px);">
    <div class="p-4">
        <div class="max-w-6xl mx-auto">
            <div id="content-container" class="h-full"></div>

            <!-- Tab Navigation -->
            <div class="flex mb-6 space-x-2">
                <button id="tab-classes" class="tab-button active">Daftar Kelas</button>
                <button id="tab-history" class="tab-button">Riwayat Presensi</button>
            </div>

            <!-- Tab Content: Daftar Kelas -->
            <div id="content-classes" class="tab-content active">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-gray-800">Pilih Kelas</h3>
                        <p class="text-sm text-gray-500 mt-1">Silakan pilih kelas untuk melakukan presensi siswa</p>
                    </div>
                    <div class="p-6">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <?php for ($i = 7; $i <= 12; $i++) : ?>
                                <?php
                                // Perbandingan menggunakan nomor kelas yang diekstrak
                                $class_status = ($assigned_class_number == $i) ? 'selected' : 'disabled';
                                $text_color = ($assigned_class_number == $i) ? 'text-gray-800' : 'text-gray-500';
                                $bg_color = ($assigned_class_number == $i) ? 'bg-blue-100' : 'bg-gray-100';
                                $svg_color = ($assigned_class_number == $i) ? 'text-blue-600' : 'text-gray-400';
                                ?>
                                <div class="class-card card p-4 flex flex-col items-center <?= $class_status ?>" data-class="<?= $i ?>">
                                    <div class="w-12 h-12 rounded-full <?= $bg_color ?> flex items-center justify-center mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 <?= $svg_color ?>" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                        </svg>
                                    </div>
                                    <h4 class="text-base font-medium <?= $text_color ?>">Kelas <?= $i ?></h4>
                                    <p class="text-sm <?= ($assigned_class_number == $i) ? 'text-gray-500' : 'text-gray-400' ?> mt-1"><?= isset($jumlah_siswa_per_kelas[$i]) ? $jumlah_siswa_per_kelas[$i] . " Siswa" : "0 Siswa"; ?></p>
                                </div>
                            <?php endfor; ?>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Form Presensi (Muncul setelah kelas dipilih) -->
            <div id="content-form-presensi" class="tab-content">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-gray-800">Informasi Presensi <span
                                id="class-name-display" class="text-blue-600"></span></h3>
                        <p class="text-sm text-gray-500 mt-1">Silakan isi informasi presensi untuk kelas yang
                            dipilih</p>
                    </div>
                    <div class="p-6">
                        <form id="attendance-info-form">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <!-- Tanggal (Readonly, default hari ini) -->
                                <div class="form-group">
                                    <label for="date" class="form-label">Tanggal</label>
                                    <input type="date" id="date" name="date" class="form-input bg-gray-100"
                                        readonly>
                                </div>

                                <!-- Waktu Mulai -->
                                <div class="form-group">
                                    <label for="start-time" class="form-label">Waktu Mulai</label>
                                    <input type="time" id="start-time" name="start-time" class="form-input"
                                        required>
                                </div>

                                <!-- Waktu Selesai -->
                                <div class="form-group">
                                    <label for="end-time" class="form-label">Waktu Selesai</label>
                                    <input type="time" id="end-time" name="end-time" class="form-input"
                                        required>
                                </div>
                            </div>
                        </form>

                        <div class="flex justify-between mt-4">
                            <button id="back-to-classes"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Kembali
                            </button>
                            <button id="next-to-attendance" class="btn-gradient">
                                Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Daftar Siswa untuk Presensi -->
            <div id="content-attendance" class="tab-content">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-gray-800">Presensi Siswa <span
                                id="class-name-display-2" class="text-blue-600"></span></h3>
                        <p class="text-sm text-gray-500 mt-1">Silakan isi kehadiran untuk setiap siswa</p>
                    </div>
                    <div class="p-6">
                        <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-blue-700">
                                        <span id="attendance-info-display" class="font-medium"></span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="attendance-table">
                                <thead>
                                    <tr>
                                        <th width="5%">No</th>
                                        <th width="40%">Nama Siswa</th>
                                        <th width="10%">L/P</th>
                                        <th width="45%">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody id="student-list">
                                    <!-- Data siswa akan diisi oleh JavaScript -->
                                </tbody>
                            </table>
                        </div>

                        <div class="flex justify-between mt-4">
                            <button id="back-to-form"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Kembali
                            </button>
                            <button id="save-attendance" class="btn-gradient">
                                Simpan Presensi
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tab Content: Riwayat Presensi -->
            <div id="content-history" class="tab-content">
                <div class="card mb-4">
                    <div class="card-header">
                        <h3 class="text-lg font-medium text-gray-800">Filter Riwayat Presensi</h3>
                    </div>
                    <div class="p-4">
                        <form id="filter-form" class="flex flex-wrap gap-3">
                            <div>
                                <label for="month-filter"
                                    class="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                                <select id="month-filter"
                                    class="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
                                    <option value="all">Semua Bulan</option>
                                    <option value="1">Januari</option>
                                    <option value="2">Februari</option>
                                    <option value="3">Maret</option>
                                    <option value="4">April</option>
                                    <option value="5">Mei</option>
                                    <option value="6">Juni</option>
                                    <option value="7">Juli</option>
                                    <option value="8">Agustus</option>
                                    <option value="9">September</option>
                                    <option value="10">Oktober</option>
                                    <option value="11">November</option>
                                    <option value="12">Desember</option>
                                </select>
                            </div>

                            <div class="flex items-end">
                                <button type="button" id="apply-filter" class="btn-gradient">
                                    Terapkan Filter
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <h3 class="text-lg font-medium text-gray-800">Riwayat Presensi Siswa</h3>
                    </div>
                    <div class="p-4">
                        <div class="overflow-x-auto">
                            <table class="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Tanggal</th>
                                        <th>Waktu</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="attendance-history">
                                    <!-- Data riwayat presensi akan diisi oleh JavaScript -->
                                </tbody>
                            </table>
                        </div>

                        <!-- Pagination -->
                        <div class="flex items-center justify-between mt-4">
                            <div id="pagination-info" class="text-sm text-gray-500">
                                Menampilkan 0-0 dari 0 data
                            </div>
                            <div id="pagination-container" class="flex items-center space-x-1">
                                <!-- Pagination akan diisi oleh JavaScript -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Success Message -->
            <div id="content-success" class="tab-content">
                <div class="card mb-4">
                    <div class="p-6 text-center">
                        <div
                            class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 class="text-xl font-medium text-gray-800 mb-2">Presensi Berhasil Disimpan!</h3>
                        <p class="text-gray-600 mb-6">Data presensi siswa telah berhasil disimpan dan dapat
                            dilihat di Riwayat Presensi Siswa.</p>

                        <div class="flex justify-center space-x-4">
                            <button id="new-attendance"
                                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Presensi Baru
                            </button>
                            <button id="view-history" class="btn-gradient">
                                Lihat Riwayat Presensi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</main>
</div>

<!-- Modal Lihat Presensi -->
<div id="view-modal" class="modal-riwayat-presensi-siswa">
    <div class="modal-content-riwayat-presensi-siswa">
        <div class="modal-header-riwayat-presensi-siswa">
            <h3 class="text-lg font-medium text-gray-800">Detail Presensi <span id="view-class-name"
                    class="text-blue-600"></span></h3>
            <span class="close" id="close-view-modal">&times;</span>
        </div>
        <div class="modal-body-riwayat-presensi-siswa">
            <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            <span id="view-info-display" class="font-medium"></span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th width="40%">Nama Siswa</th>
                            <th width="10%">L/P</th>
                            <th width="45%">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody id="view-student-list">
                        <!-- Data siswa akan diisi oleh JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-footer-riwayat-presensi-siswa">
            <button id="close-view-btn"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Tutup
            </button>
        </div>
    </div>
</div>

<!-- Modal Edit Presensi -->
<div id="edit-modal" class="modal-riwayat-presensi-siswa">
    <div class="modal-content-riwayat-presensi-siswa">
        <div class="modal-header-riwayat-presensi-siswa">
            <h3 class="text-lg font-medium text-gray-800">Edit Presensi <span id="edit-class-name"
                    class="text-blue-600"></span></h3>
            <span class="close" id="close-edit-modal">&times;</span>
        </div>
        <div class="modal-body-riwayat-presensi-siswa">
            <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            <span id="edit-info-display" class="font-medium"></span>
                        </p>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th width="5%">No</th>
                            <th width="40%">Nama Siswa</th>
                            <th width="10%">L/P</th>
                            <th width="45%">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody id="edit-student-list">
                        <!-- Data siswa akan diisi oleh JavaScript -->
                    </tbody>
                </table>
            </div>
        </div>
        <div class="modal-footer-riwayat-presensi-siswa">
            <button id="cancel-edit-btn"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Batal
            </button>
            <button id="save-edit-btn" class="btn-gradient">
                Simpan Perubahan
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
<script>
    const userClass = '<?php echo $assigned_class_number ?>';
</script>

<script src="js/presensi_siswa.js"></script>

</body>

</html>