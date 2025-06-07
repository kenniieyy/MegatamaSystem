// Toggle sidebar functionality
function initializeSidebar() {
  const toggleBtn = document.getElementById("toggle-sidebar")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("main-content")
  const overlay = document.getElementById("overlay")

  // Check if all elements exist
  if (!toggleBtn || !sidebar || !mainContent || !overlay) {
    console.error("Some elements not found:", {
      toggleBtn: !!toggleBtn,
      sidebar: !!sidebar,
      mainContent: !!mainContent,
      overlay: !!overlay,
    })
    return
  }

  // Function to reset all classes and styles
  function resetSidebarStates() {
    sidebar.classList.remove("collapsed", "mobile-open")
    overlay.classList.remove("show")
    // Reset inline styles if any
    sidebar.style.transform = ""
  }

  // Function to setup desktop layout
  function setupDesktopLayout() {
    resetSidebarStates()
    // On desktop, sidebar default open and main content adjusts
    mainContent.classList.remove("expanded")
    sidebar.classList.remove("collapsed")
  }

  // Function to setup mobile layout
  function setupMobileLayout() {
    resetSidebarStates()
    // On mobile, sidebar default closed
    sidebar.classList.add("collapsed")
    mainContent.classList.add("expanded")
  }

  // Function to open sidebar
  function openSidebar() {
    if (window.innerWidth <= 768) {
      // Mobile: use mobile-open class
      sidebar.classList.remove("collapsed")
      sidebar.classList.add("mobile-open")
      overlay.classList.add("show")
    } else {
      // Desktop: remove collapsed class
      sidebar.classList.remove("collapsed")
      mainContent.classList.remove("expanded")
    }
  }

  // Function to close sidebar
  function closeSidebar() {
    if (window.innerWidth <= 768) {
      // Mobile: close and remove overlay
      sidebar.classList.add("collapsed")
      sidebar.classList.remove("mobile-open")
      overlay.classList.remove("show")
    } else {
      // Desktop: collapse sidebar and expand main content
      sidebar.classList.add("collapsed")
      mainContent.classList.add("expanded")
    }
  }

  // Function to check sidebar status (open/closed)
  function isSidebarOpen() {
    if (window.innerWidth <= 768) {
      return sidebar.classList.contains("mobile-open")
    } else {
      return !sidebar.classList.contains("collapsed")
    }
  }

  // Function to handle responsive behavior
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
      console.log("Sidebar closed")
    } else {
      openSidebar()
      console.log("Sidebar opened")
    }
  })

  // Close sidebar when clicking overlay (mobile only)
  overlay.addEventListener("click", () => {
    console.log("Overlay clicked - closing sidebar")
    closeSidebar()
  })

  // Handle window resize
  let resizeTimeout
  window.addEventListener("resize", () => {
    // Debounce resize event for performance
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      handleResponsiveLayout()
    }, 100)
  })

  // Initialize layout based on current window size
  handleResponsiveLayout()

  console.log("Responsive sidebar initialized successfully")
}

//LOGIC UNTUK TOAST NOTIFICATION
class ToastNotification {
  constructor() {
    this.toastElement = document.getElementById('toast-notification');
    this.toastIcon = document.getElementById('toast-icon');
    this.toastTitle = document.getElementById('toast-title');
    this.toastMessage = document.getElementById('toast-message');
    this.toastClose = document.getElementById('toast-close');
    this.toastContainer = this.toastElement.querySelector('.bg-white');

    this.isVisible = false;
    this.hideTimeout = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Event listener untuk tombol close
    this.toastClose.addEventListener('click', () => {
      this.hide();
    });

    // Auto hide setelah 5 detik
    this.toastElement.addEventListener('transitionend', (e) => {
      if (e.target === this.toastElement && this.isVisible) {
        this.autoHide();
      }
    });
  }

  show(type, title, message) {
    // Clear timeout sebelumnya jika ada
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Set konten toast
    this.setContent(type, title, message);

    // Reset classes
    this.toastElement.classList.remove('toast-exit', 'toast-show');
    this.toastElement.classList.add('toast-enter');

    // Force reflow untuk memastikan class diterapkan
    this.toastElement.offsetHeight;

    // Tampilkan toast dengan animasi
    setTimeout(() => {
      this.toastElement.classList.remove('toast-enter');
      this.toastElement.classList.add('toast-show');
      this.isVisible = true;
    }, 10);
  }

  hide() {
    if (!this.isVisible) return;

    // Clear auto hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Sembunyikan dengan animasi
    this.toastElement.classList.remove('toast-show');
    this.toastElement.classList.add('toast-exit');
    this.isVisible = false;

    // Reset ke posisi awal setelah animasi selesai
    setTimeout(() => {
      this.toastElement.classList.remove('toast-exit');
      this.toastElement.classList.add('toast-enter');
    }, 300);
  }

  autoHide() {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 5000); // Auto hide setelah 5 detik
  }

  setContent(type, title, message) {
    // Reset border color
    this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');

    // Set icon dan warna berdasarkan type
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

// Inisialisasi toast notification
const toast = new ToastNotification();

// Combobox functionality
function initializeCombobox() {
  const input = document.getElementById('subject-input')
  const dropdown = document.getElementById('subject-dropdown')
  const hiddenInput = document.getElementById('subject')
  const addNewOption = document.getElementById('add-new-subject')
  const newSubjectText = document.getElementById('new-subject-text')

  let isOpen = false

  // Show dropdown
  function showDropdown() {
    dropdown.style.display = 'block'
    isOpen = true
  }

  // Hide dropdown
  function hideDropdown() {
    dropdown.style.display = 'none'
    isOpen = false
  }

  // Filter options based on input
  function filterOptions() {
    const searchTerm = input.value.toLowerCase()
    const options = dropdown.querySelectorAll('.combobox-option')
    let hasVisibleOptions = false

    options.forEach(option => {
      const text = option.textContent.toLowerCase()
      if (text.includes(searchTerm)) {
        option.style.display = 'block'
        hasVisibleOptions = true
      } else {
        option.style.display = 'none'
      }
    })

    // Show/hide "add new" option
    if (searchTerm && !hasVisibleOptions) {
      newSubjectText.textContent = input.value
      addNewOption.style.display = 'block'
    } else {
      addNewOption.style.display = 'none'
    }
  }

  // Select option
  function selectOption(value, text) {
    input.value = text || value
    hiddenInput.value = value
    hideDropdown()

    // Remove selected class from all options
    dropdown.querySelectorAll('.combobox-option').forEach(opt => {
      opt.classList.remove('selected')
    })

    // Add selected class to chosen option
    const selectedOption = dropdown.querySelector(`[data-value="${value}"]`)
    if (selectedOption) {
      selectedOption.classList.add('selected')
    }
  }

  // Event listeners
  input.addEventListener('focus', () => {
    showDropdown()
    filterOptions()
  })

  input.addEventListener('input', () => {
    filterOptions()
    if (!isOpen) showDropdown()
  })

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideDropdown()
    }
  })

  // Click on options
  dropdown.addEventListener('click', (e) => {
    if (e.target.classList.contains('combobox-option')) {
      const value = e.target.getAttribute('data-value')
      const text = e.target.textContent
      selectOption(value, text)
    } else if (e.target.closest('#add-new-subject')) {
      const newValue = input.value
      selectOption(newValue, newValue)

      // Add new option to dropdown for future use
      const newOption = document.createElement('div')
      newOption.className = 'combobox-option selected'
      newOption.setAttribute('data-value', newValue)
      newOption.textContent = newValue
      dropdown.insertBefore(newOption, addNewOption)
    }
  })

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      hideDropdown()
    }
  })
}

// Photo upload functionality
function initializePhotoUpload() {
  const photoUpload = document.getElementById('photo-upload')
  const profilePhoto = document.querySelector('.profile-photo')

  photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        profilePhoto.src = e.target.result
        toast.show('success', 'Berhasil!', 'Foto profil berhasil diperbarui!')
      }
      reader.readAsDataURL(file)
    }
  })
}

// Form submission
function initializeForm() {
  const form = document.getElementById('profile-form')

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    // Simulate form processing
    setTimeout(() => {
      toast.show('success', 'Berhasil!', 'Profil berhasil diperbarui!')
    }, 500)
  })
}

// Initialize everything when page loads
window.addEventListener('load', () => {
  initializeSidebar()
  initializeCombobox()
  initializePhotoUpload()
  initializeForm()
})