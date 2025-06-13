<?php
include "config/config.php";
session_start();

// Cek apakah user sudah login sebagai guru
if (empty($_SESSION['guru_id']) || empty($_SESSION['nama_guru']) || empty($_SESSION['nip'])) {
    // Redirect ke halaman login jika belum login
    header("Location: login.html");
    exit();
}


$nama = $_SESSION['nama_guru'];
$id_guru = $_SESSION['guru_id'];
$nip = $_SESSION['nip'];
$tanggal = date('Y-m-d');

include "proses/chart_guru.php";

$query = mysqli_query($conn, "SELECT * FROM absen_guru WHERE id_guru = '$id_guru' AND tanggal = '$tanggal'");
$query1 = "SELECT * FROM aktivitas WHERE id_guru = '$id_guru' ORDER BY waktu DESC LIMIT 5";
$data_absen = mysqli_fetch_assoc($query);
$result = $conn->query($query1);

$status_datang = "Belum Absen Datang";
$status_pulang = "Belum Absen Pulang";

if ($data_absen) {
    if (!empty($data_absen['jam_datang'])) {
        $status_datang = "Sudah Absen Datang";
    }
    if (!empty($data_absen['jam_pulang'])) {
        $status_pulang = "Sudah Absen Pulang";
    }
}

include "layout/header.php";

?>
    <!-- Page Content -->
    <main class="p-4 bg-pattern">
        <!-- Welcome Message -->
        <div class="welcome-card">
            <h2>Welcome Back, <?php
                                $nama_depan = explode(',', $nama)[0];
                                $nama_depan = trim($nama_depan);
                                echo ($nama_depan)
                                ?> 👋</h2>
        </div>

        <!-- Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <!-- Status Card 1 -->
            <div class="card card-gradient-top p-3">
                <div class="flex items-center justify-between mb-1">
                    <h3 class="text-sm font-medium text-gray-500">Status Hari Ini</h3>
                </div>
                <div class="flex items-center">
                    <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M4 2a2 2 0 0 0-2 2v4h2V4h4V2H4zm16 0h-4v2h4v4h2V4a2 2 0 0 0-2-2zM4 18H2v4a2 2 0 0 0 2 2h4v-2H4v-4zm16 0v4h-4v2h4a2 2 0 0 0 2-2v-4h-2zM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-800"><?php echo $status_datang; ?></p>
                    </div>
                </div>
            </div>

            <!-- Status Card 2 -->
            <div class="card card-gradient-top success p-3">
                <div class="flex items-center justify-between mb-1">
                    <h3 class="text-sm font-medium text-gray-500">Status Hari Ini</h3>
                </div>
                <div class="flex items-center">
                    <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-success" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M4 2a2 2 0 0 0-2 2v4h2V4h4V2H4zm16 0h-4v2h4v4h2V4a2 2 0 0 0-2-2zM4 18H2v4a2 2 0 0 0 2 2h4v-2H4v-4zm16 0v4h-4v2h4a2 2 0 0 0 2-2v-4h-2zM12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-bold text-gray-800"><?php echo $status_pulang; ?></p>
                    </div>
                </div>
            </div>

            <!-- Status Card 3 -->
            <div class="card card-gradient-top warning p-3">
                <div class="flex items-center justify-between mb-1">
                    <h3 class="text-sm font-medium text-gray-500">Kehadiran Bulan Ini</h3>
                </div>
                <div class="flex items-center">
                    <div class="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p id="attendance-count" class="text-2xl font-bold text-gray-800">-- <span
                                class="text-sm text-gray-500 font-normal">/ -- hari</span></p>
                    </div>
                </div>
            </div>

            <!-- Status Card 4 -->
            <!-- <div class="card card-gradient-top danger p-3">
                    <div class="flex items-center justify-between mb-1">
                        <h3 class="text-sm font-medium text-gray-500">Kelas Terabsen Hari Ini</h3>
                    </div>
                    <div class="flex items-center">
                        <div class="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-danger" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path
                                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                        </div>
                        <div>
                            <p class="text-2xl font-bold text-gray-800">3 <span
                                    class="text-sm text-gray-500 font-normal">Kelas</span></p>
                        </div>
                    </div>
                </div> -->
        </div>

        <!-- Persentase Kehadiran dan Aktivitas Terbaru -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
            <!-- Persentase Kehadiran -->
            <div class="lg:col-span-2 card">
                <div class="card-header flex items-center justify-between">
                    <h3 class="text-base font-medium text-gray-700">Persentase Kehadiran</h3>
                    <div class="flex space-x-2">
                        <select id="chart-filter"
                            class="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                            <option value="1" <?= $bulan == 1 ? 'selected' : '' ?>>Januari</option>
                            <option value="2" <?= $bulan == 2 ? 'selected' : '' ?>>Februari</option>
                            <option value="3" <?= $bulan == 3 ? 'selected' : '' ?>>Maret</option>
                            <option value="4" <?= $bulan == 4 ? 'selected' : '' ?>>April</option>
                            <option value="5" <?= $bulan == 5 ? 'selected' : '' ?>>Mei</option>
                            <option value="6" <?= $bulan == 6 ? 'selected' : '' ?>>Juni</option>
                            <option value="7" <?= $bulan == 7 ? 'selected' : '' ?>>Juli</option>
                            <option value="8" <?= $bulan == 8 ? 'selected' : '' ?>>Agustus</option>
                            <option value="9" <?= $bulan == 9 ? 'selected' : '' ?>>September</option>
                            <option value="10" <?= $bulan == 10 ? 'selected' : '' ?>>Oktober</option>
                            <option value="11" <?= $bulan == 11 ? 'selected' : '' ?>>November</option>
                            <option value="12" <?= $bulan == 12 ? 'selected' : '' ?>>Desember</option>
                        </select>
                        <div class="flex space-x-1">
                            <button id="tab-datang" class="tab-button active">Absen Datang</button>
                            <button id="tab-pulang" class="tab-button">Absen Pulang</button>
                        </div>
                    </div>
                </div>
                <div class="p-3">
                    <div class="charts-wrapper">
                        <!-- Tab content for Absen Datang -->
                        <div id="content-datang" class="tab-content active w-full">
                            <div class="chart-container">
                                <canvas id="chart-datang"></canvas>
                            </div>
                        </div>

                        <!-- Tab content for Absen Pulang -->
                        <div id="content-pulang" class="tab-content w-full">
                            <div class="chart-container">
                                <canvas id="chart-pulang"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Aktivitas Terbaru -->
            <div class="card">
                <div class="card-header flex items-center justify-between">
                    <h3 class="text-base font-medium text-gray-700">Aktivitas Terbaru</h3>
                </div>
                <div class="p-3">
                    <div class="space-y-2">
                        <?php include "proses/aktivitas.php" ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Riwayat Presensi -->
        <div class="card mb-4">
            <div class="card-header flex items-center justify-between">
                <h3 class="text-base font-medium text-gray-700">Tabel Riwayat Presensi</h3>
                <a href="riwayat_presensi_guru.php" class="btn-gradient">Lihat Detail</a>
            </div>
            <div class="p-3">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="table-header text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th class="px-4 py-3 text-left">Foto</th>
                                <th class="px-4 py-3 text-left">Tanggal</th>
                                <th class="px-4 py-3 text-left">Waktu</th>
                                <th class="px-4 py-3 text-left">Status</th>
                                <th class="px-4 py-3 text-left">Keterangan</th>
                            </tr>
                        </thead>

                        <tbody id="dashboard-attendance-data" class="bg-white divide-y divide-gray-200 text-sm"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>
<script src="js/dashboard_guru.js"></script>
<script src="js/riwayat.js"></script>
</body>
<script>
    fetch('proses/kehadiran_guru.php')
        .then(response => response.json())
        .then(data => {
            document.getElementById('attendance-count').innerHTML =
                `${data.hadir} <span class="text-sm text-gray-500 font-normal">/ ${data.total} hari</span>`;
        })
        .catch(error => {
            console.error('Gagal ambil data kehadiran:', error);
        });
</script>
<script>
    function filterByMonth(bulan) {
        const url = new URL(window.location.href);
        url.searchParams.set('bulan', bulan);
        window.location.href = url.toString();
    }
</script>
</body>

</html>