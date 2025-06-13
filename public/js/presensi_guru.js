// update jam dan tanggal
function updateClock() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    // atur format waktu 
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('clock').textContent = timeString;
    document.getElementById('date').textContent = now.toLocaleDateString('id-ID', options);

    // update status aktif sesuai waktu sekarang
    updateActiveStatus(now);
}

function updateActiveStatus(now) {
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Minggu, 1 = Senin, ..., 6 = Sabtu

    // Status aktif untuk absen datang (Senin-Jumat 06:30-10:30)
    const morningActive = day >= 1 && day <= 5 && hour >= 6 && hour < 10;

    // Status aktif untuk absen pulang
    let afternoonActive = false;
    if (day >= 1 && day <= 4) { // Senin-Kamis
        afternoonActive = hour >= 10;
    } else if (day === 5) { // Jumat
        afternoonActive = hour >= 11;
    }

    const morningIndicator = document.querySelector('#attendance-status .flex:first-child .rounded-full');
    const afternoonIndicator = document.querySelector('#attendance-status .flex:last-child .rounded-full');

    // kembalikan kelas ke awal
    morningIndicator.className = 'w-3 h-3 rounded-full mr-2';
    afternoonIndicator.className = 'w-3 h-3 rounded-full mr-2';

    // tambahkan kelas untuk indikator pagi dan sore berdasarkan status aktif
    if (morningActive) {
        morningIndicator.classList.add('bg-green-500', 'pulse-animation');
        afternoonIndicator.classList.add('bg-yellow-500');
    } else if (afternoonActive) {
        morningIndicator.classList.add('bg-green-500');
        afternoonIndicator.classList.add('bg-yellow-500', 'pulse-animation');
    } else {
        morningIndicator.classList.add('bg-green-500');
        afternoonIndicator.classList.add('bg-yellow-500');
    }
}

// jalankan jam langsung dan update tiap detik
updateClock();
setInterval(updateClock, 1000);

// fungsi kamera dan elemen terkait
const cameraElement = document.getElementById('camera');
const canvasElement = document.getElementById('canvas');
const captureBtn = document.getElementById('capture-btn');
const identityInput = document.getElementById('identity');
const passwordInput = document.getElementById('password');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const autocompleteDropdown = document.getElementById('autocomplete-dropdown');
let stream = null;

let teacherData = [];

fetch('proses/get_guru.php')
    .then(response => response.json())
    .then(data => {
        teacherData = data;
    })
    .catch(error => {
        console.error('Gagal mengambil data guru:', error);
        showModal('error', 'Gagal', 'Tidak bisa memuat data guru dari server.');
    });
// Simpan data presensi di localStorage
function getAttendanceData() {
    const today = new Date().toLocaleDateString('id-ID');
    const data = localStorage.getItem(`attendance_${today}`);
    return data ? JSON.parse(data) : {};
}

function saveAttendanceData(data) {
    const today = new Date().toLocaleDateString('id-ID');
    localStorage.setItem(`attendance_${today}`, JSON.stringify(data));
}

// fungsi autocomplete
identityInput.addEventListener('input', function () {
    const inputValue = this.value.toLowerCase();

    if (inputValue.length >= 3) {
        // filter guru berdasarkan input
        const filteredTeachers = teacherData.filter(teacher =>
            teacher.id.toLowerCase().includes(inputValue) ||
            teacher.name.toLowerCase().includes(inputValue)
        );

        // tampilkan dropdown dengan hasil
        if (filteredTeachers.length > 0) {
            autocompleteDropdown.innerHTML = '';
            filteredTeachers.forEach(teacher => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.textContent = `${teacher.id} - ${teacher.name}`;
                item.addEventListener('click', function () {
                    identityInput.value = `${teacher.id} - ${teacher.name}`;
                    autocompleteDropdown.classList.add('hidden');
                    validateForm();
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

// sembunyikan dropdown saat klik di luar
document.addEventListener('click', function (e) {
    if (!identityInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
        autocompleteDropdown.classList.add('hidden');
    }
});

// navigasi dropdown pakai keyboard
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
            validateForm();
        }
    }
});

// aktifkan kamera segera saat halaman dimuat
function activateCamera() {
    if (!stream) {
        cameraPlaceholder.classList.remove('hidden');
        statusIndicator.className = 'w-3 h-3 rounded-full bg-yellow-500 mr-2 pulse-animation';
        statusText.textContent = 'Mengaktifkan kamera...';
        statusText.className = 'text-sm text-yellow-800 font-medium';

        navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user",
                frameRate: { ideal: 30 }
            }
        })
            .then(videoStream => {
                stream = videoStream;
                cameraElement.srcObject = stream;

                cameraElement.style.transform = 'scaleX(1)';
                cameraElement.style.webkitTransform = 'scaleX(1)';
                cameraElement.classList.add('non-mirrored');

                cameraElement.setAttribute('playsinline', true);
                cameraElement.setAttribute('autoplay', true);

                cameraElement.onloadedmetadata = function () {
                    cameraElement.play();
                    cameraElement.style.transform = 'scaleX(1)';
                    cameraElement.style.webkitTransform = 'scaleX(1)';
                };

                cameraPlaceholder.classList.add('hidden');

                statusIndicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-2 pulse-animation';
                statusText.textContent = 'Kamera aktif dan siap digunakan';
                statusText.className = 'text-sm text-primary font-medium';
            })
            .catch(err => {
                console.error('Error accessing camera:', err);
                showModal('error', 'Error', 'Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.');
                cameraPlaceholder.classList.remove('hidden');
                cameraPlaceholder.innerHTML = `
                <div class="text-center p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-base font-medium text-gray-600">Akses kamera ditolak</p>
                    <p class="text-sm text-gray-500 mt-2">Mohon izinkan akses kamera di pengaturan browser Anda</p>
                </div>
            `;

                statusIndicator.className = 'w-3 h-3 rounded-full bg-red-500 mr-2';
                statusText.textContent = 'Kamera tidak dapat diakses';
                statusText.className = 'text-sm text-red-800 font-medium';
            });
    }
}

// form validasi
function validateForm() {
    if (identityInput.value.length >= 3 && passwordInput.value) {
        captureBtn.disabled = false;
        captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        captureBtn.disabled = true;
        captureBtn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

identityInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

// ambil gambar
// ambil gambar
captureBtn.addEventListener('click', () => {
    if (!stream || captureBtn.disabled) return;

    // umpan balik visual setelah gambar diambil
    const flashEffect = document.createElement('div');
    flashEffect.className = 'absolute inset-0 bg-white z-10';
    document.querySelector('.camera-container').appendChild(flashEffect);

    setTimeout(() => {
        flashEffect.style.transition = 'opacity 0.5s ease';
        flashEffect.style.opacity = '0';
        setTimeout(() => flashEffect.remove(), 500);
    }, 50);

    canvasElement.width = cameraElement.videoWidth;
    canvasElement.height = cameraElement.videoHeight;
    const ctx = canvasElement.getContext('2d');
    ctx.drawImage(cameraElement, 0, 0, canvasElement.width, canvasElement.height);

    // konversi gambar ke base64
    const imageData = canvasElement.toDataURL("image/png");

    // Dapatkan waktu dan tanggal saat ini *sebelum* fetch request
    const now = new Date();
    const formattedHours = String(now.getHours()).padStart(2, '0');
    const formattedMinutes = String(now.getMinutes()).padStart(2, '0');
    const formattedSeconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('id-ID', options);

    // Dapatkan teacherId, name, dan id dari input identitas
    let name = identityInput.value;
    let id = '';
    if (identityInput.value.includes('-')) {
        const parts = identityInput.value.split('-');
        id = parts[0].trim();
        name = parts[1].trim();
    }

    // Tentukan attendanceType dan onTime/status berdasarkan waktu saat ini
    let attendanceType = '';
    let status = '';
    let onTime = false; // Inisialisasi onTime

    const hour = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();

    // Logika validasi awal sebelum mengirim ke server
    if (day < 1 || day > 5) {
        showModal('error', 'Absen Gagal', 'Absensi hanya dapat dilakukan pada hari kerja (Senin-Jumat).');
        return; // Hentikan proses jika bukan hari kerja
    }

    // Ambil data presensi dari localStorage untuk cek duplikasi
    const attendanceData = getAttendanceData();
    const teacherId = id || 'unknown'; // Gunakan ID yang sudah diekstrak

    if (attendanceData[teacherId]) {
        const hasMorningAttendance = attendanceData[teacherId].morning;
        const hasAfternoonAttendance = attendanceData[teacherId].afternoon;

        // Cek absen datang
        if (hour < 10 || (hour === 10 && minutes <= 30)) {
            if (hasMorningAttendance) {
                showModal('error', 'Absen Gagal', 'Anda sudah melakukan absen datang hari ini. Silakan cek riwayat presensi.');
                return;
            }
        }
        // Cek absen pulang
        else {
            if (hasAfternoonAttendance) {
                showModal('error', 'Absen Gagal', 'Anda sudah melakukan absen pulang hari ini. Silakan cek riwayat presensi.');
                return;
            }

            // Jika belum absen datang tapi mau absen pulang (kasus absen datang terlambat)
            if (!hasMorningAttendance) {
                // Catat sebagai absen datang terlambat di localStorage
                attendanceData[teacherId] = attendanceData[teacherId] || {};
                attendanceData[teacherId].morning = {
                    time: `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`,
                    status: 'Terlambat',
                    date: now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                };
                saveAttendanceData(attendanceData);

                showModal('info', 'Absen Datang Terlambat', 'Anda belum melakukan absen datang. Sistem mencatat absen datang terlambat. Silakan scan ulang untuk absen pulang.');
                return; // Minta scan lagi untuk absen pulang
            }
        }
    }

    // Menentukan Tipe dan Status Absensi
    if (hour < 6 || (hour === 6 && minutes < 30)) {
        showModal('error', 'Absen Gagal', 'Absen hanya dapat dilakukan mulai pukul 06:30.');
        return;
    } else if (hour < 10 || (hour === 10 && minutes <= 30)) {
        attendanceType = 'Datang';
        // Tepat waktu jika absen sebelum 07:30
        if (hour < 7 || (hour === 7 && minutes <= 30)) {
            status = 'Tepat Waktu';
            onTime = true;
        } else {
            status = 'Terlambat';
            onTime = false;
        }
    } else {
        attendanceType = 'Pulang';
        // Khusus Jumat (11:30-14:00)
        if (day === 5) {
            if (hour < 11 || (hour === 11 && minutes < 30)) {
                status = 'Terlambat (Sebelum waktu pulang)';
                onTime = false;
            } else if (hour >= 14) {
                status = 'Terlambat';
                onTime = false;
            } else {
                status = 'Tepat Waktu';
                onTime = true;
            }
        }
        // Senin-Kamis (setelah 10:30)
        else {
            status = 'Tepat Waktu'; // Tidak ada keterlambatan untuk pulang Senin-Kamis
            onTime = true;
        }
    }


    // siapkan form data
    const formData = new FormData();
    formData.append("identity", identityInput.value);
    formData.append("password", passwordInput.value);
    formData.append("image", imageData);
    // Tambahkan data waktu dan tanggal ke formData jika dibutuhkan oleh backend
    formData.append("dateString", dateString);
    formData.append("timeString", timeString);
    formData.append("attendanceType", attendanceType);
    formData.append("onTime", onTime ? 'true' : 'false');


    // perbarui indikator status sebelum mengirim
    statusIndicator.className = 'w-3 h-3 rounded-full bg-blue-500 mr-2 pulse-animation';
    statusText.textContent = 'Memproses data presensi...';
    statusText.className = 'text-sm text-primary font-medium';

    // kirim ke server
    fetch("proses/presensi_guru.php", {
        method: "POST",
        body: formData
    })
    .then(async res => {
        const response = await res.json();

        if (!res.ok || response.status !== "success") {
            // Jika server mengembalikan error, tampilkan pesan error
            throw new Error(response.message || "Presensi gagal.");
        }

        const { name: resName, nip: resNip } = response; // Gunakan alias untuk menghindari konflik nama

        // Simpan data presensi di localStorage setelah berhasil dari server
        attendanceData[teacherId] = attendanceData[teacherId] || {};
        if (attendanceType === 'Datang') {
            attendanceData[teacherId].morning = {
                time: timeString,
                status: status,
                date: dateString
            };
        } else if (attendanceType === 'Pulang') {
            attendanceData[teacherId].afternoon = {
                time: timeString,
                status: status,
                date: dateString
            };
        }
        saveAttendanceData(attendanceData);

        // Tampilkan modal keberhasilan dengan detail
        showAttendanceModal("success", response.message, {
            name: resName,
            nip: resNip,
            date: dateString, // dateString sekarang sudah didefinisikan
            time: timeString, // timeString sekarang sudah didefinisikan
            type: attendanceType, // attendanceType sekarang sudah didefinisikan
            status: status // status sekarang sudah didefinisikan (berdasarkan onTime)
        });

        // perbarui status indikator setelah berhasil
        statusIndicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-2 pulse-animation';
        statusText.textContent = 'Kamera aktif dan siap digunakan';
        statusText.className = 'text-sm text-primary font-medium';
    })
    .catch(err => {
        console.error("Presensi gagal:", err);
        showModal("error", "Presensi Gagal", err.message);

        // perbarui status indikator setelah gagal
        statusIndicator.className = 'w-3 h-3 rounded-full bg-red-500 mr-2';
        statusText.textContent = 'Terjadi kesalahan, coba lagi.';
        statusText.className = 'text-sm text-red-800 font-medium';
    });
});

// fungsi modal
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
    modalMessage.textContent = message;
    modalDetails.innerHTML = '';

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
    } else if (type === 'info') {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-blue-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-blue-600';
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function showAttendanceModal(result, status, details = null) {
    const type = result === 'success' ? 'success' : 'error';
    const title = result === 'success' ? 'Presensi Berhasil' : 'Presensi Gagal';
    const message = result === 'success' ? `Presensi ${status}` : status;

    modalTitle.textContent = title;
    modalMessage.textContent = message;

    if (details && result === 'success') {
        modalDetails.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Nama:</span>
                    <span class="text-gray-800 font-semibold">${details.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-medium text-gray-600">ID:</span>
                    <span class="text-gray-800 font-semibold">${details.id}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Tanggal:</span>
                    <span class="text-gray-800 font-semibold">${details.date}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Waktu:</span>
                    <span class="text-gray-800 font-semibold">${details.time}</span>
                </div>
                <div class="flex justify-between">
                    <span class="font-medium text-gray-600">Keterangan:</span>
                    <span class="text-gray-800 font-semibold">Absen ${details.type} (${details.status})</span>
                </div>
            </div>
        `;
    } else {
        modalDetails.innerHTML = '';
    }

    if (result === 'success') {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-green-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-green-600';
    } else {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-red-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-red-600';
    }

    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

modalClose.addEventListener('click', () => {
    modalContent.classList.remove('scale-100', 'opacity-100');
    modalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
});

// cek apakah mengakses dari jaringan lokal
function checkLocalNetwork() {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.');

    if (!isLocalhost) {
        showModal('error', 'Akses Ditolak', 'Sistem presensi hanya dapat diakses melalui jaringan lokal sekolah.');
    }
}

// jalankan saat halaman dimuat
window.addEventListener('load', () => {
    checkLocalNetwork();
    validateForm();
    activateCamera();
});