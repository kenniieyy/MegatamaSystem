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
let attendanceData = {
    datang: [],
    pulang: []
}

function loadAttendanceFromServer() {
    fetch('http://localhost/proyek/public/proses/get_riwayat_guru.php')
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                attendanceData.datang = result.data.map(item => ({
                    id: Math.random(),
                    date: item.date,
                    time: item.datang,
                    status: item.datang !== '-' ? 'Hadir' : 'Tidak Hadir',
                    note: item.datang !== '-' ? (isTimeInRange(item.datang, 7, 8) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                }))
                attendanceData.pulang = result.data.map(item => ({
                    id: Math.random(),
                    date: item.date,
                    time: item.pulang,
                    status: item.pulang !== '-' ? 'Hadir' : 'Tidak Hadir',
                    note: item.pulang !== '-' ? (isTimeInRange(item.pulang, 15, 16) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                }))
                renderAttendanceData()
            } else {
                alert("Gagal memuat data presensi.")
            }
        })
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
            }
             else if (hour >= 7 && hour < 8) {
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
let currentMonth = "all"
let filteredByMonth = []

// Menampilkan data kehadiran berdasarkan halaman dan filter saat ini
function renderAttendanceData() {
    const tableBody = document.getElementById("attendance-data")
    const data = attendanceData[currentAttendanceType]
    
    // Filter berdasarkan bulan
    filteredByMonth = data.filter(item => {
        const itemMonth = new Date(item.date).toLocaleString('en-US', { month: 'long' }).toLowerCase()
        return currentMonth === "all" || itemMonth === currentMonth
    })



    // Menghapus data yang ada
    tableBody.innerHTML = ""

    // Menghitung paginasi
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, filteredByMonth.length)
    const paginatedData = filteredByMonth.slice(startIndex, endIndex)

    // Memperbarui informasi paginasi
    document.getElementById("pagination-info").textContent =
        `Menampilkan ${startIndex + 1}-${endIndex} dari ${filteredByMonth.length} data`

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
    const totalPages = Math.ceil(filteredByMonth.length / itemsPerPage)

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

    exportPdfBtn.addEventListener("click", () => {
        const table = document.getElementById("attendance-table") // ID elemen <table> atau kontainer tabel kamu

        html2canvas(table).then((canvas) => {
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jspdf.jsPDF("p", "mm", "a4")

            const imgProps = pdf.getImageProperties(imgData)
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
            pdf.save("riwayat-presensi.pdf")
        })
    })
}




// Menjalankan saat halaman dimuat
window.addEventListener("load", () => {
    initializeSidebar()
    initializeAttendanceTypeTabs()
    initializeMonthFilter()
    initializeExportPDF()
    loadAttendanceFromServer() // <-- ambil data asli dari backend

})
