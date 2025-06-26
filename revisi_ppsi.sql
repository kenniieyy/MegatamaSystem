-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2025 at 02:41 PM
-- Server version: 10.11.11-MariaDB
-- PHP Version: 8.2.12

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
-- Table structure for table `absen`
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
-- Dumping data for table `absen`
--

INSERT INTO `absen` (`id_absen`, `id_guru`, `kelas`, `tanggal`, `jam_mulai`, `jam_selesai`, `dibuat_pada`) VALUES
(40, 411, '8', '2025-05-21', '12:00:00', '13:00:00', '2025-05-21 15:28:43'),
(41, 411, '9', '2025-06-15', '12:00:00', '13:00:00', '2025-06-15 16:06:45'),
(42, 411, '9', '2025-06-15', '12:00:00', '13:00:00', '2025-06-15 16:15:50'),
(43, 411, '9', '2025-06-15', '12:00:00', '13:00:00', '2025-06-15 16:20:39'),
(44, 1024, '8', '2025-06-17', '12:00:00', '13:00:00', '2025-06-17 08:48:10');

-- --------------------------------------------------------

--
-- Table structure for table `absen_guru`
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
-- Dumping data for table `absen_guru`
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
(77, 411, '2025-06-10', '07:06:00', '15:11:00', 'foto_datang_20.jpg', 'foto_pulang_20.jpg'),
(78, 411, '2025-06-16', '21:15:19', NULL, 'presensi__1750079719.png', NULL),
(79, 1029, '2025-06-17', '12:24:37', NULL, 'presensi__1750134277.png', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `absen_siswa`
--

CREATE TABLE `absen_siswa` (
  `id_absen_siswa` int(11) NOT NULL,
  `id_absen` int(11) DEFAULT NULL,
  `nis` varchar(20) DEFAULT NULL,
  `status` enum('hadir','sakit','izin','alpa') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `absen_siswa`
--

INSERT INTO `absen_siswa` (`id_absen_siswa`, `id_absen`, `nis`, `status`) VALUES
(292, 43, '7001', 'hadir'),
(293, 43, '7002', 'hadir'),
(294, 43, '7003', 'hadir'),
(295, 43, '8001', 'hadir'),
(296, 43, '8002', 'hadir'),
(297, 43, '8003', 'sakit'),
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
(314, 43, '9010', 'hadir'),
(315, 44, '7005', 'hadir'),
(316, 44, '7006', 'hadir'),
(317, 44, '7007', 'hadir'),
(318, 44, '7008', 'hadir'),
(319, 44, '7009', 'hadir'),
(320, 44, '7010', 'hadir');

-- --------------------------------------------------------

--
-- Table structure for table `aktivitas`
--

CREATE TABLE `aktivitas` (
  `id` int(11) NOT NULL,
  `id_guru` int(11) NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `tipe` enum('datang','pulang','absensi','edit') NOT NULL,
  `waktu` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aktivitas`
--

INSERT INTO `aktivitas` (`id`, `id_guru`, `judul`, `tipe`, `waktu`) VALUES
(1, 411, 'Presensi datang berhasil', 'datang', '2025-06-13 14:42:28'),
(2, 411, 'Presensi pulang berhasil', 'pulang', '2025-06-13 14:42:28'),
(3, 411, 'edit profil', 'edit', '2025-06-13 14:46:05'),
(4, 411, 'Melakukan absensi kelas 8', 'absensi', '2025-06-13 15:59:40'),
(64, 411, 'Input Absensi Kelas 9', 'absensi', '2025-06-15 16:20:39'),
(65, 411, 'Presensi Datang Berhasil', 'datang', '2025-06-16 21:15:19'),
(66, 1024, 'Input Absensi Kelas 8', 'absensi', '2025-06-17 08:48:10'),
(67, 1029, 'Presensi Datang Berhasil', 'datang', '2025-06-17 12:24:37');

-- --------------------------------------------------------

--
-- Table structure for table `guru`
--

CREATE TABLE `guru` (
  `id_guru` int(11) NOT NULL,
  `nama_guru` varchar(100) NOT NULL,
  `jenis_kelamin` enum('Laki-laki','Perempuan') NOT NULL,
  `ID` varchar(20) NOT NULL,
  `mata_pelajaran` varchar(100) DEFAULT NULL,
  `wali_kelas` enum('Wali Kelas 7','Wali Kelas 8','Wali Kelas 9','Wali Kelas 10','Wali Kelas 11','Wali Kelas 12') DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `foto_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guru`
--

INSERT INTO `guru` (`id_guru`, `nama_guru`, `jenis_kelamin`, `ID`, `mata_pelajaran`, `wali_kelas`, `status`, `username`, `password`, `foto_url`) VALUES
(1023, 'Budi Santoso', 'Laki-laki', '1002', 'Matematika', NULL, 'Aktif', 'budis', 'admin', 'img/guru/default.png'),
(1024, 'Citra Lestari', 'Perempuan', '1003', 'Matematika', 'Wali Kelas 8', 'Aktif', 'citral', 'admin', 'img/guru/default.png'),
(1025, 'Dian Permata', 'Perempuan', '1004', 'IPA', NULL, 'Aktif', 'dianp', 'zxcvbnmasdfghjklqwertyuiop123456', 'img/guru/default.png'),
(1026, 'Eka Wijaya', 'Laki-laki', '1005', 'IPS', 'Wali Kelas 7', 'Aktif', 'ekaw', 'admin', 'img/guru/default.png'),
(1027, 'Faisal Rahman', 'Laki-laki', '1006', 'Penjaskes', NULL, 'Tidak Aktif', 'faisr', 'lkjhgfdsaqwertyuiop0987654321fedc', 'img/guru/default.png'),
(1028, 'Gita Sari', 'Perempuan', '1007', 'Seni Budaya', 'Wali Kelas 8', 'Aktif', 'gitas', 'poiuytrewqasdfghjklmnbvcxz123456', 'img/guru/default.png'),
(1029, 'Hadi Putra', 'Perempuan', '1008', 'Kimia', 'Wali Kelas 12', 'Aktif', 'hadip', 'admin', 'img/guru/default.png'),
(1030, 'Indah Cahaya', 'Perempuan', '1009', 'Fisika', NULL, 'Aktif', 'indahc', '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik9', 'img/guru/default.png'),
(1031, 'Joko Susilo', 'Laki-laki', '1010', 'Bahasa Indonesia', 'Wali Kelas 9', 'Aktif', 'jokos', '0okm9ijn8uhb7ygv6tfcdx5esz4aw3q2', 'img/guru/default.png'),
(1032, 'Kartika Putri', 'Perempuan', '1011', 'Sejarah', NULL, 'Aktif', 'kartikap', 'loremipsumdolorsitametconsectetur', 'img/guru/default.png'),
(1035, 'Muh Arsyad Ramsi', 'Laki-laki', '221220640', 'Matematika', 'Wali Kelas 7', 'Aktif', 'anca', 'anca', 'img/guru/221220640.JPG'),
(1038, 'ivatul maula rizka angeliana, S.Kom., M.Kom., M.Sc., Phd', 'Perempuan', '221220639', 'Agama Islam', 'Wali Kelas 12', 'Tidak Aktif', 'aca', 'aca123', 'img/guru/221220639.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `operator`
--

CREATE TABLE `operator` (
  `id_operator` int(11) NOT NULL,
  `nama_operator` varchar(100) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('SMP','SMA','PERPUSTAKAAN') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operator`
--

INSERT INTO `operator` (`id_operator`, `nama_operator`, `username`, `password`, `role`) VALUES
(1, 'OPRATOR.1', 'ADMIN.1', 'ADMIN123', 'SMA'),
(2, 'OPERATOR.2', 'ADMIN.2', 'ADMIN234', 'SMP'),
(3, 'OPERATOR.3', 'ADMIN.3', 'ADMIN345', 'SMA'),
(4, 'admin', 'admin', 'admin', 'SMP');

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman_ruangan`
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

--
-- Dumping data for table `peminjaman_ruangan`
--

INSERT INTO `peminjaman_ruangan` (`id`, `nama_lengkap`, `nis`, `kelas`, `no_telepon`, `jenis_ruangan`, `tanggal_peminjaman`, `deskripsi_kegiatan`, `jam_mulai`, `jam_selesai`, `penanggung_jawab`, `status`, `created_at`) VALUES
(0, 'anca', '22122', '8', '22122', 'kesenian', '2025-06-23', 'akuu', '19:45:00', '20:45:00', 'agus', 'upcoming', '2025-06-23 08:45:35');

-- --------------------------------------------------------

--
-- Table structure for table `ruangan`
--

CREATE TABLE `ruangan` (
  `id` int(11) NOT NULL,
  `namaRuangan` varchar(100) NOT NULL,
  `lokasi` varchar(100) NOT NULL,
  `keterangan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ruangan`
--

INSERT INTO `ruangan` (`id`, `namaRuangan`, `lokasi`, `keterangan`) VALUES
(5, 'Laboratorium Komputer', 'lokasi_lab_komputer', 'Keterangan untuk Laboratorium Komputer'),
(6, 'Laboratorium Fisika', 'lokasi_lab_fisika', 'Keterangan untuk Laboratorium Fisika'),
(7, 'Laboratorium Kimia', 'lokasi_lab_kimia', 'Keterangan untuk Laboratorium Kimia'),
(8, 'Laboratorium Biologi', 'lokasi_lab_biologi', 'Keterangan untuk Laboratorium Biologi'),
(9, 'Kesenian', 'lokasi_kesenian', 'Keterangan untuk Kesenian');

-- --------------------------------------------------------

--
-- Table structure for table `siswa`
--

CREATE TABLE `siswa` (
  `nis` varchar(20) NOT NULL,
  `nama_siswa` varchar(100) NOT NULL,
  `jenis_kelamin` enum('L','P','','') NOT NULL,
  `kelas` varchar(10) NOT NULL,
  `no_hp` varchar(25) NOT NULL,
  `status_siswa` enum('Aktif','Lulus','Non-Aktif','') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `siswa`
--

INSERT INTO `siswa` (`nis`, `nama_siswa`, `jenis_kelamin`, `kelas`, `no_hp`, `status_siswa`) VALUES
('10002', 'Erni Wijayanti', 'P', '10', '0', 'Aktif'),
('10003', 'Faisal Rahman', 'L', '10', '0', 'Aktif'),
('10004', 'Gina Salsabila', 'P', '10', '0', 'Aktif'),
('10005', 'Hendra Gunawan', 'L', '10', '0', 'Aktif'),
('10006', 'Intan Permatasari', 'P', '10', '0', 'Aktif'),
('10007', 'Joni Iskandar', 'L', '10', '0', 'Aktif'),
('10008', 'Kirana Dewi', 'P', '10', '0', 'Aktif'),
('10009', 'Lutfi Halimawan', 'L', '10', '0', 'Aktif'),
('10010', 'Mawar Melati', 'P', '10', '0', 'Aktif'),
('11001', 'Naufal Hidayat', 'L', '12', '0', 'Lulus'),
('11002', 'Oktavia Ramadhani', 'P', '11', '0', 'Aktif'),
('11003', 'Pandu Wibowo', 'L', '11', '0', 'Aktif'),
('11004', 'Qonita Alya', 'P', '11', '0', 'Aktif'),
('11005', 'Rizki Ramadhan', 'L', '11', '0', 'Aktif'),
('11006', 'Sari Indah', 'P', '11', '0', 'Aktif'),
('11007', 'Tegar Perkasa', 'L', '11', '0', 'Aktif'),
('11008', 'Umi Fadilah', 'P', '11', '0', 'Aktif'),
('11009', 'Vino Bastian', 'L', '11', '0', 'Aktif'),
('11010', 'Wulan Guritno', 'P', '11', '0', 'Aktif'),
('12001', 'Xaverius Andi', 'L', '12', '0', 'Aktif'),
('12002', 'Yuliana Sari', 'P', '12', '0', 'Aktif'),
('12003', 'Zaki Ahmad', 'L', '12', '0', 'Aktif'),
('12004', 'Anita Permata', 'P', '8', '0', 'Aktif'),
('12005', 'Bima Sakti', 'L', '12', '0', 'Aktif'),
('12006', 'Citra Kirana', 'P', '12', '0', 'Aktif'),
('12007', 'Dodi Sudrajat', 'L', '12', '0', 'Aktif'),
('12008', 'Eka Putri', 'P', '12', '0', 'Aktif'),
('12009', 'Farhan Syahputra', 'L', '12', '0', 'Aktif'),
('12010', 'Gita Gutawa', 'P', '12', '0', 'Aktif'),
('221220640', 'Muh Arsyad Ramsi', 'L', '8', '082291700778', 'Aktif'),
('7001', 'Ahmad Fauzi', 'L', '8', '0822917090778', 'Aktif'),
('7002', 'Anisa Putri', 'P', '8', '0822917090778', 'Aktif'),
('7003', 'Budi Santoso', 'L', '9', '0822917090778', 'Aktif'),
('7004', 'Citra Dewi', 'P', '11', '0822917090778', 'Aktif'),
('7005', 'Deni Kurniawan', 'L', '9', '0822917090778', 'Aktif'),
('7006', 'Eka Fitriani', 'P', '8', '0822917090778', 'Aktif'),
('7007', 'Fajar Ramadhan', 'L', '8', '0822917090778', 'Aktif'),
('7008', 'Gita Nuraini', 'P', '8', '00822917090778', 'Aktif'),
('7009', 'Hadi Prasetyo', 'L', '8', '0822917090778', 'Aktif'),
('7010', 'Indah Permata', 'P', '8', '0822917090778', 'Aktif'),
('8001', 'Joko Widodo', 'L', '9', '0822917090778', 'Aktif'),
('8002', 'Kartika Sari', 'P', '9', '0822917090778', 'Aktif'),
('8003', 'Lukman Hakim', 'L', '9', '0822917090778', 'Aktif'),
('8004', 'Mira Lestari', 'P', '9', '0822917090778', 'Aktif'),
('8005', 'Nanda Pratama', 'L', '9', '0822917090778', 'Aktif'),
('8006', 'Olivia Putri', 'P', '9', '0822917090778', 'Aktif'),
('8007', 'Putra Wijaya', 'L', '9', '0822917090778', 'Aktif'),
('8008', 'Qori Amalia', 'P', '9', '0822917090778', 'Aktif'),
('8009', 'Rendi Saputra', 'L', '9', '0822917090778', 'Aktif'),
('8010', 'Sinta Dewi', 'P', '9', '0822917090778', 'Aktif'),
('9001', 'Tono Sucipto', 'L', '9', '0822917090778', 'Aktif'),
('9002', 'Umi Kalsum', 'P', '9', '0822917090778', 'Aktif'),
('9003', 'Vino Bastian', 'L', '9', '0822917090778', 'Aktif'),
('9004', 'Wati Susilawati', 'P', '9', '0822917090778', 'Aktif'),
('9005', 'Xaverius Andi', 'L', '9', '0', 'Aktif'),
('9006', 'Yanti Komalasari', 'P', '9', '0', 'Aktif'),
('9007', 'Zaki Firmansyah', 'L', '9', '0', 'Aktif'),
('9008', 'Amelia Zahra', 'P', '8', '0', 'Aktif'),
('9009', 'Bayu Segara', 'L', '8', '0', 'Aktif'),
('9010', 'Cinta Laura', 'P', '9', '0', 'Aktif');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absen`
--
ALTER TABLE `absen`
  ADD PRIMARY KEY (`id_absen`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indexes for table `absen_guru`
--
ALTER TABLE `absen_guru`
  ADD PRIMARY KEY (`id_absen_guru`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indexes for table `absen_siswa`
--
ALTER TABLE `absen_siswa`
  ADD PRIMARY KEY (`id_absen_siswa`),
  ADD KEY `id_siswa` (`nis`),
  ADD KEY `id_absen` (`id_absen`);

--
-- Indexes for table `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_guru` (`id_guru`);

--
-- Indexes for table `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id_guru`);

--
-- Indexes for table `operator`
--
ALTER TABLE `operator`
  ADD PRIMARY KEY (`id_operator`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `peminjaman_ruangan`
--
ALTER TABLE `peminjaman_ruangan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nis` (`nis`);

--
-- Indexes for table `ruangan`
--
ALTER TABLE `ruangan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`nis`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absen`
--
ALTER TABLE `absen`
  MODIFY `id_absen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `absen_guru`
--
ALTER TABLE `absen_guru`
  MODIFY `id_absen_guru` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `absen_siswa`
--
ALTER TABLE `absen_siswa`
  MODIFY `id_absen_siswa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=321;

--
-- AUTO_INCREMENT for table `aktivitas`
--
ALTER TABLE `aktivitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `guru`
--
ALTER TABLE `guru`
  MODIFY `id_guru` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1039;

--
-- AUTO_INCREMENT for table `operator`
--
ALTER TABLE `operator`
  MODIFY `id_operator` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ruangan`
--
ALTER TABLE `ruangan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absen_siswa`
--
ALTER TABLE `absen_siswa`
  ADD CONSTRAINT `absen_siswa_ibfk_3` FOREIGN KEY (`id_absen`) REFERENCES `absen` (`id_absen`),
  ADD CONSTRAINT `absen_siswa_ibfk_4` FOREIGN KEY (`nis`) REFERENCES `siswa` (`nis`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
