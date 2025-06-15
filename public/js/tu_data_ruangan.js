document.addEventListener('DOMContentLoaded', () => {
  const tambahRuanganBtn = document.getElementById('tambahRuanganBtn');
  const tambahRuanganModal = document.getElementById('tambahRuanganModal');
  const closeTambahModal = document.getElementById('closeTambahModal');
  const cancelTambahRuangan = document.getElementById('cancelTambahRuangan');
  const tambahRuanganForm = document.getElementById('tambahRuanganForm');
  const ruanganTableBody = document.getElementById('ruanganTableBody');
  const toastNotification = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  const toastClose = document.getElementById('toast-close');
  const searchInput = document.getElementById('searchInput');
  const editModal = document.getElementById('editRuanganModal');
  const editForm = document.getElementById('editRuanganForm');
  const cancelEditBtn = document.getElementById('cancelEditRuangan');

  let allData = [];
  let currentPage = 1;
  const rowsPerPage = 9;

  // -------------------- Modal Tambah --------------------
  tambahRuanganBtn.addEventListener('click', () => tambahRuanganModal.classList.remove('hidden'));
  closeTambahModal.addEventListener('click', () => tambahRuanganModal.classList.add('hidden'));
  cancelTambahRuangan.addEventListener('click', () => tambahRuanganModal.classList.add('hidden'));

  // -------------------- Toast --------------------
  toastClose.addEventListener('click', () => toastNotification.classList.add('hidden'));
  function showToast(title, message, type = 'info') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastNotification.className = 'fixed top-4 right-4 z-50 p-4 bg-white shadow-lg rounded-lg border-l-4';
    toastNotification.classList.add(
      type === 'success' ? 'border-green-600' :
      type === 'error' ? 'border-red-600' : 'border-blue-600'
    );
    toastNotification.classList.remove('hidden');
  }

  // -------------------- Submit Tambah --------------------
  tambahRuanganForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(tambahRuanganForm).entries());

    try {
      const response = await fetch('../src/API/tu_data_ruangan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil ditambahkan.', 'success');
        tambahRuanganModal.classList.add('hidden');
        tambahRuanganForm.reset();
        loadDataRuangan();
      } else {
        showToast('Gagal', result.message || 'Terjadi kesalahan.', 'error');
      }
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  });

  // -------------------- Load & Render Table --------------------
  async function loadDataRuangan() {
    try {
      const response = await fetch('../src/API/tu_data_ruangan.php?action=get');
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        allData = result.data;
        renderTable();
      } else {
        ruanganTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Data tidak ditemukan.</td></tr>';
        updatePagination();
      }
    } catch {
      ruanganTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Gagal memuat data.</td></tr>';
    }
  }

  function renderTable() {
    ruanganTableBody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, allData.length);
    const pageData = allData.slice(start, end);

    pageData.forEach((row, i) => {
      ruanganTableBody.innerHTML += `
        <tr>
          <td class="px-6 py-4">${start + i + 1}</td>
          <td class="px-6 py-4">${row.namaRuangan}</td>
          <td class="px-6 py-4">${row.lokasi}</td>
          <td class="px-6 py-4">${row.keterangan || '-'}</td>
          <td class="px-6 py-4 flex space-x-3">
            <button class="text-blue-600 hover:text-blue-800 editBtn"
              data-id="${row.id}"
              data-nama="${row.namaRuangan}"
              data-lokasi="${row.lokasi}"
              data-keterangan="${row.keterangan || ''}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="text-red-600 hover:text-red-800" onclick="deleteRuangan(${row.id})">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      `;
    });

    setupEditButtons();
    updatePagination();
  }

  // -------------------- Pagination --------------------
  function updatePagination() {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    const pageNumbersContainer = document.getElementById('pageNumbers');
    const currentRangeEl = document.getElementById('currentRange');
    const totalDataEl = document.getElementById('totalData');

    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, allData.length);

    if (currentRangeEl) currentRangeEl.textContent = allData.length ? `${start}-${end}` : '0';
    if (totalDataEl) totalDataEl.textContent = allData.length;

    if (pageNumbersContainer) {
      pageNumbersContainer.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-2 py-1 text-sm rounded ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`;
        btn.addEventListener('click', () => {
          currentPage = i;
          renderTable();
        });
        pageNumbersContainer.appendChild(btn);
      }
    }

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages || totalPages === 0;
  }

  document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  document.getElementById('nextPage')?.addEventListener('click', () => {
    const totalPages = Math.ceil(allData.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  // -------------------- Tombol Edit --------------------
  function setupEditButtons() {
    const editButtons = document.querySelectorAll('.editBtn');
    editButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('editRuanganId').value = btn.dataset.id;
        document.getElementById('editNamaRuangan').value = btn.dataset.nama;
        document.getElementById('editLokasi').value = btn.dataset.lokasi;
        document.getElementById('editKeterangan').value = btn.dataset.keterangan;
        editModal.classList.remove('hidden');
      });
    });
  }

  cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));

  editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(editForm).entries());

    try {
      const response = await fetch('../src/API/tu_data_ruangan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil diperbarui.', 'success');
        editModal.classList.add('hidden');
        loadDataRuangan();
      } else {
        showToast('Gagal', result.message || 'Gagal memperbarui.', 'error');
      }
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  });

  // -------------------- Hapus Ruangan --------------------
  window.deleteRuangan = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) return;

    try {
      const response = await fetch('../src/API/tu_data_ruangan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });

      const result = await response.json();
      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil dihapus.', 'success');
        loadDataRuangan();
      } else {
        showToast('Gagal', result.message || 'Gagal menghapus.', 'error');
      }
    } catch (error) {
      showToast('Error', error.message, 'error');
    }
  };

  // -------------------- Pencarian --------------------
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const rows = ruanganTableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const nama = row.children[1]?.textContent.toLowerCase() || '';
      row.style.display = nama.includes(keyword) ? '' : 'none';
    });
  });

  // -------------------- Inisialisasi --------------------
  loadDataRuangan();
});
