// Toast Notification Class
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

// Teacher Data
let teachersData = [
    { id: 1, name: "Siti Nurhaliza, S.Pd", gender: "Perempuan", nip: "19800412 200903 2 001", subject: "Agama Islam", waliKelas: "Wali Kelas 7", status: "Aktif", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face" },
    { id: 2, name: "Ahmad Fauzan, M.Pd", gender: "Laki - Laki", nip: "19791105 200701 1 002", subject: "Fisika", waliKelas: "Wali Kelas 9", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { id: 3, name: "Rina Kartikasari, S.Pd", gender: "Perempuan", nip: "19870217 201001 2 003", subject: "IPS", waliKelas: "Wali Kelas 8", status: "Aktif", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    { id: 4, name: "Dedi Hartono, S.Pd", gender: "Laki - Laki", nip: "19750503 199903 1 004", subject: "Biologi", waliKelas: "Wali Kelas 12", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { id: 5, name: "Yuliana Maharani, M.Pd", gender: "Perempuan", nip: "19860526 201102 2 005", subject: "Bahasa Inggris", waliKelas: "", status: "Aktif", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
    { id: 6, name: "Lestari Widyaningrum, S.Pd", gender: "Perempuan", nip: "19820115 200503 1 006", subject: "Bahasa Indonesia", waliKelas: "Wali Kelas 11", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face" },
    { id: 7, name: "Olivia Putri, S.Pd", gender: "Perempuan", nip: "19881122 201203 2 007", subject: "Matematika", waliKelas: "Wali Kelas 10", status: "Aktif", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
    { id: 8, name: "Andi Seputra, S.Sn", gender: "Laki - Laki", nip: "19891201 201104 1 008", subject: "Sejarah", waliKelas: "", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { id: 9, name: "Teguh Prasetyo, S.Pd", gender: "Laki - Laki", nip: "19760808 200001 2 009", subject: "Agama Islam", waliKelas: "", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face" },
    { id: 10, name: "Dewi Lestari, S.Pd", gender: "Perempuan", nip: "19830614 201001 2 003", subject: "Bahasa Indonesia", waliKelas: "", status: "Aktif", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
    { id: 11, name: "Budi Santoso, M.T", gender: "Laki-laki", nip: "19810203 200702 1 004", subject: "Matematika", waliKelas: "", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face" },
    { id: 12, name: "Rina Marlina, S.Kom", gender: "Perempuan", nip: "19890517 201203 2 005", subject: "IPS", waliKelas: "", status: "Aktif", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face" }
];

let filteredData = [...teachersData];
let currentPage = 1;
const itemsPerPage = 9;
let editingId = null;
let deleteId = null;

// Inisialisasi toast notification
let toast;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Initialize toast notification
    toast = new ToastNotification();
    
    renderTable();
    renderPagination();
    setupSearch();
    setupForm();
});

// Render table
function renderTable() {
    const tbody = document.getElementById('teacherTableBody');
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = filteredData.slice(startIndex, endIndex);

    tbody.innerHTML = currentData.map(teacher => `
                <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                        <img src="${teacher.photo}" alt="${teacher.name}" class="w-10 h-10 rounded-full object-cover">
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.gender}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.nip}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.subject}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${teacher.waliKelas || 'Bukan Wali Kelas'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 text-xs font-medium rounded-full ${teacher.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                            ${teacher.status}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex space-x-2">
                            <button onclick="editTeacher(${teacher.id})" class="text-orange-600 hover:text-orange-900 p-1">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteTeacher(${teacher.id})" class="text-red-600 hover:text-red-900 p-1">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');

    updatePaginationInfo();
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
                    <button onclick="goToPage(${i})" class="px-3 py-1 text-sm rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
                        ${i}
                    </button>
                `;
    }
    pageNumbers.innerHTML = paginationHTML;
}

// Update pagination info
function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
    const totalItems = filteredData.length;

    document.getElementById('paginationInfo').textContent =
        `Menampilkan ${startIndex}-${endIndex} dari ${totalItems} guru`;
}

// Pagination functions
function goToPage(page) {
    currentPage = page;
    renderTable();
    renderPagination();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        renderPagination();
    }
}

function nextPage() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        renderPagination();
    }
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase();
        filteredData = teachersData.filter(teacher =>
            teacher.name.toLowerCase().includes(searchTerm) ||
            teacher.subject.toLowerCase().includes(searchTerm) ||
            teacher.nip.includes(searchTerm)
        );
        currentPage = 1;
        renderTable();
        renderPagination();
    });
}

// Modal functions
function openAddModal() {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Tambah Data Guru';
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherWaliKelas').value = "";
    document.getElementById('teacherModal').classList.remove('hidden');
}

function editTeacher(id) {
    editingId = id;
    const teacher = teachersData.find(t => t.id === id);

    document.getElementById('modalTitle').textContent = 'Edit Data Guru';
    document.getElementById('teacherName').value = teacher.name;
    document.getElementById('teacherGender').value = teacher.gender;
    document.getElementById('teacherNIP').value = teacher.nip;
    document.getElementById('teacherSubject').value = teacher.subject;
    document.getElementById('teacherWaliKelas').value = teacher.waliKelas || "";
    document.getElementById('teacherStatus').value = teacher.status;

    document.getElementById('teacherModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('teacherModal').classList.add('hidden');
}

function deleteTeacher(id) {
    deleteId = id;
    const teacher = teachersData.find(t => t.id === id);
    
    // Show warning toast before showing delete modal
    //toast.show('warning', 'Konfirmasi Hapus', `Apakah Anda yakin ingin menghapus data guru ${teacher.name}?`);
    
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.add('hidden');
}

function confirmDelete() {
    const teacherToDelete = teachersData.find(t => t.id === deleteId);
    const teacherName = teacherToDelete ? teacherToDelete.name : 'Guru';
    
    try {
        teachersData = teachersData.filter(t => t.id !== deleteId);
        filteredData = filteredData.filter(t => t.id !== deleteId);
        renderTable();
        renderPagination();
        closeDeleteModal();
        
        // Show success notification
        toast.show('success', 'Berhasil Dihapus!', `Data guru berhasil dihapus dari sistem`);
    } catch (error) {
        // Show error notification if deletion fails
        toast.show('error', 'Error!', 'Terjadi kesalahan saat menghapus data guru');
    }
}

// Form submission
function setupForm() {
    const form = document.getElementById('teacherForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('teacherName').value,
                gender: document.getElementById('teacherGender').value,
                nip: document.getElementById('teacherNIP').value,
                subject: document.getElementById('teacherSubject').value,
                waliKelas: document.getElementById('teacherWaliKelas').value,
                status: document.getElementById('teacherStatus').value,
                photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face"
            };

            try {
                if (editingId) {
                    // Edit existing teacher
                    const index = teachersData.findIndex(t => t.id === editingId);
                    if (index !== -1) {
                        teachersData[index] = { ...teachersData[index], ...formData };
                        toast.show('success', 'Berhasil Diperbarui!', `Data guru berhasil diperbarui`);
                    }
                } else {
                    // Add new teacher
                    const newId = Math.max(...teachersData.map(t => t.id)) + 1;
                    teachersData.push({ id: newId, ...formData });
                    toast.show('success', 'Berhasil Ditambahkan!', `Data guru berhasil ditambahkan ke sistem`);
                }

                filteredData = [...teachersData];
                renderTable();
                renderPagination();
                closeModal();
                
            } catch (error) {
                // Show error notification if operation fails
                const action = editingId ? 'memperbarui' : 'menambahkan';
                toast.show('error', 'Error!', `Terjadi kesalahan saat ${action} data guru`);
            }
        });
    }
}