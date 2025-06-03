// Data siswa untuk setiap kelas
let classData = {};
fetch('proses/get_siswa.php')
    .then(response => response.json())
    .then(data => {
        console.log('Data dari database:', data);

        // Simpan ke variabel global
        classData = data;


        // Contoh akses data kelas 7
        const siswaKelas7 = data['7'];
        siswaKelas7.forEach(siswa => {
            console.log(`${siswa.name} (${siswa.gender})`);
        });

        // Sekarang kamu bisa pakai data ini seperti classData sebelumnya
    })
    .catch(error => {
        console.error('Gagal mengambil data siswa:', error);
    });

function loadStudentList(kelas) {
    const siswaKelas = classData[kelas];
    const studentList = document.getElementById('student-list');
    studentList.innerHTML = '';

    if (!siswaKelas || siswaKelas.length === 0) {
        studentList.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500">Tidak ada data siswa</td></tr>';
        console.error('Kelas belum dipilih atau data kelas tidak ditemukan:', kelas);
        return;
    }

    siswaKelas.forEach((siswa, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', siswa.id);
        row.className = 'table-row'; // Tambahkan class ini jika diperlukan untuk styling
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${siswa.name}</td>
            <td>${siswa.gender}</td>
            <td>
                <div class="flex flex-wrap">
                    <div class="radio-container hadir mr-4">
                        <input type="radio" id="hadir-${siswa.id}" name="attendance-${siswa.id}" value="hadir">
                        <label for="hadir-${siswa.id}">
                            <div class="radio-circle"></div>
                            <span>Hadir</span>
                        </label>
                    </div>
                    <div class="radio-container sakit mr-4">
                        <input type="radio" id="sakit-${siswa.id}" name="attendance-${siswa.id}" value="sakit">
                        <label for="sakit-${siswa.id}">
                            <div class="radio-circle"></div>
                            <span>Sakit</span>
                        </label>
                    </div>
                    <div class="radio-container izin mr-4">
                        <input type="radio" id="izin-${siswa.id}" name="attendance-${siswa.id}" value="izin">
                        <label for="izin-${siswa.id}">
                            <div class="radio-circle"></div>
                            <span>Izin</span>
                        </label>
                    </div>
                    <div class="radio-container alpa">
                        <input type="radio" id="alpa-${siswa.id}" name="attendance-${siswa.id}" value="alpa">
                        <label for="alpa-${siswa.id}">
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

// Hapus fungsi renderStudentList yang sebelumnya ada

// Variabel untuk menyimpan kelas yang dipilih
let selectedClass = '7'; // Default to class 7

// Variabel untuk menyimpan data riwayat presensi
let attendanceHistory = [];

// Variabel untuk pagination
let currentPage = 1;
const itemsPerPage = 5;

// Fungsi untuk mengatur sidebar
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

// Fungsi untuk mengatur tab
function initializeTabs() {
    const tabClasses = document.getElementById('tab-classes');
    const tabHistory = document.getElementById('tab-history');
    const contentClasses = document.getElementById('content-classes');
    const contentFormPresensi = document.getElementById('content-form-presensi');
    const contentAttendance = document.getElementById('content-attendance');
    const contentHistory = document.getElementById('content-history');
    const contentSuccess = document.getElementById('content-success');

    // Tab Daftar Kelas
    tabClasses.addEventListener('click', function () {
        tabClasses.classList.add('active');
        tabHistory.classList.remove('active');
        contentClasses.classList.add('active');
        contentFormPresensi.classList.remove('active');
        contentAttendance.classList.remove('active');
        contentHistory.classList.remove('active');
        contentSuccess.classList.remove('active');
    });

    // Tab Riwayat Presensi
    tabHistory.addEventListener('click', async function () {
        tabHistory.classList.add('active');
        tabClasses.classList.remove('active');
        contentHistory.classList.add('active');
        contentClasses.classList.remove('active');
        contentFormPresensi.classList.remove('active');
        contentAttendance.classList.remove('active');
        contentSuccess.classList.remove('active');

        // Load riwayat presensi
        await loadAttendanceHistory();
    });

}

function initializeClassSelection() {
    const classCards = document.querySelectorAll('.class-card');

    classCards.forEach(card => {
        const kelas = card.dataset.class;

        card.addEventListener('click', function () {
            // Hapus class 'selected' dari semua class-card yang aktif sebelumnya
            document.querySelectorAll('.class-card').forEach(c => {
                c.classList.remove('selected');
            });
            // Tambahkan class 'selected' ke class-card yang diklik
            this.classList.add('selected');

            selectedClass = kelas;

            // Tampilkan form presensi
            document.getElementById('content-classes').classList.remove('active');
            document.getElementById('content-form-presensi').classList.add('active');

            // Update tampilan nama kelas
            document.getElementById('class-name-display').textContent = `Kelas ${selectedClass}`;
            document.getElementById('class-name-display-2').textContent = `Kelas ${selectedClass}`;

            // Tampilkan tanggal
            setCurrentDate();

            // Load daftar siswa sesuai kelas (ini akan membuat radio button sekarang)
            loadStudentList(selectedClass);
        });
    });
}




// Fungsi untuk mengatur tanggal saat ini
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    document.getElementById('date').value = formattedDate;
}

// Fungsi untuk mengatur navigasi antar section
function initializeNavigation() {
    // Tombol untuk navigasi
    const backToClasses = document.getElementById('back-to-classes');
    const nextToAttendance = document.getElementById('next-to-attendance');
    const backToForm = document.getElementById('back-to-form');
    const saveAttendance = document.getElementById('save-attendance');
    const newAttendance = document.getElementById('new-attendance');
    const viewHistory = document.getElementById('view-history');

    // Navigasi dari form presensi ke daftar kelas
    backToClasses.addEventListener('click', function () {
        document.getElementById('content-form-presensi').classList.remove('active');
        document.getElementById('content-classes').classList.add('active');
    });

    // Navigasi dari form presensi ke daftar siswa
    nextToAttendance.addEventListener('click', function () {
        // Validasi form
        const form = document.getElementById('attendance-info-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        document.getElementById('content-form-presensi').classList.remove('active');
        document.getElementById('content-attendance').classList.add('active');

        // Tampilkan nama kelas yang dipilih
        document.getElementById('class-name-display-2').textContent = `Kelas ${selectedClass}`;

        // Tampilkan informasi presensi
        const date = new Date(document.getElementById('date').value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const startTime = document.getElementById('start-time').value;
        const endTime = document.getElementById('end-time').value;

        document.getElementById('attendance-info-display').textContent = `${date} (${startTime} - ${endTime})`;

        // renderStudentList() tidak perlu dipanggil lagi di sini,
        // karena loadStudentList sudah dipanggil saat kelas dipilih.
    });
    // Navigasi dari daftar siswa ke form presensi
    backToForm.addEventListener('click', function () {
        document.getElementById('content-attendance').classList.remove('active');
        document.getElementById('content-form-presensi').classList.add('active');
    });

    // Pastikan hanya ada satu event listener untuk saveAttendance
    document.getElementById("save-attendance").addEventListener("click", function () {
        // Validasi presensi sebelum menyimpan
        const allStudentsChecked = validateAttendance();
        if (!allStudentsChecked) {
            alert('Silakan isi keterangan untuk semua siswa.');
            return;
        }

        // Panggil fungsi untuk menyimpan data (yang juga akan mengirim ke PHP)
        saveAttendanceDataAndToServer(); // Nama fungsi baru
    });

    // Fungsi untuk menyimpan data presensi dan mengirim ke server
    async function saveAttendanceDataAndToServer() {
        const attendanceData = {
            id: Date.now(), // Gunakan timestamp sebagai ID unik
            class: selectedClass,
            date: document.getElementById('date').value,
            startTime: document.getElementById('start-time').value,
            endTime: document.getElementById('end-time').value,
            createdAt: new Date(),
            students: []
        };

        // Ambil data kehadiran siswa dari radio button
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

        // Kirim data ke server (proses/presensi_siswa.php)
        try {
            const response = await fetch("proses/presensi_siswa.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    kelas: attendanceData.class,
                    tanggal: attendanceData.date,
                    jam_mulai: attendanceData.startTime,
                    jam_selesai: attendanceData.endTime,
                    kehadiran: attendanceData.students.reduce((acc, student) => {
                        acc[student.id] = student.status;
                        return acc;
                    }, {}) // Ubah array students menjadi objek sesuai format PHP
                })
            });
            // Jika berhasil disimpan ke server, baru simpan ke riwayat lokal dan tampilkan pesan sukses
            attendanceHistory.unshift(attendanceData);
            localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));

            console.log('Data presensi yang disimpan:', attendanceData);

            // Tampilkan pesan sukses dan alihkan tampilan
            document.getElementById('content-attendance').classList.remove('active');
            document.getElementById('content-success').classList.add('active');

        } catch (error) {
            console.error("Error saat menyimpan presensi:", error);
            alert("Gagal menyimpan presensi. Silakan coba lagi.");
        }
    }

    // Presensi baru
    newAttendance.addEventListener('click', function () {
        document.getElementById('content-success').classList.remove('active');
        document.getElementById('content-classes').classList.add('active');

        // Reset form
        document.getElementById('attendance-info-form').reset();

        // Set tanggal hari ini lagi
        setCurrentDate();
    });

    // Lihat riwayat presensi
    viewHistory.addEventListener('click', function () {
        document.getElementById('content-success').classList.remove('active');
        document.getElementById('content-history').classList.add('active');
        document.getElementById('tab-classes').classList.remove('active');
        document.getElementById('tab-history').classList.add('active');

        // Load riwayat presensi
        loadAttendanceHistory();
    });
}


// Fungsi untuk validasi presensi
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

// Fungsi untuk menyimpan data presensi
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

// Fungsi untuk memuat data riwayat presensi langsung dari database
async function loadAttendanceHistory() {
    try {
        // Lakukan fetch ke endpoint PHP yang mengambil data riwayat presensi dari database
        // Anda perlu memastikan 'proses/get_attendance_history.php' mengembalikan array data presensi lengkap.
        // Jika Anda memodifikasi 'proses/get_absen_siswa.php' untuk tujuan ini, ganti URL di bawah.
        const response = await fetch('proses/get_riwayat_siswa.php'); // <-- Ganti dengan endpoint PHP Anda untuk riwayat presensi

        if (!response.ok) {
            throw new Error(`Gagal mengambil data riwayat presensi. Status: ${response.status}`);
        }

        const historyData = await response.json(); // Asumsikan endpoint mengembalikan JSON

        // Tetapkan data yang diambil dari database ke variabel global attendanceHistory
        attendanceHistory = historyData;

        // Panggil fungsi untuk memfilter dan menampilkan riwayat presensi
        filterAttendanceHistory();

    } catch (error) {
        console.error('Error saat memuat riwayat presensi dari database:', error);
        // Opsional: Tampilkan pesan error di UI atau sebagai console.error
        // alert('Gagal memuat riwayat presensi dari database. Memuat dari penyimpanan lokal jika tersedia.');

        // Fallback ke localStorage jika terjadi error saat fetch dari database
        const savedHistory = localStorage.getItem('attendanceHistory');
        if (savedHistory) {
            attendanceHistory = JSON.parse(savedHistory);
            console.log('Memuat riwayat dari localStorage sebagai fallback.');
            filterAttendanceHistory();
        } else {
            attendanceHistory = []; // Pastikan array kosong jika tidak ada data dari DB atau localStorage
            console.log('Tidak ada riwayat presensi yang ditemukan di database atau localStorage.');
            filterAttendanceHistory(); // Render tampilan kosong
        }
    }
}



async function generateDummyHistoryFromDatabase() {
    const response = await fetch('proses/get_absen_siswa.php');
    const students = await response.json();

    const dummyHistory = [];
    const dates = [];

    for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date);
    }

    for (let i = 0; i < 10; i++) {
        const date = dates[i];

        const attendanceData = {
            id: Date.now() - i * 86400000,
            class: '7',
            date: date.toISOString().split('T')[0],
            startTime: '07:30',
            endTime: '09:00',
            createdAt: date,
            students: []
        };

        students.forEach(student => {
            const randomIndex = Math.floor(Math.random() * 10);
            let status;

            if (randomIndex < 7) {
                status = 'hadir';
            } else if (randomIndex < 8) {
                status = 'sakit';
            } else if (randomIndex < 9) {
                status = 'izin';
            } else {
                status = 'alpa';
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

// Contoh pemakaian:
generateDummyHistoryFromDatabase().then(data => {
    console.log(data); // Lihat hasil dummy yang dibuat dari data database
});


// Fungsi untuk mengatur filter riwayat presensi
function initializeHistoryFilter() {
    const monthFilter = document.getElementById('month-filter');
    const applyFilter = document.getElementById('apply-filter');

    // Set bulan saat ini sebagai default
    const currentMonth = new Date().getMonth() + 1;
    monthFilter.value = currentMonth.toString();

    applyFilter.addEventListener('click', function () {
        filterAttendanceHistory();
    });
}

// Fungsi untuk memfilter data riwayat presensi
function filterAttendanceHistory() {
    const monthFilter = document.getElementById('month-filter').value;

    // Filter berdasarkan bulan
    let filteredData = [...attendanceHistory];
    if (monthFilter !== 'all') {
        const monthIndex = parseInt(monthFilter) - 1;

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

// Fungsi untuk menampilkan data riwayat presensi
function renderAttendanceHistory(data) {
    const historyTable = document.getElementById('attendance-history');
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

// Fungsi untuk mengupdate pagination
function updatePagination(totalItems) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Update info pagination
    document.getElementById('pagination-info').textContent = totalItems === 0
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

// Fungsi untuk menginisialisasi aksi pada tombol lihat dan edit
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

// Fungsi untuk membuka modal lihat presensi
function openViewModal(id) {
    const modal = document.getElementById('view-modal');
    const closeBtn = document.getElementById('close-view-modal');
    const closeViewBtn = document.getElementById('close-view-btn');

    const attendanceData = attendanceHistory.find(item => item.id.toString() === id);
    if (!attendanceData) {
        alert('Data presensi tidak ditemukan.');
        return;
    }

    document.getElementById('view-class-name').textContent = `Kelas ${attendanceData.class}`;

    const itemDate = new Date(attendanceData.date);
    const formattedDate = itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('view-info-display').textContent = `${formattedDate} (${attendanceData.startTime} - ${attendanceData.endTime})`;

    const studentList = document.getElementById('view-student-list');
    studentList.innerHTML = '';

    attendanceData.students.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.nama_siswa || '-'}</td>
            <td>${student.jenis_kelamin || '-'}</td>
            <td><span class="status-badge ${student.status}">${capitalizeFirstLetter(student.status)}</span></td>
        `;
        studentList.appendChild(row);
    });

    modal.style.display = 'block';

    closeBtn.onclick = () => modal.style.display = 'none';
    closeViewBtn.onclick = () => modal.style.display = 'none';

    window.onclick = (event) => {
        if (event.target === modal) modal.style.display = 'none';
    };
}


// Fungsi untuk membuka modal edit presensi
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
    modal.setAttribute('data-id', id);

    // Tampilkan informasi presensi
    document.getElementById('edit-class-name').textContent = `Kelas ${attendanceData.class}`;

    // Format tanggal
    const itemDate = new Date(attendanceData.date);
    const formattedDate = itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('edit-info-display').textContent = `${formattedDate} (${attendanceData.startTime} - ${attendanceData.endTime})`;

    // Tampilkan daftar siswa
    const studentList = document.getElementById('edit-student-list');
    studentList.innerHTML = '';

    attendanceData.students.forEach((student, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${student.nama_siswa}</td>
                    <td>${student.jenis_kelamin}</td>
                    <td>
                        <div class="flex flex-wrap">
                            <div class="radio-container hadir mr-4">
                                <input type="radio" id="edit-hadir-${student.id_siswa}" name="edit-attendance-${student.id_siswa}" value="hadir" ${student.status === 'hadir' ? 'checked' : ''}>
                                <label for="edit-hadir-${student.id_siswa}">
                                    <div class="radio-circle"></div>
                                    <span>Hadir</span>
                                </label>
                            </div>
                            <div class="radio-container sakit mr-4">
                                <input type="radio" id="edit-sakit-${student.id_siswa}" name="edit-attendance-${student.id_siswa}" value="sakit" ${student.status === 'sakit' ? 'checked' : ''}>
                                <label for="edit-sakit-${student.id_siswa}">
                                    <div class="radio-circle"></div>
                                    <span>Sakit</span>
                                </label>
                            </div>
                            <div class="radio-container izin mr-4">
                                <input type="radio" id="edit-izin-${student.id_siswa}" name="edit-attendance-${student.id_siswa}" value="izin" ${student.status === 'izin' ? 'checked' : ''}>
                                <label for="edit-izin-${student.id_siswa}">
                                    <div class="radio-circle"></div>
                                    <span>Izin</span>
                                </label>
                            </div>
                            <div class="radio-container alpa">
                                <input type="radio" id="edit-alpa-${student.id_siswa}" name="edit-attendance-${student.id_siswa}" value="alpa" ${student.status === 'alpa' ? 'checked' : ''}>
                                <label for="edit-alpa-${student.id_siswa}">
                                    <div class="radio-circle"></div>
                                    <span>Alpa</span>
                                </label>
                            </div>
                        </div>
                    </td>
                `;

        studentList.appendChild(row);
    });

    // Tampilkan modal
    modal.style.display = 'block';

    // Tutup modal saat mengklik tombol close
    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    cancelBtn.onclick = function () {
        modal.style.display = 'none';
    };

    // Simpan perubahan
    saveBtn.onclick = function () {
        saveEditedAttendance(id);
        modal.style.display = 'none';
    };

    // Tutup modal saat mengklik di luar modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function saveEditedAttendance(id) {
    // Cari data presensi berdasarkan ID
    const index = attendanceHistory.findIndex(item => item.id.toString() === id);

    if (index === -1) {
        alert('Data presensi tidak ditemukan.');
        return;
    }

    const attendanceData = attendanceHistory[index];

    // Ambil status terbaru dari form edit
    const updatedStudents = attendanceData.students.map(student => {
        const studentId = student.id_siswa;
        const selectedStatus = document.querySelector(`input[name="edit-attendance-${studentId}"]:checked`);
        return {
            id_siswa: studentId,
            status: selectedStatus ? selectedStatus.value : student.status
        };
    });

    // Kirim ke server pakai fetch POST
    fetch('proses/update_absen_siswa.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_presensi: attendanceData.id,
            students: updatedStudents
        })
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert('Data presensi berhasil diperbarui.');

                // Update lokal
                attendanceData.students.forEach(student => {
                    const updated = updatedStudents.find(s => s.id_siswa === student.id_siswa);
                    if (updated) student.status = updated.status;
                });

                attendanceHistory[index] = attendanceData;
                localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));
                filterAttendanceHistory(); // Refresh tampilan

            } else {
                alert('Gagal memperbarui presensi di server.');
            }
        })
        .catch(error => {
            console.error('Gagal mengirim data ke server:', error);
            alert('Terjadi kesalahan saat mengirim data.');
        });
}


// Fungsi untuk mengkapitalisasi huruf pertama
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Jalankan saat halaman dimuat
window.addEventListener('load', () => {
    initializeSidebar();
    initializeTabs();
    initializeClassSelection();
    initializeNavigation();
    initializeHistoryFilter();

    // Set tanggal hari ini sebagai default
    setCurrentDate();
});