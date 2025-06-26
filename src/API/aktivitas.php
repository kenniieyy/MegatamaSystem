<?php if ($result->num_rows === 0): ?>
    <div class="text-center text-sm text-gray-500 py-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mx-auto mb-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9.75 9.75h.008v.008H9.75V9.75zM14.25 9.75h.008v.008H14.25V9.75zM8.625 
                  15.75a6.375 6.375 0 0112.75 0m-14.625.75h14.25a2.25 2.25 
                  0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H5.625A2.25 2.25 
                  0 003.375 6.75v7.5a2.25 2.25 0 002.25 2.25z" />
        </svg>
        Belum ada aktivitas
    </div>
<?php else: ?>
    <?php while ($row = $result->fetch_assoc()): ?>
        <?php
        $tipe = $row['tipe'];

        // Konfigurasi tampilan dan ikon berdasarkan tipe
        if ($tipe === 'datang') {
            $bgColor = 'bg-blue-100';
            $iconColor = 'text-blue-500';
            $icon = '
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                     </svg>';
        } elseif ($tipe === 'pulang') {
            $bgColor = 'bg-green-100';
            $iconColor = 'text-green-500';
            $icon = '
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                             d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                     </svg>';
        } elseif ($tipe === 'edit') { // New condition for profile edit
            $bgColor = 'bg-yellow-100'; // Or any color you prefer for edit notifications
            $iconColor = 'text-yellow-700'; // Or any color you prefer for edit notifications
            $icon = '
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-yellow-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>';
        } else { // Default case for 'Input Absensi' or other types
            $bgColor = 'bg-blue-100';
            $iconColor = 'text-gray-600';
            $icon = '
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-primary" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                         <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                         <path
                                             d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                                     </svg>';
        }

        // Format waktu
        $waktu = strtotime($row['waktu']);
        $jam = date('H:i:s', $waktu);
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
        <div class="activity-item p-2 flex items-start rounded-lg bg-gray-50">
            <div class="w-8 h-8 rounded-full <?= $bgColor ?> flex items-center justify-center mr-2 flex-shrink-0">
                <?= $icon ?>
            </div>
            <div>
                <p class="text-sm font-medium text-gray-800"><?= htmlspecialchars($row['judul']) ?></p>
                <p class="text-xs text-gray-500"><?= $labelWaktu ?></p>
            </div>
        </div>
    <?php endwhile; ?>
<?php endif; ?>