// Class untuk Toast Notification
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
    // Reset border color - hapus semua border color classes
    this.toastContainer.className = this.toastContainer.className.replace(
      /border-l-(green|red|yellow|blue|gray)-500/g,
      "",
    )

    // Pastikan base classes tetap ada
    if (!this.toastContainer.className.includes("bg-white")) {
      this.toastContainer.className = "bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm"
    }

    // Set icon dan warna berdasarkan type menggunakan Font Awesome icons
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
let toast
let hasPhotoChanged = false // Flag untuk melacak perubahan foto

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi toast
  toast = new ToastNotification()

  // Inisialisasi event listeners yang masih digunakan
  initializePhotoUpload()
  initializeFormValidation()
})

// Fungsi untuk upload foto profil - TANPA TOAST
function initializePhotoUpload() {
  const photoUpload = document.getElementById("photo-upload")
  const profilePhoto = document.querySelector(".profile-photo")

  if (photoUpload && profilePhoto) {
    photoUpload.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        // Validasi tipe file
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]
        if (!allowedTypes.includes(file.type)) {
          toast.show("error", "Format Tidak Valid", "Hanya file gambar (JPG, PNG) yang diizinkan.")
          return
        }

        // Validasi ukuran file (maksimal 2MB)
        const maxSize = 2 * 1024 * 1024 // 2MB
        if (file.size > maxSize) {
          toast.show("error", "File Terlalu Besar", "Ukuran file maksimal 2MB.")
          return
        }

        // Preview foto TANPA menampilkan toast
        const reader = new FileReader()
        reader.onload = (e) => {
          profilePhoto.src = e.target.result
          hasPhotoChanged = true // Set flag bahwa foto telah berubah
          // TOAST DIHAPUS - tidak ada notifikasi saat foto diubah
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

// Fungsi untuk validasi form (disederhanakan untuk foto profil saja)
function initializeFormValidation() {
  const form = document.getElementById("profile-form")

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validasi form sederhana - hanya untuk foto profil
      if (validateForm()) {
        // Simulasi pengiriman data
        submitForm()
      }
    })
  }
}

function validateForm() {
  const isValid = true
  const errors = []

  // Validasi sederhana - form selalu valid karena hanya untuk foto profil
  // Jika ada error, tampilkan toast
  if (!isValid) {
    toast.show("error", "Validasi Gagal", errors.join(", "))
  }

  return isValid
}

function submitForm() {
  // Tampilkan loading state
  const submitButton = document.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent
  submitButton.textContent = "Menyimpan..."
  submitButton.disabled = true

  // Simulasi pengiriman data ke server
  setTimeout(() => {
    // Reset button
    submitButton.textContent = originalText
    submitButton.disabled = false

    // Simulasi berhasil
    const success = Math.random() > 0.2

    if (success) {
      // Toast hanya muncul saat klik tombol simpan
      if (hasPhotoChanged) {
        toast.show("success", "Berhasil", "Foto profil berhasil diperbarui!")
        hasPhotoChanged = false // Reset flag setelah berhasil disimpan
      } else {
        toast.show("success", "Berhasil", "Foto profil telah disimpan!")
      }
    } else {
      toast.show("error", "Gagal Menyimpan", "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.")
    }
  }, 2000)
}

// Fungsi utilitas untuk format nama file
function formatFileName(fileName) {
  const maxLength = 20
  if (fileName.length <= maxLength) return fileName

  const extension = fileName.split(".").pop()
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf("."))
  const truncatedName = nameWithoutExt.substring(0, maxLength - extension.length - 4) + "..."

  return truncatedName + "." + extension
}

// Fungsi untuk reset form (disederhanakan)
function resetForm() {
  const form = document.getElementById("profile-form")
  if (form) {
    // Reset ke nilai default - hanya username yang readonly
    document.getElementById("username").value = "admin_tu"
    hasPhotoChanged = false // Reset flag foto
  }
}

// Event listener untuk tombol reset (jika ada)
document.addEventListener("keydown", (e) => {
  // Reset form dengan Ctrl+R (tapi prevent page reload)
  if (e.ctrlKey && e.key === "r") {
    e.preventDefault()
    resetForm()
    toast.show("success", "Form Direset", "Form telah dikembalikan ke nilai semula.")
  }
})
