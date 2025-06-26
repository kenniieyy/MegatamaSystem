// Data siswa untuk setiap kelas
let classData = {}; // Kosongkan, akan diisi dari fetch

// Fungsi untuk mengambil data siswa dari server
function fetchClassData() {
    fetch('../src/API/get_siswa.php')
        .then(response => {
            if (!response.ok) throw new Error('Gagal mengambil data dari server.');
            return response.json();
        })
        .then(data => {
            classData = data;
            // Pastikan 'toast' object tersedia sebelum digunakan
            if (typeof toast !== 'undefined') {
            } else {
                console.log('Data siswa berhasil dimuat.');
            }
        })
        .catch(error => {
            console.error(error);
            // Pastikan 'toast' object tersedia sebelum digunakan
            if (typeof toast !== 'undefined') {
                toast.show('error', 'Gagal!', 'Tidak bisa memuat data siswa.');
            } else {
                console.error('Tidak bisa memuat data siswa.');
            }
        });
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchClassData();
    initializeSidebar();
    initializeTabs();
    initializeClassSelection();
    initializeNavigation();
    initializeHistoryFilter(); // Pastikan ini dipanggil untuk setup filter
    setCurrentDate(); // Set tanggal hari ini sebagai default
    initializeAttendanceActions();

});

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
        this.toastContainer = this.toastElement ? this.toastElement.querySelector('.bg-white') : null;

        this.isVisible = false;
        this.hideTimeout = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener untuk tombol close
        if (this.toastClose) {
            this.toastClose.addEventListener('click', () => {
                this.hide();
            });
        }

        // Auto hide setelah 5 detik
        if (this.toastElement) {
            this.toastElement.addEventListener('transitionend', (e) => {
                if (e.target === this.toastElement && this.isVisible) {
                    this.autoHide();
                }
            });
        }
    }

    show(type, title, message) {
        if (!this.toastElement || !this.toastIcon || !this.toastTitle || !this.toastMessage || !this.toastContainer) {
            console.error("Toast notification elements not found. Cannot show toast.");
            return;
        }

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
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue|gray)-500/g, '');

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
        tabHistory.addEventListener('click', async function () {
            tabHistory.classList.add('active');
            if (tabClasses) tabClasses.classList.remove('active');
            if (contentHistory) contentHistory.classList.add('active');
            if (contentClasses) contentClasses.classList.remove('active');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentSuccess) contentSuccess.classList.remove('active');

            // Load riwayat presensi
            await loadAttendanceHistory();
        });
    }
}

// Fungsi untuk mengatur pemilihan kelas
function initializeClassSelection() {
    const classCards = document.querySelectorAll('.class-card');

    classCards.forEach(card => {
        const classNumber = card.dataset.class;
        if (classNumber === userClass) {
            // Aktifkan event click untuk kelas wali
            card.addEventListener('click', function () {
                selectedClass = classNumber;
                const contentClasses = document.getElementById('content-classes');
                const contentFormPresensi = document.getElementById('content-form-presensi');
                if (contentClasses) contentClasses.classList.remove('active');
                if (contentFormPresensi) contentFormPresensi.classList.add('active');
                const classNameDisplay = document.getElementById('class-name-display');
                const classNameDisplay2 = document.getElementById('class-name-display-2');
                if (classNameDisplay) classNameDisplay.textContent = `Kelas ${selectedClass}`;
                if (classNameDisplay2) classNameDisplay2.textContent = `Kelas ${selectedClass}`;
                setCurrentDate();
                loadStudentList(selectedClass);
            });
        } else {
            card.classList.add('disabled');
        }
    });
}



// Fungsi untuk mengatur tanggal saat ini
function setCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    // Check if the element exists before trying to set its value
    const dateElement = document.getElementById('date');
    if (dateElement) {
        dateElement.value = formattedDate;
    }
}

// Fungsi untuk mengatur navigasi antar section
function initializeNavigation() {
    const backToClasses = document.getElementById('back-to-classes');
    const nextToAttendance = document.getElementById('next-to-attendance');
    const backToForm = document.getElementById('back-to-form');
    const saveAttendance = document.getElementById('save-attendance');
    const newAttendance = document.getElementById('new-attendance');
    const viewHistory = document.getElementById('view-history');

    if (backToClasses) {
        backToClasses.addEventListener('click', function () {
            const contentFormPresensi = document.getElementById('content-form-presensi');
            const contentClasses = document.getElementById('content-classes');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentClasses) contentClasses.classList.add('active');
        });
    }

    if (nextToAttendance) {
        nextToAttendance.addEventListener('click', function () {
            const form = document.getElementById('attendance-info-form');
            if (!form || !form.checkValidity()) {
                if (form) form.reportValidity();
                return;
            }

            const contentFormPresensi = document.getElementById('content-form-presensi');
            const contentAttendance = document.getElementById('content-attendance');
            if (contentFormPresensi) contentFormPresensi.classList.remove('active');
            if (contentAttendance) contentAttendance.classList.add('active');

            const classNameDisplay2 = document.getElementById('class-name-display-2');
            if (classNameDisplay2) {
                classNameDisplay2.textContent = `Kelas ${selectedClass}`;
            }

            const dateElement = document.getElementById('date');
            const startTimeElement = document.getElementById('start-time');
            const endTimeElement = document.getElementById('end-time');
            const attendanceInfoDisplay = document.getElementById('attendance-info-display');

            if (dateElement && startTimeElement && endTimeElement && attendanceInfoDisplay) {
                const date = new Date(dateElement.value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                const startTime = startTimeElement.value;
                const endTime = endTimeElement.value;
                attendanceInfoDisplay.textContent = `${date} (${startTime} - ${endTime})`;
            }
        });
    }

    if (backToForm) {
        backToForm.addEventListener('click', function () {
            const contentAttendance = document.getElementById('content-attendance');
            const contentFormPresensi = document.getElementById('content-form-presensi');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentFormPresensi) contentFormPresensi.classList.add('active');
        });
    }

    if (saveAttendance) {
        saveAttendance.addEventListener("click", function () {
            const allStudentsChecked = validateAttendance();
            if (!allStudentsChecked) {
                toast.show('error', 'Gagal!', 'Silakan isi keterangan untuk semua siswa.');
                return;
            }
            saveAttendanceDataAndToServer();
        });
    }

    async function saveAttendanceDataAndToServer() {
        const dateElement = document.getElementById('date');
        const startTimeElement = document.getElementById('start-time');
        const endTimeElement = document.getElementById('end-time');

        if (!dateElement || !startTimeElement || !endTimeElement) {
            toast.show('error', 'Error!', 'Form elements not found.');
            return;
        }

        const attendanceData = {
            id: Date.now(),
            class: selectedClass,
            date: dateElement.value,
            startTime: startTimeElement.value,
            endTime: endTimeElement.value,
            createdAt: new Date(),
            students: []
        };

        const students = classData[selectedClass];
        if (!students) {
            console.error(`No student data found for class: ${selectedClass}`);
            toast.show('error', 'Gagal!', 'Data siswa untuk kelas ini tidak ditemukan.');
            return;
        }

        students.forEach(student => {
            const radioName = `attendance-${student.id}`;
            const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);
            if (checkedRadio) {
                attendanceData.students.push({
                    nis: student.id, // Changed to id_siswa to match backend expectation
                    name: student.name,
                    gender: student.gender,
                    status: checkedRadio.value
                });
            }
        });

        try {
            const response = await fetch("../src/API/presensi_siswa.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_presensi: attendanceData.id, // Pass id_presensi as well if backend expects it for new entry
                    kelas: attendanceData.class,
                    tanggal: attendanceData.date,
                    jam_mulai: attendanceData.startTime,
                    jam_selesai: attendanceData.endTime,
                    students: attendanceData.students // Send the students array directly
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) { // Check for both HTTP status and success flag from backend
                throw new Error(result.message || "Server error saat menyimpan.");
            }

            attendanceHistory.unshift(attendanceData);
            localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));

            console.log('Data presensi yang disimpan:', attendanceData);

            const contentAttendance = document.getElementById('content-attendance');
            const contentSuccess = document.getElementById('content-success');
            if (contentAttendance) contentAttendance.classList.remove('active');
            if (contentSuccess) contentSuccess.classList.add('active');

        } catch (error) {
            console.error("Error saat menyimpan presensi:", error);
            toast.show('error', 'Gagal!', `Gagal menyimpan presensi: ${error.message}.`);
        }
    }

    if (newAttendance) {
        newAttendance.addEventListener('click', function () {
            const contentSuccess = document.getElementById('content-success');
            const contentClasses = document.getElementById('content-classes');
            if (contentSuccess) contentSuccess.classList.remove('active');
            if (contentClasses) contentClasses.classList.add('active');
            const form = document.getElementById('attendance-info-form');
            if (form) form.reset();
            setCurrentDate();
        });
    }

    if (viewHistory) {
        viewHistory.addEventListener('click', function () {
            const contentSuccess = document.getElementById('content-success');
            const contentHistory = document.getElementById('content-history');
            if (contentSuccess) contentSuccess.classList.remove('active');
            if (contentHistory) contentHistory.classList.add('active');
            const tabClasses = document.getElementById('tab-classes');
            const tabHistory = document.getElementById('tab-history');
            if (tabClasses) tabClasses.classList.remove('active');
            if (tabHistory) tabHistory.classList.add('active');
            loadAttendanceHistory();
        });
    }
}


// Fungsi untuk menampilkan daftar siswa
function loadStudentList(kelas) {
    const siswaKelas = classData[kelas];
    const studentList = document.getElementById('student-list');
    if (!studentList) {
        console.error("Element with ID 'student-list' not found.");
        return;
    }
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

// Fungsi untuk validasi presensi
function validateAttendance() {
    const students = classData[selectedClass];
    let allChecked = true;

    if (!students) return false; // Handle case where students data is not loaded

    students.forEach(student => {
        const radioName = `attendance-${student.id}`;
        const checkedRadio = document.querySelector(`input[name="${radioName}"]:checked`);

        if (!checkedRadio) {
            allChecked = false;
        }
    });

    return allChecked;
}

// Fungsi untuk menyimpan data presensi (TANPA TOAST NOTIFICATION) - kept for compatibility, but saveAttendanceDataAndToServer is preferred
function saveAttendanceData() {
    const dateElement = document.getElementById('date');
    const startTimeElement = document.getElementById('start-time');
    const endTimeElement = document.getElementById('end-time');

    if (!dateElement || !startTimeElement || !endTimeElement) {
        console.error("Form elements not found in saveAttendanceData.");
        return;
    }

    const attendanceData = {
        id: Date.now(), // Gunakan timestamp sebagai ID unik
        class: selectedClass,
        date: dateElement.value,
        startTime: startTimeElement.value,
        endTime: endTimeElement.value,
        createdAt: new Date(),
        students: []
    };

    // Ambil data kehadiran siswa
    const students = classData[selectedClass];
    if (!students) {
        console.error(`No student data found for class: ${selectedClass} in saveAttendanceData.`);
        return;
    }

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

    console.log('Data presensi yang disimpan (lokal):', attendanceData);
}

// Fungsi untuk memuat data riwayat presensi dari database
// Fungsi untuk memuat data riwayat presensi dari server, localStorage, atau dummy
async function loadAttendanceHistory() {
    try {
        const response = await fetch('../src/API/get_riwayat_siswa.php'); // Ganti sesuai endpoint PHP Anda

        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari server. Status: ${response.status}`);
        }

        const historyData = await response.json();
        attendanceHistory = historyData;
        console.log('Riwayat presensi berhasil dimuat dari server.');
    } catch (error) {
        console.warn('Gagal memuat dari server. Mencoba localStorage...', error);

        const savedHistory = localStorage.getItem('attendanceHistory');
        if (savedHistory) {
            attendanceHistory = JSON.parse(savedHistory);
            console.log('Riwayat presensi dimuat dari localStorage.');
        } else {
            console.warn('Data tidak tersedia di localStorage. Menggunakan data dummy...');
            attendanceHistory = await generateDummyHistoryFromDatabase(); // Call the async function
        }
    }

    // Panggil fungsi filter dan render
    filterAttendanceHistory();
}



// Fungsi untuk menghasilkan data dummy riwayat presensi
async function generateDummyHistoryFromDatabase() {
    try {
        const response = await fetch('../src/API/get_absen_siswa.php');
        if (!response.ok) {
            throw new Error(`Failed to fetch student absence data. Status: ${response.status}`);
        }
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
    } catch (error) {
        console.error("Error generating dummy history from database:", error);
        return []; // Return empty array on error
    }
}


// Fungsi untuk mengatur filter riwayat presensi
function initializeHistoryFilter() {
    const monthFilter = document.getElementById('month-filter');
    const applyFilter = document.getElementById('apply-filter');

    // Set bulan saat ini sebagai default
    if (monthFilter) {
        const currentMonth = new Date().getMonth() + 1;
        monthFilter.value = currentMonth.toString();

        if (applyFilter) {
            applyFilter.addEventListener('click', function () {
                filterAttendanceHistory();
            });
        }
    }
}

// Fungsi untuk memfilter data riwayat presensi
function filterAttendanceHistory() {
    const monthFilterElement = document.getElementById('month-filter');
    const monthFilter = monthFilterElement ? monthFilterElement.value : 'all'; // Default to 'all' if element not found

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
    const paginationInfo = document.getElementById('pagination-info');

    if (!paginationContainer || !paginationInfo) {
        console.error("Pagination elements not found.");
        return;
    }

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

    // Tombol halaman (simplified for brevity, a loop for page numbers would go here)
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.className = `pagination-item ${currentPage === i ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`;
        pageButton.textContent = i;
        if (currentPage !== i) {
            pageButton.addEventListener('click', function () {
                currentPage = i;
                filterAttendanceHistory();
            });
        }
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


// Fungsi untuk menampilkan detail presensi (contoh implementasi)
function displayAttendanceDetail(record) {
    // Implementasi untuk menampilkan detail presensi di modal atau halaman lain
    console.log("Menampilkan detail presensi:", record);
    // Contoh: bisa membuka modal dan mengisi detailnya
    alert(`Detail Presensi:\nKelas: ${record.class}\nTanggal: ${record.date}\nSiswa Hadir: ${record.students.filter(s => s.status === 'hadir').length}`);
}

// Fungsi untuk mengedit presensi (contoh implementasi)
function editAttendance(record) {
    console.log("Mengedit presensi:", record);
    // Contoh: mengisi form presensi dengan data yang akan diedit
    // Anda mungkin perlu membuat form terpisah atau menggunakan form yang ada dengan logika "edit mode"
    const contentHistory = document.getElementById('content-history');
    const contentFormPresensi = document.getElementById('content-form-presensi');
    if (contentHistory) contentHistory.classList.remove('active');
    if (contentFormPresensi) contentFormPresensi.classList.add('active'); // Kembali ke form presensi

    selectedClass = record.class;
    const classNameDisplay = document.getElementById('class-name-display');
    const classNameDisplay2 = document.getElementById('class-name-display-2');
    if (classNameDisplay) classNameDisplay.textContent = `Kelas ${selectedClass}`;
    if (classNameDisplay2) classNameDisplay2.textContent = `Kelas ${selectedClass}`;

    const dateElement = document.getElementById('date');
    const startTimeElement = document.getElementById('start-time');
    const endTimeElement = document.getElementById('end-time');
    if (dateElement) dateElement.value = record.date;
    if (startTimeElement) startTimeElement.value = record.startTime;
    if (endTimeElement) endTimeElement.value = record.endTime;


    loadStudentList(selectedClass); // Reload student list for the class

    // Set radio buttons based on existing attendance data
    setTimeout(() => { // Give a small delay for loadStudentList to render
        record.students.forEach(student => {
            const radio = document.querySelector(`input[name="attendance-${student.id}"][value="${student.status}"]`);
            if (radio) {
                radio.checked = true;
            }
        });
    }, 100);

    // Modify save button to call update logic instead of save
    const saveButton = document.getElementById('save-attendance');
    if (saveButton) {
        saveButton.textContent = 'Perbarui Presensi';
        saveButton.onclick = () => updateAttendanceData(record.id);
    }
}

function saveEditedAttendance(id) {
    // Cari data presensi berdasarkan ID
    const index = attendanceHistory.findIndex(item => item.id.toString() === id);

    if (index === -1) {
        toast.show('error', 'Error!', 'Data presensi tidak ditemukan.');
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
    fetch('../src/API/update_absen_siswa.php', {
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
                toast.show('success', 'Berhasil!', 'Data presensi berhasil diperbarui.');

                // Update lokal
                attendanceData.students.forEach(student => {
                    const updated = updatedStudents.find(s => s.id_siswa === student.id_siswa);
                    if (updated) student.status = updated.status;
                });

                attendanceHistory[index] = attendanceData;
                localStorage.setItem('attendanceHistory', JSON.stringify(attendanceHistory));
                filterAttendanceHistory(); // Refresh tampilan

            } else {
                 toast.show('error', 'Gagal!', 'Gagal memperbarui presensi di server.');
            }
        })
        .catch(error => {
            console.error('Gagal mengirim data ke server:', error);
            toast.show('error', 'Kesalahan!', 'Terjadi kesalahan saat mengirim data.');
        });
}

// Fungsi untuk mengkapitalisasi huruf pertama
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}