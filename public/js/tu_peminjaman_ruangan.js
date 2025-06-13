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

    // =================== Tab Navigation ===================
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

    // =================== Load Room Options ===================
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

    // =================== Submit Reservation ===================
    submitBtn?.addEventListener('click', () => {
        const identityForm = document.getElementById('identity-form');
        const reservationForm = document.getElementById('reservation-form');
        const identityData = new FormData(identityForm);
        const reservationData = new FormData(reservationForm);

        const payload = {
            action: 'submit_reservation',
            nama_lengkap: identityData.get('student-name'),
            nis: identityData.get('student-nis'),
            kelas: identityData.get('student-class'),
            telepon: identityData.get('student-phone'),
            jenis_ruangan: reservationData.get('room-type'),
            tanggal_peminjaman: reservationData.get('reservation-date'),
            deskripsi_kegiatan: reservationData.get('activity-description'),
            jam_mulai: reservationData.get('start-time'),
            jam_selesai: reservationData.get('end-time'),
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
                console.error('Error:', data);
            }
        })
        .catch(err => {
            alert('Terjadi kesalahan jaringan saat mengirim data!');
            console.error('Network error:', err);
        });
    });

    // =================== Load Reservation History ===================
    function loadReservationHistory(page = 1) {
        const room = document.getElementById('room-type').value;
        const status = document.getElementById('status-filter')?.value || 'all';
        const month = document.getElementById('month-filter')?.value || 'all';

        const params = new URLSearchParams();
        params.append('action', 'get_history');
        params.append('page', page);
        if (room !== '') params.append('room', room);
        if (status !== 'all') params.append('status', status);
        if (month !== 'all') params.append('month', month);

        fetch(`${API_URL}?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                historyTableBody.innerHTML = '';

                if (!data.items || data.items.length === 0) {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td colspan="6" class="text-center py-4 text-gray-500">
                            Tidak ada data ditemukan.
                        </td>
                    `;
                    historyTableBody.appendChild(row);
                    renderPagination(1, 1);
                    return;
                }

                data.items.forEach(item => {
                    const row = document.createElement('tr');
                    const statusBadge = getStatusBadge(item.status);
                    row.innerHTML = `
                        <td class="px-6 py-3 text-sm text-gray-800">${item.jenis_ruangan}</td>
                        <td class="px-6 py-3 text-sm text-gray-800">${formatDate(item.tanggal_peminjaman)}</td>
                        <td class="px-6 py-3 text-sm text-gray-800">${item.jam_mulai} - ${item.jam_selesai}</td>
                        <td class="px-6 py-3 text-sm text-gray-800">${item.deskripsi_kegiatan}</td>
                        <td class="px-6 py-3 text-sm">${statusBadge}</td>
                        <td class="px-6 py-3 text-sm">
                            <button class="text-blue-500 hover:underline" onclick="viewDetail(${item.id})">Lihat</button>
                        </td>
                    `;
                    historyTableBody.appendChild(row);
                });

                renderPagination(data.total_pages, page);
            })
            .catch(err => {
                console.error('Gagal memuat riwayat peminjaman:', err);
            });
    }

    // =================== Utility Functions ===================
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

    function viewDetail(id) {
        alert(`Tampilkan detail untuk ID: ${id}`);
    }

    // =================== Filter Button ===================
    document.getElementById('apply-filter')?.addEventListener('click', () => {
        loadReservationHistory(1);
    });

    // =================== Init ===================
    loadRoomOptions();
    loadReservationHistory(1);
});
