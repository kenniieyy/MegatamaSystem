<?php
session_start();

include "../src/config/config.php";

// Cek apakah user sudah login sebagai guru
if (empty($_SESSION['guru_id']) || empty($_SESSION['nama_guru'])) {
    // Redirect ke halaman login jika belum login
    header("Location: login.html");
    exit();
}
$id_guru = $_SESSION['guru_id'];

$query_guru = mysqli_query($conn, "SELECT * FROM guru WHERE id_guru = '$id_guru'");
$bidang_tugas_guru = mysqli_query($conn, "SELECT * FROM guru_bidang_tugas bidang INNER JOIN bidang_tugas tugas ON bidang.id_bidang = tugas.id_bidang WHERE bidang.id_guru = '$id_guru'");
$profil_guru = mysqli_fetch_assoc($query_guru);
$bidang_guru = mysqli_fetch_assoc($bidang_tugas_guru);
$gender = $profil_guru['gender'];
$nip = $profil_guru['ID'];
$status = $profil_guru['status'];
$bidang_tugas = $bidang_guru['nama_bidang'];


include "layout/header.php";

?>
<!-- Konten Halaman -->
<main class="p-4 bg-pattern">
    <div class="max-w-3xl mx-auto">
        <!-- Card Pengaturan Profil -->
        <div class="card mb-4">
            <div class="card-header">
                <h3 class="text-lg font-medium text-gray-800">Informasi Profil</h3>
                <p class="text-sm text-gray-500 mt-1">Perubahan yang Anda lakukan akan otomatis diperbarui di
                    sistem admin TU</p>
            </div>
            <div class="p-6">
                <form id="profile-form">
                    <!-- Foto Profil -->
                    <div class="flex flex-col items-center mb-6">
                        <div class="profile-photo-container">
                            <img src="../src/img/guru/<?= $foto ?>" alt="Profile photo"
                                class="profile-photo">
                            <label for="photo-upload" class="photo-upload-btn">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </label>
                            <input type="file" id="photo-upload" name="foto_profil" class="hidden" accept="image/*">
                        </div>
                        <div class="text-center">
                            <h4 class="text-lg font-medium text-gray-800"><?= $nama ?></h4>
                            <p class="text-sm text-gray-500">Guru <?= $bidang_tugas ?></p>
                        </div>
                    </div>


                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <!-- Nama Lengkap -->
                        <div>
                            <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Nama
                                Lengkap</label>
                            <input type="text" id="fullname" name="fullname" value="<?php echo ($nama) ?>"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <input type="hidden" name="id_guru" value="<?= $id_guru; ?>">
                        </div>

                        <!-- Jenis Kelamin -->
                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-700 mb-1">Jenis
                                Kelamin</label>
                            <select id="gender" name="gender"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="female" <?= $gender === 'female' ? 'selected' : '' ?>>Perempuan</option>
                                <option value="male" <?= $gender === 'male' ? 'selected' : '' ?>>Laki-laki</option>
                            </select>
                        </div>

                        <!-- NIP -->
                        <div>
                            <label for="id" class="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input type="text" id="id" name="id" value="<?php echo ($nip); ?>"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <!-- <p class="form-hint">Format: 18 digit angka</p> -->
                        </div>

                        <!-- Status -->
                        <div>
                            <label for="status"
                                class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select id="status" name="status"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="active" <?= $status === 'active' ? 'selected' : '' ?>>Aktif</option>
                                <option value="inactive" <?= $status === 'inactive' ? 'selected' : '' ?>>Non Aktif</option>
                                <option value="leave" <?= $status === 'leave' ? 'selected' : '' ?>>Cuti</option>
                            </select>
                        </div>
                    </div>

                    <!-- Mata Pelajaran yang Diajarkan (Combobox) -->
                    <div class="mb-4">
                        <label for="subject-input" class="block text-sm font-medium text-gray-700 mb-1">Bidang Tugas</label>
                        <div class="combobox-container">
                            <input type="text" id="subject-input" class="combobox-input"
                                placeholder="Pilih atau ketik mata pelajaran" autocomplete="off"
                                value="<?= $bidang_tugas ?>">
                            <input type="hidden" id="subject" name="subject" value="<?= $bidang_tugas ?>">
                            <div id="subject-dropdown" class="combobox-dropdown">
                                <div class="combobox-option <?= $bidang_tugas === 'Wali Kelas 7' ? 'selected' : '' ?>" data-value="Wali Kelas 7">Wali Kelas 7</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Wali Kelas 8' ? 'selected' : '' ?>" data-value="Wali Kelas 8">Wali Kelas 8</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Wali Kelas 9' ? 'selected' : '' ?>" data-value="Wali Kelas 9">Wali Kelas 9</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Wali Kelas 10' ? 'selected' : '' ?>" data-value="Wali Kelas 10">Wali Kelas 10</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Wali Kelas 11' ? 'selected' : '' ?>" data-value="Wali Kelas 11">Wali Kelas 11</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Wali Kelas 12' ? 'selected' : '' ?>" data-value="Wali Kelas 12">Wali Kelas 12</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Matematika' ? 'selected' : '' ?>" data-value="Matematika">Matematika</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Matematika Peminatan' ? 'selected' : '' ?>" data-value="Matematika Peminatan">Matematika Peminatan</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Statistika' ? 'selected' : '' ?>" data-value="Statistika">Statistika</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Fisika' ? 'selected' : '' ?>" data-value="Fisika">Fisika</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Kimia' ? 'selected' : '' ?>" data-value="Kimia">Kimia</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Biologi' ? 'selected' : '' ?>" data-value="Biologi">Biologi</div>
                                <div class="combobox-option <?= $bidang_tugas === 'Bahasa Indonesia' ? 'selected' : '' ?>" data-value="Bahasa Indonesia">Bahasa Indonesia
                                </div>
                                <div class="combobox-option" data-value="Bahasa Inggris">Bahasa Inggris</div>
                                <div class="combobox-option" data-value="Sejarah">Sejarah</div>
                                <div class="combobox-option" data-value="Geografi">Geografi</div>
                                <div class="combobox-option" data-value="Ekonomi">Ekonomi</div>
                                <div class="combobox-option" data-value="Sosiologi">Sosiologi</div>
                                <div class="combobox-option" data-value="Pendidikan Agama">Pendidikan Agama
                                </div>
                                <div class="combobox-option" data-value="PPKN">PPKN</div>
                                <div class="combobox-option" data-value="Seni Budaya">Seni Budaya</div>
                                <div class="combobox-option" data-value="Pendidikan Jasmani">Pendidikan Jasmani
                                </div>
                                <div id="add-new-subject" class="combobox-add-option">
                                    Tambahkan "<span id="new-subject-text"></span>"
                                </div>
                            </div>
                        </div>
                        <p class="form-hint">Pilih atau ketik baru bidang tugas yang diampu</p>
                    </div>

                    <!-- Peringatan: Username & Password tidak bisa diubah langsung -->
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-700">
                                    Username dan password hanya dapat diubah oleh admin TU. Silakan hubungi
                                    admin untuk perubahan data akun.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label for="username"
                                        class="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <div class="relative">
                                        <input type="text" id="username" name="username" value="olivia.putri"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            disabled>
                                        <div
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label for="password"
                                        class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div class="relative">
                                        <input type="password" id="password" name="password" value="********"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            disabled>
                                        <div
                                            class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400"
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div> -->

                    <!-- Tombol Subbmit -->
                    <div class="flex justify-end">
                        <button type="submit" class="btn-gradient">Simpan Perubahan</button>
                    </div>
                </form>
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
<script src="js/settings_guru.js"></script>
</body>

</html>