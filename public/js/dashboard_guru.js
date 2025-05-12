// Toggle sidebar
        function initializeSidebar() {
            const toggleButton = document.getElementById('toggle-sidebar');
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.getElementById('main-content');
            const overlay = document.getElementById('overlay');
            
            toggleButton.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                sidebar.classList.toggle('mobile-open');
                mainContent.classList.toggle('expanded');
                overlay.classList.toggle('show');
            });
            
            // Close sidebar when clicking on overlay
            overlay.addEventListener('click', function() {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('show');
            });
        }
        
        // Initialize tabs
        // Ubah fungsi initializeTabs() untuk hanya mengubah chart tengah (chart kedua)
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabDatang = document.getElementById('tab-datang');
    const tabPulang = document.getElementById('tab-pulang');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Update chart data based on selected tab
            if (button.id === 'tab-pulang') {
                // Hanya ubah chart tengah untuk "Pulang Cepat"
                document.querySelector('.chart-container:nth-child(2) .chart-percentage').textContent = '45%';
                document.querySelector('.chart-container:nth-child(2) path.stroke-current.text-warning').setAttribute('stroke-dasharray', '45, 100');
                document.querySelector('.chart-container:nth-child(2) .chart-label').textContent = 'Pulang Cepat';
            } else {
                // Reset chart tengah ke "Terlambat"
                document.querySelector('.chart-container:nth-child(2) .chart-percentage').textContent = '22%';
                document.querySelector('.chart-container:nth-child(2) path.stroke-current.text-warning').setAttribute('stroke-dasharray', '22, 100');
                document.querySelector('.chart-container:nth-child(2) .chart-label').textContent = 'Terlambat';
            }
        });
    });
}
        
        // Run on page load
        window.addEventListener('load', () => {
            initializeSidebar();
            initializeTabs();
        });