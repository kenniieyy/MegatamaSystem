// Simulasi peran pengguna - ubah ini untuk menguji skenario yang berbeda
const currentUser = {
    name: 'Olivia Putri',
    role: 'teacher', // 'homeroom_teacher' or 'teacher'
    class: null, // Only for homeroom teachers
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
};

// Data siswa untuk setiap kelas
const classData = {
    '7': [
        { id: 1, name: 'Ahmad Fauzi', gender: 'L' },
        { id: 2, name: 'Anisa Putri', gender: 'P' },
        { id: 3, name: 'Budi Santoso', gender: 'L' },
        { id: 4, name: 'Citra Dewi', gender: 'P' },
        { id: 5, name: 'Deni Kurniawan', gender: 'L' },
        { id: 6, name: 'Eka Fitriani', gender: 'P' },
        { id: 7, name: 'Fajar Ramadhan', gender: 'L' },
        { id: 8, name: 'Gita Nuraini', gender: 'P' },
        { id: 9, name: 'Hadi Prasetyo', gender: 'L' },
        { id: 10, name: 'Indah Permata', gender: 'P' }
    ],
    '8': [
        { id: 1, name: 'Joko Widodo', gender: 'L' },
        { id: 2, name: 'Kartika Sari', gender: 'P' },
        { id: 3, name: 'Lukman Hakim', gender: 'L' },
        { id: 4, name: 'Mira Lestari', gender: 'P' },
        { id: 5, name: 'Nanda Pratama', gender: 'L' },
        { id: 6, name: 'Olivia Putri', gender: 'P' },
        { id: 7, name: 'Putra Wijaya', gender: 'L' },
        { id: 8, name: 'Qori Amalia', gender: 'P' },
        { id: 9, name: 'Rendi Saputra', gender: 'L' },
        { id: 10, name: 'Sinta Dewi', gender: 'P' }
    ],
    '9': [
        { id: 1, name: 'Tono Sucipto', gender: 'L' },
        { id: 2, name: 'Umi Kalsum', gender: 'P' },
        { id: 3, name: 'Vino Bastian', gender: 'L' },
        { id: 4, name: 'Wati Susilawati', gender: 'P' },
        { id: 5, name: 'Xaverius Andi', gender: 'L' },
        { id: 6, name: 'Yanti Komalasari', gender: 'P' },
        { id: 7, name: 'Zaki Firmansyah', gender: 'L' },
        { id: 8, name: 'Amelia Zahra', gender: 'P' },
        { id: 9, name: 'Bayu Segara', gender: 'L' },
        { id: 10, name: 'Cinta Laura', gender: 'P' }
    ],
    '10': [
        { id: 1, name: 'Dimas Anggara', gender: 'L' },
        { id: 2, name: 'Erni Wijayanti', gender: 'P' },
        { id: 3, name: 'Faisal Rahman', gender: 'L' },
        { id: 4, name: 'Gina Salsabila', gender: 'P' },
        { id: 5, name: 'Hendra Gunawan', gender: 'L' },
        { id: 6, name: 'Intan Permatasari', gender: 'P' },
        { id: 7, name: 'Joni Iskandar', gender: 'L' },
        { id: 8, name: 'Kirana Dewi', gender: 'P' },
        { id: 9, name: 'Lutfi Halimawan', gender: 'L' },
        { id: 10, name: 'Mawar Melati', gender: 'P' }
    ],
    '11': [
        { id: 1, name: 'Naufal Hidayat', gender: 'L' },
        { id: 2, name: 'Oktavia Ramadhani', gender: 'P' },
        { id: 3, name: 'Pandu Wibowo', gender: 'L' },
        { id: 4, name: 'Qonita Alya', gender: 'P' },
        { id: 5, name: 'Rizki Ramadhan', gender: 'L' },
        { id: 6, name: 'Sari Indah', gender: 'P' },
        { id: 7, name: 'Tegar Perkasa', gender: 'L' },
        { id: 8, name: 'Umi Fadilah', gender: 'P' },
        { id: 9, name: 'Vino Bastian', gender: 'L' },
        { id: 10, name: 'Wulan Guritno', gender: 'P' }
    ],
    '12': [
        { id: 1, name: 'Xaverius Andi', gender: 'L' },
        { id: 2, name: 'Yuliana Sari', gender: 'P' },
        { id: 3, name: 'Zaki Ahmad', gender: 'L' },
        { id: 4, name: 'Anita Permata', gender: 'P' },
        { id: 5, name: 'Bima Sakti', gender: 'L' },
        { id: 6, name: 'Citra Kirana', gender: 'P' },
        { id: 7, name: 'Dodi Sudrajat', gender: 'L' },
        { id: 8, name: 'Eka Putri', gender: 'P' },
        { id: 9, name: 'Farhan Syahputra', gender: 'L' },
        { id: 10, name: 'Gita Gutawa', gender: 'P' }
    ]
};

// Variabel untuk menyimpan kelas yang dipilih
let selectedClass = '7'; // Default to class 7

// Variabel untuk menyimpan data riwayat presensi
let attendanceHistory = [];

// Variabel untuk pagination
let currentPage = 1;
const itemsPerPage = 5;

// Toggle sidebar
function initializeSidebar() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');

    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('mobile-open');
        mainContent.classList.toggle('expanded');
        overlay.classList.toggle('show');
    });

    // Close sidebar when clicking on overlay
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
    });
}

// Render pesan akses ditolak
function renderAccessDenied() {
    const container = document.getElementById('content-container');
    container.innerHTML = `
                <div class="access-denied-container">
                    <div class="access-denied">
                        <div class="access-denied-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h2>Akses Terbatas</h2>
                        <p>
                            Saat ini Anda tidak terdaftar sebagai <strong>Wali Kelas</strong> dalam sistem.<br>
                            Oleh karena itu, Anda tidak memiliki akses untuk melihat maupun menginput data kehadiran siswa.
                        </p>
                    </div>
                </div>
            `;
}

// Membuat sistem absensi (untuk guru wali kelas)
function renderAttendanceSystem() {
    const container = document.getElementById('content-container');
    container.innerHTML = `
                <div class="p-4">
                    <div class="max-w-6xl mx-auto">
                        
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
                                        <!-- Kelas 7 (Active) -->
                                        <div class="class-card card p-4 flex flex-col items-center selected" data-class="7">
                                            <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-base font-medium text-gray-800">Kelas 7</h4>
                                            <p class="text-sm text-gray-500 mt-1">10 Siswa</p>
                                        </div>
                                        
                                        <!-- Kelas 8 (Disabled) -->
                                        <div class="class-card card p-4 flex flex-col items-center disabled" data-class="8">
                                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-base font-medium text-gray-500">Kelas 8</h4>
                                            <p class="text-sm text-gray-400 mt-1">10 Siswa</p>
                                        </div>
                                        
                                        <!-- Kelas 9 (Disabled) -->
                                        <div class="class-card card p-4 flex flex-col items-center disabled" data-class="9">
                                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-base font-medium text-gray-500">Kelas 9</h4>
                                            <p class="text-sm text-gray-400 mt-1">10 Siswa</p>
                                        </div>
                                        
                                        <!-- Kelas 10 (Disabled) -->
                                        <div class="class-card card p-4 flex flex-col items-center disabled" data-class="10">
                                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-base font-medium text-gray-500">Kelas 10</h4>
                                            <p class="text-sm text-gray-400 mt-1">10 Siswa</p>
                                        </div>
                                        
                                        <!-- Kelas 11 (Disabled) -->
                                        <div class="class-card card p-4 flex flex-col items-center disabled" data-class="11">
                                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-base font-medium text-gray-500">Kelas 11</h4>
                                            <p class="text-sm text-gray-400 mt-1">10 Siswa</p>
                                        </div>
                                        
                                        <!-- Kelas 12 (Disabled) -->
                                        <div class="class-card card p-4 flex flex-col items-center disabled" data-class="12">
                                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                                </svg>
                                            </div>
                                            <h4 class="text-base font-medium text-gray-500">Kelas 12</h4>
                                            <p class="text-sm text-gray-400 mt-1">10 Siswa</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tab Content: Form Presensi (Muncul setelah kelas dipilih) -->
                        <div id="content-form-presensi" class="tab-content">
                            <div class="card mb-4">
                                <div class="card-header">
                                    <h3 class="text-lg font-medium text-gray-800">Informasi Presensi <span id="class-name-display" class="text-blue-600"></span></h3>
                                    <p class="text-sm text-gray-500 mt-1">Silakan isi informasi presensi untuk kelas yang dipilih</p>
                                </div>
                                <div class="p-6">
                                    <form id="attendance-info-form">
                                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <!-- Tanggal (Readonly, default hari ini) -->
                                            <div class="form-group">
                                                <label for="date" class="form-label">Tanggal</label>
                                                <input type="date" id="date" name="date" class="form-input bg-gray-100" readonly>
                                            </div>
                                            
                                            <!-- Waktu Mulai -->
                                            <div class="form-group">
                                                <label for="start-time" class="form-label">Waktu Mulai</label>
                                                <input type="time" id="start-time" name="start-time" class="form-input" required>
                                            </div>
                                            
                                            <!-- Waktu Selesai -->
                                            <div class="form-group">
                                                <label for="end-time" class="form-label">Waktu Selesai</label>
                                                <input type="time" id="end-time" name="end-time" class="form-input" required>
                                            </div>
                                        </div>
                                    </form>
                                    
                                    <div class="flex justify-between mt-4">
                                        <button id="back-to-classes" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
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
                                    <h3 class="text-lg font-medium text-gray-800">Presensi Siswa <span id="class-name-display-2" class="text-blue-600"></span></h3>
                                    <p class="text-sm text-gray-500 mt-1">Silakan isi kehadiran untuk setiap siswa</p>
                                </div>
                                <div class="p-6">
                                    <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                                        <div class="flex">
                                            <div class="flex-shrink-0">
                                                <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
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
                                        <button id="back-to-form" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
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
                                            <label for="month-filter" class="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
                                            <select id="month-filter" class="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
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
                                    <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 class="text-xl font-medium text-gray-800 mb-2">Presensi Berhasil Disimpan!</h3>
                                    <p class="text-gray-600 mb-6">Data presensi siswa telah berhasil disimpan dan dapat dilihat di Riwayat Presensi Siswa.</p>
                                    
                                    <div class="flex justify-center space-x-4">
                                        <button id="new-attendance" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
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
                </div>
                
                <!-- Modal Lihat Presensi -->
                <div id="view-modal" class="modal-riwayat-presensi-siswa">
                    <div class="modal-content-riwayat-presensi-siswa">
                        <div class="modal-header-riwayat-presensi-siswa">
                            <h3 class="text-lg font-medium text-gray-800">Detail Presensi <span id="view-class-name" class="text-blue-600"></span></h3>
                            <span class="close" id="close-view-modal">&times;</span>
                        </div>
                        <div class="modal-body-riwayat-presensi-siswa">
                            <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
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
                            <button id="close-view-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Modal Edit Presensi -->
                <div id="edit-modal" class="modal-riwayat-presensi-siswa">
                    <div class="modal-content-riwayat-presensi-siswa">
                        <div class="modal-header-riwayat-presensi-siswa">
                            <h3 class="text-lg font-medium text-gray-800">Edit Presensi <span id="edit-class-name" class="text-blue-600"></span></h3>
                            <span class="close" id="close-edit-modal">&times;</span>
                        </div>
                        <div class="modal-body-riwayat-presensi-siswa">
                            <div class="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
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
                            <button id="cancel-edit-btn" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                Batal
                            </button>
                            <button id="save-edit-btn" class="btn-gradient">
                                Simpan Perubahan
                            </button>
                        </div>
                    </div>
                </div>
            `;

    // Inisialisasi fungsi sistem kehadiran
    initializeAttendanceSystem();
}

// Inisialisasi fungsi sistem kehadiran
function initializeAttendanceSystem() {
    // Tetapkan tanggal saat ini
    setCurrentDate();

    // Inisialisasi tab
    initializeTabs();

    // Inisialisasi pemilihan kelas
    initializeClassSelection();

    // Inisialisasi navigasi
    initializeNavigation();

    // Inisialisasi filter riwayat
    initializeHistoryFilter();
}

// Tetapkan tanggal saat ini
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = formattedDate;
    }
}

// Inisialisasi tab
function initializeTabs() {
    const tabClasses = document.getElementById('tab-classes');
    const tabHistory = document.getElementById('tab-history');
    const contentClasses = document.getElementById('content-classes');
    const contentFormPresensi = document.getElementById('content-form-presensi');
    const contentAttendance = document.getElementById('content-attendance');
    const contentHistory = document.getElementById('content-history');
    const contentSuccess = document.getElementById('content-success');

    // Tab Daftar Kelas
    if (tabClasses) {
        tabClasses.addEventListener('click', function () {
            tabClasses.classList.add('active');
            if (tabHistory) tabHistory.classList.remove('active');
            if (contentClasses) contentClasses.classList.add('active');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentHistory) contentHistory.classList.remove('active');
            if (contentSuccess) contentSuccess.classList.remove('active');
        });
    }

    // Tab Riwayat Presensi
    if (tabHistory) {
        tabHistory.addEventListener('click', function () {
            tabHistory.classList.add('active');
            if (tabClasses) tabClasses.classList.remove('active');
            if (contentHistory) contentHistory.classList.add('active');
            if (contentClasses) contentClasses.classList.remove('active');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentSuccess) contentSuccess.classList.remove('active');

            // Load riwayat presensi
            loadAttendanceHistory();
        });
    }
}

// Inisialisasi pemilihan kelas
function initializeClassSelection() {
    const classCards = document.querySelectorAll('.class-card');

    // Hanya izinkan Kelas 7 untuk dapat diklik
    const class7Card = document.querySelector('.class-card[data-class="7"]');
    if (class7Card) {
        class7Card.addEventListener('click', function () {
            // Mengatur kelas yang dipilih
            selectedClass = '7';

            // Tampilkan formulir kehadiran
            const contentClasses = document.getElementById('content-classes');
            const contentFormPresensi = document.getElementById('content-form-presensi');
            if (contentClasses) contentClasses.classList.remove('active');
            if (contentFormPresensi) contentFormPresensi.classList.add('active');

            // Menampilkan nama kelas yang dipilih
            const classNameDisplay = document.getElementById('class-name-display');
            if (classNameDisplay) {
                classNameDisplay.textContent = `Kelas ${selectedClass}`;
            }

            // Tetapkan tanggal saat ini
            setCurrentDate();
        });
    }
}

// Initialize navigation
function initializeNavigation() {
    // Tombol untuk navigasi
    const backToClasses = document.getElementById('back-to-classes');
    const nextToAttendance = document.getElementById('next-to-attendance');
    const backToForm = document.getElementById('back-to-form');
    const saveAttendance = document.getElementById('save-attendance');
    const newAttendance = document.getElementById('new-attendance');
    const viewHistory = document.getElementById('view-history');

    // Navigasi dari form presensi ke daftar kelas
    if (backToClasses) {
        backToClasses.addEventListener('click', function () {
            const contentFormPresensi = document.getElementById('content-form-presensi');
            const contentClasses = document.getElementById('content-classes');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentClasses) contentClasses.classList.add('active');
        });
    }

    // Navigasi dari form presensi ke daftar siswa
    if (nextToAttendance) {
        nextToAttendance.addEventListener('click', function () {
            // Validasi form
            const form = document.getElementById('attendance-info-form');
            if (form && !form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const contentFormPresensi = document.getElementById('content-form-presensi');
            const contentAttendance = document.getElementById('content-attendance');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentAttendance) contentAttendance.classList.add('active');

            // Tampilkan nama kelas yang dipilih
            const classNameDisplay2 = document.getElementById('class-name-display-2');
            if (classNameDisplay2) {
                classNameDisplay2.textContent = `Kelas ${selectedClass}`;
            }

            // Tampilkan informasi presensi
            const dateInput = document.getElementById('date');
            const startTimeInput = document.getElementById('start-time');
            const endTimeInput = document.getElementById('end-time');
            const attendanceInfoDisplay = document.getElementById('attendance-info-display');

            if (dateInput && startTimeInput && endTimeInput && attendanceInfoDisplay) {
                const date = new Date(dateInput.value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                attendanceInfoDisplay.textContent = `${date} (${startTimeInput.value} - ${endTimeInput.value})`;
            }

            // Tampilkan daftar siswa
            renderStudentList();
        });
    }

    // Navigasi dari daftar siswa ke form presensi
    if (backToForm) {
        backToForm.addEventListener('click', function () {
            const contentAttendance = document.getElementById('content-attendance');
            const contentFormPresensi = document.getElementById('content-form-presensi');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentFormPresensi) contentFormPresensi.classList.add('active');
        });
    }

    // Simpan presensi
    if (saveAttendance) {
        saveAttendance.addEventListener('click', function () {
            // Validasi presensi
            const allStudentsChecked = validateAttendance();
            if (!allStudentsChecked) {
                alert('Silakan isi keterangan untuk semua siswa.');
                return;
            }

            // Simpan data presensi
            saveAttendanceData();

            // Tampilkan pesan sukses
            const contentAttendance = document.getElementById('content-attendance');
            const contentSuccess = document.getElementById('content-success');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentSuccess) contentSuccess.classList.add('active');
        });
    }

    // Presensi baru
    if (newAttendance) {
        newAttendance.addEventListener('click', function () {
            const contentSuccess = document.getElementById('content-success');
            const contentClasses = document.getElementById('content-classes');
            if (contentSuccess) contentSuccess.classList.remove('active');
            if (contentClasses) contentClasses.classList.add('active');

            // Reset form
            const form = document.getElementById('attendance-info-form');
            if (form) form.reset();

            // Set tanggal hari ini lagi
            setCurrentDate();
        });
    }

    // Lihat riwayat presensi
    if (viewHistory) {
        viewHistory.addEventListener('click', function () {
            const contentSuccess = document.getElementById('content-success');
            const contentHistory = document.getElementById('content-history');
            const tabClasses = document.getElementById('tab-classes');
            const tabHistory = document.getElementById('tab-history');

            if (contentSuccess) contentSuccess.classList.remove('active');
            if (contentHistory) contentHistory.classList.add('active');
            if (tabClasses) tabClasses.classList.remove('active');
            if (tabHistory) tabHistory.classList.add('active');

            // Load riwayat presensi
            loadAttendanceHistory();
        });
    }
}

// Render daftar siswa
function renderStudentList() {
    const studentList = document.getElementById('student-list');
    if (!studentList) return;

    studentList.innerHTML = '';

    // Ambil data siswa berdasarkan kelas yang dipilih
    const students = classData[selectedClass];

    // Tampilkan daftar siswa
    students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${student.name}</td>
                    <td>${student.gender}</td>
                    <td>
                        <div class="flex flex-wrap">
                            <div class="radio-container hadir mr-4">
                                <input type="radio" id="hadir-${student.id}" name="attendance-${student.id}" value="hadir">
                                <label for="hadir-${student.id}">
                                    <div class="radio-circle"></div>
                                    <span>Hadir</span>
                                </label>
                            </div>
                            <div class="radio-container sakit mr-4">
                                <input type="radio" id="sakit-${student.id}" name="attendance-${student.id}" value="sakit">
                                <label for="sakit-${student.id}">
                                    <div class="radio-circle"></div>
                                    <span>Sakit</span>
                                </label>
                            </div>
                            <div class="radio-container izin mr-4">
                                <input type="radio" id="izin-${student.id}" name="attendance-${student.id}" value="izin">
                                <label for="izin-${student.id}">
                                    <div class="radio-circle"></div>
                                    <span>Izin</span>
                                </label>
                            </div>
                            <div class="radio-container alpa">
                                <input type="radio" id="alpa-${student.id}" name="attendance-${student.id}" value="alpa">
                                <label for="alpa-${student.id}">
                                    <div class="radio-circle"></div>
                                    <span>Alpa</span>
                                </label>
                            </div>
                        </div>
                    </td>
                `;

        studentList.appendChild(row);
    });
}

// Validasi kehadiran
function validateAttendance() {
    const students = classData[selectedClass];
    let allChecked = true;

    students.forEach(student => {
        const radioName = `attendance-${student.id}`;
        const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);

        if (!checkedRadio) {
            allChecked = false;
        }
    });

    return allChecked;
}

// Validasi kehadiran
function saveAttendanceData() {
    const attendanceData = {
        id: Date.now(), // Gunakan timestamp sebagai ID unik
        class: selectedClass,
        date: document.getElementById('date').value,
        startTime: document.getElementById('start-time').value,
        endTime: document.getElementById('end-time').value,
        createdAt: new Date(),
        students: []
    };

    // Ambil data kehadiran siswa
    const students = classData[selectedClass];
    students.forEach(student => {
        const radioName = `attendance-${student.id}`;
        const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);

        if (checkedRadio) {
            attendanceData.students.push({
                id: student.id,
                name: student.name,
                gender: student.gender,
                status: checkedRadio.value
            });
        }
    });

    // Simpan data presensi ke riwayat
    attendanceHistory.unshift(attendanceData);

    // Simpan ke localStorage (dalam aplikasi nyata, ini akan dikirim ke server)
    localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));

    console.log('Data presensi yang disimpan:', attendanceData);
}

// Load attendance history
function loadAttendanceHistory() {
    // Dalam aplikasi nyata, ini akan mengambil data dari server
    // Untuk demo menggunakan data dummy
    const savedHistory = localStorage.getItem('attendanceHistory');

    if (savedHistory) {
        attendanceHistory = JSON.parse(savedHistory);
    } else if (attendanceHistory.length === 0) {
        // Jika tidak ada data di localStorage dan array kosong, gunakan data dummy
        attendanceHistory = generateDummyHistory();
    }

    // Filter data berdasarkan filter yang dipilih
    filterAttendanceHistory();
}

// Generate dummy history
function generateDummyHistory() {
    const dummyHistory = [];

    // Tanggal untuk 10 hari terakhir
    const dates = [];
    for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date);
    }

    // Buat 10 data dummy
    for (let i = 0; i < 10; i++) {
        const date = dates[i];

        const attendanceData = {
            id: Date.now() - i * 86400000, // Timestamp unik untuk setiap data
            class: '7', // selalu class 7
            date: date.toISOString().split('T')[0],
            startTime: '07:30',
            endTime: '09:00',
            createdAt: date,
            students: []
        };

        // Tambahkan data siswa
        const students = classData['7'];
        students.forEach(student => {
            // Acak status kehadiran
            const statuses = ['hadir', 'sakit', 'izin', 'alpa'];
            const randomIndex = Math.floor(Math.random() * 10);
            let status;

            if (randomIndex < 7) {
                status = 'hadir'; // 70% hadir
            } else if (randomIndex < 8) {
                status = 'sakit'; // 10% sakit
            } else if (randomIndex < 9) {
                status = 'izin'; // 10% izin
            } else {
                status = 'alpa'; // 10% alpa
            }

            attendanceData.students.push({
                id: student.id,
                name: student.name,
                gender: student.gender,
                status: status
            });
        });

        dummyHistory.push(attendanceData);
    }

    return dummyHistory;
}

// Inisialisasi filter riwayat
function initializeHistoryFilter() {
    const monthFilter = document.getElementById('month-filter');
    const applyFilter = document.getElementById('apply-filter');

    // Set bulan saat ini sebagai default
    if (monthFilter) {
        const currentMonth = new Date().getMonth() + 1;
        monthFilter.value = currentMonth.toString();
    }

    if (applyFilter) {
        applyFilter.addEventListener('click', function () {
            filterAttendanceHistory();
        });
    }
}

// Filter riwayat kehadiran
function filterAttendanceHistory() {
    const monthFilter = document.getElementById('month-filter');
    if (!monthFilter) return;

    const monthValue = monthFilter.value;

    // Filter berdasarkan bulan
    let filteredData = [...attendanceHistory];
    if (monthValue !== 'all') {
        const monthIndex = parseInt(monthValue) - 1;

        filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.getMonth() === monthIndex;
        });
    }

    // Reset pagination ke halaman pertama
    currentPage = 1;

    // Render data yang sudah difilter
    renderAttendanceHistory(filteredData);
}

// Render attendance history
function renderAttendanceHistory(data) {
    const historyTable = document.getElementById('attendance-history');
    if (!historyTable) return;

    historyTable.innerHTML = '';

    // Jika tidak ada data
    if (data.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td colspan="4" class="text-center py-4 text-gray-500">Tidak ada data yang ditemukan</td>
                `;
        historyTable.appendChild(row);

        // Update pagination
        updatePagination(0);
        return;
    }

    // Hitung batas waktu untuk edit (1 minggu)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Hitung data untuk halaman saat ini
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    const currentPageData = data.slice(startIndex, endIndex);

    // Tampilkan data
    currentPageData.forEach(item => {
        const row = document.createElement('tr');

        // Format tanggal
        const itemDate = new Date(item.date);
        const formattedDate = itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        // Cek apakah data masih bisa diedit (kurang dari 1 minggu)
        const canEdit = new Date(item.createdAt) > oneWeekAgo;

        row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${item.startTime} - ${item.endTime}</td>
                    <td>
                        <span class="badge success">Selesai</span>
                    </td>
                    <td>
                        <div class="flex space-x-2">
                            <button class="view-attendance px-2 py-1 text-blue-600 hover:text-blue-800" data-id="${item.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </button>
                            ${canEdit ? `
                            <button class="edit-attendance px-2 py-1 text-green-600 hover:text-green-800" data-id="${item.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            ` : `
                            <button class="edit-attendance px-2 py-1 text-gray-400 cursor-not-allowed" disabled title="Tidak dapat diedit (lebih dari 1 minggu)">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </button>
                            `}
                        </div>
                    </td>
                `;

        historyTable.appendChild(row);
    });

    // Update pagination
    updatePagination(data.length);

    // Tambahkan event listener untuk tombol lihat dan edit
    initializeAttendanceActions();
}

// Update pagination
function updatePagination(totalItems) {
    const paginationContainer = document.getElementById('pagination-container');
    const paginationInfo = document.getElementById('pagination-info');

    if (!paginationContainer || !paginationInfo) return;

    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Update info pagination
    paginationInfo.textContent = totalItems === 0
        ? 'Tidak ada data'
        : `Menampilkan ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} dari ${totalItems} data`;

    // Jika tidak ada data, tidak perlu menampilkan pagination
    if (totalItems === 0) {
        return;
    }

    // Tombol Previous
    const prevButton = document.createElement('button');
    prevButton.className = `pagination-item text-gray-500 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`;
    prevButton.disabled = currentPage === 1;
    prevButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            `;

    if (currentPage > 1) {
        prevButton.addEventListener('click', function () {
            currentPage--;
            filterAttendanceHistory();
        });
    }

    paginationContainer.appendChild(prevButton);

    // Tombol halaman
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-item ${i === currentPage ? 'active' : 'text-gray-700'}`;
        pageButton.textContent = i;

        pageButton.addEventListener('click', function () {
            currentPage = i;
            filterAttendanceHistory();
        });

        paginationContainer.appendChild(pageButton);
    }

    // Tombol Next
    const nextButton = document.createElement('button');
    nextButton.className = `pagination-item text-gray-500 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`;
    nextButton.disabled = currentPage === totalPages;
    nextButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            `;

    if (currentPage < totalPages) {
        nextButton.addEventListener('click', function () {
            currentPage++;
            filterAttendanceHistory();
        });
    }

    paginationContainer.appendChild(nextButton);
}

// Inisialisasi tindakan kehadiran
function initializeAttendanceActions() {
    // Tombol lihat
    document.querySelectorAll('.view-attendance').forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            openViewModal(id);
        });
    });

    // Tombol edit
    document.querySelectorAll('.edit-attendance:not([disabled])').forEach(button => {
        button.addEventListener('click', function () {
            const id = this.getAttribute('data-id');
            openEditModal(id);
        });
    });
}

// Buka tampilan modal
function openViewModal(id) {
    const modal = document.getElementById('view-modal');
    const closeBtn = document.getElementById('close-view-modal');
    const closeViewBtn = document.getElementById('close-view-btn');

    // Cari data presensi berdasarkan ID
    const attendanceData = attendanceHistory.find(item => item.id.toString() === id);

    if (!attendanceData) {
        alert('Data presensi tidak ditemukan.');
        return;
    }

    // Tampilkan informasi presensi
    const viewClassName = document.getElementById('view-class-name');
    if (viewClassName) {
        viewClassName.textContent = `Kelas ${attendanceData.class}`;
    }

    // Format tanggal
    const itemDate = new Date(attendanceData.date);
    const formattedDate = itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const viewInfoDisplay = document.getElementById('view-info-display');
    if (viewInfoDisplay) {
        viewInfoDisplay.textContent = `${formattedDate} (${attendanceData.startTime} - ${attendanceData.endTime})`;
    }

    // Tampilkan daftar siswa
    const studentList = document.getElementById('view-student-list');
    if (studentList) {
        studentList.innerHTML = '';

        attendanceData.students.forEach((student, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.gender}</td>
                        <td>
                            <span class="status-badge ${student.status}">${capitalizeFirstLetter(student.status)}</span>
                        </td>
                    `;

            studentList.appendChild(row);
        });
    }

    // Tampilkan modal
    if (modal) modal.style.display = 'block';

    // Tutup modal saat mengklik tombol close
    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };
    }

    if (closeViewBtn) {
        closeViewBtn.onclick = function () {
            modal.style.display = 'none';
        };
    }

    // Tutup modal saat mengklik di luar modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Open edit modal
function openEditModal(id) {
    const modal = document.getElementById('edit-modal');
    const closeBtn = document.getElementById('close-edit-modal');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const saveBtn = document.getElementById('save-edit-btn');

    // Cari data presensi berdasarkan ID
    const attendanceData = attendanceHistory.find(item => item.id.toString() === id);

    if (!attendanceData) {
        alert('Data presensi tidak ditemukan.');
        return;
    }

    // Simpan ID untuk digunakan saat menyimpan perubahan
    if (modal) modal.setAttribute('data-id', id);

    // Tampilkan informasi presensi
    const editClassName = document.getElementById('edit-class-name');
    if (editClassName) {
        editClassName.textContent = `Kelas ${attendanceData.class}`;
    }

    // Format tanggal
    const itemDate = new Date(attendanceData.date);
    const formattedDate = itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const editInfoDisplay = document.getElementById('edit-info-display');
    if (editInfoDisplay) {
        editInfoDisplay.textContent = `${formattedDate} (${attendanceData.startTime} - ${attendanceData.endTime})`;
    }

    // Tampilkan daftar siswa
    const studentList = document.getElementById('edit-student-list');
    if (studentList) {
        studentList.innerHTML = '';

        attendanceData.students.forEach((student, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${student.name}</td>
                        <td>${student.gender}</td>
                        <td>
                            <div class="flex flex-wrap">
                                <div class="radio-container hadir mr-4">
                                    <input type="radio" id="edit-hadir-${student.id}" name="edit-attendance-${student.id}" value="hadir" ${student.status === 'hadir' ? 'checked' : ''}>
                                    <label for="edit-hadir-${student.id}">
                                        <div class="radio-circle"></div>
                                        <span>Hadir</span>
                                    </label>
                                </div>
                                <div class="radio-container sakit mr-4">
                                    <input type="radio" id="edit-sakit-${student.id}" name="edit-attendance-${student.id}" value="sakit" ${student.status === 'sakit' ? 'checked' : ''}>
                                    <label for="edit-sakit-${student.id}">
                                        <div class="radio-circle"></div>
                                        <span>Sakit</span>
                                    </label>
                                </div>
                                <div class="radio-container izin mr-4">
                                    <input type="radio" id="edit-izin-${student.id}" name="edit-attendance-${student.id}" value="izin" ${student.status === 'izin' ? 'checked' : ''}>
                                    <label for="edit-izin-${student.id}">
                                        <div class="radio-circle"></div>
                                        <span>Izin</span>
                                    </label>
                                </div>
                                <div class="radio-container alpa">
                                    <input type="radio" id="edit-alpa-${student.id}" name="edit-attendance-${student.id}" value="alpa" ${student.status === 'alpa' ? 'checked' : ''}>
                                    <label for="edit-alpa-${student.id}">
                                        <div class="radio-circle"></div>
                                        <span>Alpa</span>
                                    </label>
                                </div>
                            </div>
                        </td>
                    `;

            studentList.appendChild(row);
        });
    }

    // Tampilkan modal
    if (modal) modal.style.display = 'block';

    // Tutup modal saat mengklik tombol close
    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };
    }

    if (cancelBtn) {
        cancelBtn.onclick = function () {
            modal.style.display = 'none';
        };
    }

    // Simpan perubahan
    if (saveBtn) {
        saveBtn.onclick = function () {
            saveEditedAttendance(id);
            modal.style.display = 'none';
        };
    }

    // Tutup modal saat mengklik di luar modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Simpan kehadiran yang telah diedit
function saveEditedAttendance(id) {
    // Cari data presensi berdasarkan ID
    const index = attendanceHistory.findIndex(item => item.id.toString() === id);

    if (index === -1) {
        alert('Data presensi tidak ditemukan.');
        return;
    }

    // Ambil data presensi
    const attendanceData = attendanceHistory[index];

    // Update status kehadiran siswa
    attendanceData.students.forEach(student => {
        const radioName = `edit-attendance-${student.id}`;
        const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);

        if (checkedRadio) {
            student.status = checkedRadio.value;
        }
    });

    // Update data di array
    attendanceHistory[index] = attendanceData;

    // Simpan ke localStorage
    localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));

    // Refresh tampilan
    filterAttendanceHistory();

    // Tampilkan pesan sukses
    alert('Data presensi berhasil diperbarui.');
}

//Kapitalisasi huruf pertama
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Inisialisasi halaman berdasarkan peran pengguna
function initializePage() {
    if (currentUser.role === 'homeroom_teacher') {
        renderAttendanceSystem();
    } else {
        renderAccessDenied();
    }
}

// Jalankan saat halaman dimuat
window.addEventListener('load', () => {
    initializeSidebar();
    initializePage();
});

// Fungsi untuk mensimulasikan perubahan peran (untuk pengujian)
function changeUserRole(newRole) {
    currentUser.role = newRole;
    if (newRole === 'homeroom_teacher') {
        currentUser.class = '7A';
    } else {
        currentUser.class = null;
    }
    initializePage();
}

// Jadikan fungsi tersedia secara global untuk pengujian
window.changeUserRole = changeUserRole;