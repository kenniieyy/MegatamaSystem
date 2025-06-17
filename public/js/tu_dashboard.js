// Deklarasi variabel chart secara global agar bisa diakses dan diperbarui dari berbagai fungsi
let roomChart;
let teacherDatangChart;
let teacherPulangChart;
let studentChart;

// Objek untuk menyimpan data peminjaman ruangan yang diambil dari database, dikelompokkan per bulan
let dynamicRoomDataByMonth = {};

// Pemetaan nama bulan dalam Bahasa Indonesia ke Bahasa Inggris (sesuai format data)
const bulanMapping = {
    januari: 'january',
    februari: 'february',
    maret: 'march',
    april: 'april',
    mei: 'may',
    juni: 'june',
    juli: 'july',
    agustus: 'august',
    september: 'september',
    oktober: 'october',
    november: 'november',
    desember: 'december' // Pastikan ejaan ini konsisten dengan PHP Anda
};


/**
 * Fungsi asinkron untuk mengambil data peminjaman ruangan dari server.
 * Data ini akan digunakan untuk chart peminjaman ruangan.
 */
async function fetchRoomData() {
    try {
        const response = await fetch('../src/API/get_tu_peminjaman_ruangan.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        dynamicRoomDataByMonth = await response.json();
        console.log('Fetched room data:', dynamicRoomDataByMonth);

        // Ambil nilai default dari dropdown
        const defaultMonthIndonesian = document.getElementById('room-filter').value.toLowerCase();
        const defaultMonthEnglish = bulanMapping[defaultMonthIndonesian];

        if (dynamicRoomDataByMonth[defaultMonthEnglish]) { // Gunakan mapped month
            updateRoomChart(defaultMonthEnglish);
        } else if (Object.keys(dynamicRoomDataByMonth).length > 0) {
            updateRoomChart(Object.keys(dynamicRoomDataByMonth)[0]);
        } else {
            console.warn('No room data available from the database.');
            // Kosongkan chart jika tidak ada data
            if (roomChart) { // Pastikan chart sudah diinisialisasi
                roomChart.data.labels = [];
                roomChart.data.datasets[0].data = [];
                roomChart.update();
            }
        }

    } catch (error) {
        console.error('Gagal fetch data peminjaman:', error);
    }
}

/**
 * Fungsi asinkron untuk mengambil data kehadiran guru dari server berdasarkan bulan.
 * Data ini akan digunakan untuk chart kehadiran guru.
 * @param {string} month - Nama bulan dalam Bahasa Inggris (e.g., 'january', 'february').
 */
async function fetchKehadiranGuruData(month) {
    try {
        const response = await fetch(`../src/API/get_chart_guru_tu.php?month=${encodeURIComponent(month)}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log('Fetched teacher attendance data for', month, ':', data);
        // Langsung panggil updateKehadiranCharts dengan data yang diterima
        updateKehadiranCharts(data);

    } catch (err) {
        console.error('Gagal fetch data kehadiran:', err);
        // Jika gagal fetch, panggil updateKehadiranCharts dengan data kosong
        // Agar pesan "Belum ada data" bisa ditampilkan jika totalHariKerja > 0,
        // atau "Tidak ada hari kerja" jika totalHariKerja = 0 (asumsi API memberikan totalHariKerja=0 jika error atau tidak ada data)
        // Jika API tidak mengirim totalHariKerja saat error, Anda perlu menyesuaikan ini.
        updateKehadiranCharts({
            datang: { tepat_waktu: 0, terlambat: 0, absen_tidak_dilakukan: 0 },
            pulang: { tepat_waktu: 0, terlambat: 0, absen_tidak_dilakukan: 0 },
            totalHariKerja: 0 // Pastikan ini juga diatur ke 0 jika terjadi error fetch
        });
    }
}


/**
 * Fungsi asinkron untuk mengambil data jumlah siswa dari server berdasarkan kelas.
 * Data ini akan digunakan untuk chart jumlah siswa (laki-laki/perempuan).
 * @param {string} grade - Kelas yang dipilih (e.g., 'kelas7', 'kelas8').
 */
async function fetchStudentData(grade) {
    try {
        const classNumber = grade.replace('kelas', '');
        const response = await fetch(`../src/API/get_chart_siswa.php?kelas=${encodeURIComponent(classNumber)}`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        console.log(`Fetched student data for ${grade}:`, data);
        updateStudentChart(data);
    } catch (error) {
        console.error(`Gagal fetch data siswa untuk kelas ${grade}:`, error);
        updateStudentChart({ labels: ['Laki-laki', 'Perempuan'], data: [0, 0] });
    }
}


/**
 * Fungsi untuk memperbarui chart peminjaman ruangan.
 * @param {string} month - Bulan yang datanya akan ditampilkan (dalam Bahasa Inggris).
 */
function updateRoomChart(month) {
    const data = dynamicRoomDataByMonth[month];
    if (!roomChart) {
        console.warn('Room chart belum diinisialisasi');
        return;
    }
    if (!data) {
        console.warn(`No data found for month: ${month}`);
        roomChart.data.labels = [];
        roomChart.data.datasets[0].data = [];
        roomChart.update();
        return;
    }

    roomChart.data.labels = data.labels;
    roomChart.data.datasets[0].data = data.data;
    roomChart.update();
}


/**
 * Fungsi untuk menginisialisasi fungsionalitas tab kehadiran guru.
 * Mengatur event listener untuk tombol tab.
 */
function initializeTeacherTabs() {
    const tabButtons = document.querySelectorAll('#tab-teacher-datang, #tab-teacher-pulang');
    const tabContents = document.querySelectorAll('#content-teacher-datang, #content-teacher-pulang');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            const contentId = 'content-teacher-' + button.id.split('-')[2];
            document.getElementById(contentId).classList.add('active');
        });
    });
}

/**
 * Fungsi untuk menginisialisasi event listener untuk semua dropdown filter.
 */
function initializeFilters() {
    const roomFilter = document.getElementById('room-filter');
    if (roomFilter) {
        roomFilter.addEventListener('change', function () {
            const selectedMonthIndonesian = this.value.toLowerCase();
            const mappedMonthEnglish = bulanMapping[selectedMonthIndonesian];
            console.log("Dropdown ruangan berubah jadi bulan:", selectedMonthIndonesian, "→", mappedMonthEnglish);
            updateRoomChart(mappedMonthEnglish);
            // Hapus baris ini jika Anda tidak ingin filter ruangan juga mengubah chart guru
            // fetchKehadiranGuruData(mappedMonthEnglish); 
        });
    }

    const studentFilter = document.getElementById('student-filter');
    if (studentFilter) {
        studentFilter.addEventListener('change', function () {
            const selectedGrade = this.value;
            console.log("Dropdown siswa berubah jadi kelas:", selectedGrade);
            fetchStudentData(selectedGrade);
        });
    }

    const teacherMonthFilter = document.getElementById('teacher-month-filter');
    if (teacherMonthFilter) {
        teacherMonthFilter.addEventListener('change', function () {
            const selectedMonthIndonesian = this.value.toLowerCase();
            const mappedMonthEnglish = bulanMapping[selectedMonthIndonesian];
            console.log("Dropdown guru berubah jadi bulan:", selectedMonthIndonesian, "→", mappedMonthEnglish);
            fetchKehadiranGuruData(mappedMonthEnglish);
        });
    }
}


/**
 * Fungsi untuk menginisialisasi semua objek Chart.js.
 * Mempersiapkan chart dengan data awal kosong atau default.
 */
function initializeCharts() {
    const initialRoomData = {
        labels: [],
        datasets: [{
            label: 'Jumlah Peminjaman',
            data: [],
            backgroundColor: '#3b82f6',
            borderColor: '#1e40af',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
        }]
    };

    const teacherDatangData = {
        labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                '#10B981',
                '#EF4444',
                '#F59E0B',
            ],
            borderWidth: 0
        }]
    };

    const teacherPulangData = {
        labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: [
                '#10B981',
                '#EF4444',
                '#F59E0B',
            ],
            borderWidth: 0
        }]
    };

    const initialStudentData = {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{
            data: [0, 0],
            backgroundColor: [
                '#3b82f6',
                '#ec4899'
            ],
            borderWidth: 0
        }]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 10,
                ticks: {
                    stepSize: 2,
                    font: {
                        family: 'Poppins',
                        size: 11
                    },
                    padding: 10
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 11
                    },
                    maxRotation: 45,
                    minRotation: 0
                }
            }
        },
        layout: {
            padding: {
                left: 10,
                right: 10
            }
        }
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'Poppins',
                        size: 11
                    },
                    padding: 15
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.raw;
                        const total = context.dataset.data.reduce((acc, current) => acc + current, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    roomChart = new Chart(
        document.getElementById('room-chart'),
        {
            type: 'bar',
            data: initialRoomData,
            options: barOptions
        }
    );

    teacherDatangChart = new Chart(
        document.getElementById('teacher-chart-datang'),
        {
            type: 'pie',
            data: teacherDatangData,
            options: pieOptions
        }
    );

    teacherPulangChart = new Chart(
        document.getElementById('teacher-chart-pulang'),
        {
            type: 'pie',
            data: teacherPulangData,
            options: pieOptions
        }
    );

    studentChart = new Chart(
        document.getElementById('student-chart'),
        {
            type: 'pie',
            data: initialStudentData,
            options: pieOptions
        }
    );
}

// ... (kode sebelumnya) ...

/**
 * Fungsi untuk memperbarui chart kehadiran guru (Absen Datang dan Absen Pulang).
 * @param {object} data - Objek data yang berisi data untuk chart kehadiran guru.
 */
function updateKehadiranCharts(data) {
    // Pastikan chart sudah diinisialisasi
    if (!teacherDatangChart || !teacherPulangChart) {
        console.warn('Teacher charts belum diinisialisasi.');
        return;
    }

    // Ambil referensi ke elemen canvas dan container pesan
    const datangChartCanvas = document.getElementById('teacher-chart-datang');
    const pulangChartCanvas = document.getElementById('teacher-chart-pulang');
    const datangMessageContainer = document.getElementById('no-data-message-datang');
    const pulangMessageContainer = document.getElementById('no-data-message-pulang');

    // Pastikan container pesan ada
    if (!datangMessageContainer || !pulangMessageContainer) {
        console.error("Elemen pesan 'no-data-message-datang' atau 'no-data-message-pulang' tidak ditemukan.");
        return;
    }

    // ===========================================
    // LOGIKA UNTUK CHART ABSEN DATANG
    // ===========================================
    const totalDatang = data.datang.tepat_waktu + data.datang.terlambat + data.datang.absen_tidak_dilakukan;

    if (totalDatang === 0 && data.totalHariKerja > 0) {
        // Jika tidak ada data absensi tercatat, tampilkan pesan
        datangChartCanvas.style.display = 'none'; // Sembunyikan canvas
        datangMessageContainer.style.display = 'flex'; // Tampilkan pesan
        datangMessageContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="font-size: 1.1em; color: #555;">Belum ada data kehadiran bulan ini.</p>
                <p style="font-size: 0.9em; color: #888;">Total hari kerja: ${data.totalHariKerja} hari.</p>
            </div>
        `;
    } else if (totalDatang === 0 && data.totalHariKerja === 0) {
        // Jika tidak ada data absensi dan juga tidak ada hari kerja (misal di bulan dengan hari libur semua)
        datangChartCanvas.style.display = 'none';
        datangMessageContainer.style.display = 'flex';
        datangMessageContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="font-size: 1.1em; color: #555;">Tidak ada hari kerja di bulan ini.</p>
            </div>
        `;
    }
    else {
        // Jika ada data, tampilkan chart dan sembunyikan pesan
        datangChartCanvas.style.display = 'block'; // Tampilkan canvas
        datangMessageContainer.style.display = 'none'; // Sembunyikan pesan

        teacherDatangChart.data.datasets[0].data = [
            data.datang.tepat_waktu,
            data.datang.terlambat,
            data.datang.absen_tidak_dilakukan
        ];
        teacherDatangChart.update(); // Redraw chart
    }

    // ===========================================
    // LOGIKA UNTUK CHART ABSEN PULANG
    // ===========================================
    const totalPulang = data.pulang.tepat_waktu + data.pulang.terlambat + data.pulang.absen_tidak_dilakukan;

    if (totalPulang === 0 && data.totalHariKerja > 0) {
        // Jika tidak ada data absensi tercatat, tampilkan pesan
        pulangChartCanvas.style.display = 'none'; // Sembunyikan canvas
        pulangMessageContainer.style.display = 'flex'; // Tampilkan pesan
        pulangMessageContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="font-size: 1.1em; color: #555;">Belum ada data kehadiran bulan ini.</p>
                <p style="font-size: 0.9em; color: #888;">Total hari kerja: ${data.totalHariKerja} hari.</p>
            </div>
        `;
    } else if (totalPulang === 0 && data.totalHariKerja === 0) {
        pulangChartCanvas.style.display = 'none';
        pulangMessageContainer.style.display = 'flex';
        pulangMessageContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="font-size: 1.1em; color: #555;">Tidak ada hari kerja di bulan ini.</p>
            </div>
        `;
    }
    else {
        // Jika ada data, tampilkan chart dan sembunyikan pesan
        pulangChartCanvas.style.display = 'block'; // Tampilkan canvas
        pulangMessageContainer.style.display = 'none'; // Sembunyikan pesan

        teacherPulangChart.data.datasets[0].data = [
            data.pulang.tepat_waktu,
            data.pulang.terlambat,
            data.pulang.absen_tidak_dilakukan
        ];
        teacherPulangChart.update(); // Redraw chart
    }
}

// ... (kode lainnya tetap sama) ...

/**
 * Fungsi untuk memperbarui chart jumlah siswa.
 * Fungsi ini menerima objek data langsung dari API.
 * @param {object} data - Objek data yang berisi labels dan data untuk chart siswa (e.g., { labels: [...], data: [...] }).
 */
function updateStudentChart(data) {
    if (!studentChart) {
        console.warn('Student chart belum diinisialisasi');
        return;
    }
    if (!data || !data.labels || !data.data) {
        console.warn(`Invalid student data received:`, data);
        studentChart.data.labels = [];
        studentChart.data.datasets[0].data = [];
        studentChart.update();
        return;
    }

    studentChart.data.labels = data.labels;
    studentChart.data.datasets[0].data = data.data;
    studentChart.update();
}


// Event listener yang berjalan saat seluruh halaman selesai dimuat
window.addEventListener('load', async () => {
    initializeTeacherTabs();
    initializeCharts();
    initializeFilters();

    // Pastikan elemen dropdown siswa ada sebelum mencoba mengaksesnya
    const studentFilterElement = document.getElementById('student-filter');
    if (studentFilterElement) {
        const initialStudentFilterValue = studentFilterElement.value;
        await fetchStudentData(initialStudentFilterValue);
    } else {
        console.error("Elemen 'student-filter' tidak ditemukan.");
    }

    // Pastikan elemen dropdown ruangan ada sebelum mencoba mengaksesnya
    const roomFilterElement = document.getElementById('room-filter');
    if (roomFilterElement) {
        // Ambil nilai default dari dropdown filter ruangan saat halaman pertama kali dimuat
        const defaultRoomMonthIndonesian = roomFilterElement.value.toLowerCase();
        const defaultRoomMonthEnglish = bulanMapping[defaultRoomMonthIndonesian];
        await fetchRoomData(defaultRoomMonthEnglish); // Panggil dengan bulan default yang diambil dari dropdown
    } else {
        console.error("Elemen 'room-filter' tidak ditemukan.");
    }

    // Pastikan elemen dropdown guru ada sebelum mencoba mengaksesnya
    const teacherMonthFilterElement = document.getElementById('teacher-month-filter');
    if (teacherMonthFilterElement) {
        // Ambil dan perbarui data chart kehadiran guru untuk bulan default
        const defaultTeacherMonthIndonesian = teacherMonthFilterElement.value.toLowerCase();
        const defaultTeacherMonthEnglish = bulanMapping[defaultTeacherMonthIndonesian];
        fetchKehadiranGuruData(defaultTeacherMonthEnglish);
    } else {
        console.error("Elemen 'teacher-month-filter' tidak ditemukan.");
    }
});