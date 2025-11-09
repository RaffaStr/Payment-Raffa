document.addEventListener("DOMContentLoaded", () => {

    // --- KONFIGURASI STATIS PENJUAL (GANTI DI SINI) ---
    const SELLER_INFO = {
        DANA: {
            name: "A/N: SRI Mxxxx",
            number: "0895-6224-94773"
        },
        OVO: {
            name: "A/N: Raffa Rizqi",
            number: "0895-6224-94773"
        },
        GoPay: {
            name: "A/N: SRI MULYATI",
            number: "0813-8543-5612"
        },
        'Bank Jago': {
            name: "A/N: DIANI NUR RAHMAWATI",
            number: "1081-5393-9529"
        },
        QRIS: {
            // Ganti URL ini dengan URL gambar QRIS statis Anda
            imageUrl: "https://telegra.ph/file/6c3d66daf16b55e0949ce.jpg" 
        },
        Crypto: {
            name: "Alamat Wallet (Solana)",
            number: "FKR2aKXxghXT7XCn9chyXhSRtTSYrWk9CLEfgKHy431W" // Alamat wallet penjual
        },
        // --- Nomor WA Admin (GANTI DI SINI) ---
        ADMIN_WHATSAPP: "6281385435612" // Nomor WA penjual (diawali 62, tanpa + atau 0)
    };
    // ----------------------------------------------------


    // --- SELEKSI ELEMEN DOM ---
    const statusMessages = document.getElementById("status-messages");
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    
    // Tampilan Info Pembayaran
    const instructionsDisplay = document.getElementById("payment-instructions");
    const paymentTitle = document.getElementById("payment-title");
    const paymentInfo = document.getElementById("payment-info");
    
    // Tombol WA
    const whatsappButton = document.getElementById("whatsapp-button");

    // --- EVENT LISTENERS ---
    
    // 1. Saat metode pembayaran dipilih
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', showPaymentInfo);
    });

    // 2. Saat tombol Kirim Bukti WA diklik
    whatsappButton.addEventListener('click', sendWhatsAppConfirmation);

    /**
     * @name showPaymentInfo
     * @description Menampilkan info rekening/nomor statis penjual
     */
    function showPaymentInfo(e) {
        const method = e.target.value;
        const info = SELLER_INFO[method];

        if (!info) {
            instructionsDisplay.style.display = "none";
            return;
        }
        
        // Reset pesan status
        statusMessages.style.display = "none";

        paymentTitle.textContent = `Instruksi Pembayaran ${method}`;
        let contentHTML = "";

        if (method === "QRIS") {
            // Tampilkan Gambar QRIS Statis
            contentHTML = `
                <p>Silakan pindai QRIS di bawah ini:</p>
                <img src="${info.imageUrl}" alt="QRIS Penjual">
                <p class="note" style="text-align:center;">(Pastikan jumlah yang Anda masukkan manual sudah benar)</p>
            `;
        } else {
            // Tampilkan Teks (No. HP / Rekening / Wallet)
            contentHTML = `
                <p style="font-size: 1rem; margin-bottom: 0.5rem;">${info.name}</p>
                <h3>${info.number}</h3>
            `;
        }

        paymentInfo.innerHTML = contentHTML;
        instructionsDisplay.style.display = "block";
    }

    /**
     * @name sendWhatsAppConfirmation
     * @description Memvalidasi form dan membuka link WhatsApp Me
     */
    function sendWhatsAppConfirmation() {
        // 1. Validasi Form
        const formData = {
            name: document.getElementById("customer-name").value,
            contact: document.getElementById("customer-contact").value,
            amount: document.getElementById("amount").value,
            orderId: document.getElementById("order-id").value || "-",
            method: document.querySelector('input[name="payment-method"]:checked')?.value
        };

        const errors = [];
        if (!formData.name) errors.push("Nama");
        if (!formData.contact) errors.push("No. WA");
        if (!formData.amount || formData.amount <= 0) errors.push("Jumlah");
        if (!formData.method) errors.push("Metode Pembayaran");

        if (errors.length > 0) {
            showMessage(`Form tidak lengkap: ${errors.join(", ")}.`, "error");
            return;
        }

        // 2. Buat Pesan WhatsApp
        // (encodeURIComponent memastikan spasi, enter, dll aman untuk URL)
        const message = `
Halo, saya ingin konfirmasi pembayaran:
-----------------------------------
Nama: ${formData.name}
No. WA: ${formData.contact}
Jumlah: Rp ${new Intl.NumberFormat('id-ID').format(formData.amount)}
Metode: ${formData.method}
Catatan: ${formData.orderId}
-----------------------------------

Berikut saya lampirkan bukti transfer:
(Silakan upload screenshot Anda di sini)
        `;

        const encodedMessage = encodeURIComponent(message.trim());
        const waLink = `https://wa.me/${SELLER_INFO.ADMIN_WHATSAPP}?text=${encodedMessage}`;
        
        // 3. Buka di tab baru
        window.open(waLink, '_blank');
        showMessage("Silakan kirim bukti transfer Anda di tab WhatsApp yang baru terbuka.", "success");
    }


    // --- FUNGSI HELPERS UI ---

    function showMessage(message, type = "pending") {
        statusMessages.textContent = message;
        statusMessages.className = `status-box ${type}`; 
        statusMessages.style.display = "block";
    }

});
