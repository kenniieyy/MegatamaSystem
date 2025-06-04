// Data untuk berbagai bulan
const roomDataByMonth = {
    'januari': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [5, 6, 7, 4, 3]
    },
    'februari': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [6, 5, 6, 7, 4]
    },
    'maret': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [4, 7, 5, 6, 5]
    },
    'april': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [4, 6, 8, 6, 4]
    },
    'mei': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [5, 7, 6, 8, 3]
    },
    'juni': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [3, 5, 9, 4, 6]
    },
    'juli': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [0, 0, 0, 0, 0]
    },
    'agustus': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [0, 0, 0, 0, 0]
    },
    'september': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [0, 0, 0, 0, 0]
    },
    'oktober': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [0, 0, 0, 0, 0]
    },
    'november': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [0, 0, 0, 0, 0]
    },
    'desember': {
        labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
        data: [0, 0, 0, 0, 0]
    }
};

let roomChart;
let teacherDatangChart;
let teacherPulangChart;
let studentChart;


// Fungsi untuk mengatur sidebar
// function initializeSidebar() {
//     const toggleButton = document.getElementById('toggle-sidebar');
//     const sidebar = document.getElementById('sidebar');
//     const mainContent = document.getElementById('main-content');
//     const overlay = document.getElementById('overlay');

//     toggleButton.addEventListener('click', function () {
//         sidebar.classList.toggle('collapsed');
//         sidebar.classList.toggle('mobile-open');
//         mainContent.classList.toggle('expanded');
//         overlay.classList.toggle('show');
//     });

//     // Tutup sidebar saat mengklik overlay
//     overlay.addEventListener('click', function () {
//         sidebar.classList.remove('mobile-open');
//         overlay.classList.remove('show');
//     });
// }

// Fungsi untuk mengatur tab teacher
function initializeTeacherTabs() {
    const tabButtons = document.querySelectorAll('#tab-teacher-datang, #tab-teacher-pulang');
    const tabContents = document.querySelectorAll('#content-teacher-datang, #content-teacher-pulang');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus kelas active dari semua tombol dan konten
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Tambahkan kelas active ke tombol yang diklik
            button.classList.add('active');

            // Tampilkan konten yang sesuai
            const contentId = 'content-teacher-' + button.id.split('-')[2];
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Fungsi untuk update chart peminjaman ruangan
function updateRoomChart(month) {
    const data = roomDataByMonth[month];
    roomChart.data.labels = data.labels;
    roomChart.data.datasets[0].data = data.data;
    roomChart.update();
}

// Fungsi untuk mengatur filter
function initializeFilters() {
    const roomFilter = document.getElementById('room-filter');
    roomFilter.addEventListener('change', function () {
        updateRoomChart(this.value);
    });
}

// Fungsi untuk membuat grafik
function initializeCharts() {
    // Data untuk Peminjaman Ruangan (default April)
    const roomData = {
        labels: roomDataByMonth.april.labels,
        datasets: [{
            label: 'Jumlah Peminjaman',
            data: roomDataByMonth.april.data,
            backgroundColor: '#3b82f6',
            borderColor: '#1e40af',
            borderWidth: 1,
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.7
        }]
    };

    // Data untuk Kehadiran Guru - Absen Datang
    const teacherDatangData = {
        labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
        datasets: [{
            data: [75, 20, 5],
            backgroundColor: [
                '#10B981', // Hijau untuk Tepat Waktu
                '#EF4444', // Merah untuk Terlambat
                '#F59E0B', // Kuning untuk Absen Tidak Dilakukan
            ],
            borderWidth: 0
        }]
    };

    // Data untuk Kehadiran Guru - Absen Pulang
    const teacherPulangData = {
        labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
        datasets: [{
            data: [70, 25, 5],
            backgroundColor: [
                '#10B981', // Hijau untuk Tepat Waktu
                '#EF4444', // Merah untuk Terlambat
                '#F59E0B', // Kuning untuk Absen Tidak Dilakukan
            ],
            borderWidth: 0
        }]
    };

    // Data untuk Jumlah Siswa
    const studentData = {
        labels: ['Laki-laki', 'Perempuan'],
        datasets: [{
            data: [45, 55],
            backgroundColor: [
                '#3b82f6', // Biru untuk Laki-laki
                '#ec4899'  // Pink untuk Perempuan
            ],
            borderWidth: 0
        }]
    };

    // Pengaturan grafik bar
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
                // grid: {
                //     color: '',
                // },
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

    // Pengaturan grafik pie
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
                        return `${context.raw}`;
                    }
                }
            }
        }
    };

    // Buat grafik Peminjaman Ruangan
    roomChart = new Chart(
        document.getElementById('room-chart'),
        {
            type: 'bar',
            data: roomData,
            options: barOptions
        }
    );

    // Buat grafik Kehadiran Guru - Absen Datang
    teacherDatangChart = new Chart(
        document.getElementById('teacher-chart-datang'),
        {
            type: 'pie',
            data: teacherDatangData,
            options: pieOptions
        }
    );

    // Buat grafik Kehadiran Guru - Absen Pulang
    teacherPulangChart = new Chart(
        document.getElementById('teacher-chart-pulang'),
        {
            type: 'pie',
            data: teacherPulangData,
            options: pieOptions
        }
    );

    // Buat grafik Jumlah Siswa
    studentChart = new Chart(
        document.getElementById('student-chart'),
        {
            type: 'pie',
            data: studentData,
            options: pieOptions
        }
    );
}

// Jalankan saat halaman dimuat
window.addEventListener('load', () => {
    // initializeSidebar();
    initializeTeacherTabs();
    initializeCharts();
    initializeFilters();
});