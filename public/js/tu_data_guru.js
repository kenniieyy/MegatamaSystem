document.addEventListener("DOMContentLoaded", function () {
    loadTeachers();

    const form = document.getElementById("teacherForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);

        fetch("api/guru.php", {
            method: "POST",
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            alert("Data guru berhasil ditambahkan!");
            form.reset();
            loadTeachers();
        })
        .catch(err => {
            console.error(err);
            alert("Gagal menyimpan data.");
        });
    });

    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function () {
        loadTeachers(searchInput.value);
    });
});

function loadTeachers(searchTerm = "") {
    fetch(`api/guru.php?search=${encodeURIComponent(searchTerm)}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then(data => {
            const tbody = document.getElementById("teacherTableBody");
            tbody.innerHTML = "";
            data.forEach(guru => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><img src="${guru.foto_url}" width="50"></td>
                    <td>${guru.nama_lengkap}</td>
                    <td>${guru.jenis_kelamin}</td>
                    <td>${guru.nip}</td>
                    <td>${guru.mata_pelajaran}</td>
                    <td>${guru.wali_kelas}</td>
                    <td>${guru.status_guru}</td>
                    <td>
                        <button onclick="openEditModal(${guru.id})">Edit</button>
                        <button onclick="openDeleteModal(${guru.id})">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error(err);
            alert("Gagal memuat data.");
        });
}


// let teachersData = [
//     { id: 1, name: "Siti Nurhaliza, S.Pd", gender: "Perempuan", nip: "19800412 200903 2 001", subject: "Agama Islam", waliKelas: "Wali Kelas 7", status: "Aktif", photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face" },
//     { id: 2, name: "Ahmad Fauzan, M.Pd", gender: "Laki - Laki", nip: "19791105 200701 1 002", subject: "Fisika", waliKelas: "Wali Kelas 9", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
//     { id: 3, name: "Rina Kartikasari, S.Pd", gender: "Perempuan", nip: "19870217 201001 2 003", subject: "IPS", waliKelas: "Wali Kelas 8", status: "Aktif", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
//     { id: 4, name: "Dedi Hartono, S.Pd", gender: "Laki - Laki", nip: "19750503 199903 1 004", subject: "Biologi", waliKelas: "Wali Kelas 12", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
//     { id: 5, name: "Yuliana Maharani, M.Pd", gender: "Perempuan", nip: "19860526 201102 2 005", subject: "Bahasa Inggris", waliKelas: "", status: "Aktif", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
//     { id: 6, name: "Lestari Widyaningrum, S.Pd", gender: "Perempuan", nip: "19820115 200503 1 006", subject: "Bahasa Indonesia", waliKelas: "Wali Kelas 11", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face" },
//     { id: 7, name: "Olivia Putri, S.Pd", gender: "Perempuan", nip: "19881122 201203 2 007", subject: "Matematika", waliKelas: "Wali Kelas 10", status: "Aktif", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
//     { id: 8, name: "Andi Seputra, S.Sn", gender: "Laki - Laki", nip: "19891201 201104 1 008", subject: "Sejarah", waliKelas: "", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
//     { id: 9, name: "Teguh Prasetyo, S.Pd", gender: "Laki - Laki", nip: "19760808 200001 2 009", subject: "Agama Islam", waliKelas: "", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face" },
//     { id: 10, name: "Dewi Lestari, S.Pd", gender: "Perempuan", nip: "19830614 201001 2 003", subject: "Bahasa Indonesia", waliKelas: "", status: "Aktif", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
//     { id: 11, name: "Budi Santoso, M.T", gender: "Laki-laki", nip: "19810203 200702 1 004", subject: "Matematika", waliKelas: "", status: "Non-Aktif", photo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&crop=face" },
//     { id: 12, name: "Rina Marlina, S.Kom", gender: "Perempuan", nip: "19890517 201203 2 005", subject: "IPS", waliKelas: "", status: "Aktif", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face" }
// ];

// let filteredData = [...teachersData];
// let currentPage = 1;
// const itemsPerPage = 9;
// let editingId = null;
// let deleteId = null;

// // Initialize page
// document.addEventListener('DOMContentLoaded', function () {
//     renderTable();
//     renderPagination();
//     setupSearch();
// });

// // Render table
// function renderTable() {
//     const tbody = document.getElementById('teacherTableBody');
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     const currentData = filteredData.slice(startIndex, endIndex);

//     tbody.innerHTML = currentData.map(teacher => `
//                 <tr class="hover:bg-gray-50 transition-colors">
//                     <td class="px-6 py-4 whitespace-nowrap">
//                         <img src="${teacher.photo}" alt="${teacher.name}" class="w-10 h-10 rounded-full object-cover">
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.name}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.gender}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.nip}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${teacher.subject}</td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//   ${teacher.waliKelas || 'Bukan Wali Kelas'}
// </td>

//                     <td class="px-6 py-4 whitespace-nowrap">
//                         <span class="px-2 py-1 text-xs font-medium rounded-full ${teacher.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
//                             ${teacher.status}
//                         </span>
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div class="flex space-x-2">
//                             <button onclick="editTeacher(${teacher.id})" class="text-orange-600 hover:text-orange-900 p-1">
//                                 <i class="fas fa-edit"></i>
//                             </button>
//                             <button onclick="deleteTeacher(${teacher.id})" class="text-red-600 hover:text-red-900 p-1">
//                                 <i class="fas fa-trash"></i>
//                             </button>
//                         </div>
//                     </td>
//                 </tr>
//             `).join('');

//     updatePaginationInfo();
// }

// // Render pagination
// function renderPagination() {
//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     const pageNumbers = document.getElementById('pageNumbers');

//     let paginationHTML = '';
//     for (let i = 1; i <= totalPages; i++) {
//         paginationHTML += `
//                     <button onclick="goToPage(${i})" class="px-3 py-1 text-sm rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}">
//                         ${i}
//                     </button>
//                 `;
//     }
//     pageNumbers.innerHTML = paginationHTML;
// }

// // Update pagination info
// function updatePaginationInfo() {
//     const startIndex = (currentPage - 1) * itemsPerPage + 1;
//     const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
//     const totalItems = filteredData.length;

//     document.getElementById('paginationInfo').textContent =
//         `Menampilkan ${startIndex}-${endIndex} dari ${totalItems} guru`;
// }

// // Pagination functions
// function goToPage(page) {
//     currentPage = page;
//     renderTable();
//     renderPagination();
// }

// function previousPage() {
//     if (currentPage > 1) {
//         currentPage--;
//         renderTable();
//         renderPagination();
//     }
// }

// function nextPage() {
//     const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//     if (currentPage < totalPages) {
//         currentPage++;
//         renderTable();
//         renderPagination();
//     }
// }

// // Search functionality
// function setupSearch() {
//     const searchInput = document.getElementById('searchInput');
//     searchInput.addEventListener('input', function () {
//         const searchTerm = this.value.toLowerCase();
//         filteredData = teachersData.filter(teacher =>
//             teacher.name.toLowerCase().includes(searchTerm) ||
//             teacher.subject.toLowerCase().includes(searchTerm) ||
//             teacher.nip.includes(searchTerm)
//         );
//         currentPage = 1;
//         renderTable();
//         renderPagination();
//     });
// }

// // Modal functions
// function openAddModal() {
//     editingId = null;
//     document.getElementById('modalTitle').textContent = 'Tambah Data Guru';
//     document.getElementById('teacherForm').reset();
//     document.getElementById('teacherWaliKelas').value = "";
//     document.getElementById('teacherModal').classList.remove('hidden');
// }

// function editTeacher(id) {
//     editingId = id;
//     const teacher = teachersData.find(t => t.id === id);

//     document.getElementById('modalTitle').textContent = 'Edit Data Guru';
//     document.getElementById('teacherName').value = teacher.name;
//     document.getElementById('teacherGender').value = teacher.gender;
//     document.getElementById('teacherNIP').value = teacher.nip;
//     document.getElementById('teacherSubject').value = teacher.subject;
//     document.getElementById('teacherWaliKelas').value = teacher.waliKelas || "";
//     document.getElementById('teacherStatus').value = teacher.status;

//     document.getElementById('teacherModal').classList.remove('hidden');
// }

// function closeModal() {
//     document.getElementById('teacherModal').classList.add('hidden');
// }

// function deleteTeacher(id) {
//     deleteId = id;
//     document.getElementById('deleteModal').classList.remove('hidden');
// }

// function closeDeleteModal() {
//     document.getElementById('deleteModal').classList.add('hidden');
// }

// function confirmDelete() {
//     teachersData = teachersData.filter(t => t.id !== deleteId);
//     filteredData = filteredData.filter(t => t.id !== deleteId);
//     renderTable();
//     renderPagination();
//     closeDeleteModal();
// }

// // Form submission
// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('teacherForm');

//     if (form) {
//         form.addEventListener('submit', function (e) {
//             e.preventDefault();

//             const formData = {
//                 name: document.getElementById('teacherName').value,
//                 gender: document.getElementById('teacherGender').value,
//                 nip: document.getElementById('teacherNIP').value,
//                 subject: document.getElementById('teacherSubject').value,
//                 waliKelas: document.getElementById('teacherWaliKelas').value,
//                 status: document.getElementById('teacherStatus').value,
//                 photo: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face"
//             };

//             if (editingId) {
//                 const index = teachersData.findIndex(t => t.id === editingId);
//                 if (index !== -1) {
//                     teachersData[index] = { ...teachersData[index], ...formData };
//                 }
//             } else {
//                 const newId = Math.max(...teachersData.map(t => t.id)) + 1;
//                 teachersData.push({ id: newId, ...formData });
//             }

//             filteredData = [...teachersData];
//             renderTable();
//             renderPagination();
//             closeModal();
//             console.log('Form Data:', formData);
//         });
//     }
// });

