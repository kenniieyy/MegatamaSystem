
// Sample data for autocomplete
const teacherData = [
    { nip: '197201231995011002', name: 'Efrizal, S.P., M.Si.' },
    { nip: '197605212009121002', name: 'Syamsul Rizal, S.H., M.H.' },
    { nip: '198511212009121009', name: 'Ahmed Riza Fahlevi, S.H.' },
    { nip: '195907271987011002', name: 'Prof. Dr. Afrizal, S.E.,M.Si.,Ak.' },
    { nip: '196302041989031003', name: 'Prof. Ir. Yusrizal, M.Sc., Ph.D.' },
    { nip: '196805281993031001', name: 'Dr. Ir. Mairizal, M.Si.' }
];

// Autocomplete functionality for guru login
const identityInput = document.getElementById('identity-guru');
const autocompleteDropdown = document.getElementById('autocomplete-dropdown-guru');

if (identityInput && autocompleteDropdown) {
    identityInput.addEventListener('input', function() {
        const inputValue = this.value.toLowerCase();
        
        if (inputValue.length >= 3) {
            // Filter teachers based on input
            const filteredTeachers = teacherData.filter(teacher => 
                teacher.nip.toLowerCase().includes(inputValue) || 
                teacher.name.toLowerCase().includes(inputValue)
            );
            
            // Show dropdown with results
            if (filteredTeachers.length > 0) {
                autocompleteDropdown.innerHTML = '';
                filteredTeachers.forEach(teacher => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = `${teacher.nip} - ${teacher.name}`;
                    item.addEventListener('click', function() {
                        identityInput.value = `${teacher.nip} - ${teacher.name}`;
                        autocompleteDropdown.classList.add('hidden');
                    });
                    autocompleteDropdown.appendChild(item);
                });
                autocompleteDropdown.classList.remove('hidden');
            } else {
                autocompleteDropdown.innerHTML = '<div class="autocomplete-placeholder">Tidak ada hasil yang cocok</div>';
                autocompleteDropdown.classList.remove('hidden');
            }
        } else {
            autocompleteDropdown.classList.add('hidden');
        }
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!identityInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
            autocompleteDropdown.classList.add('hidden');
        }
    });

    // Keyboard navigation for dropdown
    identityInput.addEventListener('keydown', function(e) {
        const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');
        const selectedItem = autocompleteDropdown.querySelector('.selected');
        
        if (items.length > 0 && !autocompleteDropdown.classList.contains('hidden')) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!selectedItem) {
                    items[0].classList.add('selected');
                } else {
                    const nextItem = selectedItem.nextElementSibling;
                    if (nextItem && nextItem.classList.contains('autocomplete-item')) {
                        selectedItem.classList.remove('selected');
                        nextItem.classList.add('selected');
                    }
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (selectedItem) {
                    const prevItem = selectedItem.previousElementSibling;
                    if (prevItem && prevItem.classList.contains('autocomplete-item')) {
                        selectedItem.classList.remove('selected');
                        prevItem.classList.add('selected');
                    }
                }
            } else if (e.key === 'Enter' && selectedItem) {
                e.preventDefault();
                identityInput.value = selectedItem.textContent;
                autocompleteDropdown.classList.add('hidden');
            }
        }
    });
}

// Login button functionality
// const loginButtons = document.querySelectorAll('.btn-login');
// loginButtons.forEach(button => {
//     button.addEventListener('click', function() {
//         showModal('info', 'Login', 'Fitur dashboard belum tersedia dalam demo ini.');
//     });
// });

// Modal functionality
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalDetails = document.getElementById('modal-details');
const modalHeader = document.getElementById('modal-header');
const modalIcon = document.getElementById('modal-icon');
const modalClose = document.getElementById('modal-close');

function showModal(type, title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalDetails.innerHTML = '';
    
    // Set icon and color based on type
    if (type === 'error') {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-red-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-red-600';
    } else if (type === 'success') {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-green-100';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-green-600';
    } else {
        modalIcon.className = 'mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-primary bg-opacity-10';
        modalIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        `;
        modalHeader.className = 'text-center mb-4 text-primary';
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        modalContent.classList.remove('scale-95', 'opacity-0');
        modalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    });
}
