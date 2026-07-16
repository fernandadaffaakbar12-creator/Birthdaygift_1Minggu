// ==========================================
// 0. ANIMASI LOADING "I LOVE YOU" MEMBENTUK HATI
// ==========================================
(function () {
    const PARTICLE_COUNT = 80;
    const LOVE_TEXTS = ['I love you', 'i love u', 'love', 'ily', '♡', 'luv u', 'sayang', 'cinta'];

    // Parametric heart shape formula
    function heartX(t) {
        return 16 * Math.pow(Math.sin(t), 3);
    }
    function heartY(t) {
        return -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    }

    function mulaiAnimasiLoading() {
        const container = document.getElementById('love-particles-container');
        const loadingScreen = document.getElementById('love-loading-screen');
        const tapText = document.getElementById('loading-tap-text');
        if (!container || !loadingScreen) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const centerX = vw / 2;
        const centerY = vh / 2;
        const scale = Math.min(vw, vh) * 0.018;

        const particles = [];

        // Generate heart shape target positions (relative to center)
        const heartPoints = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const t = (i / PARTICLE_COUNT) * Math.PI * 2;
            heartPoints.push({
                x: heartX(t) * scale,
                y: heartY(t) * scale - 20
            });
        }

        // Build all particles in a document fragment (single DOM insert)
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const el = document.createElement('span');
            el.classList.add('love-particle');
            el.textContent = LOVE_TEXTS[Math.floor(Math.random() * LOVE_TEXTS.length)];

            const fontSize = 8 + Math.random() * 6;
            el.style.fontSize = fontSize + 'px';

            // All particles start at center, use transform for positioning
            el.style.left = centerX + 'px';
            el.style.top = centerY + 'px';

            // Scatter offset from center (bottom area)
            const scatterX = -centerX + Math.random() * vw;
            const scatterY = vh * 0.1 + Math.random() * vh * 0.4;
            const rotation = -30 + Math.random() * 60;

            // Random color
            const colors = [
                'rgba(255, 182, 193, 0.9)',
                'rgba(255, 150, 180, 0.85)',
                'rgba(255, 200, 220, 0.8)',
                'rgba(220, 160, 255, 0.7)',
                'rgba(255, 255, 255, 0.6)',
                'rgba(255, 130, 170, 0.9)'
            ];
            el.style.color = colors[Math.floor(Math.random() * colors.length)];

            fragment.appendChild(el);
            particles.push({
                el: el,
                scatterX: scatterX,
                scatterY: scatterY,
                rotation: rotation,
                heartX: heartPoints[i].x,
                heartY: heartPoints[i].y
            });
        }

        container.appendChild(fragment);

        // Phase 1: Show scattered particles with staggered fade-in
        requestAnimationFrame(() => {
            particles.forEach((p, i) => {
                setTimeout(() => {
                    p.el.style.transform = 'translate(' + p.scatterX + 'px, ' + p.scatterY + 'px) rotate(' + p.rotation + 'deg)';
                    p.el.classList.add('scattered');
                }, 50 + i * 12);
            });
        });

        // Phase 2: Float particles upward slightly (1.5s)
        setTimeout(() => {
            particles.forEach(p => {
                const driftX = p.scatterX + (-40 + Math.random() * 80);
                const driftY = p.scatterY - (20 + Math.random() * 60);
                p.el.style.transform = 'translate(' + driftX + 'px, ' + driftY + 'px) rotate(' + (p.rotation * 0.5) + 'deg)';
            });
        }, 1500);

        // Phase 3: Form the heart shape (3s)
        setTimeout(() => {
            particles.forEach((p, i) => {
                const staggerDelay = (i / PARTICLE_COUNT) * 1000;
                p.el.style.transitionDuration = '2.5s';
                p.el.style.transitionDelay = staggerDelay + 'ms';

                setTimeout(() => {
                    p.el.style.transform = 'translate(' + p.heartX + 'px, ' + p.heartY + 'px) rotate(0deg) scale(1)';
                    p.el.classList.remove('scattered');
                    p.el.classList.add('formed');
                }, 30);
            });
        }, 3000);

        // Phase 4: Add glow pulse & sparkles after heart is formed (6.5s)
        setTimeout(() => {
            particles.forEach((p, i) => {
                p.el.classList.add('glow-pulse');
            });

            buatSparkles(container, heartPoints, centerX, centerY);
            if (tapText) tapText.classList.add('show');
        }, 6500);

        // Click/tap to dismiss with planet transition
        let bisaDismiss = false;
        setTimeout(() => { bisaDismiss = true; }, 6000);
        loadingScreen.addEventListener('click', function () {
            if (!bisaDismiss) return;
            bisaDismiss = false;

            if (tapText) tapText.classList.remove('show');

            // Phase A: SUCK particles into the center
            particles.forEach((p) => {
                p.el.style.transitionDuration = '0.8s';
                p.el.style.transitionDelay = (Math.random() * 150) + 'ms';
                p.el.style.transitionTimingFunction = 'cubic-bezier(0.5, 0, 1, 0.5)';
                p.el.style.transform = 'translate(0px, 0px) scale(0) rotate(180deg)';
                p.el.style.opacity = '0';
            });

            // Phase B: Fade out screen
            setTimeout(() => {
                loadingScreen.style.transition = 'opacity 1s ease';
                loadingScreen.style.opacity = '0';
            }, 800);

            // Phase C: Show PIN screen instead of landing page
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const pinScreen = document.getElementById('pin-screen');
                if (pinScreen) {
                    pinScreen.style.display = 'flex';
                    // Delay sedikit agar transisi CSS jalan
                    setTimeout(() => {
                        pinScreen.classList.add('active');
                    }, 50);
                }
            }, 1800);
        });

        // ==========================================
        // PIN VALIDATION LOGIC
        // ==========================================
        const pinSubmitBtn = document.getElementById('pin-submit');
        const pinInput = document.getElementById('pin-input');
        const pinError = document.getElementById('pin-error');

        // DEFAULT PIN: Silakan ubah angka 2607 ini jika ingin PIN lain
        const SECRET_PIN = "2708";

        if (pinSubmitBtn && pinInput) {
            pinSubmitBtn.addEventListener('click', verifyPin);
            pinInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') verifyPin();
            });

            function verifyPin() {
                if (pinInput.value === SECRET_PIN) {
                    const pinScreen = document.getElementById('pin-screen');
                    pinScreen.classList.remove('active');
                    pinError.style.display = 'none';

                    setTimeout(() => {
                        pinScreen.style.display = 'none';
                        const landingPage = document.getElementById('landing-page');
                        if (landingPage) landingPage.style.display = '';
                    }, 1000); // Tunggu animasi fade out selesai
                } else {
                    pinError.style.display = 'block';
                    pinInput.classList.add('shake-animation');
                    setTimeout(() => pinInput.classList.remove('shake-animation'), 400);
                    pinInput.value = ''; // Reset input
                }
            }
        }
    }

    function buatSparkles(container, heartPoints, centerX, centerY) {
        const sparkleInterval = setInterval(() => {
            const sparkle = document.createElement('div');
            sparkle.classList.add('heart-sparkle');

            const randomPoint = heartPoints[Math.floor(Math.random() * heartPoints.length)];
            const offsetX = -15 + Math.random() * 30;
            const offsetY = -15 + Math.random() * 30;

            sparkle.style.left = (centerX + randomPoint.x + offsetX) + 'px';
            sparkle.style.top = (centerY + randomPoint.y + offsetY) + 'px';
            sparkle.style.animation = 'sparkleFloat ' + (1.5 + Math.random() * 1.5) + 's ease-out forwards';

            container.appendChild(sparkle);
            setTimeout(() => sparkle.remove(), 3000);
        }, 400);

        document.getElementById('love-loading-screen').addEventListener('click', () => {
            clearInterval(sparkleInterval);
        }, { once: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mulaiAnimasiLoading);
    } else {
        mulaiAnimasiLoading();
    }
})();

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
// 5. FUNGSI MENYEMBUNYIKAN POP-UP MUSIK SAAT SCROLL
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

// Auto-hide pop-up musik saat user mulai scroll
(function () {
    let sudahDisembunyikan = false;

    window.addEventListener('scroll', function () {
        const musicPopup = document.getElementById('music-popup');

        // Hanya sembunyikan jika pop-up sedang tampil dan belum pernah disembunyikan oleh scroll
        if (!sudahDisembunyikan && musicPopup && musicPopup.classList.contains('show-music')) {
            hideMusicPopup();
            sudahDisembunyikan = true;
        }
    });

    // Reset flag saat pop-up ditampilkan kembali lewat tombol 🎵
    const originalShowMusicPopup = showMusicPopup;
    showMusicPopup = function () {
        sudahDisembunyikan = false;
        originalShowMusicPopup();
    };
    // Pasang ulang ke window agar onclick di HTML tetap berfungsi
    window.showMusicPopup = showMusicPopup;
})();

// ==========================================
// SCRATCH CARD (ERASER EFFECT) LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvases = document.querySelectorAll('.scratch-canvas');
    
    canvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let brushRadius = 25; // Ukuran penghapus

        // Beri sedikit delay agar browser memuat DOM
        setTimeout(() => {
            // Karena elemen ini disembunyikan di awal (display: none),
            // getBoundingClientRect() akan menghasilkan 0. 
            // Kita hardcode ukurannya sesuai CSS (.scratch-card width: 220px, aspect-ratio: 9/16)
            canvas.width = 220;
            canvas.height = Math.round(220 * 16 / 9); // ~391px

            // 1. Gambar layer hitam penutup
            ctx.fillStyle = '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 2. Tambahkan efek glitter (bintik-bintik kecil)
            for(let i = 0; i < 200; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    Math.random() * 1.5,
                    0, Math.PI * 2
                );
                ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.8)' : 'rgba(255,182,193,0.8)';
                ctx.fill();
            }

            // 3. Ubah mode compositing agar brush menghapus piksel (menjadi transparan)
            ctx.globalCompositeOperation = 'destination-out';
            
            // 4. Logika Menggambar/Menghapus
            const startPosition = (e) => {
                isDrawing = true;
                draw(e);
            };

            const endPosition = () => {
                isDrawing = false;
                ctx.beginPath(); // Reset garis agar tidak menyambung ke sentuhan berikutnya
            };

            const draw = (e) => {
                if (!isDrawing) return;
                
                // e.preventDefault(); // Jangan halangi scroll secara default kecuali saat menggesek
                
                let clientX, clientY;
                if (e.type.includes('touch')) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                
                const canvasRect = canvas.getBoundingClientRect();
                const x = clientX - canvasRect.left;
                const y = clientY - canvasRect.top;

                ctx.lineWidth = brushRadius * 2;
                ctx.lineCap = 'round';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(x, y);
            };

            // Pasang event listener untuk Mouse
            canvas.addEventListener('mousedown', startPosition);
            canvas.addEventListener('mouseup', endPosition);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseleave', endPosition);
            
            // Pasang event listener untuk Touchscreen (HP)
            canvas.addEventListener('touchstart', startPosition, { passive: true });
            canvas.addEventListener('touchend', endPosition);
            canvas.addEventListener('touchmove', (e) => {
                if(isDrawing) e.preventDefault(); // Cegah layar ikut ke-scroll saat sedang menggesek foto
                draw(e);
            }, { passive: false });
            
        }, 500); 
    });
});