
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
                initializeCharts();
            });
    
            // Initialize all charts
            
        // Room Borrowing Chart
        const roomCtx = document.getElementById('roomChart').getContext('2d');
        new Chart(roomCtx, {
            type: 'bar',
            data: {
                labels: ['Lab Komputer', 'Lab Fisika', 'Lab Kimia', 'Lab Biologi', 'Aula'],
                datasets: [{
                    label: 'Jumlah Peminjaman',
                    data: [4, 6, 8, 6, 4],
                    backgroundColor: '#3B82F6',
                    borderRadius: 8,
                    barThickness: 40
                }]
            },
            options: {
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
                            stepSize: 2
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });

        // Teacher Attendance Chart
        const attendanceCtx = document.getElementById('attendanceChart').getContext('2d');
        new Chart(attendanceCtx, {
            type: 'pie',
            data: {
                labels: ['Tepat Waktu', 'Terlambat', 'Absen Tidak Dilakukan'],
                datasets: [{
                    data: [70, 20, 10],
                    backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });

        // Student Gender Chart
        const studentCtx = document.getElementById('studentChart').getContext('2d');
        new Chart(studentCtx, {
            type: 'pie',
            data: {
                labels: ['Laki-laki', 'Perempuan'],
                datasets: [{
                    data: [60, 40],
                    backgroundColor: ['#EC4899', '#06B6D4'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });

        // Interactive dropdowns (placeholder functionality)
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', function() {
                console.log('Filter changed:', this.value);
                // Here you would typically update the charts with new data
            });
        });

        // Button interactions for attendance chart
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', function() {
                if (this.textContent.includes('Absen')) {
                    // Remove active state from other buttons
                    document.querySelectorAll('button').forEach(btn => {
                        if (btn.textContent.includes('Absen')) {
                            btn.className = btn.className.replace('bg-blue-600 text-white', 'border border-gray-300 text-gray-700');
                        }
                    });
                    // Add active state to clicked button
                    this.className = 'bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors';
                    console.log('Attendance type changed:', this.textContent);
                }
            });
        });
   