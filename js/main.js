// Initialize Lucide Icons
lucide.createIcons();

// Curtain Logic
let curtainPetalInterval;

function startCurtainPetals() {
    const container = document.getElementById('curtain-petals');
    const colors = ['#D4AF37', '#FFF', '#F9F9F5', '#E8F5E9'];

    const isMobile = window.innerWidth < 768;
    const intervalTime = isMobile ? 800 : 400;

    curtainPetalInterval = setInterval(() => {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        const left = Math.random() * 90;
        const size = Math.random() * 8 + 5;
        const duration = Math.random() * 4 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.left = `${left}vw`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.backgroundColor = color;
        petal.style.animationDuration = `${duration}s`;
        petal.style.opacity = Math.random() * 0.5 + 0.3;

        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }, intervalTime);
}

// Start curtain petals immediately
// startCurtainPetals();

function openCurtain() {
    const curtain = document.getElementById('curtain-overlay');
    curtain.classList.add('open');

    // Start background music directly inside this handler — this is the
    // one guaranteed real user gesture on the page ("Tap to Open"), so
    // calling play() here (rather than relying only on a generic
    // document-level listener) is the most reliable way to satisfy
    // mobile browsers' autoplay-requires-gesture policies.
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.play().catch(() => {});
    }

    // Remove scroll lock - multiple methods for reliability
    document.body.classList.remove('noscroll');
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.height = '';
    document.documentElement.style.overflow = '';

    clearInterval(curtainPetalInterval);
    const curtainPetalContainer = document.getElementById('curtain-petals');
    if(curtainPetalContainer) curtainPetalContainer.innerHTML = '';

    setTimeout(() => {
        curtain.classList.add('hidden');
        startPetals();

        // Extra safety check - ensure scroll is enabled
        document.body.classList.remove('noscroll');
        document.body.style.overflow = 'auto';
    }, 1500);
}

// Fallback: Force enable scroll after 3 seconds (safety net)
setTimeout(() => {
    document.body.classList.remove('noscroll');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.documentElement.style.overflow = '';
}, 3000);

// Music Toggle
function toggleMusic() {
    const player = document.getElementById('music-player');
    player.classList.toggle('active');

    const tooltip = document.getElementById('music-tooltip');
    if(tooltip) {
        tooltip.style.display = 'none';
    }
}

// Countdown Timer
const eventDate = new Date('2026-12-12T14:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const container = document.getElementById('countdown');
    if(!container) return;

    const timeUnits = [
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' }
    ];

    container.innerHTML = timeUnits.map(unit => `
        <div class="flex flex-col items-center">
            <span class="text-4xl md:text-6xl font-serif font-light">${unit.value}</span>
            <span class="text-xs uppercase tracking-widest opacity-60 mt-2 text-[#D4AF37]">${unit.label}</span>
        </div>
    `).join('');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Flying Petals
let isUserScrolling = false;
let scrollStopTimer;
window.addEventListener('scroll', () => {
    isUserScrolling = true;
    clearTimeout(scrollStopTimer);
    scrollStopTimer = setTimeout(() => { isUserScrolling = false; }, 200);
}, { passive: true });

function startPetals() {
    const container = document.getElementById('petals-container');
    const colors = ['#F9F9F5', '#E8F5E9', '#FFFFFF'];

    const isMobile = window.innerWidth < 768;
    const spawnRate = isMobile ? 1800 : 600;
    const maxPetals = isMobile ? 5 : 30;

    setInterval(() => {
        // Skip spawning new petals while the user is actively scrolling,
        // so the main thread isn't doing DOM work during the scroll gesture
        if (isUserScrolling) return;
        if(container.childElementCount > maxPetals) return;

        const petal = document.createElement('div');
        petal.classList.add('petal');

        const left = Math.random() * 90;
        const size = Math.random() * 10 + 10;
        const duration = Math.random() * 5 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        petal.style.left = `${left}vw`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.backgroundColor = color;
        petal.style.animationDuration = `${duration}s`;

        container.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, duration * 1000);
    }, spawnRate);
}

// Scroll Effects
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(section => {
    observer.observe(section);
});

// Navbar & Music Scroll Logic
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    const musicPlayer = document.getElementById('music-player');
    const musicTooltip = document.getElementById('music-tooltip');

    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });

// Shared scroll-lock helper that preserves scroll position across
// position:fixed toggling (prevents the page jumping to top on close)
let lockedScrollY = 0;

function lockBodyScroll() {
    lockedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.height = '';
    window.scrollTo(0, lockedScrollY);
}

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const isOpen = !menu.classList.contains('translate-x-full');

    if (isOpen) {
        menu.classList.add('translate-x-full');
        unlockBodyScroll();
    } else {
        menu.classList.remove('translate-x-full');
        lockBodyScroll();
    }
}

// RSVP Modal Logic
function toggleRSVP() {
    const modal = document.getElementById('rsvp-modal');
    const isOpen = modal.classList.contains('open');

    if (isOpen) {
        modal.classList.remove('open');
        unlockBodyScroll();
    } else {
        modal.classList.add('open');
        lockBodyScroll();
    }
}

// Close RSVP on outside click
document.getElementById('rsvp-modal').addEventListener('click', (e) => {
    if (e.target.id === 'rsvp-modal') {
        toggleRSVP();
    }
});

// Mobile scroll fix: Ensure body scrolling is always enabled.
// Safety-net check, but bounded — no need to poll forever after the
// curtain has opened once, since that was the only real risk window.
let scrollFixChecks = 0;
const scrollFixInterval = setInterval(() => {
    scrollFixChecks++;
    const curtain = document.getElementById('curtain-overlay');
    const rsvpModal = document.getElementById('rsvp-modal');

    if (curtain && curtain.classList.contains('hidden') &&
        rsvpModal && !rsvpModal.classList.contains('open')) {
        if (document.body.classList.contains('noscroll')) {
            document.body.classList.remove('noscroll');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.height = '';
        }
    }

    if (scrollFixChecks > 10) clearInterval(scrollFixInterval); // stop after ~10s
}, 1000);