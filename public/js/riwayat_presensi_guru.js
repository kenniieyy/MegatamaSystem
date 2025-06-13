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
let currentAttendanceType = "datang" // Define currentAttendanceType globally or within a scope where it's accessible
let currentPage = 1 // Define currentPage globally or within a scope where it's accessible
let currentMonth = "all" // Define currentMonth globally or within a scope where it's accessible

function initializeAttendanceTypeTabs() {
    const datangButton = document.getElementById("btn-absen-datang")
    const pulangButton = document.getElementById("btn-absen-pulang")

    // Ensure buttons exist before adding event listeners
    if (datangButton) {
        datangButton.addEventListener("click", () => {
            datangButton.classList.add("active")
            pulangButton.classList.remove("active")
            currentAttendanceType = "datang"
            currentPage = 1
            renderAttendanceData()
        })
    } else {
        console.warn("Button with ID 'btn-absen-datang' not found.");
    }

    if (pulangButton) {
        pulangButton.addEventListener("click", () => {
            pulangButton.classList.add("active")
            datangButton.classList.remove("active")
            currentAttendanceType = "pulang"
            currentPage = 1
            renderAttendanceData()
        })
    } else {
        console.warn("Button with ID 'btn-absen-pulang' not found.");
    }
}

// Mengatur filter bulan
function initializeMonthFilter() {
    const monthFilter = document.getElementById("month-filter")

    if (monthFilter) {
        monthFilter.addEventListener("change", function () {
            currentMonth = this.value
            currentPage = 1
            renderAttendanceData()
        })
    } else {
        console.warn("Select element with ID 'month-filter' not found.");
    }
}

// Fungsi untuk memeriksa apakah waktu berada dalam rentang tertentu
function isTimeInRange(timeStr, startHour, endHour) {
    // FIX: Check for null or undefined in addition to "-"
    if (timeStr === null || timeStr === undefined || timeStr === "-") {
        return false
    }

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
    // FIX: Return the fetch promise chain
    return fetch('proses/get_riwayat_guru.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'success') {
                attendanceData.datang = result.data
                    .filter(item => item.datang && item.datang !== "null" && item.datang !== "-")
                    .map(item => ({

                        id: Math.random(),
                        date: item.date,
                        // FIX: Ensure time is a string, replace null/undefined with "-"
                        time: item.datang !== null && item.datang !== undefined ? String(item.datang) : "-",
                        foto_datang: item.foto_datang || null,
                        foto_pulang: null,
                        type: 'Datang',
                        status: item.datang !== '-' ? 'Hadir' : 'Tidak Hadir',
                        note: item.datang !== '-' ? (isTimeInRange(item.datang, 7, 8) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                    }))
                attendanceData.pulang = result.data
                    .filter(item => item.pulang && item.pulang !== "null" && item.pulang !== "-")
                    .map(item => ({
                        id: Math.random(),
                        date: item.date,
                        // FIX: Ensure time is a string, replace null/undefined with "-"
                        time: item.pulang !== null && item.pulang !== undefined ? String(item.pulang) : "-",
                        type: 'Pulang',
                        foto_datang: null,
                        foto_pulang: item.foto_pulang || null,
                        status: item.pulang !== '-' ? 'Hadir' : 'Tidak Hadir',
                        note: item.pulang !== '-' ? (isTimeInRange(item.pulang, 15, 16) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                    }))
                // Only render if data is successfully loaded
                renderAttendanceData()
            } else {
                alert("Gagal memuat data presensi: " + (result.message || "Pesan tidak diketahui."));
                // Propagate the error so the .then() in the window.load handler doesn't execute
                throw new Error("Server response status not 'success'");
            }
        })
        .catch(error => {
            console.error("Error loading attendance data:", error);
            alert("Terjadi kesalahan saat memuat data presensi. Silakan coba lagi.");
            // Re-throw the error to ensure the .then() after loadAttendanceFromServer()
            // doesn't proceed if there's an error.
            throw error;
        });
}

// Memperbarui data kehadiran berdasarkan aturan waktu
function updateAttendanceData() {
    // Memperbarui data absen datang
    attendanceData.datang.forEach((item) => {
        // Ensure item.time is handled robustly here too, although the map should have handled it.
        if (item.time === "-" || item.time === null || item.time === undefined) {
            item.status = "Tidak Hadir"
            item.note = "Absen Tidak Dilakukan"
        } else {
            const timeParts = item.time.split(":")
            const hour = Number.parseInt(timeParts[0], 10)

            if (hour >= 7 && hour < 8) {
                item.status = "Hadir"
                item.note = "Tepat Waktu"
            }
            // Removed redundant else if (hour >= 7 && hour < 8) - this was a logical error
            else { // This 'else' correctly covers cases outside 7-8 AM (i.e., late)
                item.status = "Hadir"
                item.note = "Terlambat"
            }
        }
    })

    // Memperbarui data absen pulang
    attendanceData.pulang.forEach((item) => {
        // Ensure item.time is handled robustly here too.
        if (item.time === "-" || item.time === null || item.time === undefined) {
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
const itemsPerPage = 9
let filteredByMonth = [] // Declare filteredByMonth outside the function to make it accessible

// Menampilkan data kehadiran berdasarkan halaman dan filter saat ini
function renderAttendanceData() {
    const tableBody = document.getElementById("attendance-data")
    if (!tableBody) {
        console.warn("Table body with ID 'attendance-data' not found.");
        return;
    }

    const data = attendanceData[currentAttendanceType]

    // Filter berdasarkan bulan
    filteredByMonth = data.filter(item => {
        const itemDate = new Date(item.date);
        // Check if itemDate is a valid date before getting the month
        if (isNaN(itemDate.getTime())) {
            console.warn("Invalid date format encountered:", item.date);
            return false; // Exclude invalid dates
        }
        const itemMonth = itemDate.toLocaleString('en-US', { month: 'long' }).toLowerCase()
        return currentMonth === "all" || itemMonth === currentMonth
    })

    // Menghapus data yang ada
    tableBody.innerHTML = ""

    // Menghitung paginasi
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, filteredByMonth.length)
    const paginatedData = filteredByMonth.slice(startIndex, endIndex)

    // Memperbarui informasi paginasi
    const paginationInfoElement = document.getElementById("pagination-info");
    if (paginationInfoElement) {
        paginationInfoElement.textContent = `Menampilkan ${startIndex + 1}-${endIndex} dari ${filteredByMonth.length} data`
    } else {
        console.warn("Element with ID 'pagination-info' not found.");
    }

    if (filteredByMonth.length === 0) {
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML = `
        <td colspan="5" class="px-4 py-3 whitespace-nowrap text-center text-gray-500">
            Belum ada data riwayat presensi
        </td>
    `;
    tableBody.appendChild(noDataRow);
    paginationInfoElement.textContent = "Menampilkan 0-0 dari 0 data"; // Update pagination info
    renderPagination(); // Still call renderPagination to disable buttons
    return; // Exit the function
}


    // Menampilkan baris data
    paginatedData.forEach((item) => {

        // Tentukan foto presensi (datang/pulang)
        let fotoPresensi;
        if (item.type === "Datang") {
            fotoPresensi = item.foto_datang ? `img/upload/${item.foto_datang}` : 'img/guru/1.png';
        } else {
            fotoPresensi = item.foto_pulang ? `img/upload/${item.foto_pulang}` : 'img/guru/1.png';
        }

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
                <img class="h-8 w-8 rounded-full object-cover" src="${fotoPresensi}" alt="User avatar">
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
    if (!paginationContainer) {
        console.warn("Element with ID 'pagination-numbers' not found.");
        return;
    }

    // Use filteredByMonth.length to calculate totalPages for correct pagination
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

    if (prevButton) {
        prevButton.disabled = currentPage === 1
        // Avoid adding multiple event listeners
        if (!prevButton._hasClickListener) {
            prevButton.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--
                    renderAttendanceData()
                }
            })
            prevButton._hasClickListener = true;
        }
    } else {
        console.warn("Button with ID 'prev-page' not found.");
    }

    if (nextButton) {
        nextButton.disabled = currentPage === totalPages
        // Avoid adding multiple event listeners
        if (!nextButton._hasClickListener) {
            nextButton.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++
                    renderAttendanceData()
                }
            })
            nextButton._hasClickListener = true;
        }
    } else {
        console.warn("Button with ID 'next-page' not found.");
    }
}

// Add the ToastNotification class implementation right before the initializeExportPDF function

//LOGIC UNTUK TOAST NOTIFICATION
class ToastNotification {
    constructor() {
        this.toastElement = document.getElementById("toast-notification")
        // Check if toastElement exists before proceeding
        if (!this.toastElement) {
            console.error("Toast notification element with ID 'toast-notification' not found.");
            return;
        }
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
        if (this.toastClose) {
            this.toastClose.addEventListener("click", () => {
                this.hide()
            })
        }
        if (this.toastElement) {
            this.toastElement.addEventListener("transitionend", (e) => {
                if (e.target === this.toastElement && this.isVisible) {
                    this.autoHide()
                }
            })
        }
    }

    show(type, title, message) {
        if (!this.toastElement) return; // Exit if toast element not found

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
        if (!this.toastElement || !this.isVisible) return

        // Clear auto hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout)
        }

        // Sembunyikan dengan animasi
        this.toastElement.classList.remove("toast-show")
        this.toastElement.classList.add("toast-exit")
        this.isVisible = false

        // Reset ke posisi awal setelah animasi selesai
        // This timeout should match the CSS transition duration for 'toast-exit'
        setTimeout(() => {
            this.toastElement.classList.remove("toast-exit")
            // Optionally, add 'toast-enter' back if it's part of initial hidden state
            // this.toastElement.classList.add("toast-enter")
        }, 300) // Assuming 300ms is the duration of toast-exit transition
    }

    autoHide() {
        this.hideTimeout = setTimeout(() => {
            this.hide()
        }, 5000) // Auto hide setelah 5 detik
    }

    setContent(type, title, message) {
        if (!this.toastContainer || !this.toastIcon || !this.toastTitle || !this.toastMessage) {
            console.error("One or more toast content elements are missing.");
            return;
        }

        // Reset border color
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue|gray)-500/g, "")

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
const toast = new ToastNotification() // Make sure this is accessible

// Mengatur tombol ekspor PDF
function initializeExportPDF() {
    const exportPdfBtn = document.getElementById("btn-export-pdf");

    if (!exportPdfBtn) {
        console.error("Tombol 'Export Data' dengan ID 'btn-export-pdf' tidak ditemukan.");
        return;
    }

    exportPdfBtn.addEventListener("click", () => {
        const table = document.getElementById("attendance-table");

        if (!table) {
            console.error("Tabel dengan ID 'attendance-table' tidak ditemukan.");
            toast.show("error", "Gagal!", "Tabel data tidak ditemukan untuk diekspor.");
            return;
        }

        exportPdfBtn.innerText = "Memproses...";
        exportPdfBtn.disabled = true;

        const scale = 2;
        // Ensure html2canvas and jsPDF libraries are loaded in your HTML
        if (typeof html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
            console.error("html2canvas or jsPDF library not loaded.");
            toast.show("error", "Gagal!", "Library export PDF tidak ditemukan.");
            exportPdfBtn.innerText = "Export Data";
            exportPdfBtn.disabled = false;
            return;
        }

        html2canvas(table, { scale }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = heightLeft - imgHeight;
                }
            }

            // Convert PDF to Blob and auto download
            const blob = pdf.output("blob");
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "kenaikan-kelas.pdf"; // This filename seems incorrect for attendance data
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.show("success", "Berhasil!", "Data berhasil diekspor ke PDF!");
            exportPdfBtn.innerText = "Export Data";
            exportPdfBtn.disabled = false;
        }).catch((error) => {
            console.error("Gagal membuat PDF:", error);
            toast.show("error", "Gagal!", "Terjadi kesalahan saat membuat PDF.");
            exportPdfBtn.innerText = "Export Data";
            exportPdfBtn.disabled = false;
        });
    });
}


// Menjalankan saat halaman dimuat
window.addEventListener("load", () => {
    initializeSidebar()
    initializeAttendanceTypeTabs()
    initializeMonthFilter()
    initializeExportPDF()
    loadAttendanceFromServer() // <-- ambil data asli dari backend
        .then(() => {
            // Data successfully loaded and rendered by loadAttendanceFromServer -> renderAttendanceData
            // No need to call renderAttendanceData here again unless specific additional rendering is needed.
            console.log("Attendance data loaded and rendered successfully.");
        })
        .catch(error => {
            console.error("Error during initial data load:", error);
        });
})