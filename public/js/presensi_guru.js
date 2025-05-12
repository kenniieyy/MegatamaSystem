// update jam dan tangga
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
            const morningActive = hour >= 7 && hour < 8;
            const afternoonActive = hour >= 15 && hour < 16;
            
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

        // data dummy
        const teacherData = [
            { nip: '197201231995011002', name: 'Efrizal, S.P., M.Si.' },
            { nip: '197605212009121002', name: 'Syamsul Rizal, S.H., M.H.' },
            { nip: '198511212009121009', name: 'Ahmed Riza Fahlevi, S.H.' },
            { nip: '195907271987011002', name: 'Prof. Dr. Afrizal, S.E.,M.Si.,Ak.' },
            { nip: '196302041989031003', name: 'Prof. Ir. Yusrizal, M.Sc., Ph.D.' },
            { nip: '196805281993031001', name: 'Dr. Ir. Mairizal, M.Si.' }
        ];

       // fungsi autocomplete
        identityInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            
            if (inputValue.length >= 3) {
                // filter guru berdasarkan input
                const filteredTeachers = teacherData.filter(teacher => 
                    teacher.nip.toLowerCase().includes(inputValue) || 
                    teacher.name.toLowerCase().includes(inputValue)
                );
                
                // tampilkan dropdown dengan hasil
                if (filteredTeachers.length > 0) {
                    autocompleteDropdown.innerHTML = '';
                    filteredTeachers.forEach(teacher => {
                        const item = document.createElement('div');
                        item.className = 'autocomplete-item';
                        item.textContent = `${teacher.nip} - ${teacher.name}`;
                        item.addEventListener('click', function() {
                            identityInput.value = `${teacher.nip} - ${teacher.name}`;
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
        document.addEventListener('click', function(e) {
            if (!identityInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
                autocompleteDropdown.classList.add('hidden');
            }
        });

        // navigasi dropdown pakai keyboard
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
                
                // dalam fungsi activateCamera(), ganti konfigurasi getUserMedia dengan:
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
                    
                    // pastikan kamera tidak terbalik dengan berbagai metode
                    cameraElement.style.transform = 'scaleX(1)';
                    cameraElement.style.webkitTransform = 'scaleX(1)';
                    cameraElement.classList.add('non-mirrored');
                    
                    // atur atribut tambahan untuk kualitas
                    cameraElement.setAttribute('playsinline', true);
                    cameraElement.setAttribute('autoplay', true);
                    
                    cameraElement.onloadedmetadata = function() {
                        cameraElement.play();
                        // pastikan lagi transformasi setelah video dimuat
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
        captureBtn.addEventListener('click', () => {
            if (!stream || captureBtn.disabled) return;
            
            // umpan balik visual setelah gambar diambil
            const flashEffect = document.createElement('div');
            flashEffect.className = 'absolute inset-0 bg-white z-10';
            document.querySelector('.camera-container').appendChild(flashEffect);
            
            // hilangkan efek flash secara perlahan
            setTimeout(() => {
                flashEffect.style.transition = 'opacity 0.5s ease';
                flashEffect.style.opacity = '0';
                setTimeout(() => flashEffect.remove(), 500);
            }, 50);
            
           // tampilkan frame video di canvas
            canvasElement.width = cameraElement.videoWidth;
            canvasElement.height = cameraElement.videoHeight;
            const ctx = canvasElement.getContext('2d');
            // gambar tanpa membalik
            ctx.drawImage(cameraElement, 0, 0, canvasElement.width, canvasElement.height);
            
            // kirim gambar ke server untuk diproses

            // cek apakah waktu sekarang dalam rentang yang diizinkan
            const now = new Date();
            const hour = now.getHours();
            const minutes = now.getMinutes();
            
            // simulasi cek kehadiran
            const hasAttendedToday = Math.random() > 0.7; 
            
            if (hasAttendedToday) {
                showAttendanceModal('failed', 'Anda sudah melakukan presensi hari ini. Silakan cek riwayat presensi Anda.');
                return;
            }
            
            // cek apakah dalam waktu kehadiran pagi (7:00 - 8:00)
            const isMorningAttendance = hour >= 7 && hour < 8;
            // cek apakah dalam waktu kehadiran sore (15:00 - 16:00)
            const isAfternoonAttendance = hour >= 15 && hour < 16;
            
            let attendanceType = '';
            let onTime = true;
            
            if (isMorningAttendance) {
                attendanceType = 'Datang';
                onTime = hour === 7 || (hour === 7 && minutes <= 30);
            } else if (isAfternoonAttendance) {
                attendanceType = 'Pulang';
                onTime = hour === 15 || (hour === 15 && minutes <= 30);
            } else {
                // di luar jam kehadiran
                attendanceType = hour < 12 ? 'Datang' : 'Pulang';
                onTime = false;
            }
            
            // format waktu dengan nol di depan untuk tampilan
            const formattedHours = String(now.getHours()).padStart(2, '0');
            const formattedMinutes = String(now.getMinutes()).padStart(2, '0');
            const formattedSeconds = String(now.getSeconds()).padStart(2, '0');
            const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            
            // format tanggal untuk tampilan
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = now.toLocaleDateString('id-ID', options);
            
            // ambil nama dan NIP dari input identitas
            let name = identityInput.value;
            let nip = '';
            
            if (identityInput.value.includes('-')) {
                const parts = identityInput.value.split('-');
                nip = parts[0].trim();
                name = parts[1].trim();
            }
            
            // perbarui indikator status
            statusIndicator.className = 'w-3 h-3 rounded-full bg-blue-500 mr-2 pulse-animation';
            statusText.textContent = 'Memproses data presensi...';
            statusText.className = 'text-sm text-primary font-medium';
            
            // simulasi keterlambatan pemrosesan
            setTimeout(() => {
                showAttendanceModal('success', onTime ? 'Tepat Waktu' : 'Terlambat', {
                    name: name,
                    nip: nip || '123456', 
                    date: dateString,
                    time: timeString,
                    type: attendanceType,
                    status: onTime ? 'Tepat Waktu' : 'Terlambat'
                });
                
                // perbarui status
                statusIndicator.className = 'w-3 h-3 rounded-full bg-green-500 mr-2 pulse-animation';
                statusText.textContent = 'Kamera aktif dan siap digunakan';
                statusText.className = 'text-sm text-primary font-medium';
            }, 1500);
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
            
            // atur ikon dan warna sesuai tipe
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
                            <span class="font-medium text-gray-600">NIP:</span>
                            <span class="text-gray-800 font-semibold">${details.nip}</span>
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
            
            // atur ikon dan warna sesuai hasil
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
            activateCamera(); // aktifkan kamera langsung

        });