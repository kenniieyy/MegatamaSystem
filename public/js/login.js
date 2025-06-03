// Sample data for autocomplete (akan diisi dari fetch)
let teacherData = [];

// Fetch teacher data from PHP backend
fetch('http://localhost/revisi/public/proses/get_nama_guru.php') // ganti dengan path sebenarnya
  .then(response => response.json())
  .then(data => {
    teacherData = data;
    // Setelah data dimuat, atur autocomplete dan validasi formulir jika diperlukan
    setupAutocompleteForTeachers();
    setupFormValidation(); // Panggil setupFormValidation di sini untuk memastikan teacherData dimuat
  })
  .catch(error => {
    console.error('Gagal mengambil data guru:', error);
    showModal('error', 'Gagal', 'Tidak bisa memuat data guru dari server.');
  });

// default credentials for Admin TU (dari kode teman)
const defaultCredentials = {
    adminTU: {
        username: 'admin.tu',
        password: 'admin123'
    },
    // Data guru akan dimuat dari database, ini hanya placeholder jika diperlukan
    teachers: []
};

// Fungsi untuk memeriksa apakah semua bidang yang diperlukan dalam formulir sudah diisi
function checkFormValidity(formId, buttonId) {
    const form = document.getElementById(formId);
    const button = document.getElementById(buttonId);
    const inputs = form.querySelectorAll('input[required]');

    let allFilled = true;
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allFilled = false;
        }
    });

    button.disabled = !allFilled;
}

// Tambahkan event listener ke semua form
function setupFormValidation() {
    // Admin TU form
    const tuInputs = document.querySelectorAll('#form-tu input[required]');
    tuInputs.forEach(input => {
        input.addEventListener('input', () => {
            checkFormValidity('form-tu', 'btn-login-tu');
        });
    });

    // Guru form
    const guruInputs = document.querySelectorAll('#form-guru input[required]');
    guruInputs.forEach(input => {
        input.addEventListener('input', () => {
            checkFormValidity('form-guru', 'btn-login-guru');
        });
    });

    // Pengecekan awal untuk semua form
    checkFormValidity('form-tu', 'btn-login-tu');
    checkFormValidity('form-guru', 'btn-login-guru');
}

function validateAdminTU() {
    const username = document.getElementById('username-tu').value.trim();
    const password = document.getElementById('password-tu').value;

    if (
        username === defaultCredentials.adminTU.username &&
        password === defaultCredentials.adminTU.password
    ) {
        // Langsung masuk ke dashboard TU
        window.location.href = 'tu_dashboard.html';
    } else {
        showModal('error', 'Login Gagal', 'Username atau password Admin TU tidak valid');
    }
}

function validateTeacher() {
    const identityInput = document.getElementById('identity-guru').value;
    const password = document.getElementById('password-guru').value;

    const parts = identityInput.split(' - ');
    const nip = parts[0]; // Asumsi NIP adalah bagian pertama

    // Kirim permintaan login ke backend PHP
    fetch('http://localhost/revisi/public/proses/login_guru.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nip: nip, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Login berhasil
            window.location.href = `dashboard_guru.php?name=${encodeURIComponent(data.nama_guru)}`;
        } else {
            // Login gagal
            showModal('error', 'Login Gagal', data.message);
        }
    })
    .catch(error => {
        console.error('Error during teacher login:', error);
        showModal('error', 'Login Gagal', 'Terjadi kesalahan saat mencoba login guru.');
    });
}

// Fungsionalitas autocomplete untuk login guru
function setupAutocompleteForTeachers() {
    const identityInput = document.getElementById('identity-guru');
    const autocompleteDropdown = document.getElementById('autocomplete-dropdown-guru');

    if (identityInput && autocompleteDropdown) {
        identityInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            
            if (inputValue.length >= 3) {
                // Filter guru berdasarkan input
                const filteredTeachers = teacherData.filter(teacher => 
                    teacher.nip.toLowerCase().includes(inputValue) || 
                    teacher.nama_guru.toLowerCase().includes(inputValue)
                );
                
                // Tampilkan dropdown dengan hasil
                if (filteredTeachers.length > 0) {
                    autocompleteDropdown.innerHTML = '';
                    filteredTeachers.forEach(teacher => {
                        const item = document.createElement('div');
                        item.className = 'autocomplete-item';
                        item.textContent = `${teacher.nip} - ${teacher.nama_guru}`;
                        item.addEventListener('click', function() {
                            identityInput.value = `${teacher.nip} - ${teacher.nama_guru}`;
                            autocompleteDropdown.classList.add('hidden');
                            checkFormValidity('form-guru', 'btn-login-guru'); // Validasi form setelah pilihan dipilih
                        });
                        autocompleteDropdown.appendChild(item);
                    });
                    autocompleteDropdown.classList.remove('hidden');
                } else {
                    autocompleteDropdown.innerHTML = '<div class="autocomplete-placeholder">Tidak ada hasil yang cocok</div>';
                    autocompleteDropdown.classList.remove('hidden');
                }
            } else {
                autocompleteDropdown.classList.add('hidden');
            }
        });

        // Sembunyikan dropdown saat mengklik di luar
        document.addEventListener('click', function(e) {
            if (!identityInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
                autocompleteDropdown.classList.add('hidden');
            }
        });

        // Navigasi keyboard untuk dropdown
        identityInput.addEventListener('keydown', function(e) {
            const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');
            const selectedItem = autocompleteDropdown.querySelector('.selected');
            
            if (items.length > 0 && !autocompleteDropdown.classList.contains('hidden')) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (!selectedItem) {
                        items[0].classList.add('selected');
                    } else {
                        const nextItem = selectedItem.nextElementSibling;
                        if (nextItem && nextItem.classList.contains('autocomplete-item')) {
                            selectedItem.classList.remove('selected');
                            nextItem.classList.add('selected');
                        }
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (selectedItem) {
                        const prevItem = selectedItem.previousElementSibling;
                        if (prevItem && prevItem.classList.contains('autocomplete-item')) {
                            selectedItem.classList.remove('selected');
                            prevItem.classList.add('selected');
                        }
                    }
                } else if (e.key === 'Enter' && selectedItem) {
                    e.preventDefault();
                    identityInput.value = selectedItem.textContent;
                    autocompleteDropdown.classList.add('hidden');
                    checkFormValidity('form-guru', 'btn-login-guru'); // Validasi form setelah pilihan dipilih
                }
            }
        });
    }
}


// Fungsionalitas tombol login
document.getElementById('btn-login-tu').addEventListener('click', function () {
    if (!this.disabled) {
        validateAdminTU();
    }
});

document.getElementById('btn-login-guru').addEventListener('click', function () {
    if (!this.disabled) {
        validateTeacher();
    }
});

// Fungsionalitas modal
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalDetails = document.getElementById('modal-details');
const modalHeader = document.getElementById('modal-header');
const modalIcon = document.getElementById('modal-icon');
const modalClose = document.getElementById('modal-close');

function showModal(type, title, message) {
    modalTitle.textContent = title;
    modalMessage.innerHTML = message; // Gunakan innerHTML agar <br> bisa muncul
    modalDetails.innerHTML = '';
    
    // Atur ikon dan warna berdasarkan tipe
    if (type === 'error') {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-red-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-red-600';
    } else if (type === 'success') {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-green-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-green-600';
    } else {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-primary bg-opacity-10';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-primary';
    }
    
    // Terapkan warna oranye ke tombol tutup (sekunder)
    modalClose.className = 'w-full py-3 px-6 text-base font-medium rounded-xl focus:outline-none transition-all duration-300 hover:shadow-lg text-white';
    modalClose.style.backgroundColor = '#FFA725';

    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });
}

// Inisialisasi validasi form saat halaman dimuat (dipindahkan ke dalam callback fetch untuk memastikan teacherData dimuat)
document.addEventListener('DOMContentLoaded', function () {
    // setupFormValidation(); // Akan dipanggil setelah teacherData diambil
});