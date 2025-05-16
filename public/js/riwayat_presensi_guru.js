// Mengatur sidebar
function initializeSidebar() {
    const toggleButton = document.getElementById("toggle-sidebar")
    const sidebar = document.getElementById("sidebar")
    const mainContent = document.getElementById("main-content")
    const overlay = document.getElementById("overlay")

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed")
        sidebar.classList.toggle("mobile-open")
        mainContent.classList.toggle("expanded")
        overlay.classList.toggle("show")
    })

    // Tutup sidebar saat mengklik overlay
    overlay.addEventListener("click", () => {
        sidebar.classList.remove("mobile-open")
        overlay.classList.remove("show")
    })
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

// Mengatur filter bulan
function initializeMonthFilter() {
    const monthFilter = document.getElementById("month-filter")

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

// Data contoh untuk catatan kehadiran
const attendanceData = {
    datang: [
        { id: 1, date: "01-April-2024", time: "07:15:23", status: "Hadir", note: "Tepat Waktu" },
        { id: 2, date: "02-April-2024", time: "07:15:23", status: "Hadir", note: "Tepat Waktu" },
        { id: 3, date: "03-April-2024", time: "07:16:25", status: "Hadir", note: "Tepat Waktu" },
        { id: 4, date: "04-April-2024", time: "07:16:28", status: "Hadir", note: "Tepat Waktu" },
        { id: 5, date: "05-April-2024", time: "07:10:15", status: "Hadir", note: "Tepat Waktu" },
        { id: 6, date: "06-April-2024", time: "07:12:45", status: "Hadir", note: "Tepat Waktu" },
        { id: 7, date: "07-April-2024", time: "-", status: "Tidak Hadir", note: "Absen Tidak Dilakukan" },
        { id: 8, date: "08-April-2024", time: "08:53:35", status: "Hadir", note: "Terlambat" },
        { id: 9, date: "09-April-2024", time: "07:05:11", status: "Hadir", note: "Tepat Waktu" },
        { id: 10, date: "10-April-2024", time: "07:03:04", status: "Hadir", note: "Tepat Waktu" },
        { id: 11, date: "11-April-2024", time: "07:08:12", status: "Hadir", note: "Tepat Waktu" },
        { id: 12, date: "12-April-2024", time: "07:14:55", status: "Hadir", note: "Tepat Waktu" },
        { id: 13, date: "13-April-2024", time: "08:22:30", status: "Hadir", note: "Terlambat" },
        { id: 14, date: "14-April-2024", time: "-", status: "Tidak Hadir", note: "Absen Tidak Dilakukan" },
        { id: 15, date: "15-April-2024", time: "07:05:45", status: "Hadir", note: "Tepat Waktu" },
        { id: 16, date: "16-April-2024", time: "07:10:18", status: "Hadir", note: "Tepat Waktu" },
        { id: 17, date: "17-April-2024", time: "07:12:33", status: "Hadir", note: "Tepat Waktu" },
        { id: 18, date: "18-April-2024", time: "07:08:59", status: "Hadir", note: "Tepat Waktu" },
        { id: 19, date: "19-April-2024", time: "07:15:02", status: "Hadir", note: "Tepat Waktu" },
        { id: 20, date: "20-April-2024", time: "08:18:47", status: "Hadir", note: "Terlambat" },
        { id: 21, date: "21-April-2024", time: "-", status: "Tidak Hadir", note: "Absen Tidak Dilakukan" },
        { id: 22, date: "22-April-2024", time: "07:09:22", status: "Hadir", note: "Tepat Waktu" },
        { id: 23, date: "23-April-2024", time: "07:11:15", status: "Hadir", note: "Tepat Waktu" },
        { id: 24, date: "24-April-2024", time: "07:14:30", status: "Hadir", note: "Tepat Waktu" },
    ],
    pulang: [
        { id: 1, date: "01-April-2024", time: "15:05:23", status: "Hadir", note: "Tepat Waktu" },
        { id: 2, date: "02-April-2024", time: "15:10:45", status: "Hadir", note: "Tepat Waktu" },
        { id: 3, date: "03-April-2024", time: "15:02:18", status: "Hadir", note: "Tepat Waktu" },
        { id: 4, date: "04-April-2024", time: "15:00:05", status: "Hadir", note: "Tepat Waktu" },
        { id: 5, date: "05-April-2024", time: "15:30:15", status: "Hadir", note: "Tepat Waktu" },
        { id: 6, date: "06-April-2024", time: "15:05:22", status: "Hadir", note: "Tepat Waktu" },
        { id: 7, date: "07-April-2024", time: "-", status: "Tidak Hadir", note: "Absen Tidak Dilakukan" },
        { id: 8, date: "08-April-2024", time: "16:45:35", status: "Hadir", note: "Terlambat" },
        { id: 9, date: "09-April-2024", time: "15:08:11", status: "Hadir", note: "Tepat Waktu" },
        { id: 10, date: "10-April-2024", time: "15:03:04", status: "Hadir", note: "Tepat Waktu" },
        { id: 11, date: "11-April-2024", time: "15:12:12", status: "Hadir", note: "Tepat Waktu" },
        { id: 12, date: "12-April-2024", time: "15:04:55", status: "Hadir", note: "Tepat Waktu" },
        { id: 13, date: "13-April-2024", time: "15:02:30", status: "Hadir", note: "Tepat Waktu" },
        { id: 14, date: "14-April-2024", time: "-", status: "Tidak Hadir", note: "Absen Tidak Dilakukan" },
        { id: 15, date: "15-April-2024", time: "15:05:45", status: "Hadir", note: "Tepat Waktu" },
        { id: 16, date: "16-April-2024", time: "16:40:18", status: "Hadir", note: "Terlambat" },
        { id: 17, date: "17-April-2024", time: "15:02:33", status: "Hadir", note: "Tepat Waktu" },
        { id: 18, date: "18-April-2024", time: "15:08:59", status: "Hadir", note: "Tepat Waktu" },
        { id: 19, date: "19-April-2024", time: "15:05:02", status: "Hadir", note: "Tepat Waktu" },
        { id: 20, date: "20-April-2024", time: "15:08:47", status: "Hadir", note: "Tepat Waktu" },
        { id: 21, date: "21-April-2024", time: "-", status: "Tidak Hadir", note: "Absen Tidak Dilakukan" },
        { id: 22, date: "22-April-2024", time: "15:09:22", status: "Hadir", note: "Tepat Waktu" },
        { id: 23, date: "23-April-2024", time: "15:01:15", status: "Hadir", note: "Tepat Waktu" },
        { id: 24, date: "24-April-2024", time: "15:04:30", status: "Hadir", note: "Tepat Waktu" },
    ],
}

// Memperbarui data kehadiran berdasarkan aturan waktu
function updateAttendanceData() {
    // Memperbarui data absen datang
    attendanceData.datang.forEach((item) => {
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
    attendanceData.pulang.forEach((item) => {
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
}

// Variabel untuk paginasi
let currentPage = 1
const itemsPerPage = 9
let currentAttendanceType = "datang"
let currentMonth = "april"

// Menampilkan data kehadiran berdasarkan halaman dan filter saat ini
function renderAttendanceData() {
    const tableBody = document.getElementById("attendance-data")
    const data = attendanceData[currentAttendanceType]

    // Menghapus data yang ada
    tableBody.innerHTML = ""

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
    const data = attendanceData[currentAttendanceType]
    const totalPages = Math.ceil(data.length / itemsPerPage)

    // Menghapus paginasi yang ada
    paginationContainer.innerHTML = ""

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

// Mengatur tombol ekspor PDF
function initializeExportPDF() {
    const exportPdfBtn = document.getElementById("btn-export-pdf")

    // Ekspor langsung saat tombol diklik
    exportPdfBtn.addEventListener("click", () => {
        // Untuk saat ini, hanya menampilkan pesan sederhana
        alert("PDF berhasil diunduh!")
    })
}

// Menjalankan saat halaman dimuat
window.addEventListener("load", () => {
    updateAttendanceData() // Memperbarui data berdasarkan aturan waktu
    initializeSidebar()
    initializeAttendanceTypeTabs()
    initializeMonthFilter()
    initializeExportPDF()
    renderAttendanceData()
})