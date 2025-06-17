// default

let teacherData = [];

fetch('../src/API/get_guru.php')
    .then(res => res.json())
    .then(data => {
        teacherData = data;
    })
    .catch(err => console.error('Gagal mengambil data guru:', err));



const defaultCredentials = {
    adminTU: {
        username: 'admin.tu',
        password: 'admin123'
    },
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
    const id = identityInput.split(' - ')[0];

    fetch('../src/API/login_guru.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `id=${encodeURIComponent(id)}&password=${encodeURIComponent(password)}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = `dashboard_guru.php?name=${encodeURIComponent(data.name)}`;
            } else {
                showModal('error', 'Login Gagal', data.message);
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            showModal('error', 'Login Gagal', 'Terjadi kesalahan koneksi ke server');
        });
}

// Fungsi untuk menjalankan fitur autocomplete
const identityInput = document.getElementById('identity-guru');
const autocompleteDropdown = document.getElementById('autocomplete-dropdown-guru');

if (identityInput && autocompleteDropdown) {
    identityInput.addEventListener('input', function () {
        const inputValue = this.value.toLowerCase();

        if (inputValue.length >= 3) {
            const filteredTeachers = teacherData.filter(teacher =>
                teacher.id.toLowerCase().includes(inputValue) ||
                teacher.name.toLowerCase().includes(inputValue)
            );

            if (filteredTeachers.length > 0) {
                autocompleteDropdown.innerHTML = '';
                filteredTeachers.forEach(teacher => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = `${teacher.id} - ${teacher.name}`;
                    item.addEventListener('click', function () {
                        identityInput.value = `${teacher.id} - ${teacher.name}`;
                        autocompleteDropdown.classList.add('hidden');
                        checkFormValidity('form-guru', 'btn-login-guru');
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


    document.addEventListener('click', function (e) {
        if (!identityInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
            autocompleteDropdown.classList.add('hidden');
        }
    });

    identityInput.addEventListener('keydown', function (e) {
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
                // Menjalankan validasi form setelah pilihan dipilih
                checkFormValidity('form-guru', 'btn-login-guru');
            }
        }
    });
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

    // Atur ikon, warna, dan header berdasarkan tipe
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

    // Tampilkan modal dengan animasi
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

// Inisialisasi validasi form saat halaman dimuat
document.addEventListener('DOMContentLoaded', function () {
    setupFormValidation();
});