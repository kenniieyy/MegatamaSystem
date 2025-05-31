// Simulasi peran pengguna - ubah ini untuk menguji skenario yang berbeda
const currentUser = {
    name: 'Olivia Putri',
    role: 'teacher', // 'homeroom_teacher' or 'teacher'
    class: null, // Hanya untuk guru wali kelas
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
};

// Contoh data siswa kelas 7 (hanya ditampilkan untuk guru wali kelas)
const studentData = [
    { id: 1, name: 'Ahmad Fauzi', gender: 'Laki-laki', nis: '2024025', class: '7', phone: '081234567814', status: 'pending' },
    { id: 2, name: 'Anisa Putri', gender: 'Perempuan', nis: '2024001', class: '7', phone: '081234567890', status: 'pending' },
    { id: 3, name: 'Budi Santoso', gender: 'Laki-laki', nis: '2024006', class: '7', phone: '081234567895', status: 'pending' },
    { id: 4, name: 'Citra Dewi', gender: 'Perempuan', nis: '2024015', class: '7', phone: '081234567804', status: 'pending' },
    { id: 5, name: 'Deni Kurniawan', gender: 'Laki-laki', nis: '2024009', class: '7', phone: '081234567898', status: 'pending' },
    { id: 6, name: 'Eka Fitriani', gender: 'Perempuan', nis: '2024019', class: '7', phone: '081234567808', status: 'pending' },
    { id: 7, name: 'Fajar Ramadhan', gender: 'Laki-laki', nis: '2024003', class: '7', phone: '081234567892', status: 'pending' },
    { id: 8, name: 'Gita Nuraini', gender: 'Perempuan', nis: '2024004', class: '7', phone: '081234567893', status: 'pending' },
    { id: 9, name: 'Hadi Prasetyo', gender: 'Laki-laki', nis: '2024011', class: '7', phone: '081234567800', status: 'pending' },
    { id: 10, name: 'Indah Permata', gender: 'Perempuan', nis: '2024027', class: '7', phone: '081234567816', status: 'pending' },
];

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

    // Tutup sidebar saat mengklik overlay
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
                            Oleh karena itu, Anda tidak memiliki akses untuk mengelola data kenaikan kelas siswa.
                        </p>
                    </div>
                </div>
            `;
}

// Render tabel data siswa (untuk guru wali kelas)
function renderStudentTable() {
    const container = document.getElementById('content-container');
    container.innerHTML = `
                <div class="p-4">
                    <div class="card mb-4">
                        <div class="card-header flex flex-col md:flex-row md:items-center justify-between gap-3">
                            <h3 class="text-base font-medium text-gray-700">Data Siswa Kenaikan Kelas</h3>
                            <div class="flex flex-wrap gap-2">
                                <button id="btn-export-data" class="btn-gradient flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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
                                        <!-- Data will be populated by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    // Mengisi data siswa
    const tableBody = document.getElementById('student-data');
    studentData.forEach((student, index) => {
        const row = document.createElement('tr');
        row.className = 'table-row';

        row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${index + 1}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.name}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.gender}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.nis}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.class}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.phone}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <div class="flex space-x-2">
                            <button class="btn-success">Naik</button>
                            <button class="btn-danger">Tidak Naik</button>
                        </div>
                    </td>
                `;

        tableBody.appendChild(row);
    });

    // Tambahkan fungsi ekspor
    document.getElementById('btn-export-data').addEventListener('click', () => {
        alert('Data berhasil diekspor!');
    });
}

// Inisialisasi halaman berdasarkan peran pengguna
function initializePage() {
    if (currentUser.role === 'homeroom_teacher') {
        renderStudentTable();
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