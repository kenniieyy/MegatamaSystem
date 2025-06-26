let studentData = []; // Deklarasikan secara global

fetch('../src/API/get_siswa_copy.php')
  .then(response => response.json())
  .then(data => {
    // Periksa apakah data adalah objek dengan kunci kelas, lalu ratakan
    if (typeof data === 'object' && !Array.isArray(data)) {
      studentData = Object.values(data).flat();
    } else if (Array.isArray(data)) {
      studentData = data; // Jika data sudah berupa array datar
    } else {
      console.error('Format data tidak terduga:', data);
      toast.show('error', 'Gagal Memuat Data', 'Format data siswa tidak sesuai.');
      return;
    }
    console.log("Semua Siswa:", studentData);

    // Filter studentData berdasarkan kelas jika ada filter kelas yang aktif (misalnya untuk guru)
    // Bagian ini mengasumsikan 'teacherClass' akan ditetapkan secara dinamis setelah login
    // Sebagai contoh, mari kita asumsikan variabel 'loggedInTeacherClass' ada
    // let loggedInTeacherClass = '9'; // Contoh: atur ini secara dinamis berdasarkan sesi login
    // if (loggedInTeacherClass) {
    //     studentData = studentData.filter(student => student.class === loggedInTeacherClass);
    //     console.log(`Siswa yang difilter untuk kelas ${loggedInTeacherClass}:`, studentData);
    // }

    renderStudentData(); // Sekarang renderStudentData dapat mengakses studentData global
  })
  .catch(error => {
    console.error('Error saat mengambil data siswa:', error);
    toast.show('error', 'Error Jaringan', 'Tidak dapat terhubung ke server untuk memuat data siswa.');
  });

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
                Belum ada data siswa
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
      statusBadge = `<span class="badge success">Naik</span>`
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
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${student.id}</td>
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

// Variabel paginasi
let currentPage = 1
const itemsPerPage = 10
let currentAction = null
let currentStudentId = null
let isBulkPromotion = false

// Fungsionalitas sidebar yang dapat dialihkan
function initializeSidebar() {
  const toggleBtn = document.getElementById("toggle-sidebar")
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("main-content")
  const overlay = document.getElementById("overlay")

  // Periksa apakah semua elemen ada
  if (!toggleBtn || !sidebar || !mainContent || !overlay) {
    console.error("Beberapa elemen tidak ditemukan:", {
      toggleBtn: !!toggleBtn,
      sidebar: !!sidebar,
      mainContent: !!mainContent,
      overlay: !!overlay,
    })
    return
  }

  // Fungsi untuk mengatur ulang semua kelas dan gaya
  function resetSidebarStates() {
    sidebar.classList.remove("collapsed", "mobile-open")
    overlay.classList.remove("show")
    // Atur ulang gaya inline jika ada
    sidebar.style.transform = ""
  }

  // Fungsi untuk mengatur tata letak desktop
  function setupDesktopLayout() {
    resetSidebarStates()
    // Di desktop, sidebar default terbuka dan konten utama menyesuaikan
    mainContent.classList.remove("expanded")
    sidebar.classList.remove("collapsed")
  }

  // Fungsi untuk mengatur tata letak seluler
  function setupMobileLayout() {
    resetSidebarStates()
    // Di seluler, sidebar default tertutup
    sidebar.classList.add("collapsed")
    mainContent.classList.add("expanded")
  }

  // Fungsi untuk membuka sidebar
  function openSidebar() {
    if (window.innerWidth <= 768) {
      // Seluler: gunakan kelas mobile-open
      sidebar.classList.remove("collapsed")
      sidebar.classList.add("mobile-open")
      overlay.classList.add("show")
    } else {
      // Desktop: hilangkan kelas collapsed
      sidebar.classList.remove("collapsed")
      mainContent.classList.remove("expanded")
    }
  }

  // Fungsi untuk menutup sidebar
  function closeSidebar() {
    if (window.innerWidth <= 768) {
      // Seluler: tutup dan hilangkan overlay
      sidebar.classList.add("collapsed")
      sidebar.classList.remove("mobile-open")
      overlay.classList.remove("show")
    } else {
      // Desktop: sembunyikan sidebar dan perluas konten utama
      sidebar.classList.add("collapsed")
      mainContent.classList.add("expanded")
    }
  }

  // Fungsi untuk memeriksa status sidebar (terbuka/tertutup)
  function isSidebarOpen() {
    if (window.innerWidth <= 768) {
      return sidebar.classList.contains("mobile-open")
    } else {
      return !sidebar.classList.contains("collapsed")
    }
  }

  // Fungsi untuk menangani perilaku responsif
  function handleResponsiveLayout() {
    const currentWidth = window.innerWidth

    if (currentWidth <= 768) {
      // Beralih ke seluler
      setupMobileLayout()
    } else {
      // Beralih ke desktop
      setupDesktopLayout()
    }

    console.log(`Tata letak diubah menjadi: ${currentWidth <= 768 ? "Seluler" : "Desktop"} (${currentWidth}px)`)
  }

  // Alihkan sidebar
  toggleBtn.addEventListener("click", () => {
    console.log("Tombol toggle diklik, lebar jendela:", window.innerWidth)
    console.log("Status sidebar terbuka:", isSidebarOpen())

    if (isSidebarOpen()) {
      closeSidebar()
      console.log("Sidebar ditutup")
    } else {
      openSidebar()
      console.log("Sidebar dibuka")
    }
  })

  // Tutup sidebar saat mengklik overlay (hanya di seluler)
  overlay.addEventListener("click", () => {
    console.log("Overlay diklik - menutup sidebar")
    closeSidebar()
  })

  // Tangani perubahan ukuran jendela
  let resizeTimeout
  window.addEventListener("resize", () => {
    // Debounce peristiwa resize untuk kinerja
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      handleResponsiveLayout()
    }, 100)
  })

  // Inisialisasi tata letak berdasarkan ukuran jendela saat ini
  handleResponsiveLayout()

  console.log("Sidebar responsif berhasil diinisialisasi")
}

// Fungsi tambahan untuk debugging
function debugSidebar() {
  const sidebar = document.getElementById("sidebar")
  const mainContent = document.getElementById("main-content")
  const overlay = document.getElementById("overlay")

  console.log("=== INFO DEBUG SIDEBAR ===")
  console.log("Lebar jendela:", window.innerWidth)
  console.log("Jenis perangkat:", window.innerWidth <= 768 ? "Seluler" : "Desktop")
  console.log("Kelas sidebar:", sidebar.className)
  console.log("Kelas konten utama:", mainContent.className)
  console.log("Kelas overlay:", overlay.className)
  console.log("Transformasi komputasi sidebar:", window.getComputedStyle(sidebar).transform)
}

// LOGIKA UNTUK NOTIFIKASI TOAST
class ToastNotification {
  constructor() {
    this.toastElement = document.getElementById('toast-notification');
    // Pastikan toastElement ditemukan sebelum mencoba mengkueri anak-anaknya
    if (!this.toastElement) {
      console.error("Elemen HTML dengan ID 'toast-notification' tidak ditemukan. ToastNotification tidak dapat diinisialisasi.");
      return; // Keluar dari konstruktor jika elemen null
    }
    this.toastIcon = document.getElementById('toast-icon');
    this.toastTitle = document.getElementById('toast-title');
    this.toastMessage = document.getElementById('toast-message');
    this.toastClose = document.getElementById('toast-close');
    // Pastikan this.toastElement bukan null sebelum memanggil querySelector
    this.toastContainer = this.toastElement.querySelector('.bg-white');

    this.isVisible = false;
    this.hideTimeout = null;

    // Hanya siapkan pendengar peristiwa jika toastElement berhasil ditemukan
    if (this.toastElement) {
      this.setupEventListeners();
    }
  }

  setupEventListeners() {
    // Pendengar peristiwa untuk tombol tutup
    if (this.toastClose) { // Periksa apakah toastClose ada sebelum menambahkan pendengar
      this.toastClose.addEventListener('click', () => {
        this.hide();
      });
    }


    // Sembunyikan otomatis setelah 5 detik
    this.toastElement.addEventListener('transitionend', (e) => {
      if (e.target === this.toastElement && this.isVisible) {
        this.autoHide();
      }
    });
  }

  show(type, title, message) {
    if (!this.toastElement) { // Cegah menampilkan jika elemen toast tidak diinisialisasi
      console.error("Elemen notifikasi toast tidak tersedia.");
      return;
    }
    // Hapus timeout sebelumnya jika ada
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Atur konten toast
    this.setContent(type, title, message);

    // Atur ulang kelas
    this.toastElement.classList.remove('toast-exit', 'toast-show');
    this.toastElement.classList.add('toast-enter');

    // Paksa reflow untuk memastikan kelas diterapkan
    this.toastElement.offsetHeight;

    // Tampilkan toast dengan animasi
    setTimeout(() => {
      this.toastElement.classList.remove('toast-enter');
      this.toastElement.classList.add('toast-show');
      this.isVisible = true;
    }, 10);
  }

  hide() {
    if (!this.isVisible || !this.toastElement) return; // Tambahkan pemeriksaan untuk toastElement

    // Hapus timeout sembunyikan otomatis
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // Sembunyikan dengan animasi
    this.toastElement.classList.remove('toast-show');
    this.toastElement.classList.add('toast-exit');
    this.isVisible = false;

    // Atur ulang ke posisi awal setelah animasi selesai
    setTimeout(() => {
      this.toastElement.classList.remove('toast-exit');
      this.toastElement.classList.add('toast-enter');
    }, 300);
  }

  autoHide() {
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, 5000); // Sembunyikan otomatis setelah 5 detik
  }

  setContent(type, title, message) {
    if (!this.toastContainer || !this.toastIcon || !this.toastTitle || !this.toastMessage) {
      console.error("Elemen konten toast tidak tersedia.");
      return;
    }
    // Atur ulang warna batas
    this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');

    // Atur ikon dan warna berdasarkan tipe
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

// Inisialisasi notifikasi toast
const toast = new ToastNotification();

// Tampilkan modal konfirmasi
function showConfirmationModal(studentId, action) {
  const student = studentData.find((s) => String(s.id) === String(studentId))
  const modal = document.getElementById("confirmation-modal")
  const message = document.getElementById("modal-message-naik-kelas")
  const confirmButton = document.getElementById("confirm-action")

  if (!student) {
    console.error("Siswa tidak ditemukan untuk ID:", studentId);
    toast.show('error', 'Kesalahan', 'Data siswa tidak ditemukan.');
    return;
  }
  if (!modal || !message || !confirmButton) {
    console.error("Elemen modal tidak ditemukan untuk modal konfirmasi.");
    return;
  }

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
    console.error("Elemen modal tidak ditemukan")
    return
  }

  // Hitung hanya siswa yang masih tertunda
  const pendingStudents = studentData.filter((student) => student.status === "Aktif")

  // Jika tidak ada siswa yang tertunda, tampilkan pesan khusus
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

  // "Hapus pendengar peristiwa lama (jika ada), lalu tambahkan pendengar peristiwa yang baru."
  const newConfirmButton = confirmButton.cloneNode(true)
  confirmButton.parentNode.replaceChild(newConfirmButton, confirmButton)

  // Atur ulang teks tombol konfirmasi
  document.getElementById("confirm-action").textContent = "Konfirmasi"
  document.getElementById("confirm-action").addEventListener("click", confirmBulkAction)

  modal.classList.add("show")
}

// Tutup modal
function closeModal() {
  const modal = document.getElementById("confirmation-modal")
  if (modal) { // Tambahkan pemeriksaan null untuk modal
    modal.classList.remove("show")
  }
  currentStudentId = null
  currentAction = null
  isBulkPromotion = false

  // Hapus subpesan
  const subMessage = document.getElementById("modal-submessage-naik-kelas")
  if (subMessage) {
    subMessage.textContent = ""
  }
}

function confirmAction() {
  if (currentStudentId && currentAction) {
    const studentIndex = studentData.findIndex((s) => s.id == currentStudentId)
    if (studentIndex !== -1) {
      const student = studentData[studentIndex]

      // Kirim ke backend
      fetch('../src/API/update_status_siswa.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          action: currentAction,
          class: student.class // tambahkan ini juga karena PHP butuh untuk kenaikan
        })

      })
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            studentData[studentIndex].status = currentAction
            renderStudentData()

            if (currentAction === 'promote') {
              toast.show('success', 'Berhasil!', `${student.name} berhasil dinyatakan lulus!`)
            } else if (currentAction === 'not_promote') {
              toast.show('info', 'Status Diperbarui!', `${student.name} dinyatakan tidak lulus.`)
            }
          } else {
            toast.show('error', 'Gagal!', response.message || 'Terjadi kesalahan saat menyimpan.')
          }
        })
        .catch(err => {
          console.error(err)
          toast.show('error', 'Gagal!', 'Gagal menghubungi server.')
        })
        .finally(() => {
          closeModal()
        })
    }
  } else {
    closeModal()
  }
}


// Konfirmasi tindakan massal
function confirmBulkAction() {
  if (isBulkPromotion && currentAction === "promote") {
    const studentsToPromote = studentData.filter((student) => student.status === "Aktif");

    if (studentsToPromote.length === 0) {
      toast.show('info', 'Tidak Ada Siswa', 'Tidak ada siswa yang bisa dinaikkan.');
      closeModal();
      return;
    }

    // Kirim data ke backend untuk diproses massal
    fetch('../src/API/update_status_siswa.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: "promote",
        isBulk: true, // <== Tandai bahwa ini mode massal
        students: studentsToPromote.map(student => ({
          id: student.id,
          name: student.name,
          class: student.class
        }))
      })
    })
    .then(res => res.json())
    .then(response => {
      if (response.success) {
        // Update status lokal hanya kalau sukses
        studentsToPromote.forEach((student) => {
          student.status = "promote";
        });
        renderStudentData();

        toast.show('success', 'Berhasil!', response.message);
      } else {
        toast.show('error', 'Gagal!', response.message || 'Gagal memperbarui data.');
      }
    })
    .catch(err => {
      console.error(err);
      toast.show('error', 'Gagal!', 'Gagal menghubungi server.');
    })
    .finally(() => {
      closeModal();
    });
  } else {
    closeModal();
  }
}


// Render kontrol paginasi
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

  // Pasang kembali pendengar peristiwa setelah mengganti elemen
  if (prevButton) {
    prevButton.replaceWith(prevButton.cloneNode(true));
    document.getElementById("prev-page").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--
        renderStudentData()
      }
    });
  }
  if (nextButton) {
    nextButton.replaceWith(nextButton.cloneNode(true));
    document.getElementById("next-page").addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++
        renderStudentData()
      }
    });
  }
}

// Inisialisasi fungsi tombol
function initializeButtons() {
  const exportButton = document.getElementById("btn-export-data") // Tombol ini digunakan untuk simulasi ekspor umum
  const promoteAllButton = document.getElementById("btn-promote-all")

  if (exportButton) {
    exportButton.addEventListener("click", () => {
      // Simulasi ekspor data
      setTimeout(() => {
        toast.show('success', 'Berhasil!', 'Data berhasil diekspor (simulasi)!')
      }, 500)
    })
  }

  if (promoteAllButton) {
    promoteAllButton.addEventListener("click", () => {
      showBulkPromotionModal()
    })
  }
}

// Mengatur tombol ekspor PDF
function initializeExportPDF() {
  const exportPdfBtn = document.getElementById("btn-export-pdf");

  if (!exportPdfBtn) {
    console.error("Tombol 'Export PDF' dengan ID 'btn-export-pdf' tidak ditemukan.");
    return;
  }

  exportPdfBtn.addEventListener("click", () => {
    const table = document.getElementById("attendance-table");
    const tbody = document.getElementById("student-data");
    const rows = tbody ? tbody.querySelectorAll("tr") : [];

    // Validasi tabel dan data
    if (!table) {
      toast.show("error", "Gagal!", "Tabel tidak ditemukan.");
      return;
    }

    if (!tbody || rows.length === 0) {
      toast.show("warning", "Data Kosong!", "Tidak ada data yang bisa diekspor ke PDF.");
      return;
    }

    // Jika valid, lanjut ekspor
    exportPdfBtn.innerText = "Memproses...";
    exportPdfBtn.disabled = true;

    const scale = 2;
    html2canvas(table, { scale: scale }).then((canvas) => {
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

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kenaikan-kelas.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.show("success", "Berhasil!", "Data berhasil diekspor ke PDF!");
    }).catch((error) => {
      console.error("Gagal membuat PDF:", error);
      toast.show("error", "Gagal!", "Terjadi kesalahan saat membuat PDF.");
    }).finally(() => {
      exportPdfBtn.innerText = "Export PDF";
      exportPdfBtn.disabled = false;
    });
  });
}



// Jalankan saat halaman dimuat
window.addEventListener("load", () => {
  initializeSidebar()
  initializeButtons() // Untuk simulasi ekspor umum dan promosi massal
  initializeExportPDF() // Untuk ekspor PDF
  console.log("Data siswa:", studentData.map(s => s.id))

  console.log("Data siswa tersedia:", studentData)
})

// Jadikan fungsi tersedia secara global
window.showConfirmationModal = showConfirmationModal
window.showBulkPromotionModal = showBulkPromotionModal
window.closeModal = closeModal
window.confirmAction = confirmAction
window.confirmBulkAction = confirmBulkAction
window.ToastNotification = ToastNotification; // Jadikan ToastNotification dapat diakses secara global jika diperlukan, meskipun instance 'toast' biasanya sudah cukup