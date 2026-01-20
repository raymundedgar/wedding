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
startCurtainPetals();

function openCurtain() {
    const curtain = document.getElementById('curtain-overlay');
    curtain.classList.add('open');
    
    // Remove position fixed to allow scrolling
    document.body.classList.remove('noscroll');
    document.body.style.position = '';
    document.body.style.width = '';
    
    clearInterval(curtainPetalInterval);
    const curtainPetalContainer = document.getElementById('curtain-petals');
    if(curtainPetalContainer) curtainPetalContainer.innerHTML = '';

    setTimeout(() => {
        curtain.classList.add('hidden');
        startPetals();
    }, 1500);
}

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
function startPetals() {
    const container = document.getElementById('petals-container');
    const colors = ['#F9F9F5', '#E8F5E9', '#FFFFFF'];
    
    const isMobile = window.innerWidth < 768;
    const spawnRate = isMobile ? 1200 : 600;

    setInterval(() => {
        if(container.childElementCount > (isMobile ? 10 : 30)) return;

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
    
    if (window.scrollY > 300) {
        musicPlayer.classList.add('scrolled-visible');
        if (musicTooltip && musicTooltip.style.display !== 'none') {
            musicTooltip.classList.add('tooltip-visible');
        }
    } else {
        musicPlayer.classList.remove('scrolled-visible');
        if (musicTooltip) {
            musicTooltip.classList.remove('tooltip-visible');
        }
    }
}, { passive: true });

// Mobile Menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const isOpen = !menu.classList.contains('translate-x-full');
    
    if (isOpen) {
        menu.classList.add('translate-x-full');
    } else {
        menu.classList.remove('translate-x-full');
    }
}

// RSVP Modal Logic
function toggleRSVP() {
    const modal = document.getElementById('rsvp-modal');
    const isOpen = modal.classList.contains('open');
    
    if (isOpen) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    } else {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

// Close RSVP on outside click
document.getElementById('rsvp-modal').addEventListener('click', (e) => {
    if (e.target.id === 'rsvp-modal') {
        toggleRSVP();
    }
});
