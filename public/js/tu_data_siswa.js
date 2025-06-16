// Data siswa (simulasi)
let siswaData = [
    { id: 1, namaLengkap: "Rizky Pratama", jenisKelamin: "Laki - Laki", nis: "2301456781", kelas: "9", noHp: "081234567890", status: "Aktif" },
    { id: 2, namaLengkap: "Salsabila Azzahra", jenisKelamin: "Perempuan", nis: "2301456782", kelas: "12", noHp: "082156781234", status: "Lulus" },
    { id: 3, namaLengkap: "Dimas Arya Nugroho", jenisKelamin: "Laki - Laki", nis: "2301456783", kelas: "9", noHp: "085723456789", status: "Lulus" },
    { id: 4, namaLengkap: "Aulia Rahmawati", jenisKelamin: "Perempuan", nis: "2301456784", kelas: "7", noHp: "081398765432", status: "Non-Aktif" },
    { id: 5, namaLengkap: "Fadlan Nur Ramadhan", jenisKelamin: "Laki - Laki", nis: "2301456785", kelas: "11", noHp: "082287654321", status: "Aktif" },
    { id: 6, namaLengkap: "Nabila Khairunnisa", jenisKelamin: "Perempuan", nis: "2301456786", kelas: "10", noHp: "089012345678", status: "Non-Aktif" },
    { id: 7, namaLengkap: "Alif Maulana", jenisKelamin: "Laki - Laki", nis: "2301456787", kelas: "10", noHp: "083122334455", status: "Aktif" },
    { id: 8, namaLengkap: "Zahra Melani Putri", jenisKelamin: "Perempuan", nis: "2301456788", kelas: "7", noHp: "085377889900", status: "Non-Aktif" },
    { id: 9, namaLengkap: "Yoga Pradiptа", jenisKelamin: "Laki - Laki", nis: "2301456789", kelas: "12", noHp: "087766554433", status: "Non-Aktif" },
    { id: 10, namaLengkap: "Aisyah Nur Azizah", jenisKelamin: "Perempuan", nis: "2301456790", kelas: "8", noHp: "081299887766", status: "Aktif" },
    { id: 11, namaLengkap: "Bayu Setiawan", jenisKelamin: "Laki - Laki", nis: "2301456791", kelas: "9", noHp: "082334455667", status: "Aktif" },
    { id: 12, namaLengkap: "Citra Dewi", jenisKelamin: "Perempuan", nis: "2301456792", kelas: "11", noHp: "085566778899", status: "Lulus" }
];

let currentPage = 1;
const itemsPerPage = 9;
let filteredData = [...siswaData];
let editId = null;
let deleteId = null;

// DOM Elements
const sidebar = document.getElementById('sidebar');
const searchInput = document.getElementById('searchInput');
const kelasFilter = document.getElementById('kelasFilter');
const tableBody = document.getElementById('siswaTableBody');
const naikkanKelasBtn = document.getElementById('naikkanKelasBtn');
const tambahSiswaBtn = document.getElementById('tambahSiswaBtn');

// Modal elements
const naikkanKelasModal = document.getElementById('naikkanKelasModal');
const tambahSiswaModal = document.getElementById('tambahSiswaModal');

// Fungsi untuk validasi NIS
function validateNIS(nis, excludeId = null) {
    // Hapus spasi dan normalize input
    const normalizedNIS = nis.replace(/\s+/g, '').trim();
    
    // Cek apakah NIS sudah ada (kecuali untuk data yang sedang diedit)
    const existingStudent = siswaData.find(siswa => 
        siswa.nis === normalizedNIS && siswa.id !== excludeId
    );
    
    return !existingStudent;
}

// Fungsi untuk menampilkan error pada field NIS
function showNISError(message) {
    const nisField = document.querySelector('input[name="nis"]');
    const errorElement = document.getElementById('nisError') || createErrorElement('nisError');
    
    if (nisField) {
        nisField.classList.add('border-red-500');
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
        
        if (!document.getElementById('nisError')) {
            nisField.parentNode.appendChild(errorElement);
        }
    }
}

// Fungsi untuk menghapus error pada field NIS
function clearNISError() {
    const nisField = document.querySelector('input[name="nis"]');
    const errorElement = document.getElementById('nisError');
    
    if (nisField) {
        nisField.classList.remove('border-red-500');
    }
    if (errorElement) {
        errorElement.classList.add('hidden');
    }
}

// Fungsi untuk membuat element error
function createErrorElement(id) {
    const errorElement = document.createElement('div');
    errorElement.id = id;
    errorElement.className = 'text-red-500 text-sm mt-1 hidden';
    return errorElement;
}

// Fungsi untuk setup validasi real-time NIS
function setupNISValidation() {
    const nisField = document.querySelector('input[name="nis"]');
    
    if (nisField) {
        // Validasi saat user keluar dari field NIS
        nisField.addEventListener('blur', function() {
            const nisValue = this.value.trim();
            if (nisValue) {
                if (!validateNIS(nisValue, editId)) {
                    showNISError('NIS sudah terdaftar, silakan gunakan NIS yang berbeda');
                } else {
                    clearNISError();
                }
            }
        });

        // Clear error saat user mulai mengetik
        nisField.addEventListener('input', function() {
            if (this.value.trim()) {
                clearNISError();
            }
        });
    }
}

// Get status badge class
function getStatusBadge(status) {
    switch (status) {
        case 'Aktif':
            return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>';
        case 'Lulus':
            return '<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Lulus</span>';
        case 'Non-Aktif':
            return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Non-Aktif</span>';
        default:
            return '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>';
    }
}

// Render table
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    tableBody.innerHTML = pageData.map(siswa => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.namaLengkap}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.jenisKelamin}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.nis}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.kelas}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.noHp}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(siswa.status)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editSiswa(${siswa.id})" class="text-orange-600 hover:text-orange-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteSiswa(${siswa.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

    document.getElementById('currentRange').textContent = `${startIndex}-${endIndex}`;
    document.getElementById('totalData').textContent = filteredData.length;

    // Update page numbers
    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `px-3 py-2 text-sm ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'} rounded`;
        button.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pageNumbers.appendChild(button);
    }

    // Update prev/next buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Filter functions
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedKelas = kelasFilter.value;

    filteredData = siswaData.filter(siswa => {
        const matchesSearch = siswa.namaLengkap.toLowerCase().includes(searchTerm) ||
            siswa.nis.includes(searchTerm);
        const matchesKelas = !selectedKelas || siswa.kelas === selectedKelas;

        return matchesSearch && matchesKelas;
    });

    currentPage = 1;
    renderTable();
}

// Event listeners for filters
searchInput.addEventListener('input', applyFilters);
kelasFilter.addEventListener('change', applyFilters);

// Pagination event listeners
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
    }
});

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Setup validasi NIS setelah modal ditampilkan
    if (modalId === 'tambahSiswaModal') {
        setTimeout(() => {
            setupNISValidation();
        }, 100);
    }
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    // Clear error saat modal ditutup
    if (modalId === 'tambahSiswaModal') {
        clearNISError();
    }
}

// Naikkan Kelas Modal
// naikkanKelasBtn.addEventListener('click', () => showModal('naikkanKelasModal'));
// document.getElementById('cancelNaikkanKelas').addEventListener('click', () => hideModal('naikkanKelasModal'));
// document.getElementById('confirmNaikkanKelas').addEventListener('click', () => {
//     // Process kenaikan kelas logic here
//     alert('Kenaikan kelas berhasil diproses!');
//     hideModal('naikkanKelasModal');
// });

// Tambah Siswa Modal
tambahSiswaBtn.addEventListener('click', () => {
    editId = null; // Reset edit ID
    clearNISError(); // Clear any previous error
    showModal('tambahSiswaModal');
});

document.getElementById('closeTambahModal').addEventListener('click', () => hideModal('tambahSiswaModal'));
document.getElementById('cancelTambahSiswa').addEventListener('click', () => hideModal('tambahSiswaModal'));

// Tambah Siswa Form
document.getElementById('tambahSiswaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const siswaBaru = {
        namaLengkap: formData.get('namaLengkap'),
        jenisKelamin: formData.get('jenisKelamin'),
        nis: formData.get('nis'),
        kelas: formData.get('kelas'),
        noHp: formData.get('noHp'),
        status: formData.get('status')
    };

    // Validasi NIS sebelum submit
    if (!validateNIS(siswaBaru.nis, editId)) {
        showNISError('NIS sudah terdaftar, silakan gunakan NIS yang berbeda');
        if (typeof toast !== 'undefined') {
            toast.show('error', 'Validasi Error!', 'NIS sudah terdaftar dalam sistem');
        }
        return;
    }

    // Validasi field required lainnya
    if (!siswaBaru.namaLengkap || !siswaBaru.nis || !siswaBaru.kelas) {
        if (typeof toast !== 'undefined') {
            toast.show('error', 'Validasi Error!', 'Mohon lengkapi semua field yang wajib diisi');
        }
        return;
    }

    // Validasi format NIS (contoh: harus 10 digit)
    if (siswaBaru.nis.length !== 10 || !/^\d+$/.test(siswaBaru.nis)) {
        showNISError('NIS harus berupa 10 digit angka');
        if (typeof toast !== 'undefined') {
            toast.show('error', 'Validasi Error!', 'Format NIS tidak valid (harus 10 digit angka)');
        }
        return;
    }

    try {
        if (editId !== null) {
            // Edit mode
            const index = siswaData.findIndex(s => s.id === editId);
            if (index !== -1) {
                siswaData[index] = { ...siswaData[index], ...siswaBaru };
            }
            editId = null;
            if (typeof toast !== 'undefined') {
                toast.show('success', 'Berhasil!', 'Data Siswa berhasil diperbarui!');
            }
        } else {
            // Tambah baru
            const newId = Math.max(...siswaData.map(s => s.id)) + 1;
            siswaData.push({ id: newId, ...siswaBaru });
            if (typeof toast !== 'undefined') {
                toast.show('success', 'Berhasil!', 'Siswa berhasil ditambahkan!');
            }
        }

        e.target.reset();
        hideModal('tambahSiswaModal');
        applyFilters();
        
    } catch (error) {
        const action = editId ? 'memperbarui' : 'menambahkan';
        if (typeof toast !== 'undefined') {
            toast.show('error', 'Error!', `Terjadi kesalahan saat ${action} data siswa`);
        }
    }
});

// CRUD functions
function editSiswa(id) {
    const siswa = siswaData.find(s => s.id === id);
    if (!siswa) return;

    editId = id;
    clearNISError(); // Clear any previous error

    const form = document.getElementById('tambahSiswaForm');
    form.namaLengkap.value = siswa.namaLengkap;
    form.jenisKelamin.value = siswa.jenisKelamin;
    form.nis.value = siswa.nis;
    form.kelas.value = siswa.kelas;
    form.noHp.value = siswa.noHp;
    form.status.value = siswa.status;

    showModal('tambahSiswaModal');
}

function deleteSiswa(id) {
    deleteId = id; // Simpan ID
    document.getElementById('deleteSiswa').classList.remove('hidden');
}

function confirmDelete() {
    if (deleteId !== null) {
        const siswaToDelete = siswaData.find(s => s.id === deleteId);
        const siswaName = siswaToDelete ? siswaToDelete.namaLengkap : 'Siswa';
        
        try {
            siswaData = siswaData.filter(s => s.id !== deleteId);
            applyFilters();
            
            if (typeof toast !== 'undefined') {
                toast.show('success', 'Berhasil!', `Data siswa berhasil dihapus dari sistem`);
            }

            // Tutup modal dan reset ID
            closeDeleteModal();
            
        } catch (error) {
            if (typeof toast !== 'undefined') {
                toast.show('error', 'Error!', 'Terjadi kesalahan saat menghapus data siswa');
            }
        }
    }
}

function closeDeleteModal() {
    document.getElementById('deleteSiswa').classList.add('hidden');
    deleteId = null;
}

// Event listener untuk menutup modal ketika klik di luar modal
document.getElementById('deleteSiswa').addEventListener('click', function (e) {
    if (e.target === this) {
        closeDeleteModal();
    }
});

// Event listener untuk menutup modal dengan tombol ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !document.getElementById('deleteSiswa').classList.contains('hidden')) {
        closeDeleteModal();
    }
});

// Initial render
renderTable();

// LOGIC UNTUK TOAST NOTIFICATION
class ToastNotification {
    constructor() {
        this.toastElement = document.getElementById('toast-notification');
        this.toastIcon = document.getElementById('toast-icon');
        this.toastTitle = document.getElementById('toast-title');
        this.toastMessage = document.getElementById('toast-message');
        this.toastClose = document.getElementById('toast-close');
        this.toastContainer = this.toastElement.querySelector('.bg-white');

        this.isVisible = false;
        this.hideTimeout = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listener untuk tombol close
        this.toastClose.addEventListener('click', () => {
            this.hide();
        });

        // Auto hide setelah 5 detik
        this.toastElement.addEventListener('transitionend', (e) => {
            if (e.target === this.toastElement && this.isVisible) {
                this.autoHide();
            }
        });
    }

    show(type, title, message) {
        // Clear timeout sebelumnya jika ada
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Set konten toast
        this.setContent(type, title, message);

        // Reset classes
        this.toastElement.classList.remove('toast-exit', 'toast-show');
        this.toastElement.classList.add('toast-enter');

        // Force reflow untuk memastikan class diterapkan
        this.toastElement.offsetHeight;

        // Tampilkan toast dengan animasi
        setTimeout(() => {
            this.toastElement.classList.remove('toast-enter');
            this.toastElement.classList.add('toast-show');
            this.isVisible = true;
        }, 10);
    }

    hide() {
        if (!this.isVisible) return;

        // Clear auto hide timeout
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        // Sembunyikan dengan animasi
        this.toastElement.classList.remove('toast-show');
        this.toastElement.classList.add('toast-exit');
        this.isVisible = false;

        // Reset ke posisi awal setelah animasi selesai
        setTimeout(() => {
            this.toastElement.classList.remove('toast-exit');
            this.toastElement.classList.add('toast-enter');
        }, 300);
    }

    autoHide() {
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 5000); // Auto hide setelah 5 detik
    }

    setContent(type, title, message) {
        // Reset border color
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');

        // Set icon dan warna berdasarkan type
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

// Inisialisasi toast notification
const toast = new ToastNotification();

// Event listeners untuk demo buttons (hanya jika elemen ada)
document.addEventListener('DOMContentLoaded', () => {
    const showSuccessBtn = document.getElementById('show-success');
    if (showSuccessBtn) {
        showSuccessBtn.addEventListener('click', () => {
            toast.show('success', 'Berhasil!', 'Data berhasil dihapus dari sistem');
        });
    }

    const showErrorBtn = document.getElementById('show-error');
    if (showErrorBtn) {
        showErrorBtn.addEventListener('click', () => {
            toast.show('error', 'Error!', 'Terjadi kesalahan saat menghapus data');
        });
    }

    const showWarningBtn = document.getElementById('show-warning');
    if (showWarningBtn) {
        showWarningBtn.addEventListener('click', () => {
            toast.show('warning', 'Peringatan!', 'Pastikan Anda yakin ingin menghapus data ini');
        });
    }

    const showInfoBtn = document.getElementById('show-info');
    if (showInfoBtn) {
        showInfoBtn.addEventListener('click', () => {
            toast.show('info', 'Informasi', 'Proses penghapusan data sedang berlangsung');
        });
    }
});