// Fungsi untuk memeriksa apakah waktu berada dalam rentang tertentu
function isTimeInRange(timeStr, startHour, endHour) {
    if (timeStr === "-") return false

    const timeParts = timeStr.split(":")
    const hour = Number.parseInt(timeParts[0], 10)

    return hour >= startHour && hour < endHour
}


// Data contoh untuk catatan kehadiran
let attendanceData = {
    datang: [],
    pulang: []
}

function loadAttendanceFromServer() {
    return fetch('http://localhost/revisi/public/proses/get_riwayat_guru.php')
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                attendanceData.datang = result.data.map(item => ({
                    id: Math.random(),
                    nip: item.nip,
                    date: item.date,
                    time: item.datang,
                    status: item.datang !== '-' ? 'Hadir' : 'Tidak Hadir',
                    note: item.datang !== '-' ? (isTimeInRange(item.datang, 7, 8) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                }))
                attendanceData.pulang = result.data.map(item => ({
                    id: Math.random(),
                    nip: item.nip,
                    date: item.date,
                    time: item.pulang,
                    status: item.pulang !== '-' ? 'Hadir' : 'Tidak Hadir',
                    note: item.pulang !== '-' ? (isTimeInRange(item.pulang, 15, 16) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                }))
            } else {
                alert("Gagal memuat data presensi.")
            }
        })
}


// Memperbarui data kehadiran berdasarkan aturan waktu
function updateAttendanceData() {
    // Memperbarui data absen datang
    attendanceData.datang.forEach((item) => {
        if (item.time === "-") {
            item.status = "Tidak Hadir"
            item.note = "Absen Tidak Dilakukan"
        } else {
            const timeParts = item.time.split(":")
            const hour = Number.parseInt(timeParts[0], 10)

            if (hour >= 7 && hour < 8) {
                item.status = "Hadir"
                item.note = "Tepat Waktu"
            } else {
                item.status = "Hadir"
                item.note = "Terlambat"
            }
        }
    })

    // Memperbarui data absen pulang
    attendanceData.pulang.forEach((item) => {
        if (item.time === "-") {
            item.status = "Tidak Hadir"
            item.note = "Absen Tidak Dilakukan"
        } else {
            const timeParts = item.time.split(":")
            const hour = Number.parseInt(timeParts[0], 10)

            if (hour >= 15 && hour < 16) {
                item.status = "Hadir"
                item.note = "Tepat Waktu"
            } else {
                item.status = "Hadir"
                item.note = "Terlambat"
            }
        }
    })
}



function mergeAttendanceData() {
    const merged = []

    attendanceData.datang.forEach(item => {
        merged.push({
            nip: item.nip,
            date: item.date,
            waktu: item.time,
            status: item.status,
            keterangan: item.note,
            type: "Datang"
        })
    })

    attendanceData.pulang.forEach(item => {
        merged.push({
            nip: item.nip,
            date: item.date,
            waktu: item.time,
            status: item.status,
            keterangan: item.note,
            type: "Pulang"
        })
    })

    return merged.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function renderDashboardAttendanceGabungan(limit = 6) {
    const tableBody = document.getElementById("dashboard-attendance-data");
    if (!tableBody) return;

    const combinedData = mergeAttendanceData();
    const slicedData = combinedData.slice(0, limit);

    tableBody.innerHTML = "";

    slicedData.forEach(item => {
        // Panggil endpoint PHP yang benar untuk ambil foto profil
        // Menggunakan get_guru.php yang Anda sediakan, karena itu yang mengembalikan info guru berdasarkan NIP
        fetch(`http://localhost/revisi/public/proses/get_guru.php?nip=${item.nip}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let fotoProfil;
                // Pastikan data memiliki properti foto_profil
                if (data && data.foto_profil) {
                    fotoProfil = `img/guru/${data.foto_profil}`;
                } else {
                    fotoProfil = 'img/guru/1.png'; // default jika tidak ada atau error
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap">
                        <img class="h-8 w-8 rounded-full object-cover" src="${fotoProfil}" alt="User avatar">
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.date}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.waktu}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.status}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="badge ${item.badgeClass || ''}">${item.keterangan}</span>
                    </td>
                `;
                tableBody.appendChild(row);
            })
            .catch(error => {
                console.error('Error fetching guru photo:', error);
                // Fallback ke default foto jika ada error saat fetch
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-4 py-3 whitespace-nowrap">
                        <img class="h-8 w-8 rounded-full object-cover" src="img/guru/1.png" alt="User avatar">
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.date}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.waktu}</td>
                    <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.status}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                        <span class="badge ${item.badgeClass || ''}">${item.keterangan}</span>
                    </td>
                `;
                tableBody.appendChild(row);
            });
    });
}

window.addEventListener("load", () => {
    loadAttendanceFromServer().then(() => {
        renderDashboardAttendanceGabungan(3)
    })
})