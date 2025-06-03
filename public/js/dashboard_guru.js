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
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus kelas active dari semua tombol dan konten
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Tambahkan kelas active ke tombol yang diklik
            button.classList.add('active');

            // Tampilkan konten yang sesuai
            const contentId = 'content-' + button.id.split('-')[1];
            document.getElementById(contentId).classList.add('active');
        });
    });
}

// Fungsi untuk membuat grafik
function initializeCharts() {
    // Data untuk Absen Datang
    const datangData = {
        labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
        datasets: [{
            data: datangDataFromPHP, // ← ini dari PHP
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
            borderWidth: 0
        }]
    };


    // Data untuk Absen Pulang
    const pulangData = {
        labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
        datasets: [{
            data: pulangDataFromPHP, // ← ini dari PHP
            backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
            borderWidth: 0
        }]
    };

    // Pengaturan grafik
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        family: 'Poppins',
                        size: 12
                    },
                    padding: 20
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };

    // Buat grafik Absen Datang
    const datangChart = new Chart(
        document.getElementById('chart-datang'),
        {
            type: 'pie',
            data: datangData,
            options: options
        }
    );

    // Buat grafik Absen Pulang
    const pulangChart = new Chart(
        document.getElementById('chart-pulang'),
        {
            type: 'pie',
            data: pulangData,
            options: options
        }
    );
}

// Jalankan saat halaman dimuat
window.addEventListener('load', () => {
    initializeSidebar();
    initializeTabs();
    initializeCharts();
});