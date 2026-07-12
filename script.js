// ==========================================
// 1. FUNGSI FOTO MEMBESAR (LIGHTBOX) & PERSIAPAN KETIKAN
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const daftarFoto = document.querySelectorAll('.gallery-scroll img, .polaroid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');

    if (daftarFoto.length > 0 && modal && modalImg) {
        daftarFoto.forEach(foto => {
            foto.addEventListener('click', function() {
                // Cek apakah yang diklik itu Polaroid (Slide 5)
                if(this.classList.contains('polaroid')) {
                    modalImg.src = this.querySelector('img').src;
                    
                    // Paksa layar membesar jadi Kotak (1:1)
                    modalImg.style.aspectRatio = "1 / 1";
                    modalImg.style.objectFit = "cover";
                } 
                // Jika bukan Polaroid, berarti itu Galeri Cinta (Slide 4)
                else {
                    modalImg.src = this.src;
                    
                    // Paksa layar membesar jadi Potret (9:16)
                    modalImg.style.aspectRatio = "9 / 16";
                    modalImg.style.objectFit = "cover";
                }
                modal.classList.add('show-modal');
            });
        });
    }

    // Sembunyikan Teks Sejak Awal untuk Efek Ketikan
    const semuaTeksKetikan = document.querySelectorAll('.typing-text');
    semuaTeksKetikan.forEach(el => {
        el.setAttribute('data-teks', el.innerHTML); 
        el.innerHTML = ''; 
    });
});

function tutupModal() {
    const modal = document.getElementById('image-modal');
    if (modal) {
        modal.classList.remove('show-modal');
    }
}

// ==========================================
// 2. FUNGSI KADO (HALAMAN AWAL)
// ==========================================
function bukaKado() {
    buatHujanBunga();
    
    const flash = document.getElementById('flash-light');
    if (flash) flash.classList.add('flash-active');

    setTimeout(() => {
        const landingPage = document.getElementById('landing-page');
        const mainContent = document.getElementById('main-content');
        
        if (landingPage) landingPage.style.display = 'none';
        if (mainContent) mainContent.classList.remove('hidden');
        
        jalankanAnimasiScroll(); 
    }, 450); 
}

function buatHujanBunga() {
    const container = document.getElementById('flower-rain');
    if (!container) return; 

    const bungaPilihan = ['🌸', '🌺', '🌷', '✨', '💖'];
    
    for(let i = 0; i < 40; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        petal.innerText = bungaPilihan[Math.floor(Math.random() * bungaPilihan.length)];
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = (Math.random() * 3 + 2) + 's';
        petal.style.animationDelay = (Math.random() * 1) + 's'; 
        
        container.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
        }, 6000);
    }
}

// ==========================================
// 3. FUNGSI SENSOR SCROLL & MESIN TIK BERURUTAN
// ==========================================
function jalankanAnimasiScroll() {
    const elemenScroll = document.querySelectorAll('.show-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('is-visible')) {
                    entry.target.classList.add('is-visible');
                    mulaiKetikanBerurutan(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1, 
        rootMargin: "0px 0px -35% 0px" 
    });

    elemenScroll.forEach((el) => observer.observe(el));
}

async function mulaiKetikanBerurutan(slideTarget) {
    const teksKetikan = slideTarget.querySelectorAll('.typing-text');

    await new Promise(resolve => setTimeout(resolve, 600));

    for (let i = 0; i < teksKetikan.length; i++) {
        const el = teksKetikan[i];
        const teksAsli = el.getAttribute('data-teks');

        if (teksAsli) {
            await ketikTeks(el, teksAsli);
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }
}

function ketikTeks(elemen, teks) {
    return new Promise(resolve => {
        let index = 0;
        elemen.innerHTML = ''; 

        function ketik() {
            if (index < teks.length) {
                elemen.innerHTML += teks.charAt(index);
                index++;
                setTimeout(ketik, 35); 
            } else {
                elemen.classList.add('typing-done'); 
                resolve(); 
            }
        }
        
        ketik(); 
    });
}