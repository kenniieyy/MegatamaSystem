document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("tambahRuanganForm");
    const tambahBtn = document.getElementById("tambahRuanganBtn");
    const modal = document.getElementById("tambahRuanganModal");
    const closeBtn = document.getElementById("closeTambahModal");
    const cancelBtn = document.getElementById("cancelTambahRuangan");

    // ⏬ Buka Modal Saat Tombol "Tambah" Diklik
    tambahBtn.addEventListener("click", function () {
        modal.classList.remove("hidden");
    });

    // ⏫ Tutup Modal Saat Klik "X" atau "Batal"
    closeBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
    });

    cancelBtn.addEventListener("click", function () {
        modal.classList.add("hidden");
    });

    // 🚀 Submit Form Tambah Ruangan via Fetch AJAX
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);

        fetch("tu_data_ruangan.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            showToast(data.status, data.message);
            if (data.status === "success") {
                form.reset();
                modal.classList.add("hidden");
                // Bisa diaktifkan kalau sudah ada fetchRuangan()
                // fetchRuangan();
            }
        })
        .catch(error => {
            showToast("error", "Terjadi kesalahan saat mengirim data.");
            console.error("Error:", error);
        });
    });
});

// 🔔 Fungsi Menampilkan Toast Notifikasi
function showToast(status, message) {
    const toast = document.getElementById("toast-notification");
    const icon = document.getElementById("toast-icon");
    const title = document.getElementById("toast-title");
    const msg = document.getElementById("toast-message");

    title.textContent = status === "success" ? "Berhasil" : "Gagal";
    msg.textContent = message;
    icon.innerHTML = status === "success"
        ? '<i class="fas fa-check-circle text-green-500 text-lg"></i>'
        : '<i class="fas fa-exclamation-circle text-red-500 text-lg"></i>';

    toast.classList.add("toast-show");

    // ⏱️ Hilangkan toast setelah 3 detik
    setTimeout(() => {
        toast.classList.remove("toast-show");
    }, 3000);
}