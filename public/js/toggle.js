
            // Toggle sidebar functionality
            document.addEventListener('DOMContentLoaded', function() {
                const toggleBtn = document.getElementById('toggle-sidebar');
                const sidebar = document.getElementById('sidebar');
                const mainContent = document.getElementById('main-content');
                const overlay = document.getElementById('overlay');
    
                // Toggle sidebar
                toggleBtn.addEventListener('click', function() {
                    sidebar.classList.toggle('collapsed');
                    mainContent.classList.toggle('expanded');
                    
                    // Show/hide overlay on mobile
                    if (window.innerWidth <= 768) {
                        overlay.classList.toggle('show');
                    }
                });
    
                // Close sidebar when clicking overlay
                overlay.addEventListener('click', function() {
                    sidebar.classList.add('collapsed');
                    mainContent.classList.add('expanded');
                    overlay.classList.remove('show');
                });
    
                // Handle window resize
                window.addEventListener('resize', function() {
                    if (window.innerWidth > 768) {
                        overlay.classList.remove('show');
                    }
                });
    
                // Initialize Charts
                // initializeCharts();
            });
    
            // Initialize all charts
            
        // Room Borrowing Chart
        // const roomCtx = document.getElementById('roomChart').getContext('2d');
        // new Chart(roomCtx, {
        //     type: 'bar',
        //     data: {
        //         labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Aula'],
        //         datasets: [{
        //             label: 'Jumlah Peminjaman',
        //             data: [4, 6, 8, 6, 4],
        //             backgroundColor: '#3B82F6',
        //             borderRadius: 8,
        //             barThickness: 40
        //         }]
        //     },
        //     options: {
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
        //                 ticks: {
        //                     stepSize: 2
        //                 }
        //             },
        //             x: {
        //                 grid: {
        //                     display: false
        //                 }
        //             }
        //         }
        //     }
        // });