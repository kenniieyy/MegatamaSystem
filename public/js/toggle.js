
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
    
            });
    