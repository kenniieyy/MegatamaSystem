// // Fungsi untuk mengatur sidebar
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

// Fungsi untuk mengatur tab
// Fungsi untuk mengatur tab
function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const chartFilter = document.getElementById('chart-filter'); // Dapatkan elemen select filter

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

  // Tambahkan event listener untuk filter bulan
  if (chartFilter) {
    chartFilter.addEventListener('change', function() {
      filterByMonth(this.value); // Panggil fungsi filterByMonth dengan nilai yang dipilih
    });
  }
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