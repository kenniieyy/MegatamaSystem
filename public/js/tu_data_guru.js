document.addEventListener('DOMContentLoaded', () => {
    const teacherForm = document.getElementById('teacherForm');
    const teacherTableBody = document.getElementById('teacherTableBody');
    // Pastikan apiUrl sesuai dengan lokasi tu_data_guru.php Anda
    // Ini harus path yang bisa diakses dari browser, misal: http://localhost/MegatamaSystem/src/API/tu_data_guru.php
    const apiUrl = 'http://localhost/MegatamaSystem/src/API/tu_data_guru.php'; 
    const teacherModal = document.getElementById('teacherModal');
    const modalTitle = document.getElementById('modalTitle');
    let currentEditId = null; // Untuk menyimpan ID guru yang sedang diedit atau dihapus

    const toastNotification = document.getElementById('toast-notification');
    const toastTitle = document.getElementById('toast-title');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    const toastCloseButton = document.getElementById('toast-close');

    // Fungsi untuk menampilkan toast notification
    function showToast(type, title, message) {
        // Hapus kelas animasi sebelumnya dan sembunyikan dulu
        toastNotification.classList.remove('toast-enter', 'toast-exit');
        toastNotification.classList.add('hidden'); 
        
        // Atur warna border dan ikon berdasarkan tipe
        let borderColor = '';
        let iconHtml = '';
        if (type === 'success') {
            borderColor = 'border-l-green-500';
            iconHtml = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
        } else if (type === 'error') {
            borderColor = 'border-l-red-500';
            iconHtml = '<i class="fas fa-times-circle text-red-500 text-xl"></i>';
        } else if (type === 'info') {
            borderColor = 'border-l-blue-500';
            iconHtml = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
        }

        const toastBgDiv = toastNotification.querySelector('.bg-white');
        if (toastBgDiv) { // Pastikan elemen ditemukan
            toastBgDiv.className = `bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm ${borderColor}`;
        }
        toastIcon.innerHTML = iconHtml;
        toastTitle.textContent = title;
        toastMessage.textContent = message;

        // Tampilkan toast dengan animasi
        toastNotification.classList.remove('hidden');
        toastNotification.classList.add('toast-enter');

        // Otomatis sembunyikan setelah beberapa detik
        setTimeout(() => {
            toastNotification.classList.remove('toast-enter');
            toastNotification.classList.add('toast-exit');
            setTimeout(() => {
                toastNotification.classList.add('hidden');
            }, 300); // Durasi animasi toast-exit
        }, 5000); // Toast akan hilang setelah 5 detik
    }

    // Tutup toast saat tombol close diklik
    if (toastCloseButton) { 
        toastCloseButton.addEventListener('click', () => {
            toastNotification.classList.remove('toast-enter');
            toastNotification.classList.add('toast-exit');
            setTimeout(() => {
                toastNotification.classList.add('hidden');
            }, 300);
        });
    }


    // Fungsi render data guru ke tabel
    function renderTable(data) {
        teacherTableBody.innerHTML = ''; // Kosongkan dulu
        if (!data || data.length === 0) { // Menambahkan pengecekan !data
            teacherTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Data tidak ditemukan</td></tr>`;
            return;
        }
        data.forEach(guru => {
            const fotoUrl = guru.foto_url && guru.foto_url !== '' 
                ? guru.foto_url 
                : 'https://via.placeholder.com/40/D1D5DB/4B5563?text=NoPhoto'; 
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <img src="${fotoUrl}" alt="Foto Guru" class="h-10 w-10 rounded-full object-cover">
                </td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.nama_guru}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.jenis_kelamin}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.ID}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.mata_pelajaran || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.wali_kelas || '-'}</td>
                <td class="px-6 py-4 whitespace-nowrap">${guru.status}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <button onclick="openEditModal(${guru.id_guru})" title="Edit" class="text-blue-600 hover:text-blue-900 mr-2">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button onclick="openDeleteModal(${guru.id_guru})" title="Hapus" class="text-red-600 hover:text-red-900">
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
            if (!response.ok) { // Jika status HTTP bukan 2xx (e.g., 404, 500)
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const data = await response.json();
            renderTable(data);
        } catch (err) {
            console.error('Gagal load data guru:', err);
            teacherTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-600">Gagal memuat data: ${err.message || err}</td></tr>`;
            showToast('error', 'Gagal Memuat Data', 'Terjadi kesalahan saat memuat data guru. Cek konsol untuk detail.');
        }
    }

    loadDataGuru(); // Load data awal saat halaman siap

    // Event submit form tambah/edit data guru
    teacherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nama_guru', document.getElementById('teacherName').value);
        formData.append('jenis_kelamin', document.getElementById('teacherGender').value);
        formData.append('ID', document.getElementById('ID').value); // NIP/UID
        formData.append('mata_pelajaran', document.getElementById('teacherSubject').value);
        formData.append('wali_kelas', document.getElementById('teacherWaliKelas').value);
        formData.append('status', document.getElementById('status').value);
        formData.append('username', document.getElementById('teacherUsername').value);
        formData.append('password', document.getElementById('teacherPassword').value);

        const photoInput = document.getElementById('teacherPhoto');
        if (photoInput.files.length > 0) {
            formData.append('foto_wajah', photoInput.files[0]);
        }

        let url = apiUrl; // URL API tetap sama
        let method_to_send = 'POST'; // Default untuk insert

        if (currentEditId) {
            formData.append('id_guru', currentEditId); 
            formData.append('_method', 'PUT'); // Override method ke PUT
        } else {
            // Untuk insert, jika password kosong dan ini bukan edit, berikan alert
            if (document.getElementById('teacherPassword').value === '') {
                showToast('error', 'Gagal Menambah!', 'Password harus diisi untuk guru baru.');
                return; // Hentikan proses submit
            }
        }

        try {
            const response = await fetch(url, {
                method: method_to_send, // Akan selalu POST untuk FormData
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                showToast('success', 'Berhasil!', result.message || ("Data guru berhasil " + (currentEditId ? "diperbarui!" : "ditambahkan!")));
                closeModal();
                teacherForm.reset();
                currentEditId = null; // Reset edit ID
                loadDataGuru(); // Refresh tabel
            } else {
                showToast('error', 'Gagal!', result.error || 'Operasi gagal.');
                console.error("Error dari server:", result.error); // Log error dari server
            }
        } catch (err) {
            console.error("Error saat submit:", err);
            showToast('error', 'Kesalahan Jaringan!', 'Terjadi kesalahan saat mengirim data ke server. Cek konsol browser.');
        }
    });

    // Event search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            loadDataGuru(e.target.value);
        });
    }

    // Fungsi global untuk membuka modal tambah data
    window.openAddModal = () => {
        currentEditId = null; // Pastikan ini null untuk operasi tambah
        modalTitle.textContent = 'Tambah Data Guru';
        teacherForm.reset();
        document.getElementById('teacherPassword').setAttribute('required', 'required'); // Password wajib saat tambah
        teacherModal.classList.remove('hidden');
        // console.log("Open Add Modal, currentEditId:", currentEditId); // Debugging
    };

    // Fungsi global untuk membuka modal edit data
    window.openEditModal = async (id) => {
        // console.log("openEditModal called with ID:", id); // Debugging: pastikan ID diterima
        currentEditId = id;
        modalTitle.textContent = 'Edit Data Guru';
        teacherForm.reset(); // Bersihkan data sebelumnya
        document.getElementById('teacherPassword').removeAttribute('required'); // Password tidak wajib saat edit

        try {
            const response = await fetch(`${apiUrl}?id=${id}`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            const guru = await response.json();

            if (guru) {
                document.getElementById('teacherName').value = guru.nama_guru;
                document.getElementById('teacherGender').value = guru.jenis_kelamin;
                document.getElementById('ID').value = guru.ID;
                document.getElementById('teacherSubject').value = guru.mata_pelajaran;
                document.getElementById('teacherWaliKelas').value = guru.wali_kelas;
                document.getElementById('status').value = guru.status;
                document.getElementById('teacherUsername').value = guru.username;
                document.getElementById('teacherPassword').value = ''; // Jangan prefill password
                teacherModal.classList.remove('hidden'); // Tampilkan modal
                // console.log("Modal shown for editing:", guru); // Debugging
            } else {
                showToast('error', 'Data Tidak Ditemukan', 'Data guru tidak ditemukan untuk diedit.');
                // console.error("Data guru tidak ditemukan untuk ID:", id); // Debugging
            }
        } catch (err) {
            console.error('Error fetching guru data for edit:', err);
            showToast('error', 'Gagal Ambil Data', 'Terjadi kesalahan saat mengambil data guru untuk diedit. Cek konsol browser.');
        }
    };

    // Fungsi global untuk menutup modal
    window.closeModal = () => {
        teacherModal.classList.add('hidden');
        currentEditId = null; // Pastikan ID direset setelah modal ditutup
        teacherForm.reset(); // Reset form
        document.getElementById('teacherPassword').setAttribute('required', 'required'); // Kembali ke wajib jika dibuka lagi
    };

    let guruToDeleteId = null; // Variabel untuk menyimpan ID guru yang akan dihapus

    // Fungsi global untuk membuka modal konfirmasi hapus
    window.openDeleteModal = (id) => {
        // console.log("openDeleteModal called with ID:", id); // Debugging: pastikan ID diterima
        guruToDeleteId = id;
        document.getElementById('deleteModal').classList.remove('hidden');
    };

    // Fungsi global untuk menutup modal konfirmasi hapus
    window.closeDeleteModal = () => {
        document.getElementById('deleteModal').classList.add('hidden');
        guruToDeleteId = null; // Reset ID yang akan dihapus
    };

    // Fungsi global untuk mengkonfirmasi dan melakukan penghapusan
    window.confirmDelete = async () => {
        if (!guruToDeleteId) { // Jika ID kosong, jangan lanjutkan
            showToast('error', 'Gagal Hapus!', 'Tidak ada ID guru yang valid untuk dihapus.');
            return;
        }
        // console.log("confirmDelete for ID:", guruToDeleteId); // Debugging: pastikan ID ada

        try {
            const formData = new FormData();
            formData.append('id', guruToDeleteId);
            formData.append('_method', 'DELETE'); // Override method ke DELETE

            const response = await fetch(apiUrl, {
                method: 'POST', // Selalu POST untuk FormData
                body: formData // Mengirim FormData
            });
            const result = await response.json();

            if (result.success) {
                showToast('success', 'Berhasil!', result.message || 'Data berhasil dihapus.');
                closeDeleteModal();
                loadDataGuru(); // Refresh tabel
            } else {
                showToast('error', 'Gagal!', result.error || 'Operasi gagal.');
                console.error('Error dari server saat menghapus:', result.error); // Log error dari server
            }
        } catch (err) {
            console.error('Error saat menghapus:', err);
            showToast('error', 'Kesalahan Jaringan!', 'Terjadi kesalahan saat menghapus data. Cek konsol browser.');
        }
    };
});
// document.addEventListener('DOMContentLoaded', () => {
//     const teacherForm = document.getElementById('teacherForm');
//     const teacherTableBody = document.getElementById('teacherTableBody');
//     const apiUrl = 'http://localhost/MegatamaSystem/src/API/tu_data_guru.php';
    

//     // Fungsi render data guru ke tabel
//     function renderTable(data) {
//         teacherTableBody.innerHTML = ''; // Kosongkan dulu
//         if (data.length === 0) {
//             teacherTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4">Data tidak ditemukan</td></tr>`;
//             return;
//         }
//         data.forEach(guru => {
//             const fotoUrl = guru.foto_url ? guru.foto_url : 'https://via.placeholder.com/40';
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td class="px-6 py-4 whitespace-nowrap">
//                     <img src="${fotoUrl}" alt="Foto Guru" class="h-10 w-10 rounded-full object-cover">
//                 </td>
//                 <td class="px-6 py-4 whitespace-nowrap">${guru.nama_guru}</td>
//                 <td class="px-6 py-4 whitespace-nowrap">${guru.jenis_kelamin}</td>
//                 <td class="px-6 py-4 whitespace-nowrap">${guru.ID}</td>
//                 <td class="px-6 py-4 whitespace-nowrap">${guru.mata_pelajaran}</td>
//                 <td class="px-6 py-4 whitespace-nowrap">${guru.wali_kelas}</td>
//                 <td class="px-6 py-4 whitespace-nowrap">${guru.status}</td>
//                 <td class="px-6 py-4 whitespace-nowrap">
//                 <button onclick="openEditModal(${guru.id})" title="Edit" class="text-blue-600 hover:text-blue-900 mr-2">
//                     <i class="fa fa-pencil"></i>
//                 </button>
//                 <button onclick="deleteGuru(${guru.id})" title="Hapus" class="text-red-600 hover:text-red-900">
//                     <i class="fa fa-trash"></i>
//                 </button>
                    
//                 </td>
//             `;
//             teacherTableBody.appendChild(row);
//         });
//     }
//     // Fungsi fetch data guru dari API
//     async function loadDataGuru(search = '') {
//         try {
//             const url = search ? `${apiUrl}?search=${encodeURIComponent(search)}` : apiUrl;
//             const response = await fetch(url);
//             const data = await response.json();
//             renderTable(data);
//         } catch (err) {
//             console.error('Gagal load data guru:', err);
//             teacherTableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-600">Gagal memuat data</td></tr>`;
//         }
//     }

//     // Load data awal saat halaman siap
//     loadDataGuru();

//     // Event submit form tambah data guru
//     teacherForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         formData.append('teacherName', document.getElementById('teacherName').value);
//         formData.append('teacherGender', document.getElementById('teacherGender').value);
//         formData.append('teacherID', document.getElementById('ID').value);
//         formData.append('teacherSubject', document.getElementById('teacherSubject').value);
//         formData.append('teacherWaliKelas', document.getElementById('teacherWaliKelas').value);
//         formData.append('teacherStatus', document.getElementById('status').value);
//         formData.append('teacherUsername', document.getElementById('teacherUsername').value);
//         formData.append('teacherPassword', document.getElementById('teacherPassword').value);

//         const photoInput = document.getElementById('teacherPhoto');
//         if (photoInput.files.length > 0) {
//             formData.append('teacherPhoto', photoInput.files[0]);
//         }

//         try {
//             const response = await fetch(apiUrl, {
//                 method: 'POST',
//                 body: formData
//             });
//             const result = await response.json();

//             if (result.success) {
//                 alert("Data guru berhasil ditambahkan!");
//                 closeModal();
//                 teacherForm.reset();
//                 loadDataGuru();  // <-- Refresh tabel data setelah submit sukses
//             } else {
//                 alert("Gagal menambahkan data guru: " + (result.error || 'Tidak diketahui'));
//             }
//         } catch (err) {
//             console.error("Error saat submit:", err);
//             alert("Terjadi kesalahan saat mengirim data ke server.");
//         }
//     });

//     // Event search input (kalau mau pakai fitur search)
//     const searchInput = document.getElementById('searchInput');
//     if (searchInput) {
//         searchInput.addEventListener('input', (e) => {
//             loadDataGuru(e.target.value);
//         });
//     }
// });

// function openAddModal() {
//     document.getElementById('teacherModal').classList.remove('hidden');
//     document.getElementById('teacherForm').reset();
// }

// function closeModal() {
//     document.getElementById('teacherModal').classList.add('hidden');
// }

// // Dummy fungsi edit & delete (bisa kamu kembangkan)
// function editGuru(id) {
//     alert('Edit guru ID: ' + id);
// }

// function deleteGuru(id) {
//     if (confirm('Yakin ingin menghapus data guru ini?')) {
//         fetch('http://localhost/MegatamaSystem/src/API/tu_data_guru.php', {
//             method: 'DELETE',
//             headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//             body: 'id=' + id
//         })
//         .then(res => res.json())
//         .then(res => {
//             if (res.success) {
//                 alert('Data berhasil dihapus');
//                 loadDataGuru();
//             } else {
//                 alert('Gagal hapus data: ' + res.error);
//             }
//         });
//     }
// }
