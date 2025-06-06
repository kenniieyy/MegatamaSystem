// Simulasi peran pengguna - ubah ini untuk menguji skenario yang berbeda
const currentUser = {
  name: "Olivia Putri",
  role: "teacher", // 'homeroom_teacher' or 'teacher'
  class: "7", // Hanya untuk guru wali kelas
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
}

// Contoh data siswa kelas 7 (hanya ditampilkan untuk guru wali kelas)
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
  const subMessage = document.getElementById("modal-submessage-naik-kelas")

  if (modal) {
    modal.classList.remove("show")
  }

  currentStudentId = null
  currentAction = null
  isBulkPromotion = false

  // Hapus subpesan
  if (subMessage) {
    subMessage.textContent = ""
  }
}

// Konfirmasi tindakan individual
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

// Render pesan akses ditolak
function renderAccessDenied() {
  const container = document.getElementById("content-container")
  if (!container) return

  container.innerHTML = `
        <main class="p-4 bg-pattern">
            <div class="access-denied-container">
                <div class="access-denied">
                    <div class="access-denied-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2>Akses Terbatas</h2>
                    <p>
                        Saat ini Anda tidak terdaftar sebagai <strong>Wali Kelas</strong> dalam sistem.<br>
                        Oleh karena itu, Anda tidak memiliki akses untuk mengelola data kenaikan kelas siswa.
                    </p>
                </div>
            </div>
        </main>
    `
}

// Render tabel data siswa (untuk guru wali kelas)
function renderStudentTable() {
  const container = document.getElementById("content-container")
  if (!container) return

  container.innerHTML = `
        <main class="p-4 bg-pattern">
            <!-- Tabel Data Siswa -->
            <div class="card mb-4">
                <div class="card-header flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <h3 class="text-base font-medium text-gray-700">Tabel Data Kenaikan Kelas</h3>
                    <div class="flex flex-wrap gap-2">
                        <!-- Promote All Button -->
                        <button id="btn-promote-all" class="btn-success flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            Naikkan Semua Siswa
                        </button>
                        <!-- Export Button -->
                        <button id="btn-export-data" class="btn-gradient flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export Data
                        </button>
                    </div>
                </div>
                <div class="p-3">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="table-header text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th class="px-4 py-3 text-left">No</th>
                                    <th class="px-4 py-3 text-left">Nama Lengkap</th>
                                    <th class="px-4 py-3 text-left">Jenis Kelamin</th>
                                    <th class="px-4 py-3 text-left">NIS</th>
                                    <th class="px-4 py-3 text-left">Kelas</th>
                                    <th class="px-4 py-3 text-left">No HP</th>
                                    <th class="px-4 py-3 text-left">Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="student-data" class="bg-white divide-y divide-gray-200 text-sm">
                                <!-- Data diisi oleh JavaScript -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between mt-4">
                        <div id="pagination-info" class="text-sm text-gray-500">
                            Menampilkan 1-10 dari ${studentData.length} data
                        </div>
                        <div class="flex items-center space-x-1">
                            <button id="prev-page" class="pagination-item text-gray-500" disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div id="pagination-numbers" class="flex items-center space-x-1">
                                <!-- Nomor pagination akan diisi oleh JavaScript -->
                            </div>
                            <button id="next-page" class="pagination-item text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `

  // Render data siswa dan pagination
  renderStudentData()
  initializeButtons()
}

// Render data siswa
function renderStudentData() {
  const tableBody = document.getElementById("student-data")
  const paginationInfo = document.getElementById("pagination-info")

  if (!tableBody) return // Guard clause jika elemen tidak ada

  tableBody.innerHTML = ""

  if (studentData.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td colspan="7" class="text-center text-gray-500 py-4">
                Tidak ada data ditemukan
            </td>
        `
    tableBody.appendChild(row)
    if (paginationInfo) paginationInfo.textContent = "Tidak ada data"
    return
  }

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, studentData.length)
  const paginatedData = studentData.slice(startIndex, endIndex)

  if (paginationInfo) {
    paginationInfo.textContent = `Menampilkan ${startIndex + 1}-${endIndex} dari ${studentData.length} data`
  }

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

  if (!paginationContainer) return

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

  // Update pagination buttons
  const prevButton = document.getElementById("prev-page")
  const nextButton = document.getElementById("next-page")

  if (prevButton) {
    prevButton.disabled = currentPage === 1
    prevButton.onclick = () => {
      if (currentPage > 1) {
        currentPage--
        renderStudentData()
      }
    }
  }

  if (nextButton) {
    nextButton.disabled = currentPage === totalPages
    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++
        renderStudentData()
      }
    }
  }
}

// Inisialisasi fungsi tombol
function initializeButtons() {
  const exportButton = document.getElementById("btn-export-data")
  const promoteAllButton = document.getElementById("btn-promote-all")

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      // Simulasi export data
      setTimeout(() => {
        toast.show('success', 'Berhasil!', 'Data berhasil diekspor!')
      }, 500)
    })
  }

  if (promoteAllButton) {
    promoteAllButton.addEventListener("click", () => {
      showBulkPromotionModal()
    })
  }
}

// Inisialisasi halaman berdasarkan peran pengguna
function initializePage() {
  if (currentUser.role === "homeroom_teacher") {
    renderStudentTable()
  } else {
    renderAccessDenied()
  }
}

// Fungsi untuk mensimulasikan perubahan peran (untuk pengujian programmatik)
function changeUserRole(newRole) {
  currentUser.role = newRole
  if (newRole === "homeroom_teacher") {
    currentUser.class = "7"
  } else {
    currentUser.class = null
  }

  // Reset pagination saat berganti role
  currentPage = 1

  initializePage()
}

// Jalankan saat halaman dimuat
window.addEventListener("load", () => {
  initializeSidebar()
  initializePage()
})

// Jadikan fungsi tersedia secara global
window.showConfirmationModal = showConfirmationModal
window.showBulkPromotionModal = showBulkPromotionModal
window.closeModal = closeModal
window.confirmAction = confirmAction
window.confirmBulkAction = confirmBulkAction
window.changeUserRole = changeUserRole