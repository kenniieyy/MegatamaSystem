document.addEventListener('DOMContentLoaded', function () {
    const siswaTableBody = document.getElementById('siswaTableBody');
    const searchInput = document.getElementById('searchInput');
    const kelasFilter = document.getElementById('kelasFilter');
    const tambahSiswaModal = document.getElementById('tambahSiswaModal');
    const tambahSiswaForm = document.getElementById('tambahSiswaForm');
    const modalTitle = tambahSiswaModal.querySelector('h3');
    const deleteSiswaModal = document.getElementById('deleteSiswa'); // Pastikan ID ini benar di HTML
    const confirmDeleteBtn = document.getElementById('confirmDelete'); // Ambil tombol konfirmasi hapus
    const cancelDeleteBtn = document.getElementById('cancelDelete'); // Ambil tombol batal hapus
    const apiUrl = 'http://localhost/MegatamaSystem/src/API/siswa.php';

    let allSiswaData = [];
    let filteredSiswaData = [];
    let currentPage = 1;
    const itemsPerPage = 9;
    let editSiswaId = null; // Menyimpan NIS siswa yang sedang diedit
    let deleteSiswaId = null; // Menyimpan NIS siswa yang akan dihapus

    // Toast Notification Class (tetap sama)
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
            this.toastClose.addEventListener('click', () => { this.hide(); });
            this.toastElement.addEventListener('transitionend', (e) => {
                if (e.target === this.toastElement && this.isVisible) { this.autoHide(); }
            });
        }
        show(type, title, message) {
            if (this.hideTimeout) { clearTimeout(this.hideTimeout); }
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
            if (this.hideTimeout) { clearTimeout(this.hideTimeout); }
            this.toastElement.classList.remove('toast-show');
            this.toastElement.classList.add('toast-exit');
            this.isVisible = false;
            setTimeout(() => { this.toastElement.classList.remove('toast-exit'); this.toastElement.classList.add('toast-enter'); }, 300);
        }
        autoHide() {
            this.hideTimeout = setTimeout(() => { this.hide(); }, 5000);
        }
        setContent(type, title, message) {
            this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');
            switch (type) {
                case 'success': this.toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>'; this.toastContainer.classList.add('border-l-green-500'); break;
                case 'error': this.toastIcon.innerHTML = '<i class="fas fa-times-circle text-red-500 text-xl"></i>'; this.toastContainer.classList.add('border-l-red-500'); break;
                case 'warning': this.toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>'; this.toastContainer.classList.add('border-l-yellow-500'); break;
                case 'info': this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>'; this.toastContainer.classList.add('border-l-blue-500'); break;
                default: this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500 text-xl"></i>'; this.toastContainer.classList.add('border-l-gray-500');
            }
            this.toastTitle.textContent = title;
            this.toastMessage.textContent = message;
        }
    }
    const toast = new ToastNotification();

    function getStatusBadge(status) {
        switch (status) {
            case 'Aktif': return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>';
            case 'Lulus': return '<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Lulus</span>';
            case 'Non-Aktif': return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Non-Aktif</span>';
            default: return '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>';
        }
    }

    function renderTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredSiswaData.slice(startIndex, endIndex);
        siswaTableBody.innerHTML = '';
        if (pageData.length === 0) {
            siswaTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">Data tidak ditemukan.</td></tr>`;
        } else {
            siswaTableBody.innerHTML = pageData.map(siswa => `
                <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.nama_siswa}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.jenis_kelamin}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.nis}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.kelas}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.no_hp}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(siswa.status)}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onclick="editSiswa('${siswa.nis}')" class="text-orange-600 hover:text-orange-900 mr-3">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="confirmDeleteSiswa('${siswa.nis}')" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        updatePagination();
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredSiswaData.length / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage + 1;
        const endIndex = Math.min(currentPage * itemsPerPage, filteredSiswaData.length);
        document.getElementById('currentRange').textContent = `${startIndex}-${endIndex}`;
        document.getElementById('totalData').textContent = filteredSiswaData.length;
        const pageNumbersContainer = document.getElementById('pageNumbers');
        pageNumbersContainer.innerHTML = '';
        const prevButton = document.getElementById('prevPage');
        prevButton.disabled = currentPage === 1;
        prevButton.onclick = () => { if (currentPage > 1) { currentPage--; renderTable(); } };
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.className = `px-3 py-2 text-sm ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'} rounded`;
            button.addEventListener('click', () => { currentPage = i; renderTable(); });
            pageNumbersContainer.appendChild(button);
        }
        const nextButton = document.getElementById('nextPage');
        nextButton.disabled = currentPage === totalPages;
        nextButton.onclick = () => { const totalPages = Math.ceil(filteredSiswaData.length / itemsPerPage); if (currentPage < totalPages) { currentPage++; renderTable(); } };
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedKelas = kelasFilter.value;
        filteredSiswaData = allSiswaData.filter(siswa => {
            const matchesSearch = siswa.nama_siswa.toLowerCase().includes(searchTerm) || siswa.nis.includes(searchTerm);
            const matchesKelas = !selectedKelas || siswa.kelas === selectedKelas;
            return matchesSearch && matchesKelas;
        });
        currentPage = 1;
        renderTable();
    }

    async function loadSiswaData() {
        try {
            const response = await fetch(apiUrl, { method: 'GET' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal memuat data siswa.');
            }
            const result = await response.json();
            if (result.success) {
                allSiswaData = result.data;
                applyFilters();
            } else {
                toast.show('error', 'Error!', 'Gagal memuat data siswa: ' + result.message);
                siswaTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-600">Gagal memuat data</td></tr>`;
            }
        } catch (error) {
            console.error('Error loading siswa data:', error);
            toast.show('error', 'Error!', `Terjadi kesalahan: ${error.message}`);
            siswaTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-600">Koneksi ke API gagal atau error: ${error.message}</td></tr>`;
        }
    }

    searchInput.addEventListener('input', applyFilters);
    kelasFilter.addEventListener('change', applyFilters);

    document.getElementById('tambahSiswaBtn').addEventListener('click', () => {
        editSiswaId = null;
        tambahSiswaForm.reset();
        modalTitle.textContent = 'Tambah Siswa Baru';
        tambahSiswaModal.classList.remove('hidden');
    });

    document.getElementById('closeTambahModal').addEventListener('click', () => {
        tambahSiswaModal.classList.add('hidden');
    });

    document.getElementById('cancelTambahSiswa').addEventListener('click', () => {
        tambahSiswaModal.classList.add('hidden');
    });

    tambahSiswaForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = {
            namasiswa: this.namasiswa.value.trim(),
            jenisKelamin: this.jenisKelamin.value,
            nis: this.nis.value.trim(),
            kelas: this.kelas.value,
            noHp: this.noHp.value.trim(),
            status: this.status.value
        };
        if (Object.values(formData).some(value => !value)) {
            toast.show('warning', 'Peringatan!', 'Semua field harus diisi!');
            return;
        }
        let method = 'POST';
        if (editSiswaId !== null) {
            method = 'PUT';
            // Saat update, kita perlu mengirim NIS yang sedang diedit
            // Form akan mengirim NIS baru jika diubah, tapi untuk identifikasi kita pakai editSiswaId (NIS lama)
            formData.id_siswa = editSiswaId; // PHP API akan menerima ini sebagai 'id_siswa' lalu menggunakannya sebagai 'nis'
        }
        try {
            const response = await fetch(apiUrl, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok) {
                toast.show('success', 'Berhasil!', result.message);
                tambahSiswaForm.reset();
                tambahSiswaModal.classList.add('hidden');
                editSiswaId = null;
                loadSiswaData();
            } else {
                toast.show('error', 'Gagal!', result.message || `Error: ${response.statusText}`);
                console.error('Server responded with an error:', result);
            }
        } catch (error) {
            console.error('Operation failed:', error);
            toast.show('error', 'Error!', `Terjadi kesalahan jaringan atau server: ${error.message}`);
        }
    });

    window.editSiswa = async function (nis) { // Menerima NIS sebagai parameter
        editSiswaId = nis; // Simpan NIS siswa yang akan diedit
        modalTitle.textContent = 'Edit Data Siswa';
        try {
            // Mengambil data untuk diedit menggunakan NIS sebagai ID
            const response = await fetch(`${apiUrl}?id_siswa=${nis}`, { method: 'GET' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengambil data siswa untuk diedit.');
            }
            const result = await response.json();
            if (result.success && result.data) {
                const siswa = result.data;
                tambahSiswaForm.namasiswa.value = siswa.nama_siswa;
                tambahSiswaForm.jenisKelamin.value = siswa.jenis_kelamin;
                tambahSiswaForm.nis.value = siswa.nis; // Pastikan NIS yang ada di form adalah NIS siswa
                tambahSiswaForm.kelas.value = siswa.kelas;
                tambahSiswaForm.noHp.value = siswa.no_hp;
                tambahSiswaForm.status.value = siswa.status;
                tambahSiswaModal.classList.remove('hidden');
            } else {
                toast.show('error', 'Error!', result.message || 'Data siswa tidak ditemukan untuk diedit.');
                console.error('API did not return specific student data for NIS:', nis, result);
            }
        } catch (error) {
            console.error('Error fetching siswa for edit:', error);
            toast.show('error', 'Error!', `Gagal mengambil data siswa untuk diedit: ${error.message}`);
        }
    };

    window.confirmDeleteSiswa = function (nis) { // Menerima NIS sebagai parameter
        deleteSiswaId = nis; // Simpan NIS siswa yang akan dihapus
        deleteSiswaModal.classList.remove('hidden'); // Tampilkan modal
    };

    // --- PENTING: Perbaiki Event Listener Tombol Hapus ---
    // Pastikan event listener hanya dipasang sekali.
    // Jika Anda punya event listener yang dipasang berkali-kali, itu bisa menyebabkan konflik.
    // Cara terbaik adalah melepasnya dulu jika sudah ada, lalu pasang yang baru.
    // Namun, untuk kasus ini, asalkan DOM Elements (confirmDeleteBtn, cancelDeleteBtn)
    // sudah ada saat DOMContentLoaded, sekali pasang sudah cukup.

    if (confirmDeleteBtn && !confirmDeleteBtn.dataset.listenerAttached) {
        confirmDeleteBtn.addEventListener('click', async function () {
            if (deleteSiswaId !== null) {
                try {
                    const response = await fetch(apiUrl, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id_siswa: deleteSiswaId }) // Kirim NIS sebagai id_siswa di body
                    });
                    const result = await response.json();
                    if (response.ok) {
                        toast.show('success', 'Berhasil!', result.message);
                        deleteSiswaModal.classList.add('hidden');
                        deleteSiswaId = null;
                        loadSiswaData();
                    } else {
                        toast.show('error', 'Gagal!', result.message || `Error: ${response.statusText}`);
                        console.error('Server responded with an error:', result);
                    }
                } catch (error) {
                    console.error('Delete failed:', error);
                    toast.show('error', 'Error!', `Terjadi kesalahan jaringan atau server saat menghapus data: ${error.message}`);
                }
            } else {
                toast.show('warning', 'Peringatan!', 'Tidak ada siswa yang dipilih untuk dihapus.');
            }
        });
        confirmDeleteBtn.dataset.listenerAttached = 'true'; // Tandai bahwa listener sudah terpasang
    }

    if (cancelDeleteBtn && !cancelDeleteBtn.dataset.listenerAttached) {
        cancelDeleteBtn.addEventListener('click', function () {
            deleteSiswaModal.classList.add('hidden');
            deleteSiswaId = null;
        });
        cancelDeleteBtn.dataset.listenerAttached = 'true'; // Tandai bahwa listener sudah terpasang
    }

    // Event listener untuk menutup modal ketika klik di luar area modal (backdrop)
    if (deleteSiswaModal) {
        deleteSiswaModal.addEventListener('click', function (e) {
            if (e.target === this) { // Jika target klik adalah backdrop modal itu sendiri
                deleteSiswaModal.classList.add('hidden');
                deleteSiswaId = null;
            }
        });
    }

    // Initial load of data when the page loads
    loadSiswaData();
});

//     // Contoh: tampilkan data di console, nanti bisa diganti kirim ke server
//     console.log({
//         nama, jenisKelamin, nis, kelas, noHp, status
//     });

//     alert('Data siswa berhasil disimpan!');

//     // Reset form
//     this.reset();

//     // Tutup modal
//     document.getElementById('tambahSiswaModal').classList.add('hidden');
// });

// // Data siswa (simulasi)
// let siswaData = [
//     { id: 1, namasiswa: "Rizky Pratama", jenisKelamin: "Laki - Laki", nis: "2301456781", kelas: "9", noHp: "081234567890", status: "Aktif" },
//     { id: 2, namasiswa: "Salsabila Azzahra", jenisKelamin: "Perempuan", nis: "2301456782", kelas: "12", noHp: "082156781234", status: "Lulus" },
//     { id: 3, namasiswa: "Dimas Arya Nugroho", jenisKelamin: "Laki - Laki", nis: "2301456783", kelas: "9", noHp: "085723456789", status: "Lulus" },
//     { id: 4, namasiswa: "Aulia Rahmawati", jenisKelamin: "Perempuan", nis: "2301456784", kelas: "7", noHp: "081398765432", status: "Non-Aktif" },
//     { id: 5, namasiswa: "Fadlan Nur Ramadhan", jenisKelamin: "Laki - Laki", nis: "2301456785", kelas: "11", noHp: "082287654321", status: "Aktif" },
//     { id: 6, namasiswa: "Nabila Khairunnisa", jenisKelamin: "Perempuan", nis: "2301456786", kelas: "10", noHp: "089012345678", status: "Non-Aktif" },
//     { id: 7, namasiswa: "Alif Maulana", jenisKelamin: "Laki - Laki", nis: "2301456787", kelas: "10", noHp: "083122334455", status: "Aktif" },
//     { id: 8, namasiswa: "Zahra Melani Putri", jenisKelamin: "Perempuan", nis: "2301456788", kelas: "7", noHp: "085377889900", status: "Non-Aktif" },
//     { id: 9, namasiswa: "Yoga Pradiptа", jenisKelamin: "Laki - Laki", nis: "2301456789", kelas: "12", noHp: "087766554433", status: "Non-Aktif" },
//     { id: 10, namasiswa: "Aisyah Nur Azizah", jenisKelamin: "Perempuan", nis: "2301456790", kelas: "8", noHp: "081299887766", status: "Aktif" },
//     { id: 11, namasiswa: "Bayu Setiawan", jenisKelamin: "Laki - Laki", nis: "2301456791", kelas: "9", noHp: "082334455667", status: "Aktif" },
//     { id: 12, namasiswa: "Citra Dewi", jenisKelamin: "Perempuan", nis: "2301456792", kelas: "11", noHp: "085566778899", status: "Lulus" }
// ];

// let currentPage = 1;
// const itemsPerPage = 9;
// let filteredData = [...siswaData];
// let editId = null;

// // DOM Elements
// const sidebar = document.getElementById('sidebar');
// const searchInput = document.getElementById('searchInput');
// const kelasFilter = document.getElementById('kelasFilter');
// const tableBody = document.getElementById('siswaTableBody');
// const naikkanKelasBtn = document.getElementById('naikkanKelasBtn');
// const tambahSiswaBtn = document.getElementById('tambahSiswaBtn');

// // Modal elements
// const naikkanKelasModal = document.getElementById('naikkanKelasModal');
// const tambahSiswaModal = document.getElementById('tambahSiswaModal');

// // Get status badge class
// function getStatusBadge(status) {
//     switch (status) {
//         case 'Aktif':
//             return '<span class="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Aktif</span>';
//         case 'Lulus':
//             return '<span class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Lulus</span>';
//         case 'Non-Aktif':
//             return '<span class="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Non-Aktif</span>';
//         default:
//             return '<span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Unknown</span>';
//     }
// }

// // Render table
// function renderTable() {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const pageData = filteredData.slice(startIndex, endIndex);

//     tableBody.innerHTML = pageData.map(siswa => `
//                 <tr class="hover:bg-gray-50">
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.namasiswa}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.jenisKelamin}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.nis}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.kelas}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${siswa.noHp}</td>
//                     <td class="px-6 py-4 whitespace-nowrap">${getStatusBadge(siswa.status)}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <button onclick="editSiswa(${siswa.id})" class="text-orange-600 hover:text-orange-900 mr-3">
//                             <i class="fas fa-edit"></i>
//                         </button>
//                         <button onclick="deleteSiswa(${siswa.id})" class="text-red-600 hover:text-red-900">
//                             <i class="fas fa-trash"></i>
//                         </button>
//                     </td>
//                 </tr>
//             `).join('');

//     updatePagination();
// }

// // Update pagination
// function updatePagination() {
//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     const startIndex = (currentPage - 1) * itemsPerPage + 1;
//     const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

//     document.getElementById('currentRange').textContent = `${startIndex}-${endIndex}`;
//     document.getElementById('totalData').textContent = filteredData.length;

//     // Update page numbers
//     const pageNumbers = document.getElementById('pageNumbers');
//     pageNumbers.innerHTML = '';

//     for (let i = 1; i <= totalPages; i++) {
//         const button = document.createElement('button');
//         button.textContent = i;
//         button.className = `px-3 py-2 text-sm ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'} rounded`;
//         button.addEventListener('click', () => {
//             currentPage = i;
//             renderTable();
//         });
//         pageNumbers.appendChild(button);
//     }

//     // Update prev/next buttons
//     document.getElementById('prevPage').disabled = currentPage === 1;
//     document.getElementById('nextPage').disabled = currentPage === totalPages;
// }

// // Filter functions
// function applyFilters() {
//     const searchTerm = searchInput.value.toLowerCase();
//     const selectedKelas = kelasFilter.value;

//     filteredData = siswaData.filter(siswa => {
//         const matchesSearch = siswa.namasiswa.toLowerCase().includes(searchTerm) ||
//             siswa.nis.includes(searchTerm);
//         const matchesKelas = !selectedKelas || siswa.kelas === selectedKelas;

//         return matchesSearch && matchesKelas;
//     });

//     currentPage = 1;
//     renderTable();
// }

// // Event listeners for filters
// searchInput.addEventListener('input', applyFilters);
// kelasFilter.addEventListener('change', applyFilters);

// // Pagination event listeners
// document.getElementById('prevPage').addEventListener('click', () => {
//     if (currentPage > 1) {
//         currentPage--;
//         renderTable();
//     }
// });

// document.getElementById('nextPage').addEventListener('click', () => {
//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     if (currentPage < totalPages) {
//         currentPage++;
//         renderTable();
//     }
// });

// // Modal functions
// function showModal(modalId) {
//     document.getElementById(modalId).classList.remove('hidden');
//     document.body.style.overflow = 'hidden';
// }

// function hideModal(modalId) {
//     document.getElementById(modalId).classList.add('hidden');
//     document.body.style.overflow = 'auto';
// }

// // Naikkan Kelas Modal
// // naikkanKelasBtn.addEventListener('click', () => showModal('naikkanKelasModal'));
// // document.getElementById('cancelNaikkanKelas').addEventListener('click', () => hideModal('naikkanKelasModal'));
// // document.getElementById('confirmNaikkanKelas').addEventListener('click', () => {
// //     // Process kenaikan kelas logic here
// //     alert('Kenaikan kelas berhasil diproses!');
// //     hideModal('naikkanKelasModal');
// // });

// // Tambah Siswa Modal
// tambahSiswaBtn.addEventListener('click', () => showModal('tambahSiswaModal'));
// document.getElementById('closeTambahModal').addEventListener('click', () => hideModal('tambahSiswaModal'));
// // document.getElementById('cancelTambahSiswa').addEventListener('click', () => hideModal('tambahSiswaModal'));

// // Tambah Siswa Form
// document.getElementById('tambahSiswaForm').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const siswaBaru = {
//         namasiswa: formData.get('namasiswa'),
//         jenisKelamin: formData.get('jenisKelamin'),
//         nis: formData.get('nis'),
//         kelas: formData.get('kelas'),
//         noHp: formData.get('noHp'),
//         status: formData.get('status')
//     };

//     if (editId !== null) {
//         // Edit mode
//         const index = siswaData.findIndex(s => s.id === editId);
//         if (index !== -1) {
//             siswaData[index] = { ...siswaData[index], ...siswaBaru };
//         }
//         editId = null;
//         toast.show('success', 'Berhasil!', 'Data Siswa berhasil di edit!');
//     } else {
//         // Tambah baru
//         siswaData.push({ id: siswaData.length + 1, ...siswaBaru });
//         toast.show('success', 'Berhasil!', 'Siswa berhasil ditambahkan!');
//     }

//     e.target.reset();
//     hideModal('tambahSiswaModal');
//     applyFilters();
// });


// // CRUD functions
// function editSiswa(id) {
//     const siswa = siswaData.find(s => s.id === id);
//     if (!siswa) return;

//     editId = id;

//     const form = document.getElementById('tambahSiswaForm');
//     form.namasiswa.value = siswa.namasiswa;
//     form.jenisKelamin.value = siswa.jenisKelamin;
//     form.nis.value = siswa.nis;
//     form.kelas.value = siswa.kelas;
//     form.noHp.value = siswa.noHp;
//     form.status.value = siswa.status;
//     document.getElementById('closeTambahModal').addEventListener('click', () => {
//         editId = null;
//         hideModal('tambahSiswaModal');
//     });
//     document.getElementById('cancelTambahSiswa').addEventListener('click', () => {
//         editId = null;
//         hideModal('tambahSiswaModal');
//     });

//     showModal('tambahSiswaModal');
// }


// let deleteId = null; // Variable untuk menyimpan ID yang akan dihapus

// function deleteSiswa(id) {
//     deleteId = id; // Simpan ID
//     document.getElementById('deleteSiswa').classList.remove('hidden');
// }

// function confirmDelete() {
//     if (deleteId !== null) {
//         siswaData = siswaData.filter(s => s.id !== deleteId);
//         applyFilters();
//         toast.show('success', 'Berhasil!', 'Data Siswa berhasil dihapus!');

//         // Tutup modal dan reset ID
//         closeDeleteModal();
//     }
// }

// function closeDeleteModal() {
//     document.getElementById('deleteSiswa').classList.add('hidden');
//     deleteId = null;
// }

// // Event listener untuk menutup modal ketika klik di luar modal
// document.getElementById('deleteSiswa').addEventListener('click', function (e) {
//     if (e.target === this) {
//         closeDeleteModal();
//     }
// });

// // Event listener untuk menutup modal dengan tombol ESC
// document.addEventListener('keydown', function (e) {
//     if (e.key === 'Escape' && !document.getElementById('deleteSiswa').classList.contains('hidden')) {
//         closeDeleteModal();
//     }
// });

// // Initial render
// renderTable();




// //LOGIC UNTUK TOAST NOTIFICATION
// class ToastNotification {
//     constructor() {
//         this.toastElement = document.getElementById('toast-notification');
//         this.toastIcon = document.getElementById('toast-icon');
//         this.toastTitle = document.getElementById('toast-title');
//         this.toastMessage = document.getElementById('toast-message');
//         this.toastClose = document.getElementById('toast-close');
//         this.toastContainer = this.toastElement.querySelector('.bg-white');

//         this.isVisible = false;
//         this.hideTimeout = null;

//         this.setupEventListeners();
//     }

//     setupEventListeners() {
//         // Event listener untuk tombol close
//         this.toastClose.addEventListener('click', () => {
//             this.hide();
//         });

//         // Auto hide setelah 5 detik
//         this.toastElement.addEventListener('transitionend', (e) => {
//             if (e.target === this.toastElement && this.isVisible) {
//                 this.autoHide();
//             }
//         });
//     }

//     show(type, title, message) {
//         // Clear timeout sebelumnya jika ada
//         if (this.hideTimeout) {
//             clearTimeout(this.hideTimeout);
//         }

//         // Set konten toast
//         this.setContent(type, title, message);

//         // Reset classes
//         this.toastElement.classList.remove('toast-exit', 'toast-show');
//         this.toastElement.classList.add('toast-enter');

//         // Force reflow untuk memastikan class diterapkan
//         this.toastElement.offsetHeight;

//         // Tampilkan toast dengan animasi
//         setTimeout(() => {
//             this.toastElement.classList.remove('toast-enter');
//             this.toastElement.classList.add('toast-show');
//             this.isVisible = true;
//         }, 10);
//     }

//     hide() {
//         if (!this.isVisible) return;

//         // Clear auto hide timeout
//         if (this.hideTimeout) {
//             clearTimeout(this.hideTimeout);
//         }

//         // Sembunyikan dengan animasi
//         this.toastElement.classList.remove('toast-show');
//         this.toastElement.classList.add('toast-exit');
//         this.isVisible = false;

//         // Reset ke posisi awal setelah animasi selesai
//         setTimeout(() => {
//             this.toastElement.classList.remove('toast-exit');
//             this.toastElement.classList.add('toast-enter');
//         }, 300);
//     }

//     autoHide() {
//         this.hideTimeout = setTimeout(() => {
//             this.hide();
//         }, 5000); // Auto hide setelah 5 detik
//     }

//     setContent(type, title, message) {
//         // Reset border color
//         this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue)-500/g, '');

//         // Set icon dan warna berdasarkan type
//         switch (type) {
//             case 'success':
//                 this.toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
//                 this.toastContainer.classList.add('border-l-green-500');
//                 break;
//             case 'error':
//                 this.toastIcon.innerHTML = '<i class="fas fa-times-circle text-red-500 text-xl"></i>';
//                 this.toastContainer.classList.add('border-l-red-500');
//                 break;
//             case 'warning':
//                 this.toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>';
//                 this.toastContainer.classList.add('border-l-yellow-500');
//                 break;
//             case 'info':
//                 this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
//                 this.toastContainer.classList.add('border-l-blue-500');
//                 break;
//             default:
//                 this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500 text-xl"></i>';
//                 this.toastContainer.classList.add('border-l-gray-500');
//         }

//         this.toastTitle.textContent = title;
//         this.toastMessage.textContent = message;
//     }
// }

// // Inisialisasi toast notification
// const toast = new ToastNotification();

// // Event listeners untuk demo buttons
// document.getElementById('show-success').addEventListener('click', () => {
//     toast.show('success', 'Berhasil!', 'Data berhasil dihapus dari sistem');
// });

// document.getElementById('show-error').addEventListener('click', () => {
//     toast.show('error', 'Error!', 'Terjadi kesalahan saat menghapus data');
// });

// document.getElementById('show-warning').addEventListener('click', () => {
//     toast.show('warning', 'Peringatan!', 'Pastikan Anda yakin ingin menghapus data ini');
// });

// document.getElementById('show-info').addEventListener('click', () => {
//     toast.show('info', 'Informasi', 'Proses penghapusan data sedang berlangsung');
// });
