// ==========================================
// 1. FUNGSI FOTO MEMBESAR (LIGHTBOX) & PEMUTAR MUSIK
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const daftarFoto = document.querySelectorAll('.gallery-scroll img, .polaroid, .planet-card');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalIframe = document.getElementById('modal-iframe'); // Panggil elemen iframe
    const modalCaption = document.getElementById('modal-caption');

    if (daftarFoto.length > 0 && modal && modalImg) {
        daftarFoto.forEach(foto => {
            foto.addEventListener('click', function () {

                // Reset layar setiap kali diklik
                if (modalCaption) modalCaption.innerText = "";
                modalImg.style.display = 'block'; // Tampilkan foto sebagai default
                modalIframe.style.display = 'none'; // Sembunyikan musik sebagai default
                modalIframe.src = ""; // Kosongkan lagu sebelumnya

                // A. JIKA YANG DIKLIK ADALAH KARTU LAGU (Punya data-embed)
                if (this.classList.contains('planet-card') && this.hasAttribute('data-embed')) {
                    modalImg.style.display = 'none'; // Sembunyikan foto
                    modalIframe.style.display = 'block'; // Tampilkan alat musik
                    modalIframe.src = this.getAttribute('data-embed'); // Masukkan link Spotify

                    const teksCaption = this.querySelector('.planet-caption').innerText;
                    if (modalCaption) modalCaption.innerText = teksCaption;
                }
                // B. JIKA YANG DIKLIK ADALAH KARTU 3D BIASA (Bukan Lagu)
                else if (this.classList.contains('planet-card')) {
                    modalImg.src = this.querySelector('img').src;
                    modalImg.style.aspectRatio = "3 / 4";

                    const teksCaption = this.querySelector('.planet-caption').innerText;
                    if (modalCaption) modalCaption.innerText = teksCaption;
                }
                // C. JIKA YANG DIKLIK ADALAH POLAROID
                else if (this.classList.contains('polaroid')) {
                    modalImg.src = this.querySelector('img').src;
                    modalImg.style.aspectRatio = "1 / 1";
                }
                // D. JIKA YANG DIKLIK ADALAH GALERI CINTA
                else {
                    modalImg.src = this.src;
                    modalImg.style.aspectRatio = "9 / 16";
                }

                modal.classList.add('show-modal');
            });
        });
    }

    const semuaTeksKetikan = document.querySelectorAll('.typing-text');
    semuaTeksKetikan.forEach(el => {
        el.setAttribute('data-teks', el.innerHTML);
        el.innerHTML = '';
    });
});

// Fungsi Menutup Layar & Mematikan Lagu
function tutupModal() {
    const modal = document.getElementById('image-modal');
    const modalIframe = document.getElementById('modal-iframe');

    if (modal) {
        modal.classList.remove('show-modal');
        // KUNCI PENTING: Mengosongkan src agar lagu berhenti berputar saat ditutup
        if (modalIframe) {
            modalIframe.src = "";
        }
    }
}

// ==========================================
// 2. FUNGSI KADO & PEMUTAR MUSIK LATAR
// ==========================================
function bukaKado() {
    buatHujanBunga();

    const flash = document.getElementById('flash-light');
    if (flash) flash.classList.add('flash-active');

    // --- MULAI MUSIK & MUNCULKAN POP-UP ---
    const bgMusic = document.getElementById('bg-music');
    const musicPopup = document.getElementById('music-popup');

    // Putar musiknya
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Browser memblokir autoplay, tidak masalah.");
        });
    }

    // Munculkan notifikasi pop-up dari bawah layar
    if (musicPopup) {
        setTimeout(() => {
            musicPopup.classList.add('show-music');
        }, 1000);
    }
    // --------------------------------------

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

    for (let i = 0; i < 40; i++) {
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

// ==========================================
// 4. FUNGSI TOGGLE PLAY/PAUSE MUSIK (SPOTIFY STYLE)
// ==========================================
function toggleMusic() {
    const bgMusic = document.getElementById('bg-music');
    const iconPlay = document.getElementById('icon-play');
    const iconPause = document.getElementById('icon-pause');

    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play().catch(console.error);
        iconPlay.style.display = 'none';
        iconPause.style.display = 'block';
    } else {
        bgMusic.pause();
        iconPlay.style.display = 'block';
        iconPause.style.display = 'none';
    }
}

// ==========================================
// 5. FUNGSI MENUTUP POP-UP MUSIK
// ==========================================
function hideMusicPopup() {
    const musicPopup = document.getElementById('music-popup');
    const showMusicBtn = document.getElementById('show-music-btn');
    if (musicPopup) {
        musicPopup.classList.remove('show-music');
    }
    if (showMusicBtn) {
        showMusicBtn.classList.add('show-btn');
    }
}

function showMusicPopup() {
    const musicPopup = document.getElementById('music-popup');
    const showMusicBtn = document.getElementById('show-music-btn');
    if (musicPopup) {
        musicPopup.classList.add('show-music');
    }
    if (showMusicBtn) {
        showMusicBtn.classList.remove('show-btn');
    }
}