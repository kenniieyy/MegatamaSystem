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

// Toggle sidebar functionality 
function initializeSidebar() {
    const toggleBtn = document.getElementById("toggle-sidebar")
    const sidebar = document.getElementById("sidebar")
    const mainContent = document.getElementById("main-content")
    const overlay = document.getElementById("overlay")

    // Cek apakah semua element ada
    if (!toggleBtn || !sidebar || !mainContent || !overlay) {
        console.error("Beberapa element tidak ditemukan:", {
            toggleBtn: !!toggleBtn,
            sidebar: !!sidebar,
            mainContent: !!mainContent,
            overlay: !!overlay,
        })
        return
    }

    // Fungsi untuk reset semua classes dan styles
    function resetSidebarStates() {
        sidebar.classList.remove("collapsed", "mobile-open")
        overlay.classList.remove("show")
        // Reset inline styles jika ada
        sidebar.style.transform = ""
    }

    // Fungsi untuk setup desktop layout
    function setupDesktopLayout() {
        resetSidebarStates()
        // Di desktop, sidebar default terbuka dan main content menyesuaikan
        mainContent.classList.remove("expanded")
        sidebar.classList.remove("collapsed")
    }

    // Fungsi untuk setup mobile layout
    function setupMobileLayout() {
        resetSidebarStates()
        // Di mobile, sidebar default tertutup
        sidebar.classList.add("collapsed")
        mainContent.classList.add("expanded")
    }

    // Fungsi untuk membuka sidebar
    function openSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: gunakan mobile-open class
            sidebar.classList.remove("collapsed")
            sidebar.classList.add("mobile-open")
            overlay.classList.add("show")
        } else {
            // Desktop: hilangkan collapsed class
            sidebar.classList.remove("collapsed")
            mainContent.classList.remove("expanded")
        }
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: tutup dan hilangkan overlay
            sidebar.classList.add("collapsed")
            sidebar.classList.remove("mobile-open")
            overlay.classList.remove("show")
        } else {
            // Desktop: collapse sidebar dan expand main content
            sidebar.classList.add("collapsed")
            mainContent.classList.add("expanded")
        }
    }

    // Fungsi untuk cek status sidebar (terbuka/tertutup)
    function isSidebarOpen() {
        if (window.innerWidth <= 768) {
            return sidebar.classList.contains("mobile-open")
        } else {
            return !sidebar.classList.contains("collapsed")
        }
    }

    // Fungsi untuk handle responsive behavior
    function handleResponsiveLayout() {
        const currentWidth = window.innerWidth

        if (currentWidth <= 768) {
            // Switching to mobile
            setupMobileLayout()
        } else {
            // Switching to desktop
            setupDesktopLayout()
        }

        console.log(`Layout switched to: ${currentWidth <= 768 ? "Mobile" : "Desktop"} (${currentWidth}px)`)
    }

    // Toggle sidebar 
    toggleBtn.addEventListener("click", () => {
        console.log("Toggle clicked, window width:", window.innerWidth)
        console.log("Sidebar open status:", isSidebarOpen())

        if (isSidebarOpen()) {
            closeSidebar()
            console.log("Sidebar ditutup")
        } else {
            openSidebar()
            console.log("Sidebar dibuka")
        }
    })

    // Tutup sidebar saat mengklik overlay (hanya di mobile)
    overlay.addEventListener("click", () => {
        console.log("Overlay clicked - closing sidebar")
        closeSidebar()
    })

    // Handle window resize 
    let resizeTimeout
    window.addEventListener("resize", () => {
        // Debounce resize event untuk performa
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
            handleResponsiveLayout()
        }, 100)
    })

    // Initialize layout berdasarkan ukuran window saat ini
    handleResponsiveLayout()

    console.log("Responsive sidebar initialized successfully")
}

// Fungsi tambahan untuk debugging
function debugSidebar() {
    const sidebar = document.getElementById("sidebar")
    const mainContent = document.getElementById("main-content")
    const overlay = document.getElementById("overlay")

    console.log("=== SIDEBAR DEBUG INFO ===")
    console.log("Window width:", window.innerWidth)
    console.log("Device type:", window.innerWidth <= 768 ? "Mobile" : "Desktop")
    console.log("Sidebar classes:", sidebar.className)
    console.log("Main content classes:", mainContent.className)
    console.log("Overlay classes:", overlay.className)
    console.log("Sidebar computed transform:", window.getComputedStyle(sidebar).transform)
}

//LOGIC UNTUK TOAST NOTIFICATION
class ToastNotification {
    constructor() {
        this.toastElement = document.getElementById('toast-notification');
        this.toastIcon = document.getElementById('toast-icon');
        this.toastTitle = document.getElementById('toast-title');
        this.toastMessage = document.getElementById('toast-message');
        this.toastClose = document.getElementById('toast-close');
        this.toastContainer = this.toastElement.querySelector('.bg-white');

        this.isVisible = false;
        this.hideTimeout = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener untuk tombol close
        this.toastClose.addEventListener('click', () => {
            this.hide();
        });

        // Auto hide setelah 5 detik
        this.toastElement.addEventListener('transitionend', (e) => {
            if (e.target === this.toastElement && this.isVisible) {
                this.autoHide();
            }
        });
    }

    show(type, title, message) {
        // Clear timeout sebelumnya jika ada
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Set konten toast
        this.setContent(type, title, message);

        // Reset classes
        this.toastElement.classList.remove('toast-exit', 'toast-show');
        this.toastElement.classList.add('toast-enter');

        // Force reflow untuk memastikan class diterapkan
        this.toastElement.offsetHeight;

        // Tampilkan toast dengan animasi
        setTimeout(() => {
            this.toastElement.classList.remove('toast-enter');
            this.toastElement.classList.add('toast-show');
            this.isVisible = true;
        }, 10);
    }

    hide() {
        if (!this.isVisible) return;

        // Clear auto hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Sembunyikan dengan animasi
        this.toastElement.classList.remove('toast-show');
        this.toastElement.classList.add('toast-exit');
        this.isVisible = false;

        // Reset ke posisi awal setelah animasi selesai
        setTimeout(() => {
            this.toastElement.classList.remove('toast-exit');
            this.toastElement.classList.add('toast-enter');
        }, 300);
    }

    autoHide() {
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 5000); // Auto hide setelah 5 detik
    }

    setContent(type, title, message) {
        // Reset border color
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');

        // Set icon dan warna berdasarkan type
        switch (type) {
            case 'success':
                this.toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-green-500');
                break;
            case 'error':
                this.toastIcon.innerHTML = '<i class="fas fa-times-circle text-red-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-red-500');
                break;
            case 'warning':
                this.toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-yellow-500');
                break;
            case 'info':
                this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-blue-500');
                break;
            default:
                this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-gray-500');
        }

        this.toastTitle.textContent = title;
        this.toastMessage.textContent = message;
    }
}

// Inisialisasi toast notification
const toast = new ToastNotification();

// Fungsi untuk mengecek apakah sudah ada presensi untuk tanggal tertentu
function checkAttendanceExists(date, classNumber) {
    return attendanceHistory.some(item =>
        item.date === date && item.class === classNumber
    );
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
    tabHistory.addEventListener('click', function () {
        tabHistory.classList.add('active');
        tabClasses.classList.remove('active');
        contentHistory.classList.add('active');
        contentClasses.classList.remove('active');
        contentFormPresensi.classList.remove('active');
        contentAttendance.classList.remove('active');
        contentSuccess.classList.remove('active');

        // Load riwayat presensi
        loadAttendanceHistory();
    });
}

// Fungsi untuk mengatur pemilihan kelas
function initializeClassSelection() {
    const classCards = document.querySelectorAll('.class-card');

    // Only allow Class 7 to be clickable
    const class7Card = document.querySelector('.class-card[data-class="7"]');
    class7Card.addEventListener('click', function () {
        // Set the selected class
        selectedClass = '7';

        // Show the attendance form
        document.getElementById('content-classes').classList.remove('active');
        document.getElementById('content-form-presensi').classList.add('active');

        // Display the selected class name
        document.getElementById('class-name-display').textContent = `Kelas ${selectedClass}`;

        // Set current date
        setCurrentDate();
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

        // Cek apakah sudah ada presensi untuk tanggal ini
        const dateInput = document.getElementById('date');
        if (checkAttendanceExists(dateInput.value, selectedClass)) {
            toast.show('warning', 'Perhatian!', 'Presensi untuk tanggal ini sudah pernah diinput. Setiap hari hanya boleh mengisi presensi satu kali.');
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

        // Tampilkan daftar siswa
        renderStudentList();
    });

    // Navigasi dari daftar siswa ke form presensi
    backToForm.addEventListener('click', function () {
        document.getElementById('content-attendance').classList.remove('active');
        document.getElementById('content-form-presensi').classList.add('active');
    });

    // Simpan presensi
    saveAttendance.addEventListener('click', function () {
        // Validasi presensi
        const allStudentsChecked = validateAttendance();
        if (!allStudentsChecked) {
            toast.show('warning', 'Perhatian!', 'Silakan isi keterangan untuk semua siswa.');
            return;
        }

        // Simpan data presensi
        saveAttendanceData();

        // Tampilkan pesan sukses
        document.getElementById('content-attendance').classList.remove('active');
        document.getElementById('content-success').classList.add('active');
    });

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

// Fungsi untuk menampilkan daftar siswa
function renderStudentList() {
    const studentList = document.getElementById('student-list');
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

// Fungsi untuk menyimpan data presensi (TANPA TOAST NOTIFICATION)
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

    // TIDAK ADA TOAST NOTIFICATION DI SINI - hanya mengandalkan success card
}

// Fungsi untuk memuat data riwayat presensi
function loadAttendanceHistory() {
    // Dalam aplikasi nyata, ini akan mengambil data dari server
    // Untuk demo, kita akan mengambil dari localStorage atau menggunakan data dummy
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

// Fungsi untuk menghasilkan data dummy riwayat presensi
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
            class: '7', // Always class 7
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
                            <button class="edit-attendance px-2 py-1 text-orange-600 hover:text-orange-800" data-id="${item.id}">
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

    // Cari data presensi berdasarkan ID
    const attendanceData = attendanceHistory.find(item => item.id.toString() === id);

    if (!attendanceData) {
        toast.show('error', 'Error!', 'Data presensi tidak ditemukan.');
        return;
    }

    // Tampilkan informasi presensi
    document.getElementById('view-class-name').textContent = `Kelas ${attendanceData.class}`;

    // Format tanggal
    const itemDate = new Date(attendanceData.date);
    const formattedDate = itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById('view-info-display').textContent = `${formattedDate} (${attendanceData.startTime} - ${attendanceData.endTime})`;

    // Tampilkan daftar siswa
    const studentList = document.getElementById('view-student-list');
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

    // Tampilkan modal
    modal.style.display = 'block';

    // Tutup modal saat mengklik tombol close
    closeBtn.onclick = function () {
        modal.style.display = 'none';
    };

    closeViewBtn.onclick = function () {
        modal.style.display = 'none';
    };

    // Tutup modal saat mengklik di luar modal
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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
        toast.show('error', 'Error!', 'Data presensi tidak ditemukan.');
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

// Fungsi untuk menyimpan perubahan presensi (DENGAN TOAST NOTIFICATION)
function saveEditedAttendance(id) {
    // Cari data presensi berdasarkan ID
    const index = attendanceHistory.findIndex(item => item.id.toString() === id);

    if (index === -1) {
        toast.show('error', 'Error!', 'Data presensi tidak ditemukan.');
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

    // Tampilkan toast sukses
    toast.show('success', 'Berhasil!', 'Data presensi berhasil diperbarui!');
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

    // Load attendance history untuk inisialisasi data
    loadAttendanceHistory();
});