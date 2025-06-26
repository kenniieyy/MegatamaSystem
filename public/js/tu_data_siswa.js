let groupedSiswaData = {};
let siswaData = []; // untuk data yang akan ditampilkan di tabel

async function fetchSiswaData() {
    try {
        const response = await fetch('../src/API/get_siswa.php');
        const data = await response.json();

        groupedSiswaData = data.grouped;     // hasil pengelompokan per kelas
        siswaData = data.all;                // semua data siswa (tanpa group)
        filteredData = [...siswaData];       // bisa dipakai untuk search/filter
        renderTable();
    } catch (error) {
        console.error('Gagal mengambil data siswa:', error);
    }
}

fetchSiswaData();


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
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.name}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.gender}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.id}</td>
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
        const matchesSearch = siswa.name.toLowerCase().includes(searchTerm) ||
            siswa.id.includes(searchTerm);
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
document.getElementById('cancelTambahSiswa').addEventListener('click', () => hideModal('tambahSiswaModal'));

// Tambah Siswa Form
document.getElementById('tambahSiswaForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (editId !== null) {
        // Kirim data edit ke update_siswa.php
        formData.append('nis_lama', editId); // tambahkan nis_lama untuk update

        fetch('../src/API/update_siswa.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    toast.show('success', 'Berhasil!', 'Data siswa berhasil diubah!');
                    e.target.reset();
                    hideModal('tambahSiswaModal');
                    editId = null;
                    fetchSiswaData(); // ambil ulang dari database
                } else {
                    toast.show('error', 'Gagal!', data.message || 'Gagal mengubah data');
                }
            })
            .catch(error => {
                toast.show('error', 'Gagal!', 'Terjadi kesalahan saat mengirim data.');
                console.error('Error:', error);
            });
    } else {
        // Tambah baru
        fetch('../src/API/add_siswa.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    toast.show('success', 'Berhasil!', 'Siswa berhasil ditambahkan!');
                    e.target.reset();
                    hideModal('tambahSiswaModal');
                    fetchSiswaData(); // Refresh data dari database
                } else {
                    toast.show('error', 'Gagal!', data.message || 'Gagal menyimpan');
                }
            })
            .catch(error => {
                toast.show('error', 'Gagal!', 'Terjadi kesalahan saat mengirim data.');
                console.error('Error:', error);
            });
    }
});


// CRUD functions
function editSiswa(id) {
    const siswa = siswaData.find(s => s.id == id);
    if (!siswa) return;

    editId = id;

    const form = document.getElementById('tambahSiswaForm');
    form.namaLengkap.value = siswa.name;
    form.jenisKelamin.value = siswa.gender;
    form.kelas.value = siswa.kelas;
    form.noHp.value = siswa.noHp;
    form.status.value = siswa.status;
    form.nis.value = siswa.id; // yang tampil di input
    form.nis_lama.value = siswa.id; // hidden input untuk backend


    showModal('tambahSiswaModal');
}


let deleteId = null; // Variable untuk menyimpan ID yang akan dihapus

function deleteSiswa(id) {
    deleteId = id; // Simpan ID
    document.getElementById('deleteSiswa').classList.remove('hidden');
}

function confirmDelete() {
    if (deleteId !== null) {
        fetch('../src/API/delete_siswa.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `nis=${encodeURIComponent(deleteId)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toast.show('success', 'Berhasil!', 'Data Siswa berhasil dihapus!');
                fetchSiswaData(); // Refresh dari database
                closeDeleteModal();
            } else {
                toast.show('error', 'Gagal!', data.message || 'Gagal menghapus data.');
            }
        })
        .catch(error => {
            toast.show('error', 'Error!', 'Terjadi kesalahan koneksi.');
            console.error('Delete error:', error);
        });
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