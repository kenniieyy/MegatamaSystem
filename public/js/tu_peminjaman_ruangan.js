const API_URL = 'http://localhost/MegatamaSystem/src/Api/tu_peminjaman_ruangan.php';

// Global variable to store current page for pagination
let currentPage = 1; 

// Make these functions globally accessible
function determineStatus(tanggal, jamMulai, jamSelesai) {
    const now = new Date();
    const mulai = new Date(`${tanggal}T${jamMulai}`);
    const selesai = new Date(`${tanggal}T${jamSelesai}`);
    if (now < mulai) return 'upcoming';
    if (now >= mulai && now <= selesai) return 'ongoing';
    return 'completed';
}

function getStatusBadge(status) {
    const map = {
        upcoming: { text: 'Belum Dimulai', class: 'bg-yellow-100 text-yellow-800' },
        ongoing: { text: 'Berlangsung', class: 'bg-blue-100 text-blue-800' },
        completed: { text: 'Selesai', class: 'bg-green-100 text-green-800' },
    };
    const s = map[status] || { text: '-', class: 'bg-gray-200 text-gray-700' };
    return `<span class="px-2 py-1 text-xs font-medium rounded-full ${s.class}">${s.text}</span>`;
}

function formatDate(dateStr) {
    const m = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus',
        'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(dateStr);
    return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()}`;
}

function renderPagination(totalPages, page) {
    const container = document.getElementById('pagination-container');
    container.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-3 py-1 text-sm rounded ${i === page ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;
        btn.onclick = () => loadReservationHistory(i);
        container.appendChild(btn);
    }

    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    if (prevPageBtn) {
        prevPageBtn.disabled = page === 1;
        prevPageBtn.onclick = () => loadReservationHistory(page - 1);
    }
    if (nextPageBtn) {
        nextPageBtn.disabled = page === totalPages;
        nextPageBtn.onclick = () => loadReservationHistory(page + 1);
    }
}

// Function to load room options into dropdowns
function loadRoomOptions() {
    return fetch(`${API_URL}?action=get_rooms`)
        .then(res => res.json())
        .then(data => {
            const dropdownIDs = ['room-type', 'editRuangan', 'room-filter'];
            dropdownIDs.forEach(id => {
                const select = document.getElementById(id);
                if (select) {
                    const isFilter = id === 'room-filter';
                    select.innerHTML = `<option value="">${isFilter ? 'Semua Ruangan' : 'Pilih Jenis Ruangan'}</option>`;
                    data.forEach(room => {
                        const opt = document.createElement('option');
                        opt.value = room;
                        opt.textContent = room;
                        select.appendChild(opt);
                    });
                }
            });
        });
}

// Function to load reservation history
function loadReservationHistory(page = 1) {
    currentPage = page; // Update current page
    const room = document.getElementById('room-filter')?.value || '';
    const status = document.getElementById('status-filter')?.value || 'all';
    const month = document.getElementById('month-filter')?.value || 'all';

    const params = new URLSearchParams();
    params.append('action', 'get_history');
    params.append('page', page);
    if (room) params.append('room', room);
    if (month !== 'all') params.append('month', month);

    fetch(`${API_URL}?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
            const historyTableBody = document.getElementById('reservation-history');
            historyTableBody.innerHTML = '';

            if (!data.items || data.items.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="6" class="text-center py-4 text-gray-500">Tidak ada data ditemukan.</td>`;
                historyTableBody.appendChild(row);
                renderPagination(1, 1);
                return;
            }

            const filteredItems = data.items.filter(item => {
                const calculated = determineStatus(item.tanggal_peminjaman, item.jam_mulai, item.jam_selesai);
                return status === 'all' || calculated === status;
            });

            if (filteredItems.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="6" class="text-center py-4 text-gray-500">Tidak ada data untuk filter ini.</td>`;
                historyTableBody.appendChild(row);
                renderPagination(1, 1);
                return;
            }

            filteredItems.forEach(item => {
                const stat = determineStatus(item.tanggal_peminjaman, item.jam_mulai, item.jam_selesai);
                const badge = getStatusBadge(stat);
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-3 text-sm">${item.jenis_ruangan}</td>
                    <td class="px-6 py-3 text-sm">${formatDate(item.tanggal_peminjaman)}</td>
                    <td class="px-6 py-3 text-sm">${item.jam_mulai} - ${item.jam_selesai}</td>
                    <td class="px-6 py-3 text-sm">${item.deskripsi_kegiatan}</td>
                    <td class="px-6 py-3 text-sm">${badge}</td>
                    <td class="px-6 py-3 text-sm">
                        <button onclick="viewmodal(${item.id})" class="text-blue-500 mr-2"><i class="fas fa-eye"></i></button>
                        <button onclick="edit_modal(${item.id})" class="text-yellow-500 mr-2"><i class="fas fa-edit"></i></button>
                        <button onclick="delete_modal(${item.id})" class="text-red-500"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                historyTableBody.appendChild(row);
            });

            document.getElementById('pagination-info').textContent =
                `Menampilkan ${data.start} - ${data.end} dari ${data.total_rows} peminjaman`;
            renderPagination(data.total_pages, page);
        })
        .catch(error => console.error('Error loading reservation history:', error));
}


function viewmodal(id) {
    const modal = document.getElementById('view-modal');
    const closeBtn = document.getElementById('close-view-modal');
    const closeFooterBtn = document.getElementById('close-view-btn');

    fetch(`${API_URL}?action=get_detail&id=${id}`)
        .then(res => res.json())
        .then(data => {
            if (data && data.id) {
                document.getElementById('viewNama').textContent = data.nama_lengkap;
                document.getElementById('viewRuangan').textContent = data.jenis_ruangan;
                document.getElementById('viewJam').textContent = `${data.jam_mulai} - ${data.jam_selesai}`;
                document.getElementById('viewDeskripsi').textContent = data.deskripsi_kegiatan;
                document.getElementById('viewPenanggung').textContent = data.penanggung_jawab;
                document.getElementById('viewnis').textContent = data.nis;
                document.getElementById('viewKelas').textContent = data.kelas;
                document.getElementById('viewTanggal').textContent = data.tanggal_peminjaman;
                document.getElementById('viewTelepon').textContent = data.telepon || '-'; 

                const now = new Date();
                const startTime = new Date(`${data.tanggal_peminjaman}T${data.jam_mulai}`);
                const endTime = new Date(`${data.tanggal_peminjaman}T${data.jam_selesai}`);

                let status = '';
                if (now < startTime) {
                    status = 'upcoming';
                } else if (now >= startTime && now <= endTime) {
                    status = 'ongoing';
                } else {
                    status = 'completed';
                }

                document.getElementById('viewstatus').innerHTML = getStatusBadge(status);

            } else {
                alert(data.message || 'Gagal memuat detail peminjaman.');
            }
        })
        .catch(error => console.error('Error fetching detail:', error));

    modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    closeFooterBtn.onclick = () => modal.style.display = 'none';
}


function edit_modal(id) {
    const modal = document.getElementById('edit-modal');
    const form = document.getElementById('edit-form');
    const closeModal = () => modal.style.display = 'none';

    form.reset();

    loadRoomOptions().then(() => {
        fetch(`${API_URL}?action=get_detail&id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.id) return alert(data.message || 'Gagal memuat data.');

                document.getElementById('edit-id').value = data.id; 
                document.getElementById('editRuangan').value = data.jenis_ruangan;
                document.getElementById('edit-start-time').value = data.jam_mulai;
                document.getElementById('edit-end-time').value = data.jam_selesai;
                document.getElementById('edit-activity-description').value = data.deskripsi_kegiatan;
                document.getElementById('edit-responsible-teacher').value = data.penanggung_jawab;
                document.getElementById('edit-reservation-date').value = data.tanggal_peminjaman;

                modal.style.display = 'block';
            })
            .catch(error => console.error('Error fetching edit detail:', error));
    });

    document.getElementById('close-edit-modal').onclick = closeModal;
    document.getElementById('cancel-edit-btn').onclick = closeModal;

    document.getElementById('save-edit-btn').onclick = () => {
        const fd = new FormData(form);
        const payload = {
            action: 'edit_reservation', 
            id: fd.get('id'), 
            jenis_ruangan: fd.get('jenis_ruangan'), 
            jam_mulai: fd.get('jam_mulai'), 
            jam_selesai: fd.get('jam_selesai'), 
            deskripsi_kegiatan: fd.get('deskripsi_kegiatan'), 
            penanggung_jawab: fd.get('penanggung_jawab'), 
            tanggal_peminjaman: fd.get('tanggal_peminjaman') 
        };

        const requiredEditFields = [
            { value: payload.jenis_ruangan, name: 'Jenis Ruangan' },
            { value: payload.tanggal_peminjaman, name: 'Tanggal Peminjaman' },
            { value: payload.deskripsi_kegiatan, name: 'Deskripsi Kegiatan' },
            { value: payload.jam_mulai, name: 'Jam Mulai' },
            { value: payload.jam_selesai, name: 'Jam Selesai' },
            { value: payload.penanggung_jawab, name: 'Penanggung Jawab' }
        ];

        for (const field of requiredEditFields) {
            if (!field.value || field.value.trim() === '') {
                alert(`Mohon lengkapi field '${field.name}' pada formulir edit!`);
                return;
            }
        }

        if (payload.jam_mulai >= payload.jam_selesai) {
            alert('Jam selesai harus lebih dari jam mulai!');
            return;
        }

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    modal.style.display = 'none';
                    // Use the global currentPage variable
                    loadReservationHistory(currentPage); 
                } else {
                    alert(data.message || 'Gagal mengupdate peminjaman.');
                }
            })
            .catch(error => {
                console.error('Error updating reservation:', error);
                alert('Terjadi kesalahan saat mengirim data perubahan.');
            });
    };
}

function delete_modal(id) {
    const modal = document.getElementById('delete-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn'); 
    const confirmBtn = document.getElementById('confirm-delete-btn');

    modal.style.display = 'block';
    cancelDeleteBtn.onclick = () => modal.style.display = 'none';

    confirmBtn.onclick = () => {
        fetch(`${API_URL}?action=delete_reservation&id=${id}`, { 
            method: 'POST'
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    modal.style.display = 'none';
                    // Use the global currentPage variable
                    loadReservationHistory(currentPage); 
                } else {
                    alert(data.message || 'Gagal menghapus peminjaman.');
                }
            })
            .catch(error => {
                console.error('Error deleting reservation:', error);
                alert('Terjadi kesalahan saat menghapus data.');
            });
    };
}   

document.addEventListener('DOMContentLoaded', function () {
    const submitBtn = document.getElementById('submit-reservation');
    const tabReservation = document.getElementById('tab-reservation');
    const tabHistory = document.getElementById('tab-history');
    const contentReservation = document.getElementById('content-reservation');
    const contentHistory = document.getElementById('content-history');
    const contentSuccess = document.getElementById('content-success');
    const newReservationBtn = document.getElementById('new-reservation');
    const viewHistoryBtn = document.getElementById('view-history');
    const applyFilterBtn = document.getElementById('apply-filter');


    tabReservation?.addEventListener('click', () => {
        contentReservation.classList.add('active');
        contentHistory.classList.remove('active');
        contentSuccess.classList.remove('active');
        tabReservation.classList.add('active');
        tabHistory.classList.remove('active');
    });

    tabHistory?.addEventListener('click', () => {
        contentReservation.classList.remove('active');
        contentHistory.classList.add('active');
        contentSuccess.classList.remove('active');
        tabReservation.classList.remove('active');
        tabHistory.classList.add('active');
        loadReservationHistory(1); // Load history when tab is activated
    });

    newReservationBtn?.addEventListener('click', () => {
        contentReservation.classList.add('active');
        contentSuccess.classList.remove('active');
    });

    viewHistoryBtn?.addEventListener('click', () => {
        contentReservation.classList.remove('active');
        contentSuccess.classList.remove('active');
        contentHistory.classList.add('active');
        tabReservation.classList.remove('active');
        tabHistory.classList.add('active');
        loadReservationHistory(1); // Load history when view history button is clicked
    });

    applyFilterBtn?.addEventListener('click', () => {
        loadReservationHistory(1); // Apply filter from page 1
    });

    submitBtn?.addEventListener('click', () => {
        const identityForm = document.getElementById('identity-form');
        const reservationForm = document.getElementById('reservation-form');

        const identityData = new FormData(identityForm);
        const reservationData = new FormData(reservationForm);

        const requiredFields = [
            { form: identityData, name: 'student_name' },
            { form: identityData, name: 'student_nis' },
            { form: identityData, name: 'student_class' },
            { form: reservationData, name: 'room_type' },
            { form: reservationData, name: 'reservation_date' },
            { form: reservationData, name: 'start_time' },
            { form: reservationData, name: 'end_time' },
            { form: reservationData, name: 'activity_description' },
            { form: reservationData, name: 'responsible_teacher' } // Tambahkan penanggung jawab sebagai wajib
        ];

        for (const field of requiredFields) {
            const val = field.form.get(field.name);
            if (!val || val.trim() === '') {
                alert('Mohon lengkapi semua field yang wajib diisi!');
                return;
            }
        }

        const jamMulai = reservationData.get('start_time');
        const jamSelesai = reservationData.get('end_time');
        if (jamMulai >= jamSelesai) {
            alert('Jam selesai harus lebih dari jam mulai!');
            return;
        }

        const payload = {
            action: 'submit_reservation',
            nama_lengkap: identityData.get('student_name'),
            nis: identityData.get('student_nis'),
            kelas: identityData.get('student_class'),
            telepon: identityData.get('student_phone') || '',
            jenis_ruangan: reservationData.get('room_type'),
            tanggal_peminjaman: reservationData.get('reservation_date'),
            deskripsi_kegiatan: reservationData.get('activity_description'),
            jam_mulai: jamMulai,
            jam_selesai: jamSelesai,
            penanggung_jawab: reservationData.get('responsible_teacher')
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    identityForm.reset();
                    reservationForm.reset();
                    contentReservation.classList.remove('active');
                    contentSuccess.classList.add('active');
                } else {
                    alert(data.message || 'Gagal mengajukan peminjaman.');
                }
            })
            .catch(() => alert('Gagal mengirim data.'));
    });

    // Initial load of room options when the page loads
    loadRoomOptions();
});