const audio = document.getElementById('bg-music');
const player = document.getElementById('music-player');
const iconPlay = document.getElementById('icon-play');
const iconPause = document.getElementById('icon-pause');

audio.volume = 0.4;

// Single source of truth: sync icon to the audio element's REAL state
function updateIconFromAudio() {
    const playing = !audio.paused;
    iconPlay.classList.toggle('hidden', playing);
    iconPause.classList.toggle('hidden', !playing);
}

// These fire on ANY play/pause, from any source
audio.addEventListener('play', updateIconFromAudio);
audio.addEventListener('pause', updateIconFromAudio);

function tryPlay() {
    audio.play().catch(() => {}); // icon updates via the 'play' event, not here
}

window.addEventListener('load', tryPlay);

function startOnFirstInteraction() {
    if (audio.paused) tryPlay();
    document.removeEventListener('click', startOnFirstInteraction);
    document.removeEventListener('touchstart', startOnFirstInteraction);
    document.removeEventListener('scroll', startOnFirstInteraction);
    document.removeEventListener('keydown', startOnFirstInteraction);
}
document.addEventListener('click', startOnFirstInteraction);
document.addEventListener('touchstart', startOnFirstInteraction);
document.addEventListener('scroll', startOnFirstInteraction);
document.addEventListener('keydown', startOnFirstInteraction);

player.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Catch the case where audio is already playing when script runs
updateIconFromAudio();