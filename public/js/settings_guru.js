// Toggle sidebar functionality
function initializeSidebar() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');

    // **Important: Add null checks for all elements**
    if (!toggleButton || !sidebar || !mainContent || !overlay) {
        console.error("Sidebar elements not found. Initialization stopped.", {
            toggleButton: !!toggleButton,
            sidebar: !!sidebar,
            mainContent: !!mainContent,
            overlay: !!overlay
        });
        return; // Exit if elements are missing
    }

    // Function to reset all sidebar related classes and styles
    function resetSidebarStates() {
        sidebar.classList.remove('collapsed', 'mobile-open');
        mainContent.classList.remove('expanded');
        overlay.classList.remove('show');
        sidebar.style.transform = ''; // Clear any inline transform styles
    }

    // Function to set up desktop layout
    function setupDesktopLayout() {
        resetSidebarStates();
        // On desktop, sidebar is typically open by default, main content adjusts
        // You might want to remove 'collapsed' if it's there from a mobile state
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('expanded');
    }

    // Function to set up mobile layout
    function setupMobileLayout() {
        resetSidebarStates();
        // On mobile, sidebar is typically collapsed by default, main content is expanded
        sidebar.classList.add('collapsed');
        mainContent.classList.add('expanded');
    }

    // Function to check sidebar status (open/closed) based on current view
    function isSidebarOpen() {
        if (window.innerWidth <= 768) { // Assuming 768px is your mobile breakpoint
            return sidebar.classList.contains('mobile-open');
        } else {
            return !sidebar.classList.contains('collapsed');
        }
    }

    // Function to handle opening the sidebar
    function openSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('collapsed');
            sidebar.classList.add('mobile-open');
            overlay.classList.add('show');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    }

    // Function to handle closing the sidebar
    function closeSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('show');
            sidebar.classList.add('collapsed'); // Add collapsed back for mobile after closing
        } else {
            sidebar.classList.add('collapsed');
            mainContent.classList.add('expanded');
        }
    }

    // Handle responsive layout on load and resize
    function handleResponsiveLayout() {
        if (window.innerWidth <= 768) {
            setupMobileLayout();
        } else {
            setupDesktopLayout();
        }
    }

    // Toggle sidebar on button click
    toggleButton.addEventListener('click', function () {
        if (isSidebarOpen()) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Close sidebar when overlay is clicked (primarily for mobile)
    overlay.addEventListener('click', function () {
        closeSidebar();
    });

    // Handle window resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResponsiveLayout, 150); // Debounce to prevent excessive calls
    });

    // Initial layout setup when the sidebar initializes
    handleResponsiveLayout();
}

// LOGIC FOR TOAST NOTIFICATION
class ToastNotification {
    constructor() {
        this.toastElement = document.getElementById('toast-notification');

        // Crucial: Check if the main toast element exists before querying its children
        if (!this.toastElement) {
            console.error("Toast notification element (id='toast-notification') not found. Toast features disabled.");
            return; // Stop constructor if base element is missing
        }

        this.toastIcon = this.toastElement.querySelector('#toast-icon'); // Use querySelector on toastElement
        this.toastTitle = this.toastElement.querySelector('#toast-title'); // Use querySelector on toastElement
        this.toastMessage = this.toastElement.querySelector('#toast-message'); // Use querySelector on toastElement
        this.toastClose = this.toastElement.querySelector('#toast-close'); // Use querySelector on toastElement
        this.toastContainer = this.toastElement.querySelector('.bg-white'); // This was the problematic line, now safe

        // Check if all necessary sub-elements exist
        if (!this.toastIcon || !this.toastTitle || !this.toastMessage || !this.toastClose || !this.toastContainer) {
            console.error("One or more toast sub-elements missing. Toast features may be limited.", {
                toastIcon: !!this.toastIcon,
                toastTitle: !!this.toastTitle,
                toastMessage: !!this.toastMessage,
                toastClose: !!this.toastClose,
                toastContainer: !!this.toastContainer
            });
            // You might choose to return here as well if the toast won't function without these
            // return;
        }

        this.isVisible = false;
        this.hideTimeout = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.toastClose) { // Ensure toastClose exists
            this.toastClose.addEventListener('click', () => {
                this.hide();
            });
        }

        if (this.toastElement) { // Ensure toastElement exists
            this.toastElement.addEventListener('transitionend', (e) => {
                // Check if the transition is on the toastElement itself (not its children)
                // and if it's currently visible (meaning it's transitioning in)
                if (e.target === this.toastElement && this.isVisible) {
                    this.autoHide();
                }
            });
        }
    }

    show(type, title, message) {
        if (!this.toastElement || !this.toastContainer) { // Exit if toast isn't properly initialized
            console.warn("Toast element not found, cannot show notification.");
            return;
        }

        // Clear previous hide timeout if a new toast is shown
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.setContent(type, title, message);

        // Reset classes for entry animation
        this.toastElement.classList.remove('toast-exit', 'toast-show');
        this.toastElement.classList.add('toast-enter');

        // Force reflow/repaint to ensure 'toast-enter' styles are applied before 'toast-show'
        // This makes the transition smooth.
        void this.toastElement.offsetWidth; // 'void' keyword makes sure result is ignored

        setTimeout(() => {
            this.toastElement.classList.remove('toast-enter');
            this.toastElement.classList.add('toast-show');
            this.isVisible = true;
        }, 10); // Small delay to allow 'toast-enter' to render
    }

    hide() {
        if (!this.isVisible || !this.toastElement) return;

        // Clear auto-hide timeout if hidden manually
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Start exit animation
        this.toastElement.classList.remove('toast-show');
        this.toastElement.classList.add('toast-exit');
        this.isVisible = false;

        // After animation, reset to initial state (hidden and ready to enter again)
        // Adjust this timeout to match your CSS transition duration for 'toast-exit'
        setTimeout(() => {
            this.toastElement.classList.remove('toast-exit');
            this.toastElement.classList.add('toast-enter'); // Or just remove all display-related classes if 'toast-enter' just sets initial position
        }, 300); // Assuming 300ms transition for 'toast-exit'
    }

    autoHide() {
        if (!this.toastElement) return; // Exit if toast isn't properly initialized
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 5000); // Auto hide after 5 seconds
    }

    setContent(type, title, message) {
        if (!this.toastContainer || !this.toastIcon || !this.toastTitle || !this.toastMessage) {
            console.warn("Cannot set toast content, some sub-elements are missing.");
            return;
        }

        // Remove all previous border-left color classes
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue|gray)-500/g, '');

        // Set icon and color based on type
        switch (type) {
            case 'success':
                this.toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-green-500');
                break;
            case 'error':
                this.toastIcon.innerHTML = '<i class="fas fa-times-circle text-red-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-red-500');
                break;
            case 'warning':
                this.toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-yellow-500');
                break;
            case 'info':
                this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-blue-500');
                break;
            default:
                this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-gray-500');
        }

        this.toastTitle.textContent = title;
        this.toastMessage.textContent = message;
    }
}

// Function to update profile display elements
function updateProfileDisplay(fullname, subject, status) {
    const h4Element = document.querySelector('.text-center h4');
    const pElement = document.querySelector('.text-center p');
    const avatarRingSpan = document.querySelector('.avatar-ring + span');
    const statusBadge = document.querySelector('.badge-status');

    if (h4Element) h4Element.textContent = fullname;
    if (pElement) pElement.textContent = `Guru ${subject}`;
    if (avatarRingSpan) avatarRingSpan.textContent = fullname;

    if (statusBadge) {
        let statusClass = '';
        if (status === 'Aktif') {
            statusClass = 'status-active';
        } else if (status === 'Non Aktif') {
            statusClass = 'status-inactive';
        } else if (status === 'Cuti') {
            statusClass = 'status-leave';
        }

        statusBadge.textContent = status;
        statusBadge.classList.remove('status-active', 'status-inactive', 'status-leave'); // Clear existing
        statusBadge.classList.add(statusClass); // Add new
    }
}



// Form submission functionality
function initializeForm(toastInstance) { // Accepts toastInstance
    const profileForm = document.getElementById('profile-form');
    document.getElementById("profile-form").addEventListener("submit", function (e) {
        // Ambil semua field yang ingin divalidasi
        const fullname = document.getElementById("fullname");
        const gender = document.getElementById("gender");
        const id = document.getElementById("id");
       // const subject = document.getElementById("subject");

        // Reset warna border & hapus notifikasi sebelumnya
        document.querySelectorAll(".error-message").forEach(el => el.remove());
        [fullname, gender, id].forEach(el => el.style.borderColor = "");

        let valid = true;

        // Fungsi bantu untuk menampilkan pesan
        function showError(input, message) {
            const error = document.createElement("p");
            error.className = "text-red-500 text-sm mt-1 error-message";
            error.textContent = message;
            input.style.borderColor = "red";
            input.parentNode.appendChild(error);
            valid = false;
        }

        // Validasi tiap input
        if (fullname.value.trim() === "") {
            showError(fullname, "Nama lengkap wajib diisi");
        }

        if (gender.value === "") {
            showError(gender, "Jenis kelamin wajib dipilih");
        }

        if (id.value.trim() === "") {
            showError(id, "ID/NIP wajib diisi");
        }

        // (subject.value.trim() === "") {
        //    showError(subject, "Bidang tugas wajib diisi");
        //}

        // Jika tidak valid, cegah pengiriman form
        if (!valid) {
            e.preventDefault();
        }
    });

    if (!profileForm) {
        console.error("Profile form element (id='profile-form') not found.");
        return;
    }

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(profileForm);
        //const selectedSubject = document.getElementById('subject').value; // Hidden input for subject
        const statusSelect = document.getElementById('status');
        const selectedStatus = statusSelect ? statusSelect.options[statusSelect.selectedIndex].text : '';

        console.log('Form data submitted:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        // Ambil elemen form (atau data) sebelum dikirim
        const fullname = formData.get('fullname');
        const nip = formData.get('id');
        const gender = formData.get('gender');
        const status = formData.get('status');
       // const subject = formData.get('subject');

        // Validasi field wajib
        if (!fullname || !nip || !gender || !status) {
            if (toastInstance) {
                toastInstance.show('warning', 'Perubahan Data Gagal!', 'Semua field wajib diisi sebelum menyimpan.');
            } else {
                alert('Semua field wajib diisi sebelum menyimpan.');
            }
            return; // Hentikan proses jika tidak valid
        }


        // Send data to server (update_guru.php)
        fetch('../src/API/update_guru.php', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(result => {
                console.log('Server response:', result);
                if (result.includes('Berhasil')) {
                    updateProfileDisplay(formData.get('fullname'), selectedStatus);
                    if (toastInstance) {
                        toastInstance.show('success', 'Berhasil!', 'Profil berhasil diperbarui!');
                    } else {
                        alert('Profil berhasil diperbarui!');
                    }
                } else {
                    if (toastInstance) {
                        toastInstance.show('error', 'Gagal!', 'Gagal memperbarui profil: ' + result);
                    } else {
                        alert('Gagal memperbarui profil: ' + result);
                    }
                }
            })
            .catch(error => {
                console.error('Error during form submission:', error);
                if (toastInstance) {
                    toastInstance.show('error', 'Error!', 'Terjadi kesalahan saat mengirim data: ' + error.message);
                } else {
                    alert('Terjadi kesalahan saat mengirim data: ' + error.message);
                }
            });
    });
}



// Photo upload functionality
function initializePhotoUpload(toastInstance) { // Accepts toastInstance
    const photoUpload = document.getElementById('photo-upload');
    const profilePhoto = document.querySelector('.profile-photo');

    if (!photoUpload || !profilePhoto) {
        console.error("Photo upload elements not found. Initialization stopped.", {
            photoUpload: !!photoUpload,
            profilePhoto: !!profilePhoto
        });
        return;
    }

    photoUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhoto.src = e.target.result;
                if (toastInstance) {
                    toastInstance.show('success', 'Berhasil!', 'Foto profil berhasil diperbarui!');
                } else {
                    console.warn("Toast instance not available for photo upload notification.");
                    alert('Foto profil berhasil diperbarui!'); // Fallback
                }
            };
            reader.readAsDataURL(file);
        }
    });
}

// Run all initialization functions when the DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize ToastNotification first, as other components might use it.
    // This ensures its DOM elements are ready when the class is instantiated.
    const appToast = new ToastNotification(); // Renamed to appToast to avoid global `toast` conflict

    // 2. Pass the toast instance to functions that need it
    initializeSidebar();
    //initializeCombobox();
    initializeForm(appToast);
    initializePhotoUpload(appToast);

    console.log("All page functionalities initialized.");
});

// The global `toast` constant needs to be removed or adjusted.
// The original code had `const toast = new ToastNotification();` at the global scope,
// which is what caused the error. By moving it inside DOMContentLoaded, we fix it.
// If you need to access the toast globally (e.g., from other scripts or manual calls),
// you can expose it. For this code, passing it as an argument is sufficient.