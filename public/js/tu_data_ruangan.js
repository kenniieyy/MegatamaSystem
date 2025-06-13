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

  // Buka modal tambah
  tambahRuanganBtn.addEventListener('click', () => {
    tambahRuanganModal.classList.remove('hidden');
  });

  // Tutup modal
  closeTambahModal.addEventListener('click', () => {
    tambahRuanganModal.classList.add('hidden');
  });

  cancelTambahRuangan.addEventListener('click', () => {
    tambahRuanganModal.classList.add('hidden');
  });

  // Tutup toast
  toastClose.addEventListener('click', () => {
    toastNotification.classList.add('hidden');
  });

  // Submit form tambah ruangan
  tambahRuanganForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(tambahRuanganForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('../src/API/tu_data_ruangan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...data }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil ditambahkan.', 'success');
        tambahRuanganModal.classList.add('hidden');
        tambahRuanganForm.reset();
        loadDataRuangan();
      } else {
        showToast('Gagal', result.message || 'Terjadi kesalahan saat menambahkan.', 'error');
      }
    } catch (error) {
      showToast('Gagal', `Terjadi kesalahan: ${error.message}`, 'error');
    }
  });

  // Tampilkan toast
  function showToast(title, message, type = 'info') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastNotification.classList.remove('hidden');
    toastNotification.classList.remove('border-l-4', 'border-green-600', 'border-red-600', 'border-blue-600');

    if (type === 'success') {
      toastNotification.classList.add('border-l-4', 'border-green-600');
    } else if (type === 'error') {
      toastNotification.classList.add('border-l-4', 'border-red-600');
    } else {
      toastNotification.classList.add('border-l-4', 'border-blue-600');
    }
  }

  // Ambil dan tampilkan data ruangan
  async function loadDataRuangan() {
    try {
      const response = await fetch('../src/API/tu_data_ruangan.php?action=get');
      const result = await response.json();

      ruanganTableBody.innerHTML = '';

      if (!result.success || result.data.length === 0) {
        ruanganTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Data tidak ditemukan.</td></tr>';
        return;
      }

      result.data.forEach((ruangan, index) => {
        ruanganTableBody.innerHTML += `
          <tr>
            <td class="px-6 py-4">${index + 1}</td>
            <td class="px-6 py-4">${ruangan.namaRuangan}</td>
            <td class="px-6 py-4">${ruangan.lokasi}</td>
            <td class="px-6 py-4">${ruangan.keterangan || '-'}</td>
            <td class="px-6 py-4 flex space-x-3">
              <button class="text-blue-600 hover:text-blue-800" onclick="editRuangan(${ruangan.id})" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="text-red-600 hover:text-red-800" onclick="deleteRuangan(${ruangan.id})" title="Hapus">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        `;
      });
    } catch (error) {
      ruanganTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Terjadi kesalahan saat memuat data.</td></tr>';
    }
  }

  // Fungsi hapus ruangan
  window.deleteRuangan = async function (id) {
    if (!confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) return;

    try {
      const response = await fetch('../src/API/tu_data_ruangan.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();

      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil dihapus.', 'success');
        loadDataRuangan();
      } else {
        showToast('Gagal', result.message || 'Gagal menghapus data.', 'error');
      }
    } catch (error) {
      showToast('Gagal', `Terjadi kesalahan: ${error.message}`, 'error');
    }
  };

  // Placeholder fungsi edit
  window.editRuangan = function (id) {
    alert(`Edit fitur untuk ruangan ID ${id} belum tersedia.`);
  };

  // Pencarian berdasarkan nama ruangan
  searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const rows = ruanganTableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const nama = row.children[1]?.textContent.toLowerCase() || '';
      row.style.display = nama.includes(keyword) ? '' : 'none';
    });
  });

  // Load data saat halaman dimuat
  loadDataRuangan();
});
