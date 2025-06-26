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
let teachersData = [];

fetch('../src/API/get_guru.php')
    .then(res => res.json())
    .then(data => {
        teachersData = data;
        filteredData = [...teachersData];

        renderTable();        // Pindahkan ke sini
        renderPagination();   // Pindahkan ke sini
    })
    .catch(err => console.error('Gagal mengambil data guru:', err));


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
                        <img src="../src/${teacher.photo}" alt="${teacher.name}" class="w-10 h-10 rounded-full object-cover">
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
    console.log("Editing teacher with ID:", id, " (Type:", typeof id, ")"); // Cek tipe data ID dari tombol
    editingId = id;
    // Temukan guru di teachersData
    const teacher = teachersData.find(t => {
        console.log("Comparing:", t.id, "(Type:", typeof t.id, ") with", id, "(Type:", typeof id, ")"); // Debugging perbandingan
        return t.id == id; // Gunakan '==' (loose equality) untuk sementara
    });

    console.log("Found teacher:", teacher); // Ini masih akan undefined jika tidak ketemu

    // Lanjutkan kode Anda jika teacher ditemukan
    if (teacher) { // Tambahkan pengecekan ini!
        document.getElementById('modalTitle').textContent = 'Edit Data Guru';
        document.getElementById('teacherName').value = teacher.name;
        document.getElementById('teacherGender').value = teacher.gender;
        document.getElementById('teacherNIP').value = teacher.nip;
        document.getElementById('teacherSubject').value = teacher.subject;
        document.getElementById('teacherWaliKelas').value = teacher.waliKelas || "";
        document.getElementById('teacherStatus').value = teacher.status;
        document.getElementById('teacherUsername').value = teacher.username;
        document.getElementById('teacherPassword').value = teacher.password;

        document.getElementById('teacherModal').classList.remove('hidden');
    } else {
        console.error("Guru dengan ID", id, "tidak ditemukan di teachersData.");
        // Opsional: Tampilkan toast error atau notifikasi ke pengguna
        toast.show('error', 'Data Tidak Ditemukan', `Guru dengan ID ${id} tidak ditemukan.`);
    }
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

async function confirmDelete() {
     console.log("ID yang akan dihapus:", deleteId); // Tambahkan log ini
    if (deleteId === null) {
        toast.show('error', 'Error!', 'Tidak ada guru yang dipilih untuk dihapus.');
        return;
    }

    try {
        const response = await fetch('../src/API/delete.php', { // PHP untuk DELETE
            method: 'POST', // Gunakan POST untuk kirim ID yang akan dihapus
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: deleteId }) // Kirim ID sebagai JSON
        });

        const result = await response.json();

        if (result.success) {
            toast.show('success', 'Berhasil Dihapus!', `Data guru berhasil dihapus dari sistem.`);
            // Setelah berhasil di database, ambil ulang semua data
            const updatedDataResponse = await fetch('../src/API/get_guru.php');
            teachersData = await updatedDataResponse.json();
            filteredData = [...teachersData];

            closeDeleteModal();
            currentPage = 1; // Kembali ke halaman pertama setelah perubahan
            renderTable();
            renderPagination();

        } else {
            toast.show('error', 'Error!', `Gagal menghapus data: ${result.message || 'Terjadi kesalahan tidak diketahui'}`);
            console.error('Error Hapus:', result.message || 'Tidak ada pesan dari server');
        }
    } catch (error) {
        toast.show('error', 'Error Koneksi!', `Gagal menghubungi server untuk menghapus data.`);
        console.error("Error saat menghapus data:", error);
    } finally {
        deleteId = null; // Reset deleteId
    }
}


let currentTeacherPhoto;

function setupForm() {
    const form = document.getElementById('teacherForm');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData();
            formData.append('fullname', document.getElementById('teacherName').value); // SESUAIKAN DENGAN NAMA DI PHP: 'fullname'
            formData.append('gender', document.getElementById('teacherGender').value);
            formData.append('nip', document.getElementById('teacherNIP').value); // SESUAIKAN DENGAN NAMA DI PHP: 'nip'
            formData.append('subject', document.getElementById('teacherSubject').value); // Tambahkan subject
            formData.append('waliKelas', document.getElementById('teacherWaliKelas').value); // SESUAIKAN DENGAN NAMA DI PHP: 'waliKelas' (atau wali_kelas)
            formData.append('status', document.getElementById('teacherStatus').value);
            formData.append('username', document.getElementById('teacherUsername').value);
            formData.append('password', document.getElementById('teacherPassword').value);

            // === Tambahkan file foto ke FormData ===
            const photoInput = document.getElementById('teacherPhoto');
            if (photoInput.files.length > 0) {
                formData.append('foto_profil', photoInput.files[0]); // Nama 'foto_profil' harus sama dengan $_FILES di PHP
            } else if (editingId && currentTeacherPhoto) {
                // Jika tidak ada file baru diupload saat edit, kirim URL foto lama
                // Ini penting agar PHP tahu foto lama tidak dihapus jika tidak ada update
                formData.append('current_photo_url', currentTeacherPhoto);
            }
            // =======================================

            let endpoint = '';
            let messageType = '';

            if (editingId) {
                // Jika sedang mengedit
                endpoint = '../src/API/add_guru.php'; // PHP untuk UPDATE
                formData.append('id_guru', editingId); // Kirim ID guru yang akan diedit. Nama ini harus sama dengan $_POST di PHP
                messageType = 'diperbarui';
            } else {
                // Jika sedang menambah
                endpoint = '../src/API/add_guru.php'; // PHP untuk ADD
                messageType = 'ditambahkan';
            }

            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    // Hapus 'Content-Type': 'application/json' ketika menggunakan FormData
                    // Browser akan otomatis mengatur Content-Type: multipart/form-data
                    body: formData
                });

                const result = await response.json(); // PHP harus mengembalikan JSON

                if (result.success) {
                    toast.show('success', `Berhasil ${messageType}!`, result.message);

                    // Refresh data setelah sukses (ini masih cara terbaik)
                    const updatedDataResponse = await fetch('../src/API/get_guru.php');
                    teachersData = await updatedDataResponse.json();
                    filteredData = [...teachersData];

                    closeModal();
                    currentPage = 1;
                    renderTable();
                    renderPagination();

                } else {
                    toast.show('error', 'Error!', `Gagal ${messageType}: ${result.message || 'Terjadi kesalahan tidak diketahui'}`);
                    console.error(`Error ${messageType}:`, result.message || 'Tidak ada pesan dari server');
                }
            } catch (error) {
                toast.show('error', 'Error Koneksi!', `Gagal menghubungi server untuk ${messageType} data.`);
                console.error(`Error saat ${messageType} data:`, error);
            }
        });
    }
}
