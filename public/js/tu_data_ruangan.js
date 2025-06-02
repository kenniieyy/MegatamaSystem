// Data ruangan (simulasi)
let ruanganData = [
    { id: 1, namaRuangan: "Laboratorium Kimia", lokasi: "Lantai 2, dekat ruang kelas 12", keterangan: "Untuk praktikum kimia." },
    { id: 2, namaRuangan: "Laboratorium Fisika", lokasi: "Lantai 2, sebelah Lab Kimia", keterangan: "Untuk praktikum fisika." },
    { id: 3, namaRuangan: "Laboratorium Biologi", lokasi: "Lantai 2, sebelah Lab Fisika", keterangan: "Untuk praktikum biologi." },
    { id: 4, namaRuangan: "Laboratorium Komputer", lokasi: "Lantai 2, sebelah kiri ruang guru", keterangan: "Untuk pelatihan dan ujian komputer." },
    { id: 5, namaRuangan: "Ruang Kesenian", lokasi: "Lantai 1, di belakang perpustakaan", keterangan: "Untuk kegiatan seni." }
];



let currentPage = 1;
const itemsPerPage = 9;
let filteredData = [...ruanganData];
let editId = null;
let deleteId = null;

// DOM Elements
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    const tableBody = document.getElementById('ruanganTableBody');

    tableBody.innerHTML = pageData.map((ruangan, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${startIndex + index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ruangan.namaRuangan}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ruangan.lokasi}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ruangan.keterangan}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editRuangan(${ruangan.id})" class="text-orange-600 hover:text-orange-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteRuangan(${ruangan.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

    document.getElementById('currentRange').textContent = `${startIndex}-${endIndex}`;
    document.getElementById('totalData').textContent = filteredData.length;

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

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredData = ruanganData.filter(ruangan => {
        return ruangan.namaRuangan.toLowerCase().includes(searchTerm) ||
            ruangan.lokasi.toLowerCase().includes(searchTerm) ||
            ruangan.keterangan.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    renderTable();
}

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', applyFilters);

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

    const tambahRuanganBtn = document.getElementById('tambahRuanganBtn');
    tambahRuanganBtn.addEventListener('click', () => showModal('tambahRuanganModal'));

    document.getElementById('closeTambahModal').addEventListener('click', () => {
        editId = null;
        hideModal('tambahRuanganModal');
    });

    document.getElementById('cancelTambahRuangan').addEventListener('click', () => {
        editId = null;
        hideModal('tambahRuanganModal');
    });

    document.getElementById('tambahRuanganForm').addEventListener('submit', handleFormSubmit);

    renderTable();

    window.toast = new ToastNotification();
});

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function editRuangan(id) {
    const ruangan = ruanganData.find(r => r.id === id);
    if (!ruangan) return;

    editId = id;

    const form = document.getElementById('tambahRuanganForm');
    form.namaRuangan.value = ruangan.namaRuangan;
    form.lokasi.value = ruangan.lokasi;
    form.keterangan.value = ruangan.keterangan;

    document.getElementById('modalTitle').textContent = 'Edit Ruangan';

    showModal('tambahRuanganModal');
}

function deleteRuangan(id) {
    deleteId = id;
    document.getElementById('deleteRuangan').classList.remove('hidden');
}

function confirmDelete() {
    if (deleteId !== null) {
        ruanganData = ruanganData.filter(r => r.id !== deleteId);
        applyFilters();
        toast.show('success', 'Berhasil!', 'Data Ruangan berhasil dihapus!');
        closeDeleteModal();
    }
}

function closeDeleteModal() {
    document.getElementById('deleteRuangan').classList.add('hidden');
    deleteId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ruangan = {
        namaRuangan: formData.get('namaRuangan'),
        lokasi: formData.get('lokasi'),
        keterangan: formData.get('keterangan')
    };

    if (editId !== null) {
        const index = ruanganData.findIndex(r => r.id === editId);
        if (index !== -1) {
            ruanganData[index] = { ...ruanganData[index], ...ruangan };
        }
        editId = null;
        toast.show('success', 'Berhasil!', 'Data Ruangan berhasil di edit!');
        document.getElementById('modalTitle').textContent = 'Tambah Ruangan Baru';
    } else {
        ruanganData.push({
            id: ruanganData.length + 1,
            ...ruangan
        });
        toast.show('success', 'Berhasil!', 'Ruangan berhasil ditambahkan!');
    }

    e.target.reset();
    hideModal('tambahRuanganModal');
    applyFilters();
}

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
        this.toastClose.addEventListener('click', () => {
            this.hide();
        });

        this.toastElement.addEventListener('transitionend', (e) => {
            if (e.target === this.toastElement && this.isVisible) {
                this.autoHide();
            }
        });
    }

    show(type, title, message) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.setContent(type, title, message);
        this.toastElement.classList.remove('toast-exit', 'toast-show');
        this.toastElement.classList.add('toast-enter');
        this.toastElement.offsetHeight;

        setTimeout(() => {
            this.toastElement.classList.remove('toast-enter');
            this.toastElement.classList.add('toast-show');
            this.isVisible = true;
        }, 10);
    }

    hide() {
        if (!this.isVisible) return;

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.toastElement.classList.remove('toast-show');
        this.toastElement.classList.add('toast-exit');
        this.isVisible = false;

        setTimeout(() => {
            this.toastElement.classList.remove('toast-exit');
            this.toastElement.classList.add('toast-enter');
        }, 300);
    }

    autoHide() {
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 5000);
    }

    setContent(type, title, message) {
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');

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

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('deleteRuangan').addEventListener('click', function (e) {
        if (e.target === this) {
            closeDeleteModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !document.getElementById('deleteRuangan').classList.contains('hidden')) {
            closeDeleteModal();
        }
    });
});