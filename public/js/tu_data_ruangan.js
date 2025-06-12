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

  // Membuka modal tambah
  tambahRuanganBtn.addEventListener('click', () => {
    tambahRuanganModal.classList.remove('hidden');
  });

  // Tutup modal tambah
  closeTambahModal.addEventListener('click', () => {
    tambahRuanganModal.classList.add('hidden');
  });
  cancelTambahRuangan.addEventListener('click', () => {
    tambahRuanganModal.classList.add('hidden');
  });

  // Toast close
  toastClose.addEventListener('click', () => {
    toastNotification.classList.add('hidden');
  });

  // Submit form tambah ruangan
  tambahRuanganForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(tambahRuanganForm);
    const data = Object.fromEntries(formData.entries());

    // Log data yang akan dikirim
    console.log('Mengirim data ke PHP:', data); 

    try {
      const response = await fetch('../src/API/tu_data_ruangan.php?action=get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', ...data }),
      });

      // Log status respon HTTP
      console.log('Status HTTP Response:', response.status);

      // Cek apakah response OK dan Content-Type adalah JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error Response Text:', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      // Log hasil JSON dari PHP
      console.log('Result dari PHP:', result); 

      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil ditambahkan.', 'success');
        tambahRuanganModal.classList.add('hidden');
        tambahRuanganForm.reset();
        loadDataRuangan(); // Reload tabel data ruangan
      } else {
        // Tampilkan pesan error spesifik dari PHP
        showToast('Gagal', result.message || 'Terjadi kesalahan saat mengirim data.', 'error');
      }
    } catch (error) {
      // Tangani error jaringan atau parsing JSON
      showToast('Gagal', `Terjadi kesalahan: ${error.message}`, 'error');
      console.error('Catch Error:', error);
    }
  });

  // Fungsi menampilkan toast
  function showToast(title, message, type = 'info') {
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastNotification.classList.remove('hidden');
    // Hapus kelas warna yang ada dan tambahkan yang baru
    toastNotification.classList.remove('border-l-4', 'border-green-600', 'border-red-600', 'border-blue-600');
    if (type === 'success') {
      toastNotification.classList.add('border-l-4', 'border-green-600');
    } else if (type === 'error') {
      toastNotification.classList.add('border-l-4', 'border-red-600');
    } else {
      toastNotification.classList.add('border-l-4', 'border-blue-600');
    }
  }

  // Fungsi load data ruangan
  async function loadDataRuangan() {
    try {
      const response = await fetch('../src/API/tu_data_ruangan.php?action=get');
      const result = await response.json();

      if (result.success) {
        ruanganTableBody.innerHTML = '';

        if (result.data.length === 0) {
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
              <td class="px-6 py-4">
                <button class="text-red-600 hover:underline" onclick="deleteRuangan(${ruangan.id})">Hapus</button>
              </td>
            </tr>
          `;
        });
      } else {
        ruanganTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Gagal memuat data: ${result.message || ''}</td></tr>`;
      }
    } catch (error) {
      ruanganTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Terjadi kesalahan saat memuat data.</td></tr>';
      console.error(error);
    }
  }

  // Panggil loadData saat halaman siap
  loadDataRuangan();

  // Fungsi hapus ruangan (konfirmasi)
  window.deleteRuangan = async function(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) return;

    try {
      const response = await fetch('t../src/API/tu_data_ruangan.php?action=get', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      });
      
      // Log status respon HTTP
      console.log('Status HTTP Response (Delete):', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error Response Text (Delete):', errorText);
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      const result = await response.json();
      // Log hasil JSON dari PHP
      console.log('Result dari PHP (Delete):', result); 

      if (result.success) {
        showToast('Sukses', 'Data ruangan berhasil dihapus.', 'success');
        loadDataRuangan();
      } else {
        showToast('Gagal', result.message || 'Gagal menghapus data.', 'error');
      }
    } catch (error) {
      showToast('Gagal', `Terjadi kesalahan: ${error.message}`, 'error');
      console.error('Catch Error (Delete):', error);
    }
  };
});