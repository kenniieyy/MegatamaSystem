// Mengatur sidebar
// function initializeSidebar() {
//   const toggleButton = document.getElementById("toggle-sidebar")
//   const sidebar = document.getElementById("sidebar")
//   const mainContent = document.getElementById("main-content")
//   const overlay = document.getElementById("overlay")

//   toggleButton.addEventListener("click", () => {
//     sidebar.classList.toggle("collapsed")
//     sidebar.classList.toggle("mobile-open")
//     mainContent.classList.toggle("expanded")
//     overlay.classList.toggle("show")
//   })

//   overlay.addEventListener("click", () => {
//     sidebar.classList.remove("mobile-open")
//     overlay.classList.remove("show")
//   })
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

// Data bulan
const months = [
  { value: "januari", label: "Januari", index: 0 },
  { value: "februari", label: "Februari", index: 1 },
  { value: "maret", label: "Maret", index: 2 },
  { value: "april", label: "April", index: 3 },
  { value: "mei", label: "Mei", index: 4 },
  { value: "juni", label: "Juni", index: 5 },
  { value: "juli", label: "Juli", index: 6 },
  { value: "agustus", label: "Agustus", index: 7 },
  { value: "september", label: "September", index: 8 },
  { value: "oktober", label: "Oktober", index: 9 },
  { value: "november", label: "November", index: 10 },
  { value: "desember", label: "Desember", index: 11 },
]

//data dummy guru
const dummyGuru = [
  {
    id: 1,
    name: "Siti Nurhaliza, S.Pd",
    gender: "Perempuan",
    nip: "19800412 200903 2 001",
    subject: "Agama Islam",
    waliKelas: "Wali Kelas 7",
    status: "Aktif",
    photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Ahmad Fauzan, M.Pd",
    gender: "Laki - Laki",
    nip: "19791105 200701 1 002",
    subject: "Fisika",
    waliKelas: "Wali Kelas 9",
    status: "Non-Aktif",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Rina Kartikasari, S.Pd",
    gender: "Perempuan",
    nip: "19870217 201001 2 003",
    subject: "IPS",
    waliKelas: "Wali Kelas 8",
    status: "Aktif",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "Dedi Hartono, S.Pd",
    gender: "Laki - Laki",
    nip: "19750503 199903 1 004",
    subject: "Biologi",
    waliKelas: "Wali Kelas 12",
    status: "Non-Aktif",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Yuliana Maharani, M.Pd",
    gender: "Perempuan",
    nip: "19860526 201102 2 005",
    subject: "Bahasa Inggris",
    waliKelas: "",
    status: "Aktif",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 6,
    name: "Lestari Widyaningrum, S.Pd",
    gender: "Perempuan",
    nip: "19820115 200503 1 006",
    subject: "Bahasa Indonesia",
    waliKelas: "Wali Kelas 11",
    status: "Non-Aktif",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 7,
    name: "Olivia Putri, S.Pd",
    gender: "Perempuan",
    nip: "19881122 201203 2 007",
    subject: "Matematika",
    waliKelas: "Wali Kelas 10",
    status: "Aktif",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 8,
    name: "Andi Seputra, S.Sn",
    gender: "Laki - Laki",
    nip: "19891201 201104 1 008",
    subject: "Sejarah",
    waliKelas: "",
    status: "Non-Aktif",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 9,
    name: "Teguh Prasetyo, S.Pd",
    gender: "Laki - Laki",
    nip: "19760808 200001 2 009",
    subject: "Agama Islam",
    waliKelas: "",
    status: "Non-Aktif",
    photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 10,
    name: "Dewi Lestari, S.Pd",
    gender: "Perempuan",
    nip: "19830614 201001 2 003",
    subject: "Bahasa Indonesia",
    waliKelas: "",
    status: "Aktif",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 11,
    name: "Budi Santoso, M.T",
    gender: "Laki-laki",
    nip: "19810203 200702 1 004",
    subject: "Matematika",
    waliKelas: "",
    status: "Non-Aktif",
    photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 12,
    name: "Rina Marlina, S.Kom",
    gender: "Perempuan",
    nip: "19890517 201203 2 005",
    subject: "IPS",
    waliKelas: "",
    status: "Aktif",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face",
  },
]

//data dummy siswa
const dummySiswa = [
  {
    id: 1,
    name: "Rizky Pratama",
    jenis_kelamin: "Laki - Laki",
    nis: "2301456781",
    kelas: "9",
    noHp: "081234567890",
    status: "Aktif",
  },
  {
    id: 2,
    name: "Salsabila Azzahra",
    jenis_kelamin: "Perempuan",
    nis: "2301456782",
    kelas: "12",
    noHp: "082156781234",
    status: "Lulus",
  },
  {
    id: 3,
    name: "Dimas Arya Nugroho",
    jenis_kelamin: "Laki - Laki",
    nis: "2301456783",
    kelas: "9",
    noHp: "085723456789",
    status: "Lulus",
  },
  {
    id: 4,
    name: "Aulia Rahmawati",
    jenis_kelamin: "Perempuan",
    nis: "2301456784",
    kelas: "7",
    noHp: "081398765432",
    status: "Non-Aktif",
  },
  {
    id: 5,
    name: "Fadlan Nur Ramadhan",
    jenis_kelamin: "Laki - Laki",
    nis: "2301456785",
    kelas: "11",
    noHp: "082287654321",
    status: "Aktif",
  },
  {
    id: 6,
    name: "Nabila Khairunnisa",
    jenis_kelamin: "Perempuan",
    nis: "2301456786",
    kelas: "10",
    noHp: "089012345678",
    status: "Non-Aktif",
  },
  {
    id: 7,
    name: "Alif Maulana",
    jenis_kelamin: "Laki - Laki",
    nis: "2301456787",
    kelas: "10",
    noHp: "083122334455",
    status: "Aktif",
  },
  {
    id: 8,
    name: "Zahra Melani Putri",
    jenis_kelamin: "Perempuan",
    nis: "2301456788",
    kelas: "7",
    noHp: "085377889900",
    status: "Non-Aktif",
  },
  {
    id: 9,
    name: "Yoga Pradipta",
    jenis_kelamin: "Laki - Laki",
    nis: "2301456789",
    kelas: "12",
    noHp: "087766554433",
    status: "Non-Aktif",
  },
  {
    id: 10,
    name: "Aisyah Nur Azizah",
    jenis_kelamin: "Perempuan",
    nis: "2301456790",
    kelas: "8",
    noHp: "081299887766",
    status: "Aktif",
  },
  {
    id: 11,
    name: "Bayu Setiawan",
    jenis_kelamin: "Laki - Laki",
    nis: "2301456791",
    kelas: "9",
    noHp: "082334455667",
    status: "Aktif",
  },
  {
    id: 12,
    name: "Citra Dewi",
    jenis_kelamin: "Perempuan",
    nis: "2301456792",
    kelas: "11",
    noHp: "085566778899",
    status: "Lulus",
  },
]

// Variabel untuk paginasi dan state
let currentPage = 1
const itemsPerPage = 9
let currentAttendanceType = "datang"
let currentMonth = "april"
let filteredData = []

// Get status badge class - untuk siswa
function getStatusBadge(status) {
  switch (status.toLowerCase()) {
    case "hadir":
      return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Hadir</span>'
    case "sakit":
      return '<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Sakit</span>'
    case "izin":
      return '<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Izin</span>'
    case "alpa":
      return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Alpa</span>'
    default:
      return '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>'
  }
}

// Get keterangan badge class untuk guru - mengikuti model status siswa
function getKeteranganBadge(keterangan) {
  switch (keterangan) {
    case "Tepat Waktu":
      return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Tepat Waktu</span>'
    case "Terlambat":
      return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Terlambat</span>'
    case "Absen Tidak Dilakukan":
      return '<span class="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Absen Tidak Dilakukan</span>'
  }
}

// Fungsi bantu untuk dapatkan label bulan dari value
function getMonthLabel(value) {
  const m = months.find((m) => m.value === value)
  return m ? m.label : ""
}

// Fungsi bantu untuk mendapatkan index bulan
function getMonthIndex(value) {
  const m = months.find((m) => m.value === value)
  return m ? m.index : 0
}

// Fungsi bantu format tanggal agar konsisten
function formatTanggal(day, monthValue, year) {
  const label = getMonthLabel(monthValue)
  return `${String(day).padStart(2, "0")}-${label}-${year}`
}

// Fungsi untuk mengkonversi format tanggal dari input date ke format internal
function convertDateInputToInternal(dateInput) {
  if (!dateInput) return null

  const [year, month, day] = dateInput.split("-")
  const monthIndex = Number.parseInt(month, 10) - 1 // month input is 1-based, array is 0-based
  const monthValue = months[monthIndex].value

  return {
    day: Number.parseInt(day, 10),
    month: monthValue,
    year: Number.parseInt(year, 10),
    formatted: formatTanggal(day, monthValue, year),
  }
}

// Generator data guru untuk bulan dan tahun tertentu
function generateGuruData() {
  const monthIndex = getMonthIndex(currentMonth)
  const tanggalInput = document.getElementById("tanggal")
  let year = new Date().getFullYear()

  // Jika ada input tanggal, ambil tahun dari sana
  if (tanggalInput && tanggalInput.value) {
    const dateInfo = convertDateInputToInternal(tanggalInput.value)
    if (dateInfo) {
      year = dateInfo.year
      // Update currentMonth jika user memilih tanggal spesifik
      currentMonth = dateInfo.month
    }
  }

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const data = []

  dummyGuru.forEach((teacher) => {
    for (let d = 1; d <= daysInMonth; d++) {
      const date = formatTanggal(d, currentMonth, year)
      const isPresent = Math.random() > 0.15
      let time = "-",
        status = "",
        note = ""

      if (isPresent) {
        const hour = Math.floor(Math.random() * 2) + (currentAttendanceType === "datang" ? 7 : 15)
        const minute = Math.floor(Math.random() * 60)
        time = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`
        status = "Hadir"
        note = hour < (currentAttendanceType === "datang" ? 8 : 16) ? "Tepat Waktu" : "Terlambat"
      } else {
        // Tidak hadir
        time = "-"
        status = "Tidak Hadir"
        note = "Absen Tidak Dilakukan"
      }

      data.push({
        name: teacher.name,
        avatar: teacher.photo,
        date,
        time,
        status,
        note,
        day: d,
        month: currentMonth,
        year,
      })
    }
  })

  return data
}

// Generator data siswa untuk bulan dan tahun tertentu
function generateSiswaData() {
  const monthIndex = getMonthIndex(currentMonth)
  const tanggalInput = document.getElementById("tanggal")
  let year = new Date().getFullYear()

  // Jika ada input tanggal, ambil tahun dari sana
  if (tanggalInput && tanggalInput.value) {
    const dateInfo = convertDateInputToInternal(tanggalInput.value)
    if (dateInfo) {
      year = dateInfo.year
      // Update currentMonth jika user memilih tanggal spesifik
      currentMonth = dateInfo.month
    }
  }

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const data = []

  dummySiswa.forEach((siswa) => {
    for (let d = 1; d <= daysInMonth; d++) {
      const tanggal = formatTanggal(d, currentMonth, year)
      const status = Math.random() < 0.85 ? "Hadir" : ["Izin", "Sakit", "Alpa"][Math.floor(Math.random() * 3)]

      data.push({
        ...siswa,
        tanggal,
        status,
        day: d,
        month: currentMonth,
        year,
      })
    }
  })

  return data
}

// Fungsi search yang diperbaiki
function performSearch(data, searchTerm) {
  if (!searchTerm || searchTerm.length < 2) {
    return data // Return all data if search term is too short
  }

  const lowerSearchTerm = searchTerm.toLowerCase()

  return data.filter((item) => {
    // Search by name (works for both guru and siswa)
    const nameMatch = item.name && item.name.toLowerCase().includes(lowerSearchTerm)

    // For siswa, also search by NIS
    const nisMatch = item.nis && item.nis.toLowerCase().includes(lowerSearchTerm)

    return nameMatch || nisMatch
  })
}

// Fungsi untuk mengupdate opsi status berdasarkan tipe
function updateStatusOptions() {
  const tipe = document.getElementById("tipe").value
  const statusSelect = document.getElementById("status")
  const currentValue = statusSelect.value

  // Clear existing options
  statusSelect.innerHTML = ""

  if (tipe === "guru") {
    // Opsi status untuk guru
    const guruOptions = [
      { value: "semua", text: "Semua Status" },
      { value: "hadir", text: "Hadir" },
      { value: "tidak hadir", text: "Tidak Hadir" },
    ]

    guruOptions.forEach((option) => {
      const optionElement = document.createElement("option")
      optionElement.value = option.value
      optionElement.textContent = option.text
      statusSelect.appendChild(optionElement)
    })
  } else {
    // Opsi status untuk siswa
    const siswaOptions = [
      { value: "semua", text: "Semua Status" },
      { value: "hadir", text: "Hadir" },
      { value: "sakit", text: "Sakit" },
      { value: "izin", text: "Izin" },
      { value: "alpa", text: "Alpa" },
    ]

    siswaOptions.forEach((option) => {
      const optionElement = document.createElement("option")
      optionElement.value = option.value
      optionElement.textContent = option.text
      statusSelect.appendChild(optionElement)
    })
  }

  // Restore previous value if it exists in new options
  const availableValues = Array.from(statusSelect.options).map((opt) => opt.value)
  if (availableValues.includes(currentValue)) {
    statusSelect.value = currentValue
  } else {
    statusSelect.value = "semua"
  }
}

// Fungsi untuk mengupdate tampilan filter berdasarkan tipe
function updateFilterVisibility() {
  const tipe = document.getElementById("tipe").value
  const kelasFilter = document.getElementById("kelas")
  const absenButtons = document.getElementById("btn-absen-datang").parentElement

  if (tipe === "guru") {
    // Untuk guru: sembunyikan HANYA filter kelas, tampilkan tombol absen
    kelasFilter.style.display = "none"
    absenButtons.style.display = "flex"
  } else {
    // Untuk siswa: tampilkan filter kelas, sembunyikan tombol absen
    kelasFilter.style.display = "block"
    absenButtons.style.display = "none"
  }

  // Update opsi status
  updateStatusOptions()
}

// Render table - mengikuti model data siswa
function renderTable() {
  const tbody = document.getElementById("attendance-data")
  const tipe = document.getElementById("tipe").value
  const statusFilter = document.getElementById("status").value
  const kelasFilter = document.getElementById("kelas").value
  const tanggalFilter = document.getElementById("tanggal").value
  const searchTerm = document.getElementById("search-name").value.trim()

  // Update tampilan filter berdasarkan tipe
  updateFilterVisibility()

  // Update currentMonth dari month filter jika tidak ada filter tanggal
  const monthFilter = document.getElementById("month-filter")
  if (monthFilter && monthFilter.value !== "semua" && !tanggalFilter) {
    currentMonth = monthFilter.value
  }

  let data = tipe === "guru" ? generateGuruData() : generateSiswaData()

  // Apply search filter first
  data = performSearch(data, searchTerm)

  // Filter berdasarkan status
  if (statusFilter !== "semua") {
    data = data.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase())
  }

  // Filter berdasarkan kelas (khusus siswa)
  if (tipe === "siswa" && kelasFilter !== "semua") {
    data = data.filter((item) => item.kelas === kelasFilter)
  }

  // Filter berdasarkan tanggal spesifik
  if (tanggalFilter) {
    const dateInfo = convertDateInputToInternal(tanggalFilter)
    if (dateInfo) {
      data = data.filter((item) => {
        return item.day === dateInfo.day && item.month === dateInfo.month && item.year === dateInfo.year
      })

      // Update month filter untuk konsistensi UI
      if (monthFilter) {
        monthFilter.value = dateInfo.month
      }
    }
  }

  // Update filteredData untuk pagination
  filteredData = data

  // Paginasi
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const pageData = filteredData.slice(startIndex, endIndex)

  // Render tabel
  tbody.innerHTML = ""
  if (pageData.length === 0) {
    updatePagination()
    return
  }

  pageData.forEach((item) => {
    const row = document.createElement("tr")
    row.className = "hover:bg-gray-50"

    if (tipe === "guru") {
      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap"><img class="h-8 w-8 rounded-full object-cover" src="${item.avatar}" alt="${item.name}"></td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.time}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.status}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getKeteranganBadge(item.note)}</td>
            `
    } else {
      row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.jenis_kelamin}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.nis}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.kelas}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${item.tanggal}</td>
                <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(item.status)}</td>
            `
    }

    tbody.appendChild(row)
  })

  updatePagination()
}

// Update pagination - dengan logika yang lebih baik untuk data banyak
function updatePagination() {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginationContainer = document.querySelector(
    ".px-6.py-4.flex.items-center.justify-between.border-t.border-gray-200",
  )

  // Selalu tampilkan pagination container
  paginationContainer.style.display = "flex"

  if (filteredData.length === 0) {
    // Jika tidak ada data, tampilkan "Menampilkan 1-0 dari 0 data"
    document.getElementById("currentRange").textContent = "1-0"
    document.getElementById("totalData").textContent = "0"

    // Kosongkan page numbers
    const pageNumbers = document.getElementById("pageNumbers")
    pageNumbers.innerHTML = ""

    // Disable kedua tombol navigasi
    document.getElementById("prevPage").disabled = true
    document.getElementById("nextPage").disabled = true

    return
  }

  // Jika ada data, tampilkan pagination normal
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length)

  document.getElementById("currentRange").textContent = `${startIndex}-${endIndex}`
  document.getElementById("totalData").textContent = filteredData.length

  // Update page numbers dengan logika yang lebih smart
  const pageNumbers = document.getElementById("pageNumbers")
  pageNumbers.innerHTML = ""

  // Jika total halaman <= 7, tampilkan semua
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      createPageButton(i, pageNumbers)
    }
  } else {
    // Logika untuk pagination yang lebih kompleks
    const delta = 2 // Jumlah halaman di kiri dan kanan current page

    // Selalu tampilkan halaman pertama
    createPageButton(1, pageNumbers)

    // Tambahkan ellipsis jika perlu
    if (currentPage > delta + 2) {
      createEllipsis(pageNumbers)
    }

    // Tampilkan halaman di sekitar current page
    const start = Math.max(2, currentPage - delta)
    const end = Math.min(totalPages - 1, currentPage + delta)

    for (let i = start; i <= end; i++) {
      createPageButton(i, pageNumbers)
    }

    // Tambahkan ellipsis jika perlu
    if (currentPage < totalPages - delta - 1) {
      createEllipsis(pageNumbers)
    }

    // Selalu tampilkan halaman terakhir (jika bukan halaman 1)
    if (totalPages > 1) {
      createPageButton(totalPages, pageNumbers)
    }
  }

  // Update prev/next buttons
  const prevButton = document.getElementById("prevPage")
  const nextButton = document.getElementById("nextPage")

  prevButton.disabled = currentPage === 1
  nextButton.disabled = currentPage === totalPages

  // Update styling untuk disabled buttons
  if (prevButton.disabled) {
    prevButton.classList.add("opacity-50", "cursor-not-allowed")
  } else {
    prevButton.classList.remove("opacity-50", "cursor-not-allowed")
  }

  if (nextButton.disabled) {
    nextButton.classList.add("opacity-50", "cursor-not-allowed")
  } else {
    nextButton.classList.remove("opacity-50", "cursor-not-allowed")
  }
}

// Helper function untuk membuat tombol halaman
function createPageButton(pageNum, container) {
  const button = document.createElement("button")
  button.textContent = pageNum
  button.className = `px-3 py-2 text-sm rounded transition-colors duration-200 ${
    pageNum === currentPage
      ? "bg-blue-600 text-white font-medium"
      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
  }`
  button.addEventListener("click", () => {
    currentPage = pageNum
    renderTable()
  })
  container.appendChild(button)
}

// Helper function untuk membuat ellipsis
function createEllipsis(container) {
  const ellipsis = document.createElement("span")
  ellipsis.textContent = "..."
  ellipsis.className = "px-3 py-2 text-sm text-gray-400"
  container.appendChild(ellipsis)
}

// Filter functions
function applyFilters() {
  currentPage = 1
  renderTable()
}

// Debounce function untuk optimasi search
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Initialize sidebar
  initializeSidebar()

  // Set currentMonth sesuai bulan sekarang
  const now = new Date()
  const monthIndex = now.getMonth()
  currentMonth = months[monthIndex].value

  const monthSelect = document.getElementById("month-filter")
  if (monthSelect) {
    monthSelect.value = currentMonth
  }

  // Event listeners untuk tombol absen
  document.getElementById("btn-absen-datang").addEventListener("click", () => {
    document.getElementById("btn-absen-datang").classList.add("active")
    document.getElementById("btn-absen-pulang").classList.remove("active")
    currentAttendanceType = "datang"
    currentPage = 1
    renderTable()
  })

  document.getElementById("btn-absen-pulang").addEventListener("click", () => {
    document.getElementById("btn-absen-pulang").classList.add("active")
    document.getElementById("btn-absen-datang").classList.remove("active")
    currentAttendanceType = "pulang"
    currentPage = 1
    renderTable()
  })

  // Event listeners untuk filter
  document.getElementById("tipe").addEventListener("change", () => {
    currentPage = 1
    updateHeader()
    renderTable()
  })

  document.getElementById("status").addEventListener("change", applyFilters)
  document.getElementById("kelas").addEventListener("change", applyFilters)

  // Event listener untuk filter bulan
  document.getElementById("month-filter").addEventListener("change", (e) => {
    currentMonth = e.target.value
    currentPage = 1
    // Clear tanggal filter ketika bulan berubah
    const tanggalInput = document.getElementById("tanggal")
    if (tanggalInput) {
      tanggalInput.value = ""
    }
    renderTable()
  })

  // Event listener untuk filter tanggal
  document.getElementById("tanggal").addEventListener("change", applyFilters)

  // Event listener untuk input pencarian nama dengan debounce
  const searchInput = document.getElementById("search-name")
  const debouncedSearch = debounce(applyFilters, 300)

  searchInput.addEventListener("input", debouncedSearch)

  // Pagination event listeners
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--
      renderTable()
    }
  })

  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage)
    if (currentPage < totalPages) {
      currentPage++
      renderTable()
    }
  })

  // Event listener untuk export PDF dengan toast notification
  document.getElementById("btn-export-pdf").addEventListener("click", () => {
    // Tampilkan toast notification saat mengekspor
    toast.show("success", "Berhasil!", "Data berhasil diekspor!")
  })

  // Initialize header and render initial data
  updateHeader()
  renderTable()
})

// Fungsi untuk mengupdate header berdasarkan tipe absensi
function updateHeader() {
  const tipe = document.getElementById("tipe").value
  const guruHeader = document.getElementById("guru-header")
  const siswaHeader = document.getElementById("siswa-header")

  if (tipe === "guru") {
    guruHeader.style.display = "table-header-group"
    siswaHeader.style.display = "none"
  } else {
    guruHeader.style.display = "none"
    siswaHeader.style.display = "table-header-group"
  }
}
