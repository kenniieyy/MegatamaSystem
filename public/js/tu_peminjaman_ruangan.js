// Global variables
let reservationHistory = []
let currentPage = 1
const itemsPerPage = 5
let filteredData = []

// Data ruangan
const roomData = {
  "lab-komputer": "Laboratorium Komputer",
  "lab-fisika": "Laboratorium Fisika",
  "lab-kimia": "Laboratorium Kimia",
  "lab-biologi": "Laboratorium Biologi",
  kesenian: "Kesenian",
}

// Toast Notification Class
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

// Fungsi navigasi
function navigateTo(page) {
  switch (page) {
    case "dashboard":
      window.location.href = "tu_dashboard.html"
      break
    case "presensi":
      window.location.href = "tu_rekap_absensi.html"
      break
    case "peminjaman":
      // Sudah di halaman ini
      break
    case "settings":
      window.location.href = "tu_settings.html"
      break
    case "login":
      if (confirm("Apakah Anda yakin ingin logout?")) {
        window.location.href = "login.html"
      }
      break
  }
}

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

// Fungsi untuk mengatur tab
function initializeTabs() {
  const tabReservation = document.getElementById("tab-reservation")
  const tabHistory = document.getElementById("tab-history")
  const contentReservation = document.getElementById("content-reservation")
  const contentSuccess = document.getElementById("content-success")
  const contentHistory = document.getElementById("content-history")

  if (tabReservation && tabHistory && contentReservation && contentSuccess && contentHistory) {
    // Tab Peminjaman Ruang
    tabReservation.addEventListener("click", () => {
      tabReservation.classList.add("active")
      tabHistory.classList.remove("active")
      contentReservation.classList.add("active")
      contentSuccess.classList.remove("active")
      contentHistory.classList.remove("active")
    })

    // Tab Riwayat Peminjaman
    tabHistory.addEventListener("click", () => {
      tabHistory.classList.add("active")
      tabReservation.classList.remove("active")
      contentHistory.classList.add("active")
      contentReservation.classList.remove("active")
      contentSuccess.classList.remove("active")

      // Load riwayat peminjaman
      loadReservationHistory()
    })
  }
}

// Fungsi untuk mengatur navigasi antar section
function initializeNavigation() {
  const submitReservation = document.getElementById("submit-reservation")
  const newReservation = document.getElementById("new-reservation")
  const viewHistory = document.getElementById("view-history")

  if (submitReservation) {
    submitReservation.addEventListener("click", () => {
      // Validasi form identitas
      const identityForm = document.getElementById("identity-form")
      if (!identityForm.checkValidity()) {
        identityForm.reportValidity()
        return
      }

      // Validasi form peminjaman
      const reservationForm = document.getElementById("reservation-form")
      if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity()
        return
      }

      // Cek ketersediaan ruangan
      const roomType = document.getElementById("room-type").value
      const reservationDate = document.getElementById("reservation-date").value
      const startTime = document.getElementById("start-time").value
      const endTime = document.getElementById("end-time").value

      if (isRoomOccupied(roomType, reservationDate, startTime, endTime)) {
        document.getElementById("room-status-message").classList.remove("hidden")
        return
      }

      // Simpan data peminjaman
      saveReservationData()

      // Tampilkan pesan sukses (tanpa toast, karena sudah ada card sukses)
      document.getElementById("content-reservation").classList.remove("active")
      document.getElementById("content-success").classList.add("active")
    })
  }

  if (newReservation) {
    newReservation.addEventListener("click", () => {
      document.getElementById("content-success").classList.remove("active")
      document.getElementById("content-reservation").classList.add("active")

      // Reset form
      document.getElementById("identity-form").reset()
      document.getElementById("reservation-form").reset()
      document.getElementById("room-status-message").classList.add("hidden")

      // Set tanggal hari ini dengan timezone lokal
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      const todayString = `${year}-${month}-${day}`

      document.getElementById("reservation-date").value = todayString
    })
  }

  if (viewHistory) {
    viewHistory.addEventListener("click", () => {
      document.getElementById("content-success").classList.remove("active")
      document.getElementById("content-history").classList.add("active")
      document.getElementById("tab-reservation").classList.remove("active")
      document.getElementById("tab-history").classList.add("active")

      // Load riwayat peminjaman
      loadReservationHistory()
    })
  }
}

// Fungsi untuk memeriksa apakah ruangan sedang digunakan
function isRoomOccupied(roomType, date, startTime, endTime) {
  // Cek apakah ada peminjaman untuk ruangan yang sama pada tanggal yang sama
  const conflictingReservations = reservationHistory.filter((item) => item.roomType === roomType && item.date === date)

  if (conflictingReservations.length === 0) {
    return false
  }

  // Konversi waktu ke menit untuk mempermudah perbandingan
  const startMinutes = convertTimeToMinutes(startTime)
  const endMinutes = convertTimeToMinutes(endTime)

  // Cek apakah ada overlap dengan peminjaman yang ada
  for (const reservation of conflictingReservations) {
    const reservationStartMinutes = convertTimeToMinutes(reservation.startTime)
    const reservationEndMinutes = convertTimeToMinutes(reservation.endTime)

    // Cek overlap
    if (
      (startMinutes >= reservationStartMinutes && startMinutes < reservationEndMinutes) ||
      (endMinutes > reservationStartMinutes && endMinutes <= reservationEndMinutes) ||
      (startMinutes <= reservationStartMinutes && endMinutes >= reservationEndMinutes)
    ) {
      return true
    }
  }

  return false
}

// Fungsi untuk mengkonversi waktu ke menit
function convertTimeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

// Fungsi untuk menentukan status peminjaman berdasarkan waktu saat ini
function determineReservationStatus(reservationDate, startTime, endTime) {
  const now = new Date()

  // Buat objek Date untuk waktu mulai peminjaman
  const reservationDateTime = new Date(reservationDate)
  const [startHours, startMinutes] = startTime.split(":").map(Number)
  reservationDateTime.setHours(startHours, startMinutes, 0, 0)

  // Buat objek Date untuk waktu selesai peminjaman
  const reservationEndDateTime = new Date(reservationDate)
  const [endHours, endMinutes] = endTime.split(":").map(Number)
  reservationEndDateTime.setHours(endHours, endMinutes, 0, 0)

  // Tentukan status berdasarkan waktu saat ini
  if (now < reservationDateTime) {
    return "upcoming" // Belum dimulai
  } else if (now >= reservationDateTime && now <= reservationEndDateTime) {
    return "ongoing" // Berlangsung
  } else {
    return "completed" // Selesai
  }
}

// Fungsi untuk menyimpan data peminjaman
function saveReservationData() {
  const reservationDate = document.getElementById("reservation-date").value
  const startTime = document.getElementById("start-time").value
  const endTime = document.getElementById("end-time").value

  // Tentukan status berdasarkan tanggal dan waktu saat ini
  const status = determineReservationStatus(reservationDate, startTime, endTime)

  const reservationData = {
    id: Date.now(), // Gunakan timestamp sebagai ID unik
    studentName: document.getElementById("student-name").value,
    studentNIS: document.getElementById("student-nis").value,
    studentClass: document.getElementById("student-class").value,
    studentPhone: document.getElementById("student-phone").value || "", // Buat opsional
    roomType: document.getElementById("room-type").value,
    roomName: roomData[document.getElementById("room-type").value],
    date: reservationDate,
    startTime: startTime,
    endTime: endTime,
    activityDescription: document.getElementById("activity-description").value,
    responsibleTeacher: document.getElementById("responsible-teacher").value,
    status: status,
    createdAt: new Date(),
  }

  // Simpan data peminjaman ke riwayat
  reservationHistory.unshift(reservationData)

  // Simpan ke localStorage
  localStorage.setItem("reservationHistory", JSON.stringify(reservationHistory))

  console.log("Data peminjaman yang disimpan:", reservationData)
}

// Fungsi untuk memuat data riwayat peminjaman
// Fungsi untuk memuat data riwayat peminjaman
async function loadReservationHistory() { // Tambahkan async di sini
  try {
    const response = await fetch("../src/API/get_peminjaman_ruang_tu.php"); // Panggil API Anda
    const result = await response.json();

    if (result.success) {
      // Mengisi roomName berdasarkan roomType dari roomData yang sudah ada
      const formattedData = result.data.map(item => ({
        ...item,
        roomName: roomData[item.roomType] || item.roomType // Gunakan roomData, fallback ke roomType jika tidak ditemukan
      }));
      reservationHistory = formattedData;
      updateAllReservationStatuses(); // Perbarui status berdasarkan waktu saat ini
      // Hapus baris ini karena data sudah dari DB:
      // localStorage.setItem("reservationHistory", JSON.stringify(reservationHistory));
      toast.show("success", "Riwayat Dimuat", result.message);
    } else {
      console.error("Failed to load reservation history from DB:", result.message);
      toast.show("error", "Gagal Memuat Riwayat", result.message);
      // Opsional: Sebagai fallback, jika gagal dari DB, Anda bisa tetap menggunakan localStorage/dummy
      // Namun, disarankan untuk mengatasi masalah koneksi DB daripada mengandalkan data lama.
      const savedHistory = localStorage.getItem("reservationHistory");
      if (savedHistory) {
        reservationHistory = JSON.parse(savedHistory);
        updateAllReservationStatuses();
        toast.show("info", "Memuat dari Lokal", "Data dimuat dari penyimpanan lokal karena gagal dari server.");
      } else {
        reservationHistory = generateDummyHistory(); // Gunakan dummy jika keduanya gagal
        toast.show("info", "Memuat Data Dummy", "Data dummy dimuat.");
      }
    }
  } catch (error) {
    console.error("Error fetching reservation history:", error);
    toast.show("error", "Error Jaringan", "Tidak dapat terhubung ke server untuk memuat riwayat.");
    // Fallback ke localStorage atau dummy jika terjadi kesalahan jaringan
    const savedHistory = localStorage.getItem("reservationHistory");
    if (savedHistory) {
      reservationHistory = JSON.parse(savedHistory);
      updateAllReservationStatuses();
      toast.show("info", "Memuat dari Lokal", "Data dimuat dari penyimpanan lokal karena kesalahan jaringan.");
    } else {
      reservationHistory = generateDummyHistory();
      toast.show("info", "Memuat Data Dummy", "Data dummy dimuat.");
    }
  }

  // Filter data yang sudah dimuat (baik dari DB, localStorage, atau dummy)
  filterReservationHistory();
}

// Fungsi untuk mengupdate status semua peminjaman
function updateAllReservationStatuses() {
  reservationHistory.forEach((reservation) => {
    const newStatus = determineReservationStatus(reservation.date, reservation.startTime, reservation.endTime)
    reservation.status = newStatus
  })

  // Simpan perubahan ke localStorage
  localStorage.setItem("reservationHistory", JSON.stringify(reservationHistory))
}

// Fungsi untuk menghasilkan data dummy riwayat peminjaman
function generateDummyHistory() {
  const dummyHistory = []
  const rooms = Object.keys(roomData)
  const activityDescriptions = [
    "Praktikum Kimia - Membuat Es",
    "Belajar Kelompok Matematika",
    "Rapat OSIS",
    "Diskusi Kelompok Biologi",
    "Persiapan Lomba Debat",
    "Turnamen Futsal",
    "Bimbingan Olimpiade",
    "Rapat Panitia Acara",
    "Workshop Robotik",
    "Persiapan Ujian",
    "Latihan Paduan Suara",
    "Seminar Motivasi",
  ]

  const teachers = [
    "Pak Budi Santoso",
    "Bu Sari Dewi",
    "Pak Ahmad Rahman",
    "Bu Maya Sari",
    "Pak Ahmad Rahman",
    "Bu Dedi Kurniawan",
    "Bu Rina Wati",
    "Pak Joko Widodo",
    "Bu Lestari",
  ]

  // Tanggal untuk 10 hari terakhir dan 5 hari ke depan
  const dates = []
  for (let i = -10; i <= 5; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    dates.push(date)
  }

  // Buat 15 data dummy
  for (let i = 0; i < 15; i++) {
    const roomIndex = i % rooms.length
    const selectedRoom = rooms[roomIndex]
    const date = dates[i]

    const startHour = 8 + (i % 8) // 8 AM - 3 PM
    const endHour = startHour + 2 // 2 jam durasi

    const reservationDate = date.toISOString().split("T")[0]
    const startTime = `${startHour.toString().padStart(2, "0")}:00`
    const endTime = `${endHour.toString().padStart(2, "0")}:00`

    // Tentukan status berdasarkan waktu saat ini
    const status = determineReservationStatus(reservationDate, startTime, endTime)

    const reservationData = {
      id: Date.now() - i * 86400000, // Timestamp unik untuk setiap data
      studentName: "Ahmad Fauzi",
      studentNIS: "123456789",
      studentClass: "11",
      studentPhone: i % 3 === 0 ? "" : "081234567890", // Beberapa data tanpa nomor telepon
      roomType: selectedRoom,
      roomName: roomData[selectedRoom],
      date: reservationDate,
      startTime: startTime,
      endTime: endTime,
      activityDescription: activityDescriptions[i % activityDescriptions.length],
      responsibleTeacher: teachers[i % teachers.length],
      status: status,
      createdAt: date,
    }

    dummyHistory.push(reservationData)
  }

  return dummyHistory
}

// Fungsi untuk mengatur filter riwayat peminjaman
function initializeHistoryFilter() {
  const applyFilter = document.getElementById("apply-filter")

  if (applyFilter) {
    applyFilter.addEventListener("click", () => {
      filterReservationHistory()
    })
  }
}

// Fungsi untuk memfilter data riwayat peminjaman
function filterReservationHistory() {
  const roomFilter = document.getElementById("room-filter").value
  const statusFilter = document.getElementById("status-filter").value
  const monthFilter = document.getElementById("month-filter").value

  // Filter berdasarkan ruangan
  filteredData = [...reservationHistory]
  if (roomFilter !== "all") {
    filteredData = filteredData.filter((item) => item.roomType === roomFilter)
  }

  // Filter berdasarkan status
  if (statusFilter !== "all") {
    filteredData = filteredData.filter((item) => item.status === statusFilter)
  }

  // Filter berdasarkan bulan
  if (monthFilter !== "all") {
    const monthIndex = Number.parseInt(monthFilter) - 1

    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate.getMonth() === monthIndex
    })
  }

  // Reset pagination ke halaman pertama
  currentPage = 1

  // Render data yang sudah difilter
  renderReservationHistory()
}

// Fungsi untuk menampilkan data riwayat peminjaman
function renderReservationHistory() {
  const historyTable = document.getElementById("reservation-history")
  if (!historyTable) return

  historyTable.innerHTML = ""

  // Jika tidak ada data
  if (filteredData.length === 0) {
    // Update pagination saja, tidak menampilkan pesan
    updatePagination(0)
    return
  }

  // Hitung data untuk halaman saat ini
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length)
  const currentPageData = filteredData.slice(startIndex, endIndex)

  // Tampilkan data
  currentPageData.forEach((item) => {
    const row = document.createElement("tr")
    row.className = "hover:bg-gray-50"

    // Format tanggal
    const itemDate = new Date(item.date)
    const formattedDate = itemDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

    // Status badge dengan warna yang diperbaiki
    let statusBadge = ""
    if (item.status === "upcoming") {
      statusBadge = '<span class="status-badge upcoming">Belum Dimulai</span>'
    } else if (item.status === "ongoing") {
      statusBadge = '<span class="status-badge ongoing">Berlangsung</span>'
    } else if (item.status === "completed") {
      statusBadge = '<span class="status-badge completed">Selesai</span>'
    }

    // Tombol aksi dengan warna yang diperbaiki
    let actionButtons = ""
    if (item.status === "upcoming") {
      actionButtons = `
                <button class="view-reservation p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" data-id="${item.id}" title="Lihat Detail">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="edit-reservation p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors" data-id="${item.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-reservation p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors" data-id="${item.id}" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            `
    } else {
      actionButtons = `
                <button class="view-reservation p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors" data-id="${item.id}" title="Lihat Detail">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="p-2 text-gray-400 cursor-not-allowed" disabled title="Tidak dapat diedit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="p-2 text-gray-400 cursor-not-allowed" disabled title="Tidak dapat dihapus">
                    <i class="fas fa-trash"></i>
                </button>
            `
    }

    row.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-900">${item.roomName}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${formattedDate}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${item.startTime} - ${item.endTime}</td>
            <td class="px-6 py-4 text-sm text-gray-900">${item.activityDescription}</td>
            <td class="px-6 py-4">${statusBadge}</td>
            <td class="px-6 py-4">
                <div class="flex space-x-1">
                    ${actionButtons}
                </div>
            </td>
        `

    historyTable.appendChild(row)
  })

  // Update pagination
  updatePagination(filteredData.length)

  // Tambahkan event listener untuk tombol aksi
  initializeReservationActions()
}

// Fungsi untuk mengupdate pagination
function updatePagination(totalItems) {
  const paginationContainer = document.getElementById("pagination-container")
  const paginationInfo = document.getElementById("pagination-info")
  const prevButton = document.getElementById("prevPage")
  const nextButton = document.getElementById("nextPage")

  if (!paginationContainer || !paginationInfo || !prevButton || !nextButton) return

  paginationContainer.innerHTML = ""

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Update info pagination
  if (totalItems === 0) {
    paginationInfo.textContent = "Menampilkan 1-0 dari 0 peminjaman"
  } else {
    paginationInfo.textContent = `Menampilkan ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} dari ${totalItems} peminjaman`
  }

  // Jika tidak ada data, tidak perlu menampilkan pagination
  if (totalItems === 0) {
    // Tetap tampilkan tombol navigasi tapi tidak bisa dipindah karena tidak ada data
    prevButton.style.display = "inline-block"
    nextButton.style.display = "inline-block"
    prevButton.disabled = false
    nextButton.disabled = false
    prevButton.className = "px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
    nextButton.className = "px-3 py-2 text-sm text-gray-500 hover:text-gray-700"

    // Set onclick tapi tidak melakukan apa-apa karena tidak ada data
    prevButton.onclick = () => {
      // Tidak ada aksi karena tidak ada data
    }

    nextButton.onclick = () => {
      // Tidak ada aksi karena tidak ada data
    }

    return
  } else {
    prevButton.style.display = "inline-block"
    nextButton.style.display = "inline-block"
  }

  // Tombol Previous
  prevButton.disabled = false // Jangan disable
  prevButton.className = "px-3 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"

  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--
      renderReservationHistory()
    }
    // Jika currentPage sudah 1, tidak melakukan apa-apa tapi tombol tetap bisa diklik
  }

  // Tombol halaman
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button")
    pageButton.className = `px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${i === currentPage ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`
    pageButton.textContent = i

    pageButton.addEventListener("click", () => {
      currentPage = i
      renderReservationHistory()
    })

    paginationContainer.appendChild(pageButton)
  }

  // Tombol Next
  nextButton.disabled = false // Jangan disable
  nextButton.className = "px-3 py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"

  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++
      renderReservationHistory()
    }
    // Jika currentPage sudah maksimal, tidak melakukan apa-apa tapi tombol tetap bisa diklik
  }
}

// Fungsi untuk menginisialisasi aksi pada tombol
function initializeReservationActions() {
  // Tombol lihat
  document.querySelectorAll(".view-reservation").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id")
      openViewModal(id)
    })
  })

  // Tombol edit
  document.querySelectorAll(".edit-reservation").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id")
      openEditModal(id)
    })
  })

  // Tombol hapus
  document.querySelectorAll(".delete-reservation").forEach((button) => {
    button.addEventListener("click", function () {
      const id = this.getAttribute("data-id")
      openDeleteModal(id)
    })
  })
}

// Fungsi untuk membuka modal lihat peminjaman
function openViewModal(id) {
  const modal = document.getElementById("view-modal")
  if (!modal) return

  // Cari data peminjaman berdasarkan ID
  const reservationData = reservationHistory.find((item) => item.id.toString() === id)

  if (!reservationData) {
    toast.show("error", "Error!", "Data peminjaman tidak ditemukan")
    return
  }

  // Tampilkan informasi peminjaman
  document.getElementById("view-room-name").textContent = reservationData.roomName

  // Format tanggal
  const itemDate = new Date(reservationData.date)
  const formattedDate = itemDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })

  document.getElementById("view-info-display").textContent =
    `${reservationData.activityDescription} - ${formattedDate} (${reservationData.startTime} - ${reservationData.endTime})`

  // Tampilkan detail peminjaman
  document.getElementById("view-student-name").textContent = reservationData.studentName
  document.getElementById("view-student-nis").textContent = reservationData.studentNIS
  document.getElementById("view-student-class").textContent = `Kelas ${reservationData.studentClass}`
  // Tampilkan nomor telepon atau "-" jika kosong
  document.getElementById("view-student-phone").textContent = reservationData.studentPhone || "-"
  document.getElementById("view-reservation-date").textContent = formattedDate
  document.getElementById("view-reservation-time").textContent =
    `${reservationData.startTime} - ${reservationData.endTime}`
  document.getElementById("view-activity-description").textContent = reservationData.activityDescription
  document.getElementById("view-responsible-teacher").textContent = reservationData.responsibleTeacher

  // Tampilkan status peminjaman
  let statusBadge = ""
  if (reservationData.status === "upcoming") {
    statusBadge = '<span class="status-badge upcoming">Belum Dimulai</span>'
  } else if (reservationData.status === "ongoing") {
    statusBadge = '<span class="status-badge ongoing">Berlangsung</span>'
  } else if (reservationData.status === "completed") {
    statusBadge = '<span class="status-badge completed">Selesai</span>'
  }

  document.getElementById("view-status").innerHTML = statusBadge

  // Tampilkan modal
  modal.style.display = "block"

  // Setup close handlers
  setupModalCloseHandlers("view-modal")
}

// Fungsi untuk membuka modal edit peminjaman
function openEditModal(id) {
  const modal = document.getElementById("edit-modal")
  if (!modal) return

  // Cari data peminjaman berdasarkan ID
  const reservationData = reservationHistory.find((item) => item.id.toString() === id)

  if (!reservationData) {
    toast.show("error", "Error!", "Data peminjaman tidak ditemukan")
    return
  }

  // Isi form dengan data peminjaman
  document.getElementById("edit-id").value = reservationData.id
  document.getElementById("edit-room-type").value = reservationData.roomType
  document.getElementById("edit-reservation-date").value = reservationData.date
  document.getElementById("edit-activity-description").value = reservationData.activityDescription
  document.getElementById("edit-start-time").value = reservationData.startTime
  document.getElementById("edit-end-time").value = reservationData.endTime
  document.getElementById("edit-responsible-teacher").value = reservationData.responsibleTeacher

  // Tampilkan modal
  modal.style.display = "block"

  // Setup close handlers
  setupModalCloseHandlers("edit-modal")

  // Setup save handler
  const saveBtn = document.getElementById("save-edit-btn")
  if (saveBtn) {
    saveBtn.onclick = () => {
      saveEditReservation(id)
    }
  }
}

// Fungsi untuk menyimpan edit peminjaman
async function saveEditReservation(id) {
  const form = document.getElementById("edit-form");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const roomType = document.getElementById("edit-room-type").value;
  const reservationDate = document.getElementById("edit-reservation-date").value;
  const startTime = document.getElementById("edit-start-time").value;
  const endTime = document.getElementById("edit-end-time").value;
  const newStatus = determineReservationStatus(reservationDate, startTime, endTime);

  const dataToUpdate = {
    id: id, // Kirim ID untuk identifikasi
    jenis_ruangan: roomType,
    tanggal_peminjaman: reservationDate,
    deskripsi_kegiatan: document.getElementById("edit-activity-description").value,
    jam_mulai: startTime,
    jam_selesai: endTime,
    penanggung_jawab: document.getElementById("edit-responsible-teacher").value,
    status: newStatus,
  };

  try {
    const response = await fetch("../src/API/update_peminjaman_ruang_tu.php", { // Buat file PHP ini
      method: "POST", // Atau PUT jika API Anda mendukung
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToUpdate),
    });

    const result = await response.json();

    if (result.success) {
      toast.show("success", "Berhasil!", result.message);
      document.getElementById("edit-modal").style.display = "none";
      await loadReservationHistory(); // Load ulang data setelah update
    } else {
      toast.show("error", "Gagal!", result.message);
    }
  } catch (error) {
    console.error("Error updating reservation:", error);
    toast.show("error", "Error Jaringan", "Terjadi kesalahan saat memperbarui data.");
  }
}


// Fungsi untuk membuka modal hapus peminjaman
function openDeleteModal(id) {
  const modal = document.getElementById("delete-modal")
  if (!modal) return

  // Tampilkan modal
  modal.style.display = "block"

  // Setup close handlers
  setupModalCloseHandlers("delete-modal")

  // Setup confirm handler
  const confirmBtn = document.getElementById("confirm-delete-btn")
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      deleteReservation(id)
    }
  }
}

// Fungsi untuk menghapus peminjaman
async function deleteReservation(id) {
  try {
    const response = await fetch("../src/API/delete_peminjaman_ruang_tu.php", { // Buat file PHP ini
      method: "POST", // Atau DELETE jika API Anda mendukung
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }), // Kirim ID yang akan dihapus
    });

    const result = await response.json();

    if (result.success) {
      toast.show("success", "Berhasil!", result.message);
      document.getElementById("delete-modal").style.display = "none";
      await loadReservationHistory(); // Load ulang data setelah hapus
    } else {
      toast.show("error", "Gagal!", result.message);
    }
  } catch (error) {
    console.error("Error deleting reservation:", error);
    toast.show("error", "Error Jaringan", "Terjadi kesalahan saat menghapus data.");
  }
}


// Fungsi untuk setup modal close handlers
function setupModalCloseHandlers(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  // Close button (X)
  const closeBtn = modal.querySelector(".close-peminjaman-ruang")
  if (closeBtn) {
    closeBtn.onclick = () => {
      modal.style.display = "none"
    }
  }

  // Cancel/Close buttons
  const cancelBtns = modal.querySelectorAll('[id*="cancel"], [id*="close-"][id*="-btn"]')
  cancelBtns.forEach((btn) => {
    btn.onclick = () => {
      modal.style.display = "none"
    }
  })

  // Click outside modal
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none"
    }
  }
}

// Fungsi untuk memeriksa ketersediaan ruangan saat memilih ruangan
function initializeRoomAvailabilityCheck() {
  const roomTypeSelect = document.getElementById("room-type")
  const reservationDateInput = document.getElementById("reservation-date")
  const startTimeInput = document.getElementById("start-time")
  const endTimeInput = document.getElementById("end-time")

  if (!roomTypeSelect || !reservationDateInput || !startTimeInput || !endTimeInput) return

  // Event listener untuk perubahan pada form
  const checkAvailability = () => {
    const roomType = roomTypeSelect.value
    const reservationDate = reservationDateInput.value
    const startTime = startTimeInput.value
    const endTime = endTimeInput.value

    // Sembunyikan pesan status ruangan
    const statusMessage = document.getElementById("room-status-message")
    if (statusMessage) {
      statusMessage.classList.add("hidden")
    }

    // Jika semua field sudah diisi, cek ketersediaan ruangan
    if (roomType && reservationDate && startTime && endTime) {
      if (isRoomOccupied(roomType, reservationDate, startTime, endTime)) {
        if (statusMessage) {
          statusMessage.classList.remove("hidden")
        }
      }
    }
  }

  roomTypeSelect.addEventListener("change", checkAvailability)
  reservationDateInput.addEventListener("change", checkAvailability)
  startTimeInput.addEventListener("change", checkAvailability)
  endTimeInput.addEventListener("change", checkAvailability)
}

// Fungsi untuk memperbarui status secara berkala
function startStatusUpdateInterval() {
  setInterval(async () => { // Tambahkan async
    // Cukup panggil loadReservationHistory untuk memperbarui status dan tampilan
    // loadReservationHistory akan secara otomatis memanggil updateAllReservationStatuses
    // dan filterReservationHistory/renderReservationHistory.
    const historyTab = document.getElementById("tab-history")
    if (historyTab && historyTab.classList.contains("active")) {
      await loadReservationHistory(); // Pastikan data terbaru ditarik
    } else {
      // Jika tidak di tab history, tetap update status di background
      if (reservationHistory.length > 0) {
        updateAllReservationStatuses();
      }
    }
  }, 60000); // 60000ms = 1 menit
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar()
  initializeTabs()
  initializeNavigation()
  initializeHistoryFilter()
  initializeRoomAvailabilityCheck()

  // Set tanggal hari ini dengan timezone lokal
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")
  const todayString = `${year}-${month}-${day}`

  const reservationDateInput = document.getElementById("reservation-date")
  if (reservationDateInput) {
    reservationDateInput.min = todayString
    reservationDateInput.value = todayString
  }

  // Set tanggal minimal untuk form edit
  const editDateInput = document.getElementById("edit-reservation-date")
  if (editDateInput) {
    editDateInput.min = todayString
  }

  // Set bulan saat ini di filter
  const currentMonth = today.getMonth() + 1
  const monthFilter = document.getElementById("month-filter")
  if (monthFilter) {
    monthFilter.value = currentMonth
  }

  // Handle form submission
  // Handle form submission
  const reservationForm = document.getElementById("reservation-form");
  if (reservationForm) {
    reservationForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Mencegah submit form secara default

      const identityForm = document.getElementById("identity-form");
      const reservationForm = document.getElementById("reservation-form");

      // Buat objek FormData terpisah
      const identityFormData = new FormData(identityForm);
      const reservationFormData = new FormData(reservationForm);

      // Gabungkan kedua FormData menjadi satu objek data JSON
      const data = {};

      // Ambil data dari identityForm
      for (let [key, value] of identityFormData.entries()) {
        // Anda perlu menyesuaikan ini dengan nama field yang benar di identityForm
        // Misalnya: student-name, student-nis, student-class, student-phone
        if (key === "student-name") data.nama_lengkap = value;
        else if (key === "student-nis") data.nis = value;
        else if (key === "student-class") data.kelas = value;
        else if (key === "student-phone") data.no_telepon = value;
      }

      // Ambil data dari reservationForm
      for (let [key, value] of reservationFormData.entries()) {
        // Ini harus sesuai dengan yang sudah ada di kode Anda
        if (key === "room-type") data.jenis_ruangan = value;
        else if (key === "reservation-date") data.tanggal_peminjaman = value;
        else if (key === "activity-description") data.deskripsi_kegiatan = value;
        else if (key === "start-time") data.jam_mulai = value;
        else if (key === "end-time") data.jam_selesai = value;
        else if (key === "responsible-teacher") data.penanggung_jawab = value;
      }

      // --- Debugging: Pastikan data sudah lengkap sebelum dikirim ---
      console.log("Data yang akan dikirim:", data);
      // -----------------------------------------------------------

      try {
        const response = await fetch("../src/API/add_peminjaman_ruang_tu.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (result.success) {
          toast.show("success", "Sukses!", result.message);
          // Reset kedua form setelah sukses
          identityForm.reset();
          reservationForm.reset();
          // Sembunyikan pesan status ruangan jika ada
          document.getElementById("room-status-message").classList.add("hidden");
          // Refresh data jika ada di tab history
          filterReservationHistory(); // Pastikan fungsi ini ada dan mengambil data terbaru
        } else {
          toast.show("error", "Gagal!", result.message);
        }
      } catch (error) {
        console.error("Error submitting reservation:", error);
        toast.show("error", "Error Jaringan", "Terjadi kesalahan saat mengirim data.");
      }
    });
  }

  // Load data awal
  loadReservationHistory()

  // Mulai interval update status
  startStatusUpdateInterval()
})