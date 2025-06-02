
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
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
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
tambahSiswaBtn.addEventListener('click', () => showModal('tambahSiswaModal'));
document.getElementById('closeTambahModal').addEventListener('click', () => hideModal('tambahSiswaModal'));
// document.getElementById('cancelTambahSiswa').addEventListener('click', () => hideModal('tambahSiswaModal'));

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

    if (editId !== null) {
        // Edit mode
        const index = siswaData.findIndex(s => s.id === editId);
        if (index !== -1) {
            siswaData[index] = { ...siswaData[index], ...siswaBaru };
        }
        editId = null;
        toast.show('success', 'Berhasil!', 'Data Siswa berhasil di edit!');
    } else {
        // Tambah baru
        siswaData.push({ id: siswaData.length + 1, ...siswaBaru });
        toast.show('success', 'Berhasil!', 'Siswa berhasil ditambahkan!');
    }

    e.target.reset();
    hideModal('tambahSiswaModal');
    applyFilters();
});


// CRUD functions
function editSiswa(id) {
    const siswa = siswaData.find(s => s.id === id);
    if (!siswa) return;

    editId = id;

    const form = document.getElementById('tambahSiswaForm');
    form.namaLengkap.value = siswa.namaLengkap;
    form.jenisKelamin.value = siswa.jenisKelamin;
    form.nis.value = siswa.nis;
    form.kelas.value = siswa.kelas;
    form.noHp.value = siswa.noHp;
    form.status.value = siswa.status;
    document.getElementById('closeTambahModal').addEventListener('click', () => {
        editId = null;
        hideModal('tambahSiswaModal');
    });
    document.getElementById('cancelTambahSiswa').addEventListener('click', () => {
        editId = null;
        hideModal('tambahSiswaModal');
    });

    showModal('tambahSiswaModal');
}


let deleteId = null; // Variable untuk menyimpan ID yang akan dihapus

function deleteSiswa(id) {
    deleteId = id; // Simpan ID
    document.getElementById('deleteSiswa').classList.remove('hidden');
}

function confirmDelete() {
    if (deleteId !== null) {
        siswaData = siswaData.filter(s => s.id !== deleteId);
        applyFilters();
        toast.show('success', 'Berhasil!', 'Data Siswa berhasil dihapus!');

        // Tutup modal dan reset ID
        closeDeleteModal();
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




//LOGIC UNTUK TOAST NOTIFICATION
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

// Event listeners untuk demo buttons
document.getElementById('show-success').addEventListener('click', () => {
    toast.show('success', 'Berhasil!', 'Data berhasil dihapus dari sistem');
});

document.getElementById('show-error').addEventListener('click', () => {
    toast.show('error', 'Error!', 'Terjadi kesalahan saat menghapus data');
});

document.getElementById('show-warning').addEventListener('click', () => {
    toast.show('warning', 'Peringatan!', 'Pastikan Anda yakin ingin menghapus data ini');
});

document.getElementById('show-info').addEventListener('click', () => {
    toast.show('info', 'Informasi', 'Proses penghapusan data sedang berlangsung');
});