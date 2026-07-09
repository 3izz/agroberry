export function initHero() {
  const video = document.getElementById('heroVideo');
  const poster = document.getElementById('heroPoster');
  if (!video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    video.removeAttribute('autoplay');
    video.pause();
    return; // keep the static poster only
  }

  const reveal = () => {
    video.classList.add('is-ready');
    poster?.classList.remove('is-ready');
  };

  if (video.readyState >= 2) {
    reveal();
  } else {
    video.addEventListener('loadeddata', reveal, { once: true });
  }

  const tryPlay = () => video.play().catch(() => {});
  tryPlay();
  document.addEventListener('click', tryPlay, { once: true });
}
