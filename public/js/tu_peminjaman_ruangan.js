document.addEventListener('DOMContentLoaded', function () { 
    const API_URL = 'http://localhost/MegatamaSystem/src/Api/tu_peminjaman_ruangan.php';

    const tabReservation = document.getElementById('tab-reservation');
    const tabHistory = document.getElementById('tab-history');
    const contentReservation = document.getElementById('content-reservation');
    const contentHistory = document.getElementById('content-history');
    const contentSuccess = document.getElementById('content-success');
    const newReservationBtn = document.getElementById('new-reservation');
    const viewHistoryBtn = document.getElementById('view-history');
    const roomSelect = document.getElementById('room-type');
    const submitBtn = document.getElementById('submit-reservation');
    const historyTableBody = document.getElementById('reservation-history');

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
        loadReservationHistory(1);
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
        loadReservationHistory(1);
    });

    function loadRoomOptions() {
        fetch(`${API_URL}?action=get_rooms`)
            .then(response => response.json())
            .then(data => {
                roomSelect.innerHTML = '<option value="">Pilih Jenis Ruangan</option>';
                data.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room;
                    option.textContent = room;
                    roomSelect.appendChild(option);
                });
            })
            .catch(err => {
                console.error('Gagal memuat data ruangan:', err);
            });
    }

    submitBtn?.addEventListener('click', () => {
        const identityForm = document.getElementById('identity-form');
        const reservationForm = document.getElementById('reservation-form');
        if (!identityForm || !reservationForm) return;

        const identityData = new FormData(identityForm);
        const reservationData = new FormData(reservationForm);

        const requiredFields = [
            'student-name', 'student-nis', 'student-class', 'student-phone',
            'room-type', 'reservation-date', 'start-time', 'end-time', 'activity-description'
        ];

        for (const field of requiredFields) {
            const value = identityData.get(field) || reservationData.get(field);
            if (!value || value.trim() === '') {
                alert('Mohon lengkapi semua field yang wajib diisi!');
                return;
            }
        }

        const jamMulai = reservationData.get('start-time');
        const jamSelesai = reservationData.get('end-time');
        if (jamMulai >= jamSelesai) {
            alert('Jam selesai harus lebih dari jam mulai!');
            return;
        }

        const payload = {
            action: 'submit_reservation',
            nama_lengkap: identityData.get('student-name'),
            nis: identityData.get('student-nis'),
            kelas: identityData.get('student-class'),
            telepon: identityData.get('student-phone'),
            jenis_ruangan: reservationData.get('room-type'),
            tanggal_peminjaman: reservationData.get('reservation-date'),
            deskripsi_kegiatan: reservationData.get('activity-description'),
            jam_mulai: jamMulai,
            jam_selesai: jamSelesai,
            penanggung_jawab: reservationData.get('responsible-teacher')
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
                alert('Gagal mengajukan peminjaman: ' + (data.message || ''));
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan jaringan saat mengirim data!');
            console.error('Network error:', err);
        });
    });

    function loadReservationHistory(page = 1) {
        const room = document.getElementById('room-filter')?.value || '';
        const status = document.getElementById('status-filter')?.value || 'all';
        const month = document.getElementById('month-filter')?.value || 'all';

        const params = new URLSearchParams();
        params.append('action', 'get_history');
        params.append('page', page);
        if (room) params.append('room', room);
        if (status !== 'all') params.append('status', status);
        if (month !== 'all') params.append('month', month);

        fetch(`${API_URL}?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                historyTableBody.innerHTML = '';

                if (!data.items || data.items.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td colspan="6" class="text-center py-4 text-gray-500">Tidak ada data ditemukan.</td>`;
                    historyTableBody.appendChild(row);
                    renderPagination(1, 1);
                    return;
                }

                data.items.forEach(item => {
                    const status = determineStatus(item.tanggal_peminjaman, item.jam_mulai, item.jam_selesai);
                    const statusBadge = getStatusBadge(status);

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-3 text-sm">${item.jenis_ruangan}</td>
                        <td class="px-6 py-3 text-sm">${formatDate(item.tanggal_peminjaman)}</td>
                        <td class="px-6 py-3 text-sm">${item.jam_mulai} - ${item.jam_selesai}</td>
                        <td class="px-6 py-3 text-sm">${item.deskripsi_kegiatan}</td>
                        <td class="px-6 py-3 text-sm">${statusBadge}</td>
                        <td class="px-6 py-3 text-sm">
                            <button onclick="viewDetail(${item.id})" class="text-blue-500 mr-2"><i class="fas fa-eye"></i></button>
                            <button onclick="editReservation(${item.id})" class="text-yellow-500 mr-2"><i class="fas fa-edit"></i></button>
                            <button onclick="deleteReservation(${item.id})" class="text-red-500"><i class="fas fa-trash"></i></button>
                        </td>
                    `;
                    historyTableBody.appendChild(row);
                });

                const infoDiv = document.getElementById('pagination-info');
                if (infoDiv) {
                    infoDiv.textContent = `Menampilkan ${data.start} - ${data.end} dari ${data.total_rows} peminjaman`;
                }
                renderPagination(data.total_pages, page);
            })
            .catch(err => {
                console.error('Gagal memuat riwayat peminjaman:', err);
            });
    }

    function determineStatus(tanggal, jamMulai, jamSelesai) {
        const now = new Date();
        const mulai = new Date(`${tanggal}T${jamMulai}`);
        const selesai = new Date(`${tanggal}T${jamSelesai}`);

        if (now < mulai) return 'upcoming';
        if (now >= mulai && now <= selesai) return 'ongoing';
        if (now > selesai) return 'completed';
        return 'unknown';
    }

    function getStatusBadge(status) {
        let colorClass = 'bg-gray-200 text-gray-800';
        let label = status;

        switch (status) {
            case 'upcoming':
                colorClass = 'bg-yellow-100 text-yellow-800';
                label = 'Belum Dimulai';
                break;
            case 'ongoing':
                colorClass = 'bg-blue-100 text-blue-800';
                label = 'Berlangsung';
                break;
            case 'completed':
                colorClass = 'bg-green-100 text-green-800';
                label = 'Selesai';
                break;
        }

        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${colorClass}">${label}</span>`;
    }

    function formatDate(dateStr) {
        const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
            'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const date = new Date(dateStr);
        return `${date.getDate()} ${bulan[date.getMonth()]} ${date.getFullYear()}`;
    }

    function renderPagination(totalPages, currentPage) {
        const container = document.getElementById('pagination') || createPaginationContainer();
        container.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `px-3 py-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} mx-1 text-sm`;
            btn.onclick = () => loadReservationHistory(i);
            container.appendChild(btn);
        }
    }

    function createPaginationContainer() {
        const container = document.createElement('div');
        container.id = 'pagination';
        container.className = 'px-6 py-4 text-center';
        document.querySelector('.bg-white.rounded-lg.shadow-sm.border')?.appendChild(container);
        return container;
    }

    window.viewDetail = function (id) {
        fetch(`${API_URL}?action=get_detail&id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.id) {
                    alert('Data tidak ditemukan!');
                    return;
                }

                document.getElementById('viewNama').textContent = data.nama_lengkap;
                document.getElementById('viewNIS').textContent = data.nis;
                document.getElementById('viewKelas').textContent = data.kelas;
                document.getElementById('viewTelepon').textContent = data.telepon;
                document.getElementById('viewRuangan').textContent = data.jenis_ruangan;
                document.getElementById('viewTanggal').textContent = data.tanggal_peminjaman;
                document.getElementById('viewJam').textContent = `${data.jam_mulai} - ${data.jam_selesai}`;
                document.getElementById('viewDeskripsi').textContent = data.deskripsi_kegiatan;
                document.getElementById('viewPenanggung').textContent = data.penanggung_jawab || '-';

                document.getElementById('view-modal').classList.remove('hidden');
            })
            .catch(err => {
                alert('Gagal memuat detail data.');
                console.error(err);
            });
    };

    window.editReservation = function (id) {
        fetch(`${API_URL}?action=get_detail&id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (!data || !data.id) {
                    alert('Data tidak ditemukan!');
                    return;
                }

                document.getElementById('editId').value = data.id;
                document.getElementById('editNama').value = data.nama_lengkap;
                document.getElementById('editNIS').value = data.nis;
                document.getElementById('editKelas').value = data.kelas;
                document.getElementById('editTelepon').value = data.telepon;
                document.getElementById('editRuangan').value = data.jenis_ruangan;
                document.getElementById('editTanggal').value = data.tanggal_peminjaman;
                document.getElementById('editJamMulai').value = data.jam_mulai;
                document.getElementById('editJamSelesai').value = data.jam_selesai;
                document.getElementById('editDeskripsi').value = data.deskripsi_kegiatan;
                document.getElementById('editPenanggung').value = data.penanggung_jawab;

                document.getElementById('edit-modal').classList.remove('hidden');
            })
            .catch(err => {
                alert('Gagal memuat data untuk diedit.');
                console.error(err);
            });
    };

    window.deleteReservation = function (id) {
        document.getElementById('deleteId').value = id;
        document.getElementById('delete-modal').classList.remove('hidden');
    };

    document.getElementById('apply-filter')?.addEventListener('click', () => {
        loadReservationHistory(1);
    });

    document.getElementById('close-detail-modal')?.addEventListener('click', () => {
        document.getElementById('view-modal').classList.add('hidden');
    });

    document.getElementById('close-edit-modal')?.addEventListener('click', () => {
        document.getElementById('edit-modal').classList.add('hidden');
    });

    document.getElementById('close-delete-modal')?.addEventListener('click', () => {
        document.getElementById('delete-modal').classList.add('hidden');
    });

    loadRoomOptions();
    loadReservationHistory(1);
});