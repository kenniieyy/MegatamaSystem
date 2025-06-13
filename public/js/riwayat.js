function isTimeInRange(timeStr, startHour, endHour) {
    if (!timeStr || timeStr === "-") return false;

    const timeParts = timeStr.split(":");
    if (timeParts.length < 1) return false;

    const hour = Number.parseInt(timeParts[0], 10);
    return hour >= startHour && hour < endHour;
}


// Data contoh untuk catatan kehadiran
let attendanceData = {
    datang: [],
    pulang: []
}

function loadAttendanceFromServer() {
    // RETURN the promise chain here
    return fetch('proses/get_riwayat_guru.php')
        .then(response => {
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.status === 'success') {
                attendanceData.datang = result.data
                    .filter(item => item.datang && item.datang !== "null" && item.datang !== "-")
                    .map(item => ({
                        id: Math.random(),
                        date: item.date,
                        time: item.datang,
                        foto_datang: item.foto_datang || null,
                        foto_pulang: null,
                        type: 'Datang',
                        status: item.datang !== '-' ? 'Hadir' : 'Tidak Hadir',
                        note: item.datang !== '-' ? (isTimeInRange(item.datang, 7, 8) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                    }))
                attendanceData.pulang = result.data
                    .filter(item => item.pulang && item.pulang !== "null" && item.pulang !== "-")
                    .map(item => ({
                        id: Math.random(),
                        date: item.date,
                        time: item.pulang,
                        type: 'Pulang',
                        foto_datang: null,
                        foto_pulang: item.foto_pulang || null,
                        status: item.pulang !== '-' ? 'Hadir' : 'Tidak Hadir',
                        note: item.pulang !== '-' ? (isTimeInRange(item.pulang, 15, 16) ? 'Tepat Waktu' : 'Terlambat') : 'Absen Tidak Dilakukan'
                    }))
                renderAttendanceData() // Assuming renderAttendanceData exists and is necessary here
            } else {
                alert("Gagal memuat data presensi: " + (result.message || "Unknown error"));
                // Propagate the error so the .then() in the load handler doesn't execute
                throw new Error("Server response status not 'success'");
            }
        })
        .catch(error => {
            console.error("Error loading attendance data:", error);
            alert("Terjadi kesalahan saat memuat data presensi. Silakan coba lagi.");
            // Re-throw the error to ensure the .then() after loadAttendanceFromServer()
            // doesn't proceed if there's an error.
            throw error;
        });
}

// Memperbarui data kehadiran berdasarkan aturan waktu
function updateAttendanceData(data) {
    // Memperbarui data absen datang
    data.datang.forEach((item) => {
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
    data.pulang.forEach((item) => {
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

    return data
}


function mergeAttendanceData() {
    const merged = [];

    attendanceData.datang.forEach(item => {
        merged.push({
            nip: item.nip, // nip might be undefined if not in the original data from server
            date: item.date,
            waktu: item.time,
            status: item.status,
            keterangan: item.note,
            type: "Datang",
            foto_datang: item.foto_datang || null,
            foto_pulang: null
        });
    });

    attendanceData.pulang.forEach(item => {
        merged.push({
            nip: item.nip, // nip might be undefined if not in the original data from server
            date: item.date,
            waktu: item.time,
            status: item.status,
            keterangan: item.note,
            type: "Pulang",
            foto_datang: null,
            foto_pulang: item.foto_pulang || null
        });
    });

    return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderDashboardAttendanceGabungan(limit = 6) {
    const tableBody = document.getElementById("dashboard-attendance-data");
    if (!tableBody) return;

    const combinedData = mergeAttendanceData();
    const slicedData = combinedData.slice(0, limit);

    tableBody.innerHTML = "";
    if (slicedData.length === 0) {
    const noDataRow = document.createElement("tr");
    noDataRow.innerHTML = `
        <td colspan="5" class="px-4 py-3 whitespace-nowrap text-center text-gray-500">
            Belum ada data riwayat presensi
        </td>
    `;
    tableBody.appendChild(noDataRow);
    return; // Exit the function as there's no data to render
}

    slicedData.forEach(item => {
        let fotoPresensi;
        if (item.type === "Datang") {
            fotoPresensi = item.foto_datang ? `img/upload/${item.foto_datang}` : 'img/guru/1.png';
        } else {
            fotoPresensi = item.foto_pulang ? `img/upload/${item.foto_pulang}` : 'img/guru/1.png';
        }

        const row = document.createElement('tr');

        let badgeClass = "success"
        if (item.keterangan === "Terlambat") {
            badgeClass = "danger"
        } else if (item.keterangan === "Absen Tidak Dilakukan") {
            badgeClass = "warning"
        }

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap">
                <img class="h-8 w-8 rounded-full object-cover" src="${fotoPresensi}" alt="Presensi">
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.date}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.waktu}</td>
            <td class="px-4 py-3 whitespace-nowrap text-gray-500">${item.status}</td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="badge ${badgeClass || ''}">${item.keterangan}</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Assuming renderAttendanceData is called to display the initial data
// This function needs to be defined if it's used within loadAttendanceFromServer
function renderAttendanceData() {
    // This function should contain the logic to display the loaded attendanceData
    // For example, if you have another table for separate datang/pulang data, render it here.
    // If it's solely for dashboard-attendance-data, then renderDashboardAttendanceGabungan should be called.
    renderDashboardAttendanceGabungan(3); // Call the dashboard rendering after data is loaded
}


window.addEventListener("load", () => {
    loadAttendanceFromServer().then(() => {
        // The renderDashboardAttendanceGabungan(3) call is now handled inside renderAttendanceData()
        // or you can call it directly here if renderAttendanceData() is not meant to do that.
        // For simplicity and to follow the flow, let's keep it in renderAttendanceData.
        // If renderAttendanceData doesn't exist or is not used for this,
        // then you would call renderDashboardAttendanceGabungan(3) here:
        // renderDashboardAttendanceGabungan(3);
    }).catch(error => {
        console.error("Failed to load and render attendance data on window load:", error);
    });
});