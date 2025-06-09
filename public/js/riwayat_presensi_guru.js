// Mengatur sidebar
// function initializeSidebar() {
//     const toggleButton = document.getElementById("toggle-sidebar")
//     const sidebar = document.getElementById("sidebar")
//     const mainContent = document.getElementById("main-content")
//     const overlay = document.getElementById("overlay")

//     toggleButton.addEventListener("click", () => {
//         sidebar.classList.toggle("collapsed")
//         sidebar.classList.toggle("mobile-open")
//         mainContent.classList.toggle("expanded")
//         overlay.classList.toggle("show")
//     })

//     overlay.addEventListener("click", () => {
//         sidebar.classList.remove("mobile-open")
//         overlay.classList.remove("show")
//     })
// }

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

// Mengatur tombol jenis absensi (datang/pulang)
function initializeAttendanceTypeTabs() {
  const datangButton = document.getElementById("btn-absen-datang")
  const pulangButton = document.getElementById("btn-absen-pulang")

  datangButton.addEventListener("click", () => {
    datangButton.classList.add("active")
    pulangButton.classList.remove("active")
    currentAttendanceType = "datang"
    currentPage = 1
    renderAttendanceData()
  })

  pulangButton.addEventListener("click", () => {
    pulangButton.classList.add("active")
    datangButton.classList.remove("active")
    currentAttendanceType = "pulang"
    currentPage = 1
    renderAttendanceData()
  })
}

// Data bulan
const months = [
  { value: "januari", label: "Januari" },
  { value: "februari", label: "Februari" },
  { value: "maret", label: "Maret" },
  { value: "april", label: "April" },
  { value: "mei", label: "Mei" },
  { value: "juni", label: "Juni" },
  { value: "juli", label: "Juli" },
  { value: "agustus", label: "Agustus" },
  { value: "september", label: "September" },
  { value: "oktober", label: "Oktober" },
  { value: "november", label: "November" },
  { value: "desember", label: "Desember" },
]

// Mengatur filter bulan
function initializeMonthFilter() {
  const monthFilter = document.getElementById("month-filter")
  monthFilter.innerHTML = "" // Clear existing options

  months.forEach((month) => {
    const option = document.createElement("option")
    option.value = month.value
    option.textContent = month.label
    if (month.value === currentMonth) {
      option.selected = true
    }
    monthFilter.appendChild(option)
  })

  monthFilter.addEventListener("change", function () {
    currentMonth = this.value
    currentPage = 1
    renderAttendanceData()
  })
}

// Fungsi untuk memeriksa apakah waktu berada dalam rentang tertentu
function isTimeInRange(timeStr, startHour, endHour) {
  if (timeStr === "-") return false

  const timeParts = timeStr.split(":")
  const hour = Number.parseInt(timeParts[0], 10)

  return hour >= startHour && hour < endHour
}

// Generator data untuk bulan tertentu
function generateMonthData(month) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const monthIndex = months.findIndex((m) => m.value === month)

  // Hanya generate data sampai bulan mei
  if (!["januari", "februari", "maret", "april", "mei"].includes(month)) {
    return []
  }

  const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
  const data = []

  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${day.toString().padStart(2, "0")}-${month.charAt(0).toUpperCase() + month.slice(1)}-${currentYear}`

    const generateTime = () => {
      const rand = Math.random()
      if (rand < 0.15) return "-"

      const hour = Math.floor(Math.random() * 3) + (currentAttendanceType === "datang" ? 7 : 15)
      const minute = Math.floor(Math.random() * 60)
      const second = Math.floor(Math.random() * 60)
      return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
    }

    const time = generateTime()
    const isAbsent = time === "-"

    data.push({
      id: day,
      date,
      time,
      status: isAbsent ? "Tidak Hadir" : "Hadir",
      note: isAbsent
        ? "Absen Tidak Dilakukan"
        : currentAttendanceType === "datang"
          ? Number.parseInt(time.split(":")[0]) < 8
            ? "Tepat Waktu"
            : "Terlambat"
          : Number.parseInt(time.split(":")[0]) < 16
            ? "Tepat Waktu"
            : "Terlambat",
    })
  }

  return data
}

// Data kehadiran dinamis
function getAttendanceData() {
  return {
    datang: generateMonthData(currentMonth),
    pulang: generateMonthData(currentMonth),
  }
}

// Memperbarui data kehadiran berdasarkan aturan waktu
function updateAttendanceData(data) {
  // Memperbarui data absen datang
  data.datang.forEach((item) => {
    if (item.time === "-") {
      item.status = "Tidak Hadir"
      item.note = "Absen Tidak Dilakukan"
    } else {
      const timeParts = item.time.split(":")
      const hour = Number.parseInt(timeParts[0], 10)

      if (hour >= 7 && hour < 8) {
        item.status = "Hadir"
        item.note = "Tepat Waktu"
      } else {
        item.status = "Hadir"
        item.note = "Terlambat"
      }
    }
  })

  // Memperbarui data absen pulang
  data.pulang.forEach((item) => {
    if (item.time === "-") {
      item.status = "Tidak Hadir"
      item.note = "Absen Tidak Dilakukan"
    } else {
      const timeParts = item.time.split(":")
      const hour = Number.parseInt(timeParts[0], 10)

      if (hour >= 15 && hour < 16) {
        item.status = "Hadir"
        item.note = "Tepat Waktu"
      } else {
        item.status = "Hadir"
        item.note = "Terlambat"
      }
    }
  })

  return data
}

// Variabel untuk paginasi
let currentPage = 1
const itemsPerPage = 9
let currentAttendanceType = "datang"
let currentMonth = "april"

// Menampilkan data kehadiran berdasarkan halaman dan filter saat ini
function renderAttendanceData() {
  const tableBody = document.getElementById("attendance-data")
  const data = updateAttendanceData(getAttendanceData())[currentAttendanceType]

  // Menghapus data yang ada
  tableBody.innerHTML = ""

  // Jika tidak ada data, tampilkan pesan
  if (data.length === 0) {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td colspan="6" class="text-center py-4 text-gray-500">Tidak ada data yang ditemukan</td>
        `
    tableBody.appendChild(row)

    // Ganti teks pagination dengan "Tidak ada data"
    document.getElementById("pagination-info").textContent = "Tidak ada data"
    document.getElementById("pagination-numbers").innerHTML = ""
    document.getElementById("prev-page").style.display = "none"
    document.getElementById("next-page").style.display = "none"
    return
  }

  // Tampilkan pagination controls
  document.getElementById("prev-page").style.display = "block"
  document.getElementById("next-page").style.display = "block"

  // Menghitung paginasi
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, data.length)
  const paginatedData = data.slice(startIndex, endIndex)

  // Memperbarui informasi paginasi
  document.getElementById("pagination-info").textContent =
    `Menampilkan ${startIndex + 1}-${endIndex} dari ${data.length} data`

  // Menampilkan baris data
  paginatedData.forEach((item) => {
    const row = document.createElement("tr")
    row.className = "table-row"

    // Menentukan kelas badge berdasarkan catatan
    let badgeClass = "success"
    if (item.note === "Terlambat") {
      badgeClass = "danger"
    } else if (item.note === "Absen Tidak Dilakukan") {
      badgeClass = "warning"
    }

    row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap">
                <img class="h-8 w-8 rounded-full object-cover" src="https://randomuser.me/api/portraits/women/44.jpg" alt="User avatar">
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.date}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.time}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.status}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="badge ${badgeClass}">${item.note}</span>
            </td>
        `

    tableBody.appendChild(row)
  })

  // Memperbarui kontrol paginasi
  renderPagination()
}

// Menampilkan kontrol paginasi
function renderPagination() {
  const paginationContainer = document.getElementById("pagination-numbers")
  const data = updateAttendanceData(getAttendanceData())[currentAttendanceType]
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Menghapus paginasi yang ada
  paginationContainer.innerHTML = ""

  // Jika tidak ada data, return
  if (data.length === 0) return

  // Menentukan nomor halaman yang akan ditampilkan
  let startPage = Math.max(1, currentPage - 1)
  const endPage = Math.min(totalPages, startPage + 2)

  // Menyesuaikan jika kita berada di akhir
  if (endPage - startPage < 2) {
    startPage = Math.max(1, endPage - 2)
  }

  // Membuat tombol nomor halaman
  for (let i = startPage; i <= endPage; i++) {
    const pageButton = document.createElement("button")
    pageButton.className = `pagination-item ${i === currentPage ? "active" : "text-gray-700"}`
    pageButton.textContent = i
    pageButton.addEventListener("click", () => {
      currentPage = i
      renderAttendanceData()
    })
    paginationContainer.appendChild(pageButton)
  }

  // Memperbarui tombol sebelumnya/selanjutnya
  const prevButton = document.getElementById("prev-page")
  const nextButton = document.getElementById("next-page")

  prevButton.disabled = currentPage === 1
  nextButton.disabled = currentPage === totalPages

  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderAttendanceData()
    }
  })

  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++
      renderAttendanceData()
    }
  })
}

// Add the ToastNotification class implementation right before the initializeExportPDF function

//LOGIC UNTUK TOAST NOTIFICATION
class ToastNotification {
  constructor() {
    this.toastElement = document.getElementById("toast-notification")
    this.toastIcon = document.getElementById("toast-icon")
    this.toastTitle = document.getElementById("toast-title")
    this.toastMessage = document.getElementById("toast-message")
    this.toastClose = document.getElementById("toast-close")
    this.toastContainer = this.toastElement.querySelector(".bg-white")

    this.isVisible = false
    this.hideTimeout = null

    this.setupEventListeners()
  }

  setupEventListeners() {
    // Event listener untuk tombol close
    this.toastClose.addEventListener("click", () => {
      this.hide()
    })

    // Auto hide setelah 5 detik
    this.toastElement.addEventListener("transitionend", (e) => {
      if (e.target === this.toastElement && this.isVisible) {
        this.autoHide()
      }
    })
  }

  show(type, title, message) {
    // Clear timeout sebelumnya jika ada
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }

    // Set konten toast
    this.setContent(type, title, message)

    // Reset classes
    this.toastElement.classList.remove("toast-exit", "toast-show")
    this.toastElement.classList.add("toast-enter")

    // Force reflow untuk memastikan class diterapkan
    this.toastElement.offsetHeight

    // Tampilkan toast dengan animasi
    setTimeout(() => {
      this.toastElement.classList.remove("toast-enter")
      this.toastElement.classList.add("toast-show")
      this.isVisible = true
    }, 10)
  }

  hide() {
    if (!this.isVisible) return

    // Clear auto hide timeout
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout)
    }

    // Sembunyikan dengan animasi
    this.toastElement.classList.remove("toast-show")
    this.toastElement.classList.add("toast-exit")
    this.isVisible = false

    // Reset ke posisi awal setelah animasi selesai
    setTimeout(() => {
      this.toastElement.classList.remove("toast-exit")
      this.toastElement.classList.add("toast-enter")
    }, 300)
  }

  autoHide() {
    this.hideTimeout = setTimeout(() => {
      this.hide()
    }, 5000) // Auto hide setelah 5 detik
  }

  setContent(type, title, message) {
    // Reset border color
    this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, "")

    // Set icon dan warna berdasarkan type
    switch (type) {
      case "success":
        this.toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>'
        this.toastContainer.classList.add("border-l-green-500")
        break
      case "error":
        this.toastIcon.innerHTML = '<i class="fas fa-times-circle text-red-500 text-xl"></i>'
        this.toastContainer.classList.add("border-l-red-500")
        break
      case "warning":
        this.toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>'
        this.toastContainer.classList.add("border-l-yellow-500")
        break
      case "info":
        this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>'
        this.toastContainer.classList.add("border-l-blue-500")
        break
      default:
        this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500 text-xl"></i>'
        this.toastContainer.classList.add("border-l-gray-500")
    }

    this.toastTitle.textContent = title
    this.toastMessage.textContent = message
  }
}

// Inisialisasi toast notification
const toast = new ToastNotification()

// Modify the initializeExportPDF function to use the toast notification instead of alert
function initializeExportPDF() {
  const exportPdfBtn = document.getElementById("btn-export-pdf")

  exportPdfBtn.addEventListener("click", () => {
    toast.show("success", "Berhasil!", "Data berhasil diekspor!")
  })
}

// Menjalankan saat halaman dimuat
window.addEventListener("load", () => {
  initializeSidebar()
  initializeAttendanceTypeTabs()
  initializeMonthFilter()
  initializeExportPDF()
  renderAttendanceData()
})
