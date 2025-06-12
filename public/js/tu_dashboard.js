// Data untuk berbagai bulan (tetap sebagai fallback atau jika Anda mau memfilter data lokal)
// Namun, sekarang data akan diambil dari backend API
const roomDataByMonth = {
    'januari': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] }, // Data akan diisi dari API
    'februari': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'maret': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'april': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'mei': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'juni': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'juli': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'agustus': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'september': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'oktober': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'november': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] },
    'desember': { labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'], data: [] }
};

let roomChart;
let teacherDatangChart;
let teacherPulangChart;
let studentChart;

document.addEventListener('DOMContentLoaded', function() {

    // Fungsi untuk mengambil data dari API

    async function fetchDashboardData() {
    try {
        const response = await fetch('http://localhost/MegatamaSystem/src/API/tu_dashboard.php') // Replace with your actual endpoint
        if (!response.ok) {
            // If the response is not OK (e.g., 404, 500)
            const errorText = await response.text(); // Read the response as text
            console.error('Error fetching dashboard data:', response.status, response.statusText, errorText);
            // You might want to throw an error or handle the non-OK response appropriately
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Attempt to parse as JSON
        // Process your data here
        console.log('Dashboard data:', data);
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Tampilkan pesan error koneksi di UI
    }
}
    // async function fetchDashboardData() {
    //     try {
    //         const response = await fetch('http://localhost/MegatamaSystem/src/API/tu_dashboard.php'); // Sesuaikan URL API Anda
    //         const data = await response.json();

    //         if (!data.success) {
    //             console.error("Error from API:", data.message);
    //             // Tampilkan pesan error di UI jika perlu
    //             return;
    //         }

    //         // Memperbarui Status Cards
    //         updateStatusCards(data.data.status_cards);

    //         // Memperbarui Aktivitas Terbaru
    //         updateRecentActivities(data.data.aktivitas_terbaru);

    //         // Memperbarui Charts (panggil setelah data chart tersedia)
    //         initializeCharts(data.data.charts); // Panggil initializeCharts dengan data dari API

    //         // Update filter ruangan dengan data yang ada di Chart.js
    //         const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
    //         document.getElementById('room-filter').value = currentMonth;
    //         // updateRoomChart(currentMonth); // Panggil ini setelah chart diinisialisasi

    //     } catch (error) {
    //         console.error('Error fetching dashboard data:', error);
    //         // Tampilkan pesan error koneksi di UI
    //     }
    // }

    // Fungsi untuk memperbarui kartu status
    function updateStatusCards(statusData) {
        document.querySelector('.card:nth-child(1) p.text-2xl').innerHTML =
            `${statusData.absen_datang_hari_ini} <span class="text-sm text-gray-500 font-normal">/ ${statusData.total_guru} Total Guru</span>`;

        document.querySelector('.card:nth-child(2) p.text-sm').textContent = statusData.absen_pulang_hari_ini;

        document.querySelector('.card:nth-child(3) p.text-2xl').innerHTML =
            `${statusData.total_siswa} <span class="text-sm text-gray-500 font-normal">Siswa</span>`;

        document.querySelector('.card:nth-child(4) p.text-2xl').innerHTML =
            `${statusData.ruangan_dipinjam_hari_ini} <span class="text-sm text-gray-500 font-normal">ruangan</span>`;
    }

    // Fungsi untuk memperbarui aktivitas terbaru
    function updateRecentActivities(activities) {
        const activityContainer = document.querySelector('.space-y-2'); // Container aktivitas terbaru
        activityContainer.innerHTML = ''; // Kosongkan dulu

        if (activities.length === 0) {
            activityContainer.innerHTML = `<p class="text-center text-gray-500">Tidak ada aktivitas terbaru.</p>`;
            return;
        }

        activities.forEach(activity => {
            let iconSvg = '';
            let bgColorClass = '';
            let textColorClass = '';

            if (activity.icon === 'room') {
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>`;
                bgColorClass = 'bg-orange-100';
                textColorClass = 'text-red-600'; // Mengikuti warna di HTML asli
            } else if (activity.icon === 'teacher') {
                iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path
                                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                            </svg>`;
                bgColorClass = 'bg-blue-100';
                textColorClass = 'text-primary';
            }

            const activityItem = `
                <div class="activity-item-admin-tu p-2 flex items-start rounded-lg ${activity.icon === 'teacher' ? 'bg-gray-50' : ''}">
                    <div class="w-8 h-8 rounded-full ${bgColorClass} flex items-center justify-center mr-2 flex-shrink-0">
                        <span class="${textColorClass}">${iconSvg}</span>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-800">${activity.keterangan}</p>
                        <p class="text-xs text-gray-500">${activity.waktu}</p>
                    </div>
                </div>
            `;
            activityContainer.insertAdjacentHTML('beforeend', activityItem);
        });
    }

    // Fungsi untuk membuat/memperbarui Chart.js
    // Menerima data chart langsung dari API
    function initializeCharts(chartsData) {
        const monthsInOrder = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        
        // Pastikan labels chart peminjaman ruangan konsisten
        const roomChartLabels = Object.keys(chartsData.peminjaman_ruangan).map(month => month.charAt(0).toUpperCase() + month.slice(1));
        const roomChartValues = Object.values(chartsData.peminjaman_ruangan);

        const roomCtx = document.getElementById('room-chart').getContext('2d');
        if (roomChart) roomChart.destroy();
        roomChart = new Chart(roomCtx, {
            type: 'bar',
            data: {
                labels: roomChartLabels,
                datasets: [{
                    label: 'Jumlah Peminjaman',
                    data: roomChartValues,
                    backgroundColor: '#3b82f6',
                    borderColor: '#1e40af',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        // max: 30, // Sesuaikan max y-axis jika diperlukan
                        ticks: { stepSize: 2, font: { family: 'Poppins', size: 11 }, padding: 10 }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { font: { family: 'Poppins', size: 11 }, maxRotation: 45, minRotation: 0 }
                    }
                },
                layout: { padding: { left: 10, right: 10 } }
            }
        });

        // Data Kehadiran Guru - Absen Datang
        const teacherDatangChartLabels = Object.keys(chartsData.kehadiran_guru_datang).map(month => month.charAt(0).toUpperCase() + month.slice(1));
        const teacherDatangChartValues = Object.values(chartsData.kehadiran_guru_datang);
        const teacherDatangCtx = document.getElementById('teacher-chart-datang').getContext('2d');
        if (teacherDatangChart) teacherDatangChart.destroy();
        teacherDatangChart = new Chart(teacherDatangCtx, {
            type: 'line', // Ganti ke line chart untuk menampilkan tren bulanan
            data: {
                labels: teacherDatangChartLabels,
                datasets: [{
                    label: 'Persentase Kehadiran Datang',
                    data: teacherDatangChartValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100 // Persentase
                    }
                }
            }
        });

        // Data Kehadiran Guru - Absen Pulang
        const teacherPulangChartLabels = Object.keys(chartsData.kehadiran_guru_pulang).map(month => month.charAt(0).toUpperCase() + month.slice(1));
        const teacherPulangChartValues = Object.values(chartsData.kehadiran_guru_pulang);
        const teacherPulangCtx = document.getElementById('teacher-chart-pulang').getContext('2d');
        if (teacherPulangChart) teacherPulangChart.destroy();
        teacherPulangChart = new Chart(teacherPulangCtx, {
            type: 'line', // Ganti ke line chart
            data: {
                labels: teacherPulangChartLabels,
                datasets: [{
                    label: 'Persentase Kehadiran Pulang',
                    data: teacherPulangChartValues,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100 // Persentase
                    }
                }
            }
        });

        // Data Jumlah Siswa
        const studentChartLabels = Object.keys(chartsData.jumlah_siswa);
        const studentChartValues = Object.values(chartsData.jumlah_siswa);
        const studentCtx = document.getElementById('student-chart').getContext('2d');
        if (studentChart) studentChart.destroy();
        studentChart = new Chart(studentCtx, {
            type: 'pie',
            data: {
                labels: studentChartLabels,
                datasets: [{
                    label: 'Jumlah Siswa',
                    data: studentChartValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)', // Merah
                        'rgba(54, 162, 235, 0.8)', // Biru
                        'rgba(255, 206, 86, 0.8)', // Kuning
                        'rgba(75, 192, 192, 0.8)', // Hijau-biru
                        'rgba(153, 102, 255, 0.8)', // Ungu
                        'rgba(255, 159, 64, 0.8)'  // Oranye
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: { family: 'Poppins', size: 11 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let total = 0;
                                context.dataset.data.forEach(data => total += data);
                                let percentage = parseFloat((context.raw / total * 100).toFixed(1));
                                return `${context.label}: ${context.raw} siswa (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Fungsi untuk mengatur tab teacher (Absen Datang / Absen Pulang)
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

    // Fungsi untuk memperbarui chart peminjaman ruangan berdasarkan filter bulan
    function updateRoomChart(month) {
        // Ini akan memanggil API lagi untuk bulan tertentu jika diperlukan,
        // atau memfilter data yang sudah diambil jika API sudah mengirim semua data bulanan sekaligus.
        // Untuk saat ini, kita hanya akan mengubah data chart.
        // Asumsi data chart sudah tersedia di `chartsData` dari `fetchDashboardData`
        fetchDashboardData(); // Panggil ulang untuk memuat data terbaru, atau bisa lebih efisien dengan cache
    }

    // Fungsi untuk mengatur filter dropdown (bulan)
    function initializeFilters() {
        const roomFilter = document.getElementById('room-filter');
        const teacherFilter = document.getElementById('teacher-filter');
        const studentFilter = document.getElementById('student-filter');

        // Set bulan saat ini sebagai nilai default untuk filter bulan
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
        if(roomFilter) roomFilter.value = currentMonth;
        if(teacherFilter) teacherFilter.value = currentMonth;
        
        // Listener untuk filter Peminjaman Ruangan
        if(roomFilter) {
            roomFilter.addEventListener('change', function () {
                // Dalam implementasi nyata, Anda mungkin memanggil API lagi dengan parameter bulan
                // atau memfilter data yang sudah ada di frontend.
                // Untuk demo ini, kita akan trigger fetchDashboardData lagi agar chart ter-render ulang.
                fetchDashboardData(); 
            });
        }

        // Listener untuk filter Kehadiran Guru (akan trigger fetchDashboardData lagi)
        if(teacherFilter) {
            teacherFilter.addEventListener('change', function () {
                fetchDashboardData();
            });
        }

        // Listener untuk filter Jumlah Siswa (akan trigger fetchDashboardData lagi)
        if(studentFilter) {
            studentFilter.addEventListener('change', function () {
                fetchDashboardData();
            });
        }
    }

    // Jalankan semua fungsi saat halaman dimuat
    fetchDashboardData(); // Panggil pertama kali untuk memuat semua data
    initializeTeacherTabs();
    initializeFilters(); // Inisialisasi filter setelah fetch data pertama

});

// // Data untuk berbagai bulan
// const roomDataByMonth = {
//     'januari': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [5, 6, 7, 4, 3]
//     },
//     'februari': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [6, 5, 6, 7, 4]
//     },
//     'maret': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [4, 7, 5, 6, 5]
//     },
//     'april': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [4, 6, 8, 6, 4]
//     },
//     'mei': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [5, 7, 6, 8, 3]
//     },
//     'juni': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [3, 5, 9, 4, 6]
//     },
//     'juli': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [0, 0, 0, 0, 0]
//     },
//     'agustus': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [0, 0, 0, 0, 0]
//     },
//     'september': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [0, 0, 0, 0, 0]
//     },
//     'oktober': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [0, 0, 0, 0, 0]
//     },
//     'november': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [0, 0, 0, 0, 0]
//     },
//     'desember': {
//         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Kesenian'],
//         data: [0, 0, 0, 0, 0]
//     }
// };

// let roomChart;
// let teacherDatangChart;
// let teacherPulangChart;
// let studentChart;


// // Fungsi untuk mengatur sidebar
// // function initializeSidebar() {
// //     const toggleButton = document.getElementById('toggle-sidebar');
// //     const sidebar = document.getElementById('sidebar');
// //     const mainContent = document.getElementById('main-content');
// //     const overlay = document.getElementById('overlay');

// //     toggleButton.addEventListener('click', function () {
// //         sidebar.classList.toggle('collapsed');
// //         sidebar.classList.toggle('mobile-open');
// //         mainContent.classList.toggle('expanded');
// //         overlay.classList.toggle('show');
// //     });

// //     // Tutup sidebar saat mengklik overlay
// //     overlay.addEventListener('click', function () {
// //         sidebar.classList.remove('mobile-open');
// //         overlay.classList.remove('show');
// //     });
// // }

// // Fungsi untuk mengatur tab teacher
// function initializeTeacherTabs() {
//     const tabButtons = document.querySelectorAll('#tab-teacher-datang, #tab-teacher-pulang');
//     const tabContents = document.querySelectorAll('#content-teacher-datang, #content-teacher-pulang');

//     tabButtons.forEach(button => {
//         button.addEventListener('click', () => {
//             // Hapus kelas active dari semua tombol dan konten
//             tabButtons.forEach(btn => btn.classList.remove('active'));
//             tabContents.forEach(content => content.classList.remove('active'));

//             // Tambahkan kelas active ke tombol yang diklik
//             button.classList.add('active');

//             // Tampilkan konten yang sesuai
//             const contentId = 'content-teacher-' + button.id.split('-')[2];
//             document.getElementById(contentId).classList.add('active');
//         });
//     });
// }

// // Fungsi untuk update chart peminjaman ruangan
// function updateRoomChart(month) {
//     const data = roomDataByMonth[month];
//     roomChart.data.labels = data.labels;
//     roomChart.data.datasets[0].data = data.data;
//     roomChart.update();
// }

// // Fungsi untuk mengatur filter
// function initializeFilters() {
//     const roomFilter = document.getElementById('room-filter');
//     roomFilter.addEventListener('change', function () {
//         updateRoomChart(this.value);
//     });
// }

// // Fungsi untuk membuat grafik
// function initializeCharts() {
//     // Data untuk Peminjaman Ruangan (default April)
//     const roomData = {
//         labels: roomDataByMonth.april.labels,
//         datasets: [{
//             label: 'Jumlah Peminjaman',
//             data: roomDataByMonth.april.data,
//             backgroundColor: '#3b82f6',
//             borderColor: '#1e40af',
//             borderWidth: 1,
//             borderRadius: 4,
//             barPercentage: 0.6,
//             categoryPercentage: 0.7
//         }]
//     };

//     // Data untuk Kehadiran Guru - Absen Datang
//     const teacherDatangData = {
//         labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
//         datasets: [{
//             data: [75, 20, 5],
//             backgroundColor: [
//                 '#10B981', // Hijau untuk Tepat Waktu
//                 '#EF4444', // Merah untuk Terlambat
//                 '#F59E0B', // Kuning untuk Absen Tidak Dilakukan
//             ],
//             borderWidth: 0
//         }]
//     };

//     // Data untuk Kehadiran Guru - Absen Pulang
//     const teacherPulangData = {
//         labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
//         datasets: [{
//             data: [70, 25, 5],
//             backgroundColor: [
//                 '#10B981', // Hijau untuk Tepat Waktu
//                 '#EF4444', // Merah untuk Terlambat
//                 '#F59E0B', // Kuning untuk Absen Tidak Dilakukan
//             ],
//             borderWidth: 0
//         }]
//     };

//     // Data untuk Jumlah Siswa
//     const studentData = {
//         labels: ['Laki-laki', 'Perempuan'],
//         datasets: [{
//             data: [45, 55],
//             backgroundColor: [
//                 '#3b82f6', // Biru untuk Laki-laki
//                 '#ec4899'  // Pink untuk Perempuan
//             ],
//             borderWidth: 0
//         }]
//     };

//     // Pengaturan grafik bar
//     const barOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 max: 10,
//                 // grid: {
//                 //     color: '',
//                 // },
//                 ticks: {
//                     stepSize: 2,
//                     font: {
//                         family: 'Poppins',
//                         size: 11
//                     },
//                     padding: 10
//                 }
//             },
//             x: {
//                 grid: {
//                     display: false
//                 },
//                 ticks: {
//                     font: {
//                         family: 'Poppins',
//                         size: 11
//                     },
//                     maxRotation: 45,
//                     minRotation: 0
//                 }
//             }
//         },
//         layout: {
//             padding: {
//                 left: 10,
//                 right: 10
//             }
//         }
//     };

//     // Pengaturan grafik pie
//     const pieOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 position: 'bottom',
//                 labels: {
//                     usePointStyle: true,
//                     pointStyle: 'circle',
//                     font: {
//                         family: 'Poppins',
//                         size: 11
//                     },
//                     padding: 15
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function (context) {
//                         return `${context.raw}`;
//                     }
//                 }
//             }
//         }
//     };

//     // Buat grafik Peminjaman Ruangan
//     roomChart = new Chart(
//         document.getElementById('room-chart'),
//         {
//             type: 'bar',
//             data: roomData,
//             options: barOptions
//         }
//     );

//     // Buat grafik Kehadiran Guru - Absen Datang
//     teacherDatangChart = new Chart(
//         document.getElementById('teacher-chart-datang'),
//         {
//             type: 'pie',
//             data: teacherDatangData,
//             options: pieOptions
//         }
//     );

//     // Buat grafik Kehadiran Guru - Absen Pulang
//     teacherPulangChart = new Chart(
//         document.getElementById('teacher-chart-pulang'),
//         {
//             type: 'pie',
//             data: teacherPulangData,
//             options: pieOptions
//         }
//     );

//     // Buat grafik Jumlah Siswa
//     studentChart = new Chart(
//         document.getElementById('student-chart'),
//         {
//             type: 'pie',
//             data: studentData,
//             options: pieOptions
//         }
//     );
// }

// // Jalankan saat halaman dimuat
// window.addEventListener('load', () => {
//     // initializeSidebar();
//     initializeTeacherTabs();
//     initializeCharts();
//     initializeFilters();
// });