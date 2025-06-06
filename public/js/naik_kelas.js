// Contoh data siswa untuk kelas 7
const studentData = [
  {
    id: 1,
    name: "Ahmad Fauzi",
    gender: "Laki-laki",
    nis: "2024025",
    class: "7",
    phone: "081234567814",
    status: "pending",
  },
  {
    id: 2,
    name: "Anisa Putri",
    gender: "Perempuan",
    nis: "2024001",
    class: "7",
    phone: "081234567890",
    status: "pending",
  },
  {
    id: 3,
    name: "Budi Santoso",
    gender: "Laki-laki",
    nis: "2024006",
    class: "7",
    phone: "081234567895",
    status: "pending",
  },
  {
    id: 4,
    name: "Citra Dewi",
    gender: "Perempuan",
    nis: "2024015",
    class: "7",
    phone: "081234567804",
    status: "pending",
  },
  {
    id: 5,
    name: "Deni Kurniawan",
    gender: "Laki-laki",
    nis: "2024009",
    class: "7",
    phone: "081234567898",
    status: "pending",
  },
  {
    id: 6,
    name: "Eka Fitriani",
    gender: "Perempuan",
    nis: "2024019",
    class: "7",
    phone: "081234567808",
    status: "pending",
  },
  {
    id: 7,
    name: "Fajar Ramadhan",
    gender: "Laki-laki",
    nis: "2024003",
    class: "7",
    phone: "081234567892",
    status: "pending",
  },
  {
    id: 8,
    name: "Gita Nuraini",
    gender: "Perempuan",
    nis: "2024004",
    class: "7",
    phone: "081234567893",
    status: "pending",
  },
  {
    id: 9,
    name: "Hadi Prasetyo",
    gender: "Laki-laki",
    nis: "2024011",
    class: "7",
    phone: "081234567800",
    status: "pending",
  },
  {
    id: 10,
    name: "Indah Permata",
    gender: "Perempuan",
    nis: "2024027",
    class: "7",
    phone: "081234567816",
    status: "pending",
  },
]

// Variabel paginasi
let currentPage = 1
const itemsPerPage = 10
let currentAction = null
let currentStudentId = null
let isBulkPromotion = false

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

// Tampilkan modal konfirmasi
function showConfirmationModal(studentId, action) {
  const student = studentData.find((s) => s.id === studentId)
  const modal = document.getElementById("confirmation-modal")
  const message = document.getElementById("modal-message-naik-kelas")
  const confirmButton = document.getElementById("confirm-action")

  currentStudentId = studentId
  currentAction = action

  const actionText = action === "promote" ? "naik kelas" : "tidak naik kelas"
  message.textContent = `Apakah Anda yakin ingin menetapkan status ${actionText} untuk siswa ${student.name}?`

  confirmButton.onclick = () => confirmAction()

  modal.classList.add("show")
}

// Tampilkan modal konfirmasi untuk kenaikan kelas massal
function showBulkPromotionModal() {
  const modal = document.getElementById("confirmation-modal")
  const message = document.getElementById("modal-message-naik-kelas")
  const subMessage = document.getElementById("modal-submessage-naik-kelas")
  const confirmButton = document.getElementById("confirm-action")

  if (!modal || !message || !confirmButton) {
    console.error("Modal elements not found")
    return
  }

  // Hitung hanya siswa yang masih pending
  const pendingStudents = studentData.filter((student) => student.status === "pending")

  // Jika tidak ada siswa yang pending, tampilkan pesan khusus
  if (pendingStudents.length === 0) {
    message.textContent = "Tidak ada siswa yang perlu dinaikkan kelas."

    // Ubah tombol konfirmasi menjadi "Tutup"
    const newConfirmButton = confirmButton.cloneNode(true)
    confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton)

    document.getElementById("confirm-action").textContent = "Tutup"
    document.getElementById("confirm-action").addEventListener("click", closeModal)

    modal.classList.add("show")
    return
  }

  isBulkPromotion = true
  currentAction = "promote"
  currentStudentId = null

  message.textContent = `Tindakan ini akan menetapkan status "Naik Kelas" untuk ${pendingStudents.length} siswa yang belum diproses.`

  // "Hapus event listener lama (jika ada), lalu tambahkan event listener yang baru."
  const newConfirmButton = confirmButton.cloneNode(true)
  confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton)

  // Reset text tombol konfirmasi
  document.getElementById("confirm-action").textContent = "Konfirmasi"
  document.getElementById("confirm-action").addEventListener("click", confirmBulkAction)

  modal.classList.add("show")
}

// Tutup modal
function closeModal() {
  const modal = document.getElementById("confirmation-modal")
  modal.classList.remove("show")
  currentStudentId = null
  currentAction = null
  isBulkPromotion = false

  // Hapus subpesan
  const subMessage = document.getElementById("modal-submessage-naik-kelas")
  if (subMessage) {
    subMessage.textContent = ""
  }
}

// Konfirmasi tindakan
function confirmAction() {
  if (currentStudentId && currentAction) {
    const studentIndex = studentData.findIndex((s) => s.id === currentStudentId)
    if (studentIndex !== -1) {
      const student = studentData[studentIndex]
      studentData[studentIndex].status = currentAction
      renderStudentData()

      // Tampilkan toast notification berdasarkan aksi
      if (currentAction === 'promote') {
        toast.show('success', 'Berhasil!', `${student.name} berhasil dinaikkan kelas!`)
      } else if (currentAction === 'not_promote') {
        toast.show('info', 'Status Diperbarui!', `${student.name} ditetapkan tidak naik kelas.`)
      }
    }
  }
  closeModal()
}

// Konfirmasi tindakan massal
function confirmBulkAction() {
  if (isBulkPromotion && currentAction === "promote") {
    const pendingStudents = studentData.filter((student) => student.status === "pending")
    const promotedCount = pendingStudents.length

    studentData.forEach((student) => {
      if (student.status === "pending") {
        student.status = "promote"
      }
    })
    renderStudentData()

    // Tampilkan toast notification untuk bulk promotion
    toast.show('success', 'Berhasil!', `${promotedCount} siswa berhasil dinaikkan kelas!`)
  }
  closeModal()
}

// Render data siswa
function renderStudentData() {
  const tableBody = document.getElementById("student-data")
  const paginationInfo = document.getElementById("pagination-info")
  const paginationContainer = document.getElementById("pagination-numbers")
  const prevButton = document.getElementById("prev-page")
  const nextButton = document.getElementById("next-page")

  tableBody.innerHTML = ""

  if (studentData.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td colspan="7" class="text-center text-gray-500 py-4">
                Tidak ada data ditemukan
            </td>
        `
    tableBody.appendChild(row)
    paginationInfo.textContent = "Tidak ada data"
    paginationContainer.innerHTML = ""
    prevButton.style.display = "none"
    nextButton.style.display = "none"
    return
  }

  // Tampilkan pagination jika data ada
  prevButton.style.display = ""
  nextButton.style.display = ""

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, studentData.length)
  const paginatedData = studentData.slice(startIndex, endIndex)

  paginationInfo.textContent = `Menampilkan ${startIndex + 1}-${endIndex} dari ${studentData.length} data`

  paginatedData.forEach((student, index) => {
    const row = document.createElement("tr")
    row.className = "table-row"

    let statusBadge = ""
    let actionButtons = ""

    if (student.status === "promote") {
      statusBadge = `<span class="badge success">Naik Kelas</span>`
    } else if (student.status === "not_promote") {
      statusBadge = `<span class="badge danger">Tidak Naik</span>`
    } else {
      actionButtons = `
                <div class="flex space-x-2">
                    <button onclick="showConfirmationModal(${student.id}, 'promote')" class="btn-success">
                        Naik
                    </button>
                    <button onclick="showConfirmationModal(${student.id}, 'not_promote')" class="btn-danger">
                        Tidak Naik
                    </button>
                </div>
            `
    }

    row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${startIndex + index + 1}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.name}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.gender}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.nis}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.class}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.phone}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                ${statusBadge}${actionButtons}
            </td>
        `

    tableBody.appendChild(row)
  })

  renderPagination()
}

// Render kontrol pagination
function renderPagination() {
  const paginationContainer = document.getElementById("pagination-numbers")
  const totalPages = Math.ceil(studentData.length / itemsPerPage)

  paginationContainer.innerHTML = ""

  let startPage = Math.max(1, currentPage - 1)
  const endPage = Math.min(totalPages, startPage + 2)

  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2)
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button")
    pageButton.className = `pagination-item ${i === currentPage ? "active" : "text-gray-700"}`
    pageButton.textContent = i
    pageButton.addEventListener("click", () => {
      currentPage = i
      renderStudentData()
    })
    paginationContainer.appendChild(pageButton)
  }

  const prevButton = document.getElementById("prev-page")
  const nextButton = document.getElementById("next-page")

  prevButton.disabled = currentPage === 1
  nextButton.disabled = currentPage === totalPages

  prevButton.replaceWith(prevButton.cloneNode(true))
  nextButton.replaceWith(nextButton.cloneNode(true))

  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderStudentData()
    }
  })

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++
      renderStudentData()
    }
  })
}

// Inisialisasi fungsi tombol
function initializeButtons() {
  const exportButton = document.getElementById("btn-export-data")
  const promoteAllButton = document.getElementById("btn-promote-all")

  exportButton.addEventListener("click", () => {
    // Simulasi export data
    setTimeout(() => {
      toast.show('success', 'Berhasil!', 'Data berhasil diekspor!')
    }, 500)
  })

  promoteAllButton.addEventListener("click", () => {
    showBulkPromotionModal()
  })
}

// Jalankan saat halaman dimuat
window.addEventListener("load", () => {
  initializeSidebar()
  initializeButtons()
  renderStudentData()
})

// Jadikan fungsi tersedia secara global
window.showConfirmationModal = showConfirmationModal
window.showBulkPromotionModal = showBulkPromotionModal
window.closeModal = closeModal
window.confirmAction = confirmAction
window.confirmBulkAction = confirmBulkAction