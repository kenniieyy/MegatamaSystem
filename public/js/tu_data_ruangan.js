// Data ruangan (will be populated from database)
let ruanganData = []; // Initialize as an empty array
let currentPage = 1;
const itemsPerPage = 9;
let filteredData = []; // Will be populated after fetching data
let editId = null;
let deleteId = null;

// Function to fetch data from the backend
async function fetchRuanganData() {
    try {
        const response = await fetch('../src/API/get_data_ruang_tu.php'); // Replace with the actual path to your PHP script
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Ensure IDs are numbers if they come as strings from the database
        ruanganData = data.map(item => ({
            ...item,
            id: parseInt(item.id) // Convert ID to integer
        }));
        
        filteredData = [...ruanganData]; // Initialize filteredData with fetched data
        renderTable(); // Render the table after data is fetched
    } catch (error) {
        console.error("Error fetching ruangan data:", error);
        // Optionally, display an error message to the user
        window.toast.show('error', 'Gagal!', 'Gagal memuat data ruangan.');
    }
}


// --- Your existing functions (no changes needed for these unless you want to update/delete via API) ---
// DOM Elements
function renderTable() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    const tableBody = document.getElementById('ruanganTableBody');

    tableBody.innerHTML = pageData.map((ruangan, index) => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${startIndex + index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ruangan.namaRuangan}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ruangan.lokasi}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ruangan.keterangan}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editRuangan(${ruangan.id})" class="text-orange-600 hover:text-orange-900 mr-3">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteRuangan(${ruangan.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);

    document.getElementById('currentRange').textContent = `${startIndex}-${endIndex}`;
    document.getElementById('totalData').textContent = filteredData.length;

    const pageNumbers = document.getElementById('pageNumbers');
    pageNumbers.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = `px-3 py-2 text-sm ${i === currentPage ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'} rounded`;
        button.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pageNumbers.appendChild(button);
    }

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredData = ruanganData.filter(ruangan => {
        return ruangan.namaRuangan.toLowerCase().includes(searchTerm) ||
            ruangan.lokasi.toLowerCase().includes(searchTerm) ||
            ruangan.keterangan.toLowerCase().includes(searchTerm);
    });

    currentPage = 1;
    renderTable();
}

document.addEventListener('DOMContentLoaded', function () {
    // *** CALL THE FETCH FUNCTION HERE INSTEAD OF INITIAL renderTable() ***
    fetchRuanganData(); // Fetch data when the DOM is loaded

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', applyFilters);

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    const tambahRuanganBtn = document.getElementById('tambahRuanganBtn');
    tambahRuanganBtn.addEventListener('click', () => showModal('tambahRuanganModal'));

    document.getElementById('closeTambahModal').addEventListener('click', () => {
        editId = null;
        hideModal('tambahRuanganModal');
    });

    document.getElementById('cancelTambahRuangan').addEventListener('click', () => {
        editId = null;
        hideModal('tambahRuanganModal');
    });

    document.getElementById('tambahRuanganForm').addEventListener('submit', handleFormSubmit);

    // renderTable(); // REMOVE THIS LINE - it's called after data is fetched

    window.toast = new ToastNotification();
});

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function editRuangan(id) {
    const ruangan = ruanganData.find(r => r.id === id);
    if (!ruangan) return;

    editId = id;

    const form = document.getElementById('tambahRuanganForm');
    form.namaRuangan.value = ruangan.namaRuangan;
    form.lokasi.value = ruangan.lokasi;
    form.keterangan.value = ruangan.keterangan;

    document.getElementById('modalTitle').textContent = 'Edit Ruangan';

    showModal('tambahRuanganModal');
}

// *** IMPORTANT: For delete and add/edit, you will also need to send requests to your backend
// *** to persist changes in the database, and then re-fetch or update the `ruanganData` array.

function deleteRuangan(id) {
    deleteId = id;
    document.getElementById('deleteRuangan').classList.remove('hidden');
}

async function confirmDelete() {
    if (deleteId !== null) {
        try {
            // Send DELETE request to your backend
            const response = await fetch(`../src/API/delete_data_ruang_tu.php?id=${deleteId}`, { // Create this PHP script
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.success) {
                // If deletion successful in backend, update frontend data
                ruanganData = ruanganData.filter(r => r.id !== deleteId);
                applyFilters();
                toast.show('success', 'Berhasil!', 'Data Ruangan berhasil dihapus!');
                closeDeleteModal();
            } else {
                toast.show('error', 'Gagal!', result.message || 'Gagal menghapus data ruangan.');
            }
        } catch (error) {
            console.error("Error deleting ruangan:", error);
            toast.show('error', 'Gagal!', 'Terjadi kesalahan saat menghapus data.');
        }
    }
}

function closeDeleteModal() {
    document.getElementById('deleteRuangan').classList.add('hidden');
    deleteId = null;
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const ruangan = {
        namaRuangan: formData.get('namaRuangan'),
        lokasi: formData.get('lokasi'),
        keterangan: formData.get('keterangan')
    };

    try {
        let response;
        let result;

        if (editId !== null) {
            // Send PUT/PATCH request for editing
            response = await fetch(`../src/API/update_data_ruang_tu.php`, { // Create this PHP script
                method: 'PUT', // Or POST if your backend handles PUT via POST method override
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: editId, ...ruangan })
            });
            result = await response.json();

            if (response.ok && result.success) {
                const index = ruanganData.findIndex(r => r.id === editId);
                if (index !== -1) {
                    ruanganData[index] = { ...ruanganData[index], ...ruangan };
                }
                editId = null;
                toast.show('success', 'Berhasil!', 'Data Ruangan berhasil di edit!');
                document.getElementById('modalTitle').textContent = 'Tambah Ruangan Baru';
            } else {
                throw new Error(result.message || 'Gagal mengedit data ruangan.');
            }
        } else {
            // Send POST request for adding new data
            response = await fetch(`../src/API/add_data_ruang_tu.php`, { // Create this PHP script
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ruangan)
            });
            result = await response.json();

            if (response.ok && result.success) {
                // If successful, add the new item with the ID returned from the backend
                ruanganData.push({
                    id: result.newId, // Backend should return the new ID
                    ...ruangan
                });
                toast.show('success', 'Berhasil!', 'Ruangan berhasil ditambahkan!');
            } else {
                throw new Error(result.message || 'Gagal menambahkan ruangan baru.');
            }
        }

        e.target.reset();
        hideModal('tambahRuanganModal');
        applyFilters(); // Re-render table with updated data
    } catch (error) {
        console.error("Error submitting form:", error);
        toast.show('error', 'Gagal!', `Terjadi kesalahan: ${error.message}`);
    }
}

// ... (Your ToastNotification class and other DOMContentLoaded event listener for delete modal)
class ToastNotification {
    constructor() {
        this.toastElement = document.getElementById('toast-notification');
        this.toastIcon = document.getElementById('toast-icon');
        this.toastTitle = document.getElementById('toast-title');
        this.toastMessage = document.getElementById('toast-message');
        this.toastClose = document.getElementById('toast-close');
        this.toastContainer = this.toastElement.querySelector('.bg-white');

        this.isVisible = false;
        this.hideTimeout = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.toastClose.addEventListener('click', () => {
            this.hide();
        });

        this.toastElement.addEventListener('transitionend', (e) => {
            if (e.target === this.toastElement && this.isVisible) {
                this.autoHide();
            }
        });
    }

    show(type, title, message) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.setContent(type, title, message);
        this.toastElement.classList.remove('toast-exit', 'toast-show');
        this.toastElement.classList.add('toast-enter');
        this.toastElement.offsetHeight; // Trigger reflow for animation

        setTimeout(() => {
            this.toastElement.classList.remove('toast-enter');
            this.toastElement.classList.add('toast-show');
            this.isVisible = true;
        }, 10);
    }

    hide() {
        if (!this.isVisible) return;

        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        this.toastElement.classList.remove('toast-show');
        this.toastElement.classList.add('toast-exit');
        this.isVisible = false;

        setTimeout(() => {
            this.toastElement.classList.remove('toast-exit');
            this.toastElement.classList.add('toast-enter'); // Or just 'hidden' if no re-entry animation
        }, 300); // Duration of the exit animation
    }

    autoHide() {
        this.hideTimeout = setTimeout(() => {
            this.hide();
        }, 5000);
    }

    setContent(type, title, message) {
        this.toastContainer.className = this.toastContainer.className.replace(/border-l-(green|red|yellow|blue|gray)-500/g, ''); // Ensure all types are covered

        switch (type) {
            case 'success':
                this.toastIcon.innerHTML = '<i class="fas fa-check-circle text-green-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-green-500');
                break;
            case 'error':
                this.toastIcon.innerHTML = '<i class="fas fa-times-circle text-red-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-red-500');
                break;
            case 'warning':
                this.toastIcon.innerHTML = '<i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-yellow-500');
                break;
            case 'info':
                this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-blue-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-blue-500');
                break;
            default:
                this.toastIcon.innerHTML = '<i class="fas fa-info-circle text-gray-500 text-xl"></i>';
                this.toastContainer.classList.add('border-l-gray-500');
        }

        this.toastTitle.textContent = title;
        this.toastMessage.textContent = message;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('deleteRuangan').addEventListener('click', function (e) {
        // Only close if clicking on the backdrop, not the modal content itself
        if (e.target === this) {
            closeDeleteModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !document.getElementById('deleteRuangan').classList.contains('hidden')) {
            closeDeleteModal();
        }
    });
});