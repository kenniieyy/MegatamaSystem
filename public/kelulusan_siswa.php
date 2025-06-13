<?php

include "config/config.php";

session_start();

// Cek apakah user sudah login
if (!isset($_SESSION['guru_id'])) {
    header("Location: login.html");
    exit();
}

$id_guru = $_SESSION['guru_id'];
$is_wali_kelas = false; // Flag to determine if the teacher is a homeroom teacher

// 1. Get id_bidang from guru_bidang_tugas based on id_guru
$id_bidang_query = mysqli_query($conn, "SELECT id_bidang FROM guru_bidang_tugas WHERE id_guru = '$id_guru'");

if ($id_bidang_query && mysqli_num_rows($id_bidang_query) > 0) {
    $id_bidang_row = mysqli_fetch_assoc($id_bidang_query);
    $id_bidang_wali = $id_bidang_row['id_bidang'];

    // 2. Use id_bidang to get nama_bidang from bidang_tugas table
    $nama_bidang_query = mysqli_query($conn, "SELECT nama_bidang FROM bidang_tugas WHERE id_bidang = '$id_bidang_wali'");
    if ($nama_bidang_query && mysqli_num_rows($nama_bidang_query) > 0) {
        $nama_bidang_row = mysqli_fetch_assoc($nama_bidang_query);
        $nama_bidang = $nama_bidang_row['nama_bidang'];

        // 3. Check if the nama_bidang indicates a homeroom teacher
        if (strpos($nama_bidang, 'Wali Kelas') !== false) {
            $is_wali_kelas = true; // Set flag to true if it's a homeroom teacher
        }
    }
}

// If the teacher is NOT a homeroom teacher, redirect to the "not allowed" page
if (!$is_wali_kelas) {
    header("Location: naik_kelas_tidak_diizinkan.php");
    exit();
}


include "layout/header.php";

?>

<!-- Page Content -->
<main class="p-4 bg-pattern">
    <!-- Tabel Data Siswa -->
    <div class="card mb-4">
        <div class="card-header flex flex-col md:flex-row md:items-center justify-between gap-3">
            <h3 class="text-base font-medium text-gray-700">Tabel Data Kelulusan Siswa</h3>
            <div class="flex flex-wrap gap-2">
                <!-- Promote All Button -->
                <button id="btn-promote-all" class="btn-success flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                    Luluskan Semua Siswa
                </button>
                <!-- Export Button -->
                <button id="btn-export-pdf" class="btn-gradient flex items-center">
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
                <table id="attendance-table" class="w-full">
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
            <h3 class="modal-title-naik-kelas">Konfirmasi Kelulusan</h3>
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
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="js/kelulusan_siswa.js"></script>
</body>

</html>