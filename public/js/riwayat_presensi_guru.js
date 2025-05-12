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
        
        // Initialize filter buttons
        function initializeFilterButtons() {
            const btnAbsenDatang = document.getElementById('btn-absen-datang');
            const btnAbsenPulang = document.getElementById('btn-absen-pulang');
            
            btnAbsenDatang.addEventListener('click', function() {
                btnAbsenDatang.classList.add('active');
                btnAbsenPulang.classList.remove('active');
                
                // Update tabel untuk Absen Datang
                updateTableForAbsenDatang();
                console.log('Filtering for Absen Datang');
            });
            
            btnAbsenPulang.addEventListener('click', function() {
                btnAbsenPulang.classList.add('active');
                btnAbsenDatang.classList.remove('active');
                
                // Update tabel untuk Absen Pulang
                updateTableForAbsenPulang();
                console.log('Filtering for Absen Pulang');
            });
        }

        // Fungsi untuk mengupdate tabel untuk Absen Datang
        function updateTableForAbsenDatang() {
            // Ubah keterangan di tabel tanpa mengubah posisi
            const rows = document.querySelectorAll('.table-row');
            
            rows.forEach((row, index) => {
                const statusCell = row.querySelector('td:nth-child(4) span');
                const keteranganCell = row.querySelector('td:nth-child(5)');
                
                // Reset status dan keterangan
                if (index % 5 === 0) {
                    // Tepat Waktu
                    statusCell.className = 'badge success';
                    statusCell.textContent = 'Sudah Absen';
                    keteranganCell.textContent = 'Tepat Waktu';
                } else if (index % 5 === 1) {
                    // Terlambat
                    statusCell.className = 'badge warning';
                    statusCell.textContent = 'Terlambat';
                    keteranganCell.textContent = 'Terlambat 15 menit';
                } else if (index % 5 === 2) {
                    // Tepat Waktu
                    statusCell.className = 'badge success';
                    statusCell.textContent = 'Sudah Absen';
                    keteranganCell.textContent = 'Tepat Waktu';
                } else if (index % 5 === 3) {
                    // Tepat Waktu
                    statusCell.className = 'badge success';
                    statusCell.textContent = 'Sudah Absen';
                    keteranganCell.textContent = 'Tepat Waktu';
                } else {
                    // Absen Tidak Dilakukan
                    statusCell.className = 'badge danger';
                    statusCell.textContent = 'Absen Tidak Dilakukan';
                    keteranganCell.textContent = '-';
                }
            });
        }

        // Fungsi untuk mengupdate tabel untuk Absen Pulang
        function updateTableForAbsenPulang() {
            // Ubah keterangan di tabel tanpa mengubah posisi
            const rows = document.querySelectorAll('.table-row');
            
            rows.forEach((row, index) => {
                const statusCell = row.querySelector('td:nth-child(4) span');
                const keteranganCell = row.querySelector('td:nth-child(5)');
                
                // Reset status dan keterangan
                if (index % 5 === 0) {
                    // Tepat Waktu
                    statusCell.className = 'badge success';
                    statusCell.textContent = 'Sudah Absen';
                    keteranganCell.textContent = 'Tepat Waktu';
                } else if (index % 5 === 1) {
                    // Pulang Cepat
                    statusCell.className = 'badge warning';
                    statusCell.textContent = 'Pulang Cepat';
                    keteranganCell.textContent = 'Pulang Cepat 30 menit';
                } else if (index % 5 === 2) {
                    // Tepat Waktu
                    statusCell.className = 'badge success';
                    statusCell.textContent = 'Sudah Absen';
                    keteranganCell.textContent = 'Tepat Waktu';
                } else if (index % 5 === 3) {
                    // Pulang Cepat
                    statusCell.className = 'badge warning';
                    statusCell.textContent = 'Pulang Cepat';
                    keteranganCell.textContent = 'Pulang Cepat 15 menit';
                } else {
                    // Absen Tidak Dilakukan
                    statusCell.className = 'badge danger';
                    statusCell.textContent = 'Absen Tidak Dilakukan';
                    keteranganCell.textContent = '-';
                }
            });
        }
        
        // Initialize pagination
        function initializePagination() {
            const paginationItems = document.querySelectorAll('.pagination-item');
            
            paginationItems.forEach(item => {
                if (!item.classList.contains('active') && !item.disabled) {
                    item.addEventListener('click', function() {
                        // Remove active class from all pagination items
                        paginationItems.forEach(i => i.classList.remove('active'));
                        
                        // Add active class to clicked item (if it's a number)
                        if (!isNaN(this.textContent)) {
                            this.classList.add('active');
                        }
                        
                        // Here you would typically fetch data for the selected page
                        console.log('Navigating to page:', this.textContent);
                    });
                }
            });
        }
        
        // Initialize export button
        function initializeExportButton() {
            const btnExport = document.getElementById('btn-export');
            
            btnExport.addEventListener('click', function() {
                // Tampilkan pop-up
                showExportPopup();
            });
        }

        // Fungsi untuk menampilkan pop-up export
        function showExportPopup() {
            // Buat elemen pop-up
            const popup = document.createElement('div');
            popup.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            popup.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full transform transition-all scale-100 opacity-100">
                    <div class="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-center text-gray-800 mb-2">Export Berhasil</h3>
                    <p class="text-gray-600 text-center mb-6">Data riwayat presensi berhasil diekspor ke Excel.</p>
                    <div class="flex justify-center">
                        <button class="btn-gradient py-2 px-4 rounded-lg" id="close-popup">Tutup</button>
                    </div>
                </div>
            `;
            
            // Tambahkan pop-up ke body
            document.body.appendChild(popup);
            
            // Tambahkan event listener untuk tombol tutup
            document.getElementById('close-popup').addEventListener('click', function() {
                document.body.removeChild(popup);
            });
        }
        
        // Initialize month filter
        function initializeMonthFilter() {
            const monthFilter = document.getElementById('month-filter');
            
            monthFilter.addEventListener('change', function() {
                // Here you would typically filter the table data by month
                console.log('Filtering for month:', this.value);
            });
        }
        
        // Run on page load
        window.addEventListener('load', () => {
            initializeSidebar();
            initializeFilterButtons();
            initializePagination();
            initializeExportButton();
            initializeMonthFilter();
            
            // Tampilkan data Absen Datang saat halaman pertama kali dimuat
            updateTableForAbsenDatang();
        });