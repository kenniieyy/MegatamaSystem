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
    { value: "desember", label: "Desember" }
]

// Mengatur filter bulan
function initializeMonthFilter() {
    const monthFilter = document.getElementById("month-filter")
    monthFilter.innerHTML = "" // Clear existing options
    
    months.forEach(month => {
        const option = document.createElement("option")
        option.value = month.value
        option.textContent = month.label
        if (month.value === currentMonth) {
            option.selected = true
        }
        monthFilter.appendChild(option)
    })

    monthFilter.addEventListener("change", function() {
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
    const monthIndex = months.findIndex(m => m.value === month)
    
    // Hanya generate data sampai bulan mei
    if (!["januari", "februari", "maret", "april", "mei"].includes(month)) {
        return []
    }

    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
    const data = []

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${day.toString().padStart(2, '0')}-${month.charAt(0).toUpperCase() + month.slice(1)}-${currentYear}`
        
        const generateTime = () => {
            const rand = Math.random()
            if (rand < 0.15) return "-"
            
            const hour = Math.floor(Math.random() * 3) + (currentAttendanceType === "datang" ? 7 : 15)
            const minute = Math.floor(Math.random() * 60)
            const second = Math.floor(Math.random() * 60)
            return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
        }

        const time = generateTime()
        const isAbsent = time === "-"
        
        data.push({
            id: day,
            date,
            time,
            status: isAbsent ? "Tidak Hadir" : "Hadir",
            note: isAbsent ? "Absen Tidak Dilakukan" : 
                  (currentAttendanceType === "datang" ? 
                    (parseInt(time.split(":")[0]) < 8 ? "Tepat Waktu" : "Terlambat") :
                    (parseInt(time.split(":")[0]) < 16 ? "Tepat Waktu" : "Terlambat"))
        })
    }

    return data
}

// Data kehadiran dinamis
function getAttendanceData() {
    return {
        datang: generateMonthData(currentMonth),
        pulang: generateMonthData(currentMonth)
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
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="6" class="text-center py-4 text-gray-500">Tidak ada data yang ditemukan</td>
        `;
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

// Mengatur tombol ekspor PDF
function initializeExportPDF() {
    const exportPdfBtn = document.getElementById("btn-export-pdf")

    exportPdfBtn.addEventListener("click", () => {
        alert("Data berhasil diekspor!")
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