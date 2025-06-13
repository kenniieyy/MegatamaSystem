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

document.addEventListener("DOMContentLoaded", () => {
  // Inisialisasi toast
  toast = new ToastNotification()

  // Inisialisasi semua event listeners
  initializePasswordToggle()
  initializePhotoUpload()
  initializeFormValidation()
})

// Fungsi untuk toggle password visibility
function initializePasswordToggle() {
  const passwordFields = [
    { fieldId: "current-password", toggleId: "toggle-current-password" },
    { fieldId: "new-password", toggleId: "toggle-new-password" },
    { fieldId: "confirm-password", toggleId: "toggle-confirm-password" },
  ]

  passwordFields.forEach((field) => {
    const passwordInput = document.getElementById(field.fieldId)
    const toggleButton = document.getElementById(field.toggleId)

    if (passwordInput && toggleButton) {
      toggleButton.addEventListener("click", () => {
        togglePasswordVisibility(passwordInput, toggleButton)
      })
    }
  })
}

function togglePasswordVisibility(input, button) {
  const isPassword = input.type === "password"
  input.type = isPassword ? "text" : "password"

  // Update icon
  const icon = button.querySelector("svg")
  if (isPassword) {
    // Show eye-slash icon when password is visible
    icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
        `
  } else {
    // Show eye icon when password is hidden
    icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `
  }
}

// Fungsi untuk upload foto profil
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

        // Preview foto
        const reader = new FileReader()
        reader.onload = (e) => {
          profilePhoto.src = e.target.result
          toast.show("success", "Foto Berhasil Diupload", "Foto profil Anda telah diperbarui.")
        }
        reader.readAsDataURL(file)
      }
    })
  }
}

// Fungsi untuk validasi form
function initializeFormValidation() {
  const form = document.getElementById("profile-form")

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validasi form
      if (validateForm()) {
        // Simulasi pengiriman data
        submitForm()
      }
    })

    // Real-time validation untuk password confirmation
    const newPassword = document.getElementById("new-password")
    const confirmPassword = document.getElementById("confirm-password")

    if (newPassword && confirmPassword) {
      confirmPassword.addEventListener("input", () => {
        validatePasswordMatch()
      })

      newPassword.addEventListener("input", () => {
        validatePasswordMatch()
      })
    }
  }
}

function validateForm() {
  let isValid = true
  const errors = []

  // Validasi username
  const username = document.getElementById("username").value.trim()
  if (username.length < 3) {
    errors.push("Username minimal 3 karakter")
    isValid = false
  }

  // Validasi password baru jika diisi
  const newPassword = document.getElementById("new-password").value
  const confirmPassword = document.getElementById("confirm-password").value

  if (newPassword) {
    // Validasi kekuatan password
    if (newPassword.length < 6) {
      errors.push("Password baru minimal 6 karakter")
      isValid = false
    }

    // Validasi konfirmasi password
    if (newPassword !== confirmPassword) {
      errors.push("Konfirmasi password tidak cocok")
      isValid = false
    }
  }

  // Jika ada error, tampilkan toast
  if (!isValid) {
    toast.show("error", "Validasi Gagal", errors.join(", "))
  }

  return isValid
}

function validatePasswordMatch() {
  const newPassword = document.getElementById("new-password").value
  const confirmPassword = document.getElementById("confirm-password").value
  const confirmInput = document.getElementById("confirm-password")

  if (confirmPassword && newPassword !== confirmPassword) {
    confirmInput.style.borderColor = "#ef4444"
    confirmInput.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"
  } else {
    confirmInput.style.borderColor = "#d1d5db"
    confirmInput.style.boxShadow = "none"
  }
}

function submitForm() {
  // Tampilkan loading state
  const submitButton = document.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent
  submitButton.textContent = 'Menyimpan...';
    submitButton.disabled = true;
  

  // Simulasi pengiriman data ke server
  setTimeout(() => {
    // Reset button
    submitButton.textContent = originalText
    submitButton.disabled = false

    // Simulasi berhasil
    const success = Math.random() > 0.2 // 80% kemungkinan berhasil

    if (success) {
      toast.show("success", "Berhasil", "Profil berhasil diperbarui!")

      // Reset password fields
      document.getElementById("new-password").value = ""
      document.getElementById("confirm-password").value = ""
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

// Fungsi untuk reset form
function resetForm() {
  const form = document.getElementById("profile-form")
  if (form) {
    form.reset()
    // Reset ke nilai default
    document.getElementById("username").value = "admin_tu"
    document.getElementById("current-password").value = "••••••••"
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
