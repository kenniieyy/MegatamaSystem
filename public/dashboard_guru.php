<?php
include "config/config.php";
session_start();

if (!isset($_SESSION['guru_id'])) {
    header("Location: login.html");
    exit();
}

$nama = $_SESSION['nama_guru'];
$id_guru = $_SESSION['guru_id'];
$tanggal = date('Y-m-d');

include "proses/chart_guru.php";

$query = mysqli_query($conn, "SELECT * FROM absen_guru WHERE id_guru = '$id_guru' AND tanggal = '$tanggal'");
$query_guru = mysqli_query($conn, "SELECT * FROM guru WHERE id_guru = '$id_guru'");
$query1 = "SELECT * FROM aktivitas WHERE id_guru = '$id_guru' ORDER BY waktu DESC LIMIT 5";
$data_absen = mysqli_fetch_assoc($query);
$profil_guru = mysqli_fetch_assoc($query_guru);
$result = $conn->query($query1);

$default_foto = '1.png';
$foto = $default_foto;

if (!empty($profil_guru) && !empty($profil_guru['foto_profil'])) {
    $file_path = 'img/guru/' . $profil_guru['foto_profil'];
    if (file_exists($file_path)) {
        $foto = htmlspecialchars($profil_guru['foto_profil']);
    }
}


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

<!-- Main Content -->
<div id="main-content" class="main-content">
    <!-- Top Navigation -->
    <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-5 py-2 flex items-center justify-between">
            <div class="flex items-center">
                <button id="toggle-sidebar"
                    class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                </button>
                <h1 class="ml-3 text-lg font-semibold text-gray-800">Dashboard</h1>
            </div>
            <div class="flex items-center">
                <div class="flex items-center">
                    <div class="avatar-ring">
                        <img class="h-8 w-8 rounded-full object-cover"
                            src="img/guru/<?= $foto ?>" alt="User avatar">
                    </div>
                    <span class="ml-2 text-sm font-medium text-gray-700"><?php echo ($nama) ?></span>
                </div>
            </div>
        </div>
    </header>

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
                        <p class="text-sm text-gray-600"><?php echo $status_datang; ?></p>
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
                        <p class="text-sm text-gray-600"><?php echo $status_pulang; ?></p>
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
                        <?php while ($row = $result->fetch_assoc()): ?>
                            <?php
                            $tipe = $row['tipe'];

                            // Warna dan ikon sesuai tipe
                            if ($tipe === 'datang') {
                                $bgColor = 'bg-blue-100 ';
                                $iconColor = 'text-blue-600';
                            } elseif ($tipe === 'pulang') {
                                $bgColor = 'bg-green-100';
                                $iconColor = 'text-green-600';
                            } else {
                                $bgColor = 'bg-gray-100';
                                $iconColor = 'text-gray-600';
                            }

                            // Icon lonceng SVG
                            $icon = '
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ' . $iconColor . '" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>';

                            // Format waktu
                            $waktu = strtotime($row['waktu']);
                            $jam = date('H:i:s', $waktu);

                            // Tentukan apakah "Hari ini", "Kemarin", atau tanggal
                            $hariIni = date('Y-m-d');
                            $kemarin = date('Y-m-d', strtotime('-1 day'));
                            $tanggalPresensi = date('Y-m-d', $waktu);

                            if ($tanggalPresensi === $hariIni) {
                                $labelWaktu = "Hari ini, $jam WIB";
                            } elseif ($tanggalPresensi === $kemarin) {
                                $labelWaktu = "Kemarin, $jam WIB";
                            } else {
                                $labelWaktu = date('d M Y, H:i:s', $waktu) . ' WIB';
                            }
                            ?>
                            <div class="activity-item p-3 flex items-start rounded-lg bg-gray-50 mb-2">
                                <div class="w-8 h-8 rounded-full <?= $bgColor ?> flex items-center justify-center mr-2 flex-shrink-0">
                                    <?= $icon ?>
                                </div>
                                <div>
                                    <p class="text-sm font-semibold text-gray-800"><?= htmlspecialchars($row['judul']) ?></p>
                                    <p class="text-xs text-gray-500"><?= $labelWaktu ?></p>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tabel Riwayat Presensi -->
        <div class="card mb-4">
            <div class="card-header flex items-center justify-between">
                <h3 class="text-base font-medium text-gray-700">Tabel Riwayat Presensi</h3>
                <a href="riwayat_presensi_guru.html" class="btn-gradient">Lihat Detail</a>
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

</html>
</html>