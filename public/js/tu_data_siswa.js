document.addEventListener('DOMContentLoaded', function () {
    const siswaTableBody = document.getElementById('siswaTableBody');
    const searchInput = document.getElementById('searchInput');
    const kelasFilter = document.getElementById('kelasFilter');
    const tambahSiswaModal = document.getElementById('tambahSiswaModal');
    const tambahSiswaForm = document.getElementById('tambahSiswaForm');
    const modalTitle = tambahSiswaModal.querySelector('h3');
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    const deleteSiswaModal = document.getElementById('deleteSiswa');

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
                        <button onclick="deleteSiswa('${siswa.nis}')" class="text-red-600 hover:text-red-900">
                            <i class="fas fa-trash"></i>
                        
                    </td>
                </tr>
            `).join('');
        }
        updatePagination();
    }
        document.addEventListener('DOMContentLoaded', function () {
        fetch('../src/API/siswa.php?page=1') // sesuaikan URL backend kamu
            .then(res => res.json())
            .then(data => {
            const page = data.page;
            const limit = data.limit;
            const total = data.total;

            const start = (page - 1) * limit + 1;
            const end = Math.min(page * limit, total);

            document.getElementById('currentRange').textContent = `${start} - ${end}`;
            document.getElementById('totalData').textContent = total;
            });
        });
            function renderSiswaTable(data, page, limit, total) {
            const tbody = document.getElementById("siswaTableBody");
            tbody.innerHTML = "";

            data.forEach((siswa, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${(page - 1) * limit + index + 1}</td>
                    <td>${siswa.nis}</td>
                    <td>${siswa.nama_siswa}</td>
                    <td>${siswa.jenis_kelamin}</td>
                    <td>${siswa.kelas}</td>
                    <td>${siswa.no_hp}</td>
                    <td>${siswa.status}</td>
                    <!-- Aksi -->
                `;
                tbody.appendChild(row);
            });

            // ✅ Update teks info jumlah data
            const currentRange = Math.min(page * limit, total);
            document.getElementById("currentRange").textContent = currentRange;
            document.getElementById("totalData").textContent = total;
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
            filteredSiswaData = [...allSiswaData]; // Salin untuk difilter
            currentPage = 1;

            applyFilters(); // Gunakan filter jika ada

            // Hitung dan tampilkan range data
            const total = filteredSiswaData.length;
            const start = (currentPage - 1) * itemsPerPage + 1;
            const end = Math.min(currentPage * itemsPerPage, total);
            document.getElementById("currentRange").textContent = `${start} - ${end}`;
            document.getElementById("totalData").textContent = total;

            renderTable(); // Render ulang tabel
        } else {
            throw new Error(result.message || 'Gagal memuat data siswa.');
        }
    } catch (error) {
        console.error('Error loading siswa data:', error);
        toast.show('error', 'Error!', `Terjadi kesalahan: ${error.message}`);
        siswaTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4 text-red-600">
                    Gagal memuat data: ${error.message}
                </td>
            </tr>`;
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

    window.deleteSiswa = function (nis) {
        deleteSiswaId = nis;
        deleteSiswaModal.classList.remove('hidden');
    };

    confirmDeleteBtn.addEventListener('click', async function () {
    console.log("Listener tombol HAPUS AKTIF");
    console.log("deleteSiswaId =", deleteSiswaId);
        console.log("Tombol HAPUS diklik");
        if (deleteSiswaId !== null) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id_siswa: deleteSiswaId })
                });
                const result = await response.json();
                if (response.ok) {
                    toast.show('success', 'Berhasil!', result.message);
                    deleteSiswaModal.classList.add('hidden');
                    deleteSiswaId = null;
                    loadSiswaData();
                } else {
                    toast.show('error', 'Gagal!', result.message || `Error: ${response.statusText}`);
                }
            } catch (error) {
                toast.show('error', 'Error!', `Gagal menghapus data: ${error.message}`);
            }
        }
    });

    cancelDeleteBtn.addEventListener('click', function () {
        console.log("Tombol BATAL diklik");
        deleteSiswaModal.classList.add('hidden');
        deleteSiswaId = null;
    });

    // Initial load of data when the page loads
    loadSiswaData();
});