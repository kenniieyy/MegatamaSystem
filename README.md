# Megatama Sistem Informasi Presensi dan Peminjaman Ruangan

Megatama adalah aplikasi web yang dirancang untuk mengelola presensi (kehadiran) dan peminjaman ruangan di Yayasan Megatama Jambi. Proyek ini bertujuan untuk menyediakan platform terpusat dan efisien untuk memfasilitasi pencatatan kehadiran karyawan/anggota serta pengelolaan jadwal dan status peminjaman ruangan.

---

## Fitur

* **Manajemen Presensi:**
    * Pencatatan kehadiran (check-in/check-out) secara digital.
    * Lihat riwayat presensi individu atau keseluruhan.
    * Laporan presensi berdasarkan periode waktu.
* **Manajemen Peminjaman Ruangan:**
    * Pengajuan peminjaman ruangan oleh pengguna.
    * Persetujuan/penolakan peminjaman oleh administrator.
    * Tampilan ketersediaan ruangan (kalender atau daftar).
    * Riwayat peminjaman ruangan.
* **Manajemen Pengguna:**
    * Pendaftaran dan pengelolaan akun pengguna (karyawan/anggota, administrator).
    * Manajemen hak akses berdasarkan peran pengguna.
* **Antarmuka Ramah Pengguna:** Antarmuka yang intuitif dan bersih memudahkan pengguna untuk melakukan presensi dan mengajukan/mengelola peminjaman ruangan.
* **Desain Responsif:** Nikmati pengalaman yang mulus di berbagai perangkat, dari desktop hingga ponsel.

---

## Teknologi yang Digunakan

* **Frontend:** HTML, CSS, JavaScript (kemungkinan menggunakan framework/library seperti Bootstrap untuk responsif).
* **Backend:** PHP (kemungkinan dengan framework seperti Laravel, mengingat struktur umum folder pada proyek web modern).
* **Basis Data:** MySQL.

---

## Memulai

Untuk mendapatkan salinan Megatama dan menjalankannya di mesin lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat

Pastikan Anda telah menginstal hal-hal berikut:

* **PHP** (Versi yang kompatibel dengan proyek, disarankan 7.4+ atau 8.x)
* **Composer** (jika menggunakan framework PHP seperti Laravel)
* **MySQL** (atau sistem basis data lain yang didukung)
* **Server Web** (misal Apache, Nginx, atau server pengembangan bawaan PHP/framework)

### Instalasi

1.  **Kloning repositori:**

    ```bash
    git clone [https://github.com/kenniieyy/MegatamaSystem.git](https://github.com/kenniieyy/MegatamaSystem.git)
    ```

2.  **Masuk ke direktori proyek:**

    ```bash
    cd MegatamaSystem
    ```

3.  **Instal dependensi (jika menggunakan Composer/Laravel):**

    ```bash
    composer install
    ```

    *Jika tidak menggunakan Composer/Laravel, langkah ini mungkin tidak diperlukan atau perlu disesuaikan dengan dependensi proyek.*

4.  **Pengaturan Basis Data:**

    * Buat basis data MySQL baru (misal: `megatamasystem_db`).
    * Impor file SQL yang disediakan (cari file `.sql` di folder `database/` atau di root proyek, misalnya `database.sql` atau `megatama.sql`) ke dalam basis data baru Anda.
    * **Contoh perintah impor (dari terminal/CMD):**
        ```bash
        mysql -u your_username -p your_database_name < path/to/your_sql_file.sql
        ```
        *Ganti `your_username`, `your_database_name`, dan `path/to/your_sql_file.sql` sesuai dengan konfigurasi Anda.*

5.  **Konfigurasi Koneksi Basis Data:**

    * Cari file konfigurasi basis data di proyek Anda (misalnya `config/database.php` jika Laravel, atau `includes/db_config.php`, `config.php` di proyek PHP native).
    * Buka file tersebut dan perbarui detail koneksi basis data (nama basis data, nama pengguna, kata sandi, host) agar sesuai dengan setup MySQL Anda.

6.  **Jalankan Aplikasi:**

    * Tempatkan direktori proyek di dalam root dokumen server web Anda (misal, `htdocs` untuk Apache, `www` untuk Nginx).
    * Akses aplikasi di browser web Anda, biasanya di `http://localhost/MegatamaSystem` (sesuaikan nama folder jika berbeda).
    * Jika menggunakan server pengembangan PHP (misalnya `php artisan serve` untuk Laravel):
        ```bash
        php artisan serve
        ```
        Akses di `http://127.0.0.1:8000`.

---

## Penggunaan

Setelah terinstal, pengguna dapat login dan mulai menggunakan fitur presensi atau mengajukan peminjaman ruangan. Administrator dapat mengelola data pengguna, ruangan, melihat laporan presensi, dan menyetujui/menolak peminjaman.

---

## Berkontribusi

Kontribusi sangat disambut baik! Jika Anda ingin meningkatkan Megatama Sistem Informasi Presensi dan Peminjaman Ruangan, silakan ikuti langkah-langkah berikut:

1.  Fork repositori ini.
2.  Buat branch baru (`git checkout -b feature/nama-fitur-anda`).
3.  Lakukan perubahan Anda.
4.  Commit perubahan Anda (`git commit -m 'Tambahkan beberapa fitur'`).
5.  Push ke branch (`git push origin feature/nama-fitur-anda`).
6.  Buka Pull Request.

---

## Lisensi

Proyek ini dilisensikan di bawah **Lisensi MIT** - lihat file `LICENSE` (jika ada) untuk detailnya.

---

## Kontak

Jika Anda memiliki pertanyaan atau saran, jangan ragu untuk membuka *issue* di GitHub atau menghubungi pengembang melalui platform GitHub.

---
