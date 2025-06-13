// Toggle sidebar functionality - VERSI RESPONSIVE DIPERBAIKI
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');

    // Cek apakah semua element ada
    if (!toggleBtn || !sidebar || !mainContent || !overlay) {
        console.error('Beberapa element tidak ditemukan:', {
            toggleBtn: !!toggleBtn,
            sidebar: !!sidebar,
            mainContent: !!mainContent,
            overlay: !!overlay
        });
        return;
    }

    // Fungsi untuk reset semua classes dan styles
    function resetSidebarStates() {
        sidebar.classList.remove('collapsed', 'mobile-open');
        overlay.classList.remove('show');
        // Reset inline styles jika ada
        sidebar.style.transform = '';
    }

    // Fungsi untuk setup desktop layout
    function setupDesktopLayout() {
        resetSidebarStates();
        // Di desktop, sidebar default terbuka dan main content menyesuaikan
        mainContent.classList.remove('expanded');
        sidebar.classList.remove('collapsed');
    }

    // Fungsi untuk setup mobile layout
    function setupMobileLayout() {
        resetSidebarStates();
        // Di mobile, sidebar default tertutup
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    // Fungsi untuk membuka sidebar
    function openSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: gunakan mobile-open class
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('mobile-open');
            overlay.classList.add('show');
        } else {
            // Desktop: hilangkan collapsed class
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        if (window.innerWidth <= 768) {
            // Mobile: tutup dan hilangkan overlay
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('show');
        } else {
            // Desktop: collapse sidebar dan expand main content
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }

    // Fungsi untuk cek status sidebar (terbuka/tertutup)
    function isSidebarOpen() {
        if (window.innerWidth <= 768) {
            return sidebar.classList.contains('mobile-open');
        } else {
            return !sidebar.classList.contains('collapsed');
        }
    }

    // Fungsi untuk handle responsive behavior
    function handleResponsiveLayout() {
        const currentWidth = window.innerWidth;
        
        if (currentWidth <= 768) {
            // Switching to mobile
            setupMobileLayout();
        } else {
            // Switching to desktop
            setupDesktopLayout();
        }
        
        console.log(`Layout switched to: ${currentWidth <= 768 ? 'Mobile' : 'Desktop'} (${currentWidth}px)`);
    }

    // Toggle sidebar - LOGIKA UTAMA
    toggleBtn.addEventListener('click', function () {
        console.log('Toggle clicked, window width:', window.innerWidth);
        console.log('Sidebar open status:', isSidebarOpen());
        
        if (isSidebarOpen()) {
            closeSidebar();
            console.log('Sidebar ditutup');
        } else {
            openSidebar();
            console.log('Sidebar dibuka');
        }
    });

    // Tutup sidebar saat mengklik overlay (hanya di mobile)
    overlay.addEventListener('click', function () {
        console.log('Overlay clicked - closing sidebar');
        closeSidebar();
    });

    // Handle window resize - PERBAIKAN UTAMA
    let resizeTimeout;
    window.addEventListener('resize', function () {
        // Debounce resize event untuk performa
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            handleResponsiveLayout();
        }, 100);
    });

    // Initialize layout berdasarkan ukuran window saat ini
    handleResponsiveLayout();

    // Set tanggal hari ini sebagai default (jika fungsi ada)
    if (typeof setCurrentDate === 'function') {
        setCurrentDate();
    }

    console.log('Responsive sidebar initialized successfully');
});

// Fungsi tambahan untuk debugging
function debugSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');
    
    console.log('=== SIDEBAR DEBUG INFO ===');
    console.log('Window width:', window.innerWidth);
    console.log('Device type:', window.innerWidth <= 768 ? 'Mobile' : 'Desktop');
    console.log('Sidebar classes:', sidebar.className);
    console.log('Main content classes:', mainContent.className);
    console.log('Overlay classes:', overlay.className);
    console.log('Sidebar computed transform:', window.getComputedStyle(sidebar).transform);
}