const RSVP_SRC = "https://docs.google.com/forms/d/e/1FAIpQLSdL6M2oB0jDL3Y_hjEWuLXrq4GfZix8On-zWswUIryAUu2Vpg/viewform?embedded=true";

const curtain = document.getElementById("curtain");
const navbar = document.getElementById("navbar");
const mobileMenu = document.getElementById("mobile-menu");
const rsvpModal = document.getElementById("rsvp-modal");
const formSlot = document.getElementById("form-slot");
const audio = document.getElementById("bg-music");
const player = document.getElementById("music-player");

function setLocked(locked) {
    document.documentElement.classList.toggle("locked", locked);
    document.body.classList.toggle("locked", locked);
}

function openCurtain() {
    if (!curtain || curtain.classList.contains("open")) return;
    curtain.classList.add("open");
    setLocked(false);
    if (audio) audio.play().catch(() => {});
    setTimeout(() => curtain.classList.add("gone"), 1600);
}

function toggleMobileMenu(forceClose) {
    const open = forceClose === false ? false : !mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open", open);
    setLocked(open || rsvpModal.classList.contains("open"));
}

function ensureRsvpFrame() {
    if (formSlot.querySelector("iframe")) return;
    const frame = document.createElement("iframe");
    frame.src = RSVP_SRC;
    frame.title = "RSVP form";
    frame.loading = "lazy";
    formSlot.replaceChildren(frame);
}

function toggleRSVP(forceClose) {
    const open = forceClose === false ? false : !rsvpModal.classList.contains("open");
    if (open) {
        ensureRsvpFrame();
        mobileMenu.classList.remove("open");
    }
    rsvpModal.classList.toggle("open", open);
    document.body.classList.toggle("locked", open || mobileMenu.classList.contains("open"));
}

document.querySelectorAll("[data-open-curtain]").forEach((el) => {
    el.addEventListener("click", openCurtain);
});

document.querySelectorAll("[data-menu]").forEach((el) => {
    el.addEventListener("click", () => toggleMobileMenu());
});

document.querySelectorAll("[data-rsvp]").forEach((el) => {
    el.addEventListener("click", () => toggleRSVP());
});

mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(false));
});

rsvpModal.addEventListener("click", (e) => {
    if (e.target === rsvpModal) toggleRSVP(false);
});

window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
}, { passive: true });

const eventDate = new Date("2026-12-12T14:00:00").getTime();
const countdownEls = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    minutes: document.getElementById("cd-minutes"),
    seconds: document.getElementById("cd-seconds"),
};

function updateCountdown() {
    const distance = eventDate - Date.now();
    const pad = (n) => String(Math.max(0, n));
    countdownEls.days.textContent = pad(Math.floor(distance / 86400000));
    countdownEls.hours.textContent = pad(Math.floor((distance % 86400000) / 3600000));
    countdownEls.minutes.textContent = pad(Math.floor((distance % 3600000) / 60000));
    countdownEls.seconds.textContent = pad(Math.floor((distance % 60000) / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

if (audio && player) {
    audio.volume = 0.4;
    const sync = () => player.classList.toggle("playing", !audio.paused);
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    player.addEventListener("click", (e) => {
        e.stopPropagation();
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
    });
    sync();
}
