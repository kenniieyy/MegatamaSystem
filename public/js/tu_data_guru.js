document.addEventListener('DOMContentLoaded', () => {
    const teacherForm = document.getElementById('teacherForm');
    const teacherTableBody = document.getElementById('teacherTableBody');
    const apiUrl = 'http://localhost/MegatamaSystem/src/API/tu_data_guru.php';
    

    // Fungsi render data guru ke tabel
    function renderTable(data) {
        teacherTableBody.innerHTML = ''; // Kosongkan dulu
        if (data.length === 0) {
            teacherTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Data tidak ditemukan</td></tr>`;
            return;
        }
        data.forEach(guru => {
            const fotoUrl = guru.foto_url ? guru.foto_url : 'https://via.placeholder.com/40';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${fotoUrl}" alt="Foto Guru" class="h-10 w-10 rounded-full object-cover">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.nama_guru}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.jenis_kelamin}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.ID}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.mata_pelajaran}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.wali_kelas}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.status}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                <button onclick="openEditModal(${guru.id})" title="Edit" class="text-blue-600 hover:text-blue-900 mr-2">
                    <i class="fa fa-pencil"></i>
                </button>
                <button onclick="deleteGuru(${guru.id})" title="Hapus" class="text-red-600 hover:text-red-900">
                    <i class="fa fa-trash"></i>
                </button>
                    
                </td>
            `;
            teacherTableBody.appendChild(row);
        });
    }
    // Fungsi fetch data guru dari API
    async function loadDataGuru(search = '') {
        try {
            const url = search ? `${apiUrl}?search=${encodeURIComponent(search)}` : apiUrl;
            const response = await fetch(url);
            const data = await response.json();
            renderTable(data);
        } catch (err) {
            console.error('Gagal load data guru:', err);
            teacherTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-600">Gagal memuat data</td></tr>`;
        }
    }

    // Load data awal saat halaman siap
    loadDataGuru();

    // Event submit form tambah data guru
    teacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('teacherName', document.getElementById('teacherName').value);
        formData.append('teacherGender', document.getElementById('teacherGender').value);
        formData.append('teacherID', document.getElementById('ID').value);
        formData.append('teacherSubject', document.getElementById('teacherSubject').value);
        formData.append('teacherWaliKelas', document.getElementById('teacherWaliKelas').value);
        formData.append('teacherStatus', document.getElementById('status').value);
        formData.append('teacherUsername', document.getElementById('teacherUsername').value);
        formData.append('teacherPassword', document.getElementById('teacherPassword').value);

        const photoInput = document.getElementById('teacherPhoto');
        if (photoInput.files.length > 0) {
            formData.append('teacherPhoto', photoInput.files[0]);
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                alert("Data guru berhasil ditambahkan!");
                closeModal();
                teacherForm.reset();
                loadDataGuru();  // <-- Refresh tabel data setelah submit sukses
            } else {
                alert("Gagal menambahkan data guru: " + (result.error || 'Tidak diketahui'));
            }
        } catch (err) {
            console.error("Error saat submit:", err);
            alert("Terjadi kesalahan saat mengirim data ke server.");
        }
    });

    // Event search input (kalau mau pakai fitur search)
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            loadDataGuru(e.target.value);
        });
    }
});

function openAddModal() {
    document.getElementById('teacherModal').classList.remove('hidden');
    document.getElementById('teacherForm').reset();
}

function closeModal() {
    document.getElementById('teacherModal').classList.add('hidden');
}

// Dummy fungsi edit & delete (bisa kamu kembangkan)
function editGuru(id) {
    alert('Edit guru ID: ' + id);
}

function deleteGuru(id) {
    if (confirm('Yakin ingin menghapus data guru ini?')) {
        fetch('http://localhost/MegatamaSystem/src/API/tu_data_guru.php', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: 'id=' + id
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                alert('Data berhasil dihapus');
                loadDataGuru();
            } else {
                alert('Gagal hapus data: ' + res.error);
            }
        });
    }
}
