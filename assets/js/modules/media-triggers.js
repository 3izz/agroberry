import { openLightbox } from './lightbox.js';

export function initMediaTriggers() {
  document.querySelectorAll('.video-card[data-video]').forEach((card) => {
    const open = () => {
      openLightbox(
        [{ type: 'video', src: card.getAttribute('data-video'), poster: card.getAttribute('data-poster') }],
        0
      );
    };
    card.addEventListener('click', open);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });
  });

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openLightbox([{ type: 'image', src: btn.getAttribute('data-lightbox') }], 0);
    });
  });

  document.querySelectorAll('[data-lightbox-video]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openLightbox(
        [{ type: 'video', src: btn.getAttribute('data-lightbox-video'), poster: btn.getAttribute('data-poster') }],
        0
      );
    });
  });
}
