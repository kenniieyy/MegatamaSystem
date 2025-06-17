-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 16 Jun 2025 pada 15.26
-- Versi server: 10.11.11-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `revisi_ppsi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `absen`
--

CREATE TABLE `absen` (
  `id_absen` int(11) NOT NULL,
  `id_guru` int(11) NOT NULL,
  `kelas` varchar(10) DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `jam_mulai` time DEFAULT NULL,
  `jam_selesai` time DEFAULT NULL,
  `dibuat_pada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `absen`
--

INSERT INTO `absen` (`id_absen`, `id_guru`, `kelas`, `tanggal`, `jam_mulai`, `jam_selesai`, `dibuat_pada`) VALUES
(40, 411, '8', '2025-05-21', '12:00:00', '13:00:00', '2025-05-21 15:28:43'),
(41, 411, '9', '2025-06-15', '12:00:00', '13:00:00', '2025-06-15 16:06:45'),
(42, 411, '9', '2025-06-15', '12:00:00', '13:00:00', '2025-06-15 16:15:50'),
(43, 411, '9', '2025-06-15', '12:00:00', '13:00:00', '2025-06-15 16:20:39');

-- --------------------------------------------------------

--
-- Struktur dari tabel `absen_guru`
--

CREATE TABLE `absen_guru` (
  `id_absen_guru` int(11) NOT NULL,
  `id_guru` int(11) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `jam_datang` time DEFAULT NULL,
  `jam_pulang` time DEFAULT NULL,
  `foto_datang` varchar(255) DEFAULT NULL,
  `foto_pulang` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `absen_guru`
--

INSERT INTO `absen_guru` (`id_absen_guru`, `id_guru`, `tanggal`, `jam_datang`, `jam_pulang`, `foto_datang`, `foto_pulang`) VALUES
(37, 411, '2025-06-12', '08:15:07', '15:16:22', 'presensi__1749687307.png', 'presensi__1749712582.png'),
(58, 411, '2025-06-01', '07:15:00', '15:10:00', 'foto_datang_1.jpg', 'foto_pulang_1.jpg'),
(59, 411, '2025-06-01', '07:22:00', '15:00:00', 'foto_datang_2.jpg', 'foto_pulang_2.jpg'),
(60, 411, '2025-06-02', '07:10:00', '15:20:00', 'foto_datang_3.jpg', 'foto_pulang_3.jpg'),
(61, 411, '2025-06-02', '07:05:00', '14:55:00', 'foto_datang_4.jpg', 'foto_pulang_4.jpg'),
(62, 411, '2025-06-03', '07:30:00', '15:05:00', 'foto_datang_5.jpg', 'foto_pulang_5.jpg'),
(63, 411, '2025-06-03', '07:12:00', '15:15:00', 'foto_datang_6.jpg', 'foto_pulang_6.jpg'),
(64, 411, '2025-06-04', '07:00:00', '15:25:00', 'foto_datang_7.jpg', 'foto_pulang_7.jpg'),
(65, 411, '2025-06-04', '07:18:00', '15:08:00', 'foto_datang_8.jpg', 'foto_pulang_8.jpg'),
(66, 411, '2025-06-05', '07:25:00', '14:50:00', 'foto_datang_9.jpg', 'foto_pulang_9.jpg'),
(67, 411, '2025-06-05', '07:14:00', '15:18:00', 'foto_datang_10.jpg', 'foto_pulang_10.jpg'),
(68, 411, '2025-06-06', '07:11:00', '15:22:00', 'foto_datang_11.jpg', 'foto_pulang_11.jpg'),
(69, 411, '2025-06-06', '07:08:00', '14:59:00', 'foto_datang_12.jpg', 'foto_pulang_12.jpg'),
(70, 411, '2025-06-07', '07:20:00', '15:12:00', 'foto_datang_13.jpg', 'foto_pulang_13.jpg'),
(71, 411, '2025-06-07', '07:16:00', '15:17:00', 'foto_datang_14.jpg', 'foto_pulang_14.jpg'),
(72, 411, '2025-06-08', '07:23:00', '15:03:00', 'foto_datang_15.jpg', 'foto_pulang_15.jpg'),
(73, 411, '2025-06-08', '07:09:00', '15:00:00', 'foto_datang_16.jpg', 'foto_pulang_16.jpg'),
(74, 411, '2025-06-09', '07:02:00', '15:26:00', 'foto_datang_17.jpg', 'foto_pulang_17.jpg'),
(75, 411, '2025-06-09', '07:28:00', '15:04:00', 'foto_datang_18.jpg', 'foto_pulang_18.jpg'),
(76, 411, '2025-06-10', '07:13:00', '14:45:00', 'foto_datang_19.jpg', 'foto_pulang_19.jpg'),
(77, 411, '2025-06-10', '07:06:00', '15:11:00', 'foto_datang_20.jpg', 'foto_pulang_20.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `absen_siswa`
--

CREATE TABLE `absen_siswa` (
  `id_absen_siswa` int(11) NOT NULL,
  `id_absen` int(11) DEFAULT NULL,
  `nis` varchar(20) DEFAULT NULL,
  `status` enum('hadir','sakit','izin','alpa') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `absen_siswa`
--

INSERT INTO `absen_siswa` (`id_absen_siswa`, `id_absen`, `nis`, `status`) VALUES
(292, 43, '7001', 'hadir'),
(293, 43, '7002', 'hadir'),
(294, 43, '7003', 'hadir'),
(295, 43, '8001', 'hadir'),
(296, 43, '8002', 'hadir'),
(297, 43, '8003', 'hadir'),
(298, 43, '8004', 'hadir'),
(299, 43, '8005', 'hadir'),
(300, 43, '8006', 'hadir'),
(301, 43, '8007', 'hadir'),
(302, 43, '8008', 'hadir'),
(303, 43, '8009', 'hadir'),
(304, 43, '8010', 'hadir'),
(305, 43, '9001', 'hadir'),
(306, 43, '9002', 'hadir'),
(307, 43, '9003', 'hadir'),
(308, 43, '9004', 'hadir'),
(309, 43, '9005', 'hadir'),
(310, 43, '9006', 'hadir'),
(311, 43, '9007', 'hadir'),
(312, 43, '9008', 'hadir'),
(313, 43, '9009', 'hadir'),
(314, 43, '9010', 'hadir');

-- --------------------------------------------------------

--
-- Struktur dari tabel `aktivitas`
--

CREATE TABLE `aktivitas` (
  `id` int(11) NOT NULL,
  `id_guru` int(11) NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `tipe` enum('datang','pulang','absensi','edit') NOT NULL,
  `waktu` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `aktivitas`
--

INSERT INTO `aktivitas` (`id`, `id_guru`, `judul`, `tipe`, `waktu`) VALUES
(1, 411, 'Presensi datang berhasil', 'datang', '2025-06-13 14:42:28'),
(2, 411, 'Presensi pulang berhasil', 'pulang', '2025-06-13 14:42:28'),
(3, 411, 'edit profil', 'edit', '2025-06-13 14:46:05'),
(4, 411, 'Melakukan absensi kelas 8', 'absensi', '2025-06-13 15:59:40'),
(64, 411, 'Input Absensi Kelas 9', 'absensi', '2025-06-15 16:20:39');

-- --------------------------------------------------------

--
-- Struktur dari tabel `bidang_tugas`
--

CREATE TABLE `bidang_tugas` (
  `id_bidang` int(11) NOT NULL,
  `nama_bidang` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bidang_tugas`
--

INSERT INTO `bidang_tugas` (`id_bidang`, `nama_bidang`) VALUES
(13, 'Bahasa Indonesia'),
(14, 'Bahasa Inggris'),
(12, 'Biologi'),
(17, 'Ekonomi'),
(10, 'Fisika'),
(16, 'Geografi'),
(11, 'Kimia'),
(7, 'Matematika'),
(8, 'Matematika Peminatan'),
(19, 'Pendidikan Agama'),
(22, 'Pendidikan Jasmani'),
(20, 'PPKN'),
(15, 'Sejarah'),
(21, 'Seni Budaya'),
(18, 'Sosiologi'),
(9, 'Statistika'),
(4, 'Wali Kelas 10'),
(5, 'Wali Kelas 11'),
(6, 'Wali Kelas 12'),
(1, 'Wali Kelas 7'),
(2, 'Wali Kelas 8'),
(3, 'Wali Kelas 9');

-- --------------------------------------------------------

--
-- Struktur dari tabel `guru`
--

CREATE TABLE `guru` (
  `id_guru` int(11) NOT NULL,
  `ID` varchar(20) NOT NULL,
  `nama_guru` varchar(100) NOT NULL,
  `gender` enum('male','female','','') NOT NULL,
  `status` enum('active','inactive','leave') NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto_profil` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `guru`
--

INSERT INTO `guru` (`id_guru`, `ID`, `nama_guru`, `gender`, `status`, `password`, `foto_profil`) VALUES
(1, '197201231995011002', 'Efrizal, S.P., M.Si.', 'female', 'active', 'admin123', ''),
(2, '197605212009121002', 'Syamsul Rizal, S.H., M.H.', '', '', 'admin123', ''),
(3, '198511212009121009', 'Ahmed Riza Fahlevi, S.H.', 'male', 'active', 'admin123', '198511212009121009.JPG'),
(4, '195907271987011002', 'Prof. Dr. Afrizal, S.E.,M.Si.,Ak.', '', '', 'admin123', ''),
(411, '221220640', 'Muh Arsyad Ramsi, S.Kom., M.Kom. M.Sc.', 'female', 'inactive', 'anca', '221220640.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `guru_bidang_tugas`
--

CREATE TABLE `guru_bidang_tugas` (
  `id` int(11) NOT NULL,
  `id_guru` int(11) NOT NULL,
  `id_bidang` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `guru_bidang_tugas`
--

INSERT INTO `guru_bidang_tugas` (`id`, `id_guru`, `id_bidang`) VALUES
(19, 1, 3),
(46, 3, 1),
(180, 411, 3);

-- --------------------------------------------------------

--
-- Struktur dari tabel `guru_mapel`
--

CREATE TABLE `guru_mapel` (
  `id` int(11) NOT NULL,
  `id_guru` int(11) DEFAULT NULL,
  `id_mapel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `mapel`
--

CREATE TABLE `mapel` (
  `id_mapel` int(11) NOT NULL,
  `nama_mapel` varchar(100) NOT NULL,
  `jenjang` enum('SMP','SMA') NOT NULL,
  `kelas` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `mapel`
--

INSERT INTO `mapel` (`id_mapel`, `nama_mapel`, `jenjang`, `kelas`) VALUES
(1, 'Agama Islam', 'SMA', '10'),
(2, 'Agama Islam', 'SMA', '11'),
(3, 'Agama Islam', 'SMA', '12'),
(4, 'Matematika', 'SMP', '7'),
(5, 'Matematika', 'SMP', '8'),
(6, 'Matematika', 'SMP', '9');

-- --------------------------------------------------------

--
-- Struktur dari tabel `operator`
--

CREATE TABLE `operator` (
  `id_operator` int(11) NOT NULL,
  `nama_operator` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('SMP','SMA','PERPUSTAKAAN') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `operator`
--

INSERT INTO `operator` (`id_operator`, `nama_operator`, `username`, `password`, `role`) VALUES
(1, 'OPRATOR.1', 'ADMIN.1', 'ADMIN123', 'SMA'),
(2, 'OPERATOR.2', 'ADMIN.2', 'ADMIN234', 'SMP'),
(3, 'OPERATOR.3', 'ADMIN.3', 'ADMIN345', 'SMA');

-- --------------------------------------------------------

--
-- Struktur dari tabel `peminjaman_ruangan`
--

CREATE TABLE `peminjaman_ruangan` (
  `id` int(11) NOT NULL,
  `nama_lengkap` varchar(100) DEFAULT NULL,
  `nis` varchar(20) DEFAULT NULL,
  `kelas` varchar(10) DEFAULT NULL,
  `no_telepon` varchar(20) DEFAULT NULL,
  `jenis_ruangan` varchar(50) DEFAULT NULL,
  `tanggal_peminjaman` date DEFAULT NULL,
  `deskripsi_kegiatan` text DEFAULT NULL,
  `jam_mulai` time DEFAULT NULL,
  `jam_selesai` time DEFAULT NULL,
  `penanggung_jawab` varchar(100) DEFAULT NULL,
  `status` enum('upcoming','ongoing','completed') DEFAULT 'upcoming',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `siswa`
--

CREATE TABLE `siswa` (
  `nis` varchar(20) NOT NULL,
  `nama_siswa` varchar(100) NOT NULL,
  `jenis_kelamin` enum('L','P','','') NOT NULL,
  `kelas` varchar(10) NOT NULL,
  `no_hp` varchar(25) NOT NULL,
  `status_siswa` varchar(20) DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `siswa`
--

INSERT INTO `siswa` (`nis`, `nama_siswa`, `jenis_kelamin`, `kelas`, `no_hp`, `status_siswa`) VALUES
('10001', 'Dimas Anggara', 'L', '10', '0', 'pending'),
('10002', 'Erni Wijayanti', 'P', '10', '0', 'pending'),
('10003', 'Faisal Rahman', 'L', '10', '0', 'pending'),
('10004', 'Gina Salsabila', 'P', '10', '0', 'pending'),
('10005', 'Hendra Gunawan', 'L', '10', '0', 'pending'),
('10006', 'Intan Permatasari', 'P', '10', '0', 'pending'),
('10007', 'Joni Iskandar', 'L', '10', '0', 'pending'),
('10008', 'Kirana Dewi', 'P', '10', '0', 'pending'),
('10009', 'Lutfi Halimawan', 'L', '10', '0', 'pending'),
('10010', 'Mawar Melati', 'P', '10', '0', 'pending'),
('11001', 'Naufal Hidayat', 'L', '12', '0', 'naik_kelas'),
('11002', 'Oktavia Ramadhani', 'P', '11', '0', 'pending'),
('11003', 'Pandu Wibowo', 'L', '11', '0', 'pending'),
('11004', 'Qonita Alya', 'P', '11', '0', 'pending'),
('11005', 'Rizki Ramadhan', 'L', '11', '0', 'pending'),
('11006', 'Sari Indah', 'P', '11', '0', 'pending'),
('11007', 'Tegar Perkasa', 'L', '11', '0', 'pending'),
('11008', 'Umi Fadilah', 'P', '11', '0', 'pending'),
('11009', 'Vino Bastian', 'L', '11', '0', 'pending'),
('11010', 'Wulan Guritno', 'P', '11', '0', 'pending'),
('12001', 'Xaverius Andi', 'L', '12', '0', 'pending'),
('12002', 'Yuliana Sari', 'P', '12', '0', 'pending'),
('12003', 'Zaki Ahmad', 'L', '12', '0', 'pending'),
('12004', 'Anita Permata', 'P', '12', '0', 'pending'),
('12005', 'Bima Sakti', 'L', '12', '0', 'pending'),
('12006', 'Citra Kirana', 'P', '12', '0', 'pending'),
('12007', 'Dodi Sudrajat', 'L', '12', '0', 'pending'),
('12008', 'Eka Putri', 'P', '12', '0', 'pending'),
('12009', 'Farhan Syahputra', 'L', '12', '0', 'pending'),
('12010', 'Gita Gutawa', 'P', '12', '0', 'pending'),
('7001', 'Ahmad Fauzi', 'L', '9', '0822917090778', 'naik_kelas'),
('7002', 'Anisa Putri', 'P', '9', '0822917090778', 'naik_kelas'),
('7003', 'Budi Santoso', 'L', '9', '0822917090778', 'naik_kelas'),
('7004', 'Citra Dewi', 'P', '11', '0822917090778', 'naik_kelas'),
('7005', 'Deni Kurniawan', 'L', '8', '0822917090778', 'naik_kelas'),
('7006', 'Eka Fitriani', 'P', '8', '0822917090778', 'naik_kelas'),
('7007', 'Fajar Ramadhan', 'L', '8', '0822917090778', 'naik_kelas'),
('7008', 'Gita Nuraini', 'P', '8', '00822917090778', 'naik_kelas'),
('7009', 'Hadi Prasetyo', 'L', '8', '0822917090778', 'naik_kelas'),
('7010', 'Indah Permata', 'P', '8', '0822917090778', 'naik_kelas'),
('8001', 'Joko Widodo', 'L', '9', '0822917090778', 'naik_kelas'),
('8002', 'Kartika Sari', 'P', '9', '0822917090778', 'naik_kelas'),
('8003', 'Lukman Hakim', 'L', '9', '0822917090778', 'naik_kelas'),
('8004', 'Mira Lestari', 'P', '9', '0822917090778', 'naik_kelas'),
('8005', 'Nanda Pratama', 'L', '9', '0822917090778', 'naik_kelas'),
('8006', 'Olivia Putri', 'P', '9', '0822917090778', 'naik_kelas'),
('8007', 'Putra Wijaya', 'L', '9', '0822917090778', 'naik_kelas'),
('8008', 'Qori Amalia', 'P', '9', '0822917090778', 'naik_kelas'),
('8009', 'Rendi Saputra', 'L', '9', '0822917090778', 'naik_kelas'),
('8010', 'Sinta Dewi', 'P', '9', '0822917090778', 'naik_kelas'),
('9001', 'Tono Sucipto', 'L', '9', '0822917090778', 'pending'),
('9002', 'Umi Kalsum', 'P', '9', '0822917090778', 'pending'),
('9003', 'Vino Bastian', 'L', '9', '0822917090778', 'pending'),
('9004', 'Wati Susilawati', 'P', '9', '0822917090778', 'pending'),
('9005', 'Xaverius Andi', 'L', '9', '0', 'pending'),
('9006', 'Yanti Komalasari', 'P', '9', '0', 'pending'),
('9007', 'Zaki Firmansyah', 'L', '9', '0', 'pending'),
('9008', 'Amelia Zahra', 'P', '9', '0', 'pending'),
('9009', 'Bayu Segara', 'L', '9', '0', 'pending'),
('9010', 'Cinta Laura', 'P', '9', '0', 'pending');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `absen`
--
ALTER TABLE `absen`
  ADD PRIMARY KEY (`id_absen`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indeks untuk tabel `absen_guru`
--
ALTER TABLE `absen_guru`
  ADD PRIMARY KEY (`id_absen_guru`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indeks untuk tabel `absen_siswa`
--
ALTER TABLE `absen_siswa`
  ADD PRIMARY KEY (`id_absen_siswa`),
  ADD KEY `id_siswa` (`nis`),
  ADD KEY `id_absen` (`id_absen`);

--
-- Indeks untuk tabel `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indeks untuk tabel `bidang_tugas`
--
ALTER TABLE `bidang_tugas`
  ADD PRIMARY KEY (`id_bidang`),
  ADD UNIQUE KEY `nama_bidang` (`nama_bidang`);

--
-- Indeks untuk tabel `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id_guru`),
  ADD UNIQUE KEY `nip` (`ID`);

--
-- Indeks untuk tabel `guru_bidang_tugas`
--
ALTER TABLE `guru_bidang_tugas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_guru` (`id_guru`),
  ADD KEY `id_bidang` (`id_bidang`);

--
-- Indeks untuk tabel `guru_mapel`
--
ALTER TABLE `guru_mapel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_guru` (`id_guru`),
  ADD KEY `id_mapel` (`id_mapel`);

--
-- Indeks untuk tabel `mapel`
--
ALTER TABLE `mapel`
  ADD PRIMARY KEY (`id_mapel`);

--
-- Indeks untuk tabel `operator`
--
ALTER TABLE `operator`
  ADD PRIMARY KEY (`id_operator`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nis` (`nis`);

--
-- Indeks untuk tabel `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`nis`) USING BTREE;

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `absen`
--
ALTER TABLE `absen`
  MODIFY `id_absen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT untuk tabel `absen_guru`
--
ALTER TABLE `absen_guru`
  MODIFY `id_absen_guru` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT untuk tabel `absen_siswa`
--
ALTER TABLE `absen_siswa`
  MODIFY `id_absen_siswa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=315;

--
-- AUTO_INCREMENT untuk tabel `aktivitas`
--
ALTER TABLE `aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT untuk tabel `bidang_tugas`
--
ALTER TABLE `bidang_tugas`
  MODIFY `id_bidang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT untuk tabel `guru`
--
ALTER TABLE `guru`
  MODIFY `id_guru` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=412;

--
-- AUTO_INCREMENT untuk tabel `guru_bidang_tugas`
--
ALTER TABLE `guru_bidang_tugas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT untuk tabel `guru_mapel`
--
ALTER TABLE `guru_mapel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `mapel`
--
ALTER TABLE `mapel`
  MODIFY `id_mapel` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `operator`
--
ALTER TABLE `operator`
  MODIFY `id_operator` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `absen`
--
ALTER TABLE `absen`
  ADD CONSTRAINT `absen_ibfk_1` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id_guru`);

--
-- Ketidakleluasaan untuk tabel `absen_guru`
--
ALTER TABLE `absen_guru`
  ADD CONSTRAINT `absen_guru_ibfk_1` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id_guru`);

--
-- Ketidakleluasaan untuk tabel `absen_siswa`
--
ALTER TABLE `absen_siswa`
  ADD CONSTRAINT `absen_siswa_ibfk_3` FOREIGN KEY (`id_absen`) REFERENCES `absen` (`id_absen`),
  ADD CONSTRAINT `absen_siswa_ibfk_4` FOREIGN KEY (`nis`) REFERENCES `siswa` (`nis`);

--
-- Ketidakleluasaan untuk tabel `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD CONSTRAINT `aktivitas_ibfk_1` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id_guru`);

--
-- Ketidakleluasaan untuk tabel `guru_bidang_tugas`
--
ALTER TABLE `guru_bidang_tugas`
  ADD CONSTRAINT `guru_bidang_tugas_ibfk_1` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id_guru`),
  ADD CONSTRAINT `guru_bidang_tugas_ibfk_2` FOREIGN KEY (`id_bidang`) REFERENCES `bidang_tugas` (`id_bidang`);

--
-- Ketidakleluasaan untuk tabel `guru_mapel`
--
ALTER TABLE `guru_mapel`
  ADD CONSTRAINT `guru_mapel_ibfk_1` FOREIGN KEY (`id_guru`) REFERENCES `guru` (`id_guru`),
  ADD CONSTRAINT `guru_mapel_ibfk_2` FOREIGN KEY (`id_mapel`) REFERENCES `mapel` (`id_mapel`);

--
-- Ketidakleluasaan untuk tabel `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD CONSTRAINT `peminjaman_ruangan_ibfk_1` FOREIGN KEY (`nis`) REFERENCES `siswa` (`nis`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
