// ==========================================
// 1. INISIALISASI DATA & STATE
// ==========================================
let berita = JSON.parse(localStorage.getItem("berita")) || [];
window.editId = null; 

document.addEventListener("DOMContentLoaded", () => {
    updateStats();
    renderAdmin();
});

// ==========================================
// 2. KONTROL MODAL (BUKA/TUTUP)
// ==========================================
function openForm() {
    const modal = document.getElementById("form");
    modal.classList.remove("hidden");
}

function closeForm() {
    const modal = document.getElementById("form");
    modal.classList.add("hidden");

    // Reset isi input agar bersih kembali
    document.getElementById("judul").value = "";
    document.getElementById("kategori").value = "";
    document.getElementById("isi").value = "";
    document.getElementById("gambar").value = "";
    
    // RESET INPUT BARU
    if(document.getElementById("seoKey")) document.getElementById("seoKey").value = "";
    if(document.getElementById("tagInput")) document.getElementById("tagInput").value = "";
    if(document.getElementById("penulis")) document.getElementById("penulis").value = "";
    if(document.getElementById("editor")) document.getElementById("editor").value = "";
    
    window.editId = null;
    const modalTitle = document.querySelector("#form h2");
    if (modalTitle) modalTitle.innerText = "Tambah Berita Baru";
}

// ==========================================
// 3. LOGIKA SIMPAN (TAMBAH & EDIT)
// ==========================================
function tambahBerita() {
    const judul = document.getElementById("judul").value;
    const kategori = document.getElementById("kategori").value;
    const isi = document.getElementById("isi").value;
    const fileInput = document.getElementById("gambar");
    const file = fileInput.files[0];

    // AMBIL NILAI DARI INPUT BARU
    const seo = document.getElementById("seoKey") ? document.getElementById("seoKey").value : "";
    const tags = document.getElementById("tagInput") ? document.getElementById("tagInput").value : "";
    const penulis = document.getElementById("penulis") ? document.getElementById("penulis").value : "Admin";
    const editor = document.getElementById("editor") ? document.getElementById("editor").value : "Redaksi";

    if (!judul || !kategori || !isi) {
        alert("Mohon lengkapi kolom Utama (Judul, Kategori, Isi)!");
        return;
    }

    const simpanData = (gambarBase64) => {
        let currentData = JSON.parse(localStorage.getItem("berita")) || [];

        if (window.editId) {
            const index = currentData.findIndex(item => item.id === window.editId);
            if (index !== -1) {
                currentData[index].judul = judul;
                currentData[index].kategori = kategori;
                currentData[index].isi = isi;
                currentData[index].seo = seo;
                currentData[index].tags = tags;
                currentData[index].penulis = penulis;
                currentData[index].editor = editor;
                if (gambarBase64) currentData[index].gambar = gambarBase64;
            }
        } else {
            const beritaBaru = {
                id: Date.now(),
                judul: judul,
                kategori: kategori,
                isi: isi,
                seo: seo,
                tags: tags,
                penulis: penulis,
                editor: editor,
                gambar: gambarBase64 || "https://via.placeholder.com/300x200?text=No+Image",
                tanggal: new Date().toLocaleDateString('id-ID')
            };
            currentData.push(beritaBaru);
        }

        localStorage.setItem("berita", JSON.stringify(currentData));
        berita = currentData; 

        alert("Berita Berhasil Disimpan!");
        renderAdmin();
        updateStats();
        closeForm(); 
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => simpanData(e.target.result);
        reader.readAsDataURL(file);
    } else {
        simpanData(null); 
    }
}

// ==========================================
// 4. TAMPILAN (RENDER DATA)
// ==========================================
function renderAdmin() {
    const container = document.getElementById("adminList");
    if (!container) return;

    container.innerHTML = "";
    const data = JSON.parse(localStorage.getItem("berita")) || [];

    if (data.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Belum ada berita tersimpan.</p>`;
        return;
    }

    data.forEach(item => {
        container.innerHTML += `
            <div class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col h-full">
                <img src="${item.gambar}" class="w-full h-48 object-cover"> 
                <div class="p-4 flex flex-col flex-grow">
                    <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">${item.kategori}</span>
                    <h3 class="font-bold text-gray-800 mt-2 line-clamp-1">${item.judul}</h3>
                    <p class="text-[10px] text-gray-400 mb-2">Penulis: ${item.penulis || 'Admin'}</p>
                    <p class="text-xs text-gray-400 mb-4">${item.tanggal}</p>
                    
                    <div class="flex gap-2 mt-auto">
                        <button onclick="editBerita(${item.id})" class="flex-1 bg-amber-100 text-amber-700 font-semibold text-xs py-2 rounded-xl hover:bg-amber-200 transition">
                            ✏️ Edit
                        </button>
                        <button onclick="hapusBerita(${item.id})" class="flex-1 bg-red-100 text-red-700 font-semibold text-xs py-2 rounded-xl hover:bg-red-200 transition">
                            🗑️ Hapus
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

function updateStats() {
    const data = JSON.parse(localStorage.getItem("berita")) || [];
    if (document.getElementById("total")) document.getElementById("total").innerText = data.length;
    if (document.getElementById("publish")) document.getElementById("publish").innerText = data.length;
}

// ==========================================
// 5. FITUR EDIT & HAPUS
// ==========================================
function editBerita(id) {
    const data = JSON.parse(localStorage.getItem("berita")) || [];
    const item = data.find(b => b.id === id);

    if (item) {
        document.getElementById("judul").value = item.judul;
        document.getElementById("kategori").value = item.kategori;
        document.getElementById("isi").value = item.isi;
        
        // ISI INPUT BARU SAAT EDIT
        if(document.getElementById("seoKey")) document.getElementById("seoKey").value = item.seo || "";
        if(document.getElementById("tagInput")) document.getElementById("tagInput").value = item.tags || "";
        if(document.getElementById("penulis")) document.getElementById("penulis").value = item.penulis || "";
        if(document.getElementById("editor")) document.getElementById("editor").value = item.editor || "";

        window.editId = id;
        document.querySelector("#form h2").innerText = "Edit Berita";
        openForm();
    }
}

function hapusBerita(id) {
    if (confirm("Apakah Anda yakin ingin menghapus berita ini?")) {
        let data = JSON.parse(localStorage.getItem("berita")) || [];
        data = data.filter(item => item.id !== id);
        localStorage.setItem("berita", JSON.stringify(data));
        renderAdmin();
        updateStats();
    }
}

function toggleList() {
    document.getElementById("adminList").classList.toggle("hidden");
}

function logout() {
    if (confirm("Ingin keluar dari Dashboard?")) {
        window.location.href = "index.html";
    }
}