// Tampilkan/sembunyikan sidebar
function initializeSidebar() {
    const toggleButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const overlay = document.getElementById('overlay');

    // Saat tombol toggle diklik
    toggleButton.addEventListener('click', function () {
        sidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('mobile-open');
        mainContent.classList.toggle('expanded');
        overlay.classList.toggle('show');
    });

    // Tutup sidebar saat overlay diklik
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('mobile-open');
        overlay.classList.remove('show');
    });
}

// Inisialisasi combobox untuk mata pelajaran
function initializeCombobox() {
    const subjectInput = document.getElementById('subject-input');
    const subjectHidden = document.getElementById('subject');
    const subjectDropdown = document.getElementById('subject-dropdown');
    const addNewSubject = document.getElementById('add-new-subject');
    const newSubjectText = document.getElementById('new-subject-text');

    // Simpan opsi asli untuk filter
    const originalOptions = Array.from(subjectDropdown.querySelectorAll('.combobox-option')).map(option => ({
        element: option,
        value: option.getAttribute('data-value')
    }));

    // Tampilkan dropdown saat input difokuskan
    subjectInput.addEventListener('focus', function () {
        subjectDropdown.classList.add('show');
    });

    // Sembunyikan dropdown saat klik di luar elemen input atau dropdown
    document.addEventListener('click', function (e) {
        if (!subjectInput.contains(e.target) && !subjectDropdown.contains(e.target)) {
            subjectDropdown.classList.remove('show');
        }
    });

    // Filter pilihan saat mengetik
    subjectInput.addEventListener('input', function () {
        const value = this.value.trim().toLowerCase();
        let exactMatch = false;

        // Filter opsi yang sesuai
        originalOptions.forEach(option => {
            const optionValue = option.value.toLowerCase();
            if (optionValue.includes(value)) {
                option.element.style.display = 'block';
                if (optionValue === value) {
                    exactMatch = true;
                }
            } else {
                option.element.style.display = 'none';
            }
        });

        // Tampilkan/sembunyikan opsi "Tambah baru"
        if (value && !exactMatch) {
            newSubjectText.textContent = this.value.trim();
            addNewSubject.classList.add('show');
        } else {
            addNewSubject.classList.remove('show');
        }

        // Perbarui nilai input tersembunyi
        subjectHidden.value = this.value;
    });

    // Pilih opsi saat diklik
    subjectDropdown.addEventListener('click', function (e) {
        const option = e.target.closest('.combobox-option');
        if (option) {
            selectOption(option);
        }
    });

    // Tambah mata pelajaran baru
    addNewSubject.addEventListener('click', function () {
        const newSubject = subjectInput.value.trim();
        if (newSubject) {
            const newOption = document.createElement('div');
            newOption.className = 'combobox-option';
            newOption.setAttribute('data-value', newSubject);
            newOption.textContent = newSubject;

            // Add to dropdown before "Add new" option
            subjectDropdown.insertBefore(newOption, addNewSubject);

            // Add to original options
            originalOptions.push({
                element: newOption,
                value: newSubject
            });

            // Select the new option
            selectOption(newOption);
        }
    });

    // Fungsi untuk memilih opsi
    function selectOption(option) {
        // Hapus kelas 'selected' dari semua opsi
        subjectDropdown.querySelectorAll('.combobox-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Tambahkan kelas 'selected' pada opsi yang dipilih
        option.classList.add('selected');

        // Perbarui input dan field tersembunyi
        const value = option.getAttribute('data-value');
        subjectInput.value = value;
        subjectHidden.value = value;

        // Sembunyikan dropdown
        subjectDropdown.classList.remove('show');
    }

    // Navigasi menggunakan keyboard
    subjectInput.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();

            const visibleOptions = Array.from(subjectDropdown.querySelectorAll('.combobox-option')).filter(
                option => option.style.display !== 'none'
            );

            if (visibleOptions.length === 0) return;

            const selectedOption = subjectDropdown.querySelector('.combobox-option.selected');
            let nextIndex = 0;

            if (selectedOption) {
                const currentIndex = visibleOptions.indexOf(selectedOption);
                if (e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % visibleOptions.length;
                } else {
                    nextIndex = (currentIndex - 1 + visibleOptions.length) % visibleOptions.length;
                }
            }

            selectOption(visibleOptions[nextIndex]);
        } else if (e.key === 'Enter') {
            e.preventDefault();

            if (addNewSubject.classList.contains('show')) {
                addNewSubject.click();
            } else {
                const visibleOption = subjectDropdown.querySelector('.combobox-option:not([style*="display: none"])');
                if (visibleOption) {
                    selectOption(visibleOption);
                }
            }
        } else if (e.key === 'Escape') {
            subjectDropdown.classList.remove('show');
        }
    });
}

function initializeForm() {
    const profileForm = document.getElementById('profile-form');

    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(profileForm);
        const selectedSubject = document.getElementById('subject').value;
        const statusSelect = document.getElementById('status');
        const selectedStatus = statusSelect.options[statusSelect.selectedIndex].text;

        console.log('Form data submitted:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Kirim data ke server (update_guru.php)
        fetch('proses/update_guru.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            console.log('Server response:', result);
            if (result.includes('Berhasil')) {
                updateProfileDisplay(formData.get('fullname'), selectedSubject, selectedStatus);
                showNotification('Profil berhasil diperbarui!');
            } else {
                showNotification('Gagal memperbarui profil: ' + result);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Terjadi kesalahan saat mengirim data.');
        });
    });
}


// Perbarui tampilan profil setelah disimpan
function updateProfileDisplay(fullname, subject, status) {
    // Update nama dan mata pelajaran
    document.querySelector('.text-center h4').textContent = fullname;
    document.querySelector('.text-center p').textContent = `Guru ${subject}`;
    document.querySelector('.avatar-ring + span').textContent = fullname;

    // Update status
    const statusBadge = document.querySelector('.badge-status'); // Pastikan class ini sesuai
    let statusClass = '';

    if (status === 'Aktif') {
        statusClass = 'status-active';
    } else if (status === 'Non Aktif') {
        statusClass = 'status-inactive';
    } else if (status === 'Cuti') {
        statusClass = 'status-leave';
    }

    if (statusBadge) {
        statusBadge.textContent = status;
        // Reset semua status class yang mungkin sebelumnya ada
        statusBadge.classList.remove('status-active', 'status-inactive', 'status-leave');
        // Tambahkan class sesuai status baru
        statusBadge.classList.add(statusClass);
    }
}


// Tampilkan notifikasi sukses
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Inisialisasi unggah foto profil
function initializePhotoUpload() {
    const photoUpload = document.getElementById('photo-upload');
    const profilePhoto = document.querySelector('.profile-photo');

    photoUpload.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Jalankan semua fungsi saat halaman dimuat
window.addEventListener('load', () => {
    initializeSidebar();
    initializeCombobox();
    initializeForm();
    initializePhotoUpload();
});