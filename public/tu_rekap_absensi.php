<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rekap Absensi Guru-Yayasan Megatama Jambi</title>
    <link rel="stylesheet" href="css/final.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Animasi untuk toast */
        .toast-enter {
            transform: translateX(100%) translateY(-100%);
            opacity: 0;
        }

        .toast-show {
            transform: translateX(0) translateY(0);
            opacity: 1;
        }

        .toast-exit {
            transform: translateX(100%) translateY(-100%);
            opacity: 0;
        }

        .toast-transition {
            transition: all 0.3s ease-out;
        }

        /* Tab button styling */
        .tab-button {
            background-color: white;
            color: #1e40af;
            border: 1px solid #1e40af;
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s ease-in-out;
            padding: 8px 16px;
        }

        .tab-button:hover {
            background-color: #e0ecff;
        }

        .tab-button.active {
            background: linear-gradient(to right, #1e40af, #3b82f6);
            color: white;
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }

        /* Content spacing */
        .main-content {
            padding-top: 0;
        }

        .content-wrapper {
            padding: 24px;
        }

        /* Export button styling */
        .btn-gradient {
            background: linear-gradient(to right, #1e40af, #3b82f6);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease-in-out;
            box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }

        .btn-gradient:hover {
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
    </style>
</head>

<body class="font-poppins mode-2">
    <!-- Mobile overlay -->
    <div id="overlay" class="overlay"></div>

    <!-- Sidebar -->
    <div id="sidebar" class="sidebar text-white flex flex-col">
        <!-- Logo -->
        <div class="flex items-center p-3 border-b border-blue-800">
            <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                        d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                <h1 class="text-base font-bold ml-3 logo-text">Yayasan Megatama</h1>
            </div>
        </div>

        <!-- Menu -->
        <div class="p-3">
            <p class="text-xs text-blue-300 mb-2 logo-text">Menu</p>
            <nav class="space-y-1">
                <a href="tu_dashboard.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </div>
                    <span class="menu-text">Dashboard</span>
                </a>
                <a href="tu_data_guru.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                    </div>
                    <span class="menu-text">Data Guru</span>
                </a>
                <a href="tu_data_siswa.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <span class="menu-text">Data Siswa</span>
                </a>
                <a href="tu_data_ruangan.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <span class="menu-text">Data Ruangan</span>
                </a>
                <a href="tu_peminjaman_ruangan.php"
                    class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <span class="menu-text">Peminjaman Ruangan</span>
                </a>
                <a href="tu_rekap_absensi.php"
                    class="menu-item active px-3 py-2 text-sm font-medium bg-blue-800 text-white rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span class="menu-text">Rekap Absensi</span>
                </a>
                <a href="tu_settings.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                    <div class="menu-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <span class="menu-text">Settings</span>
                </a>
            </nav>
        </div>
        <!-- Tombol logout di bagian bawah sidebar -->
        <div class="mt-auto p-3 border-t border-blue-800">
            <a href="../src/API/logout.php" class="menu-item px-3 py-2 text-sm font-medium text-blue-200 rounded-md">
                <div class="menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-300" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </div>
                <span class="menu-text">Logout</span>
            </a>
        </div>
    </div>

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
                    <h1 class="ml-3 text-lg font-semibold text-gray-800">Rekap Absensi</h1>
                </div>
                <div class="flex items-center">
                    <div class="flex items-center">
                        <div class="avatar-ring">
                            <img class="h-8 w-8 rounded-full object-cover"
                                src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar">
                        </div>
                        <span class="ml-2 text-sm font-medium text-gray-700">Admin TU 1</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Page Content -->
        <main class="p-6">
            <div class="bg-white rounded-lg shadow-lg border border-gray-200">
                <!-- Filter Header -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <h2 class="text-lg font-semibold text-gray-800">Filter</h2>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <!-- Tipe Absensi -->
                            <select id="tipe"
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                <option value="siswa">Siswa</option>
                                <option value="guru">Guru</option>
                            </select>

                            <!-- Filter bulan -->
                            <select id="month-filter"
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                <option value="semua">Semua Bulan</option>
                                <option value="januari">Januari</option>
                                <option value="februari">Februari</option>
                                <option value="maret">Maret</option>
                                <option value="april" selected>April</option>
                                <option value="mei">Mei</option>
                                <option value="juni">Juni</option>
                                <option value="juli">Juli</option>
                                <option value="agustus">Agustus</option>
                                <option value="september">September</option>
                                <option value="oktober">Oktober</option>
                                <option value="november">November</option>
                                <option value="desember">Desember</option>
                            </select>

                            <!-- Tanggal -->
                            <input type="date" id="tanggal"
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                value="2025-04-01">

                            <!-- Status Kehadiran -->
                            <select id="status"
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                <option value="semua">Semua Status</option>
                                <option value="hadir">Hadir</option>
                                <option value="izin">Izin</option>
                                <option value="sakit">Sakit</option>
                                <option value="alpa">Alpa</option>
                            </select>

                            <!-- Kelas -->
                            <select id="kelas"
                                class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                <option value="semua">Semua</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table Header -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <h2 class="text-lg font-semibold text-gray-800">Tabel Rekap Absensi</h2>
                        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <!-- Search Input -->
                            <div class="relative">
                                <i
                                    class="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                                <input type="text" id="search-name" placeholder="search"
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                            </div>

                            <!-- Tombol filter jenis absensi -->
                            <div class="flex space-x-2">
                                <button id="btn-absen-datang" class="btn-outline active px-3 py-1.5 text-sm">Absen Datang</button>
                                <button id=" btn-absen-pulang" class="btn-outline px-3 py-1.5 text-sm">Absen
                                    Pulang</button>
                            </div>

                            <!-- Tombol Export PDF -->
                            <button id="btn-export-pdf" class="btn-gradient flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                Export
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead id="guru-header" class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Foto</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Waktu</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Keterangan</th>
                            </tr>
                        </thead>
                        <thead id="siswa-header" class="bg-gray-50" style="display:none;">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jenis Kelamin</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIS</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kelas</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status</th>
                            </tr>
                        </thead>
                        <tbody id="attendance-data" class="bg-white divide-y divide-gray-200">
                            <!-- Data akan diisi oleh JavaScript -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div class="text-sm text-gray-500">
                        Menampilkan <span id="currentRange">1-9</span> dari <span id="totalData">24</span> data
                    </div>
                    <div class="flex items-center space-x-2">
                        <button id="prevPage"
                            class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div id="pageNumbers" class="flex space-x-1">
                            <!-- Page numbers akan diisi JavaScript -->
                        </div>
                        <button id="nextPage" class="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Toast Notification -->
    <div id="toast-notification" class="fixed top-4 right-4 z-50 toast-enter toast-transition">
        <div class="bg-white rounded-lg shadow-lg border-l-4 p-4 max-w-sm">
            <div class="flex items-center">
                <div id="toast-icon" class="mr-3"></div>
                <div class="flex-1">
                    <h4 id="toast-title" class="font-semibold text-gray-800"></h4>
                    <p id="toast-message" class="text-sm text-gray-600"></p>
                </div>
                <button id="toast-close" class="ml-2 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js"></script>
    <script src="js/tu_rekap_absensi.js"></script>
</body>

</html>