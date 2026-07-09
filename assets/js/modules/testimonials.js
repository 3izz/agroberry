import { t } from './i18n.js';
import { observeReveal } from './reveal.js';

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function render() {
  const track = document.getElementById('testimonialTrack');
  const controls = document.getElementById('testimonialControls');
  if (!track) return;

  const items = t('testimonials.items', []);
  if (!Array.isArray(items) || !items.length) return;

  track.innerHTML = items
    .map(
      (item) => `
    <article class="testimonial-card reveal">
      <div class="testimonial-stars" aria-hidden="true">
        ${'<svg><use href="#icon-star"></use></svg>'.repeat(5)}
      </div>
      <blockquote>&ldquo;${item.quote}&rdquo;</blockquote>
      <div class="testimonial-person">
        <span class="testimonial-avatar">${initials(item.name)}</span>
        <div>
          <strong>${item.name}</strong>
          <span>${item.role}</span>
        </div>
      </div>
    </article>`
    )
    .join('');

  if (controls) {
    controls.innerHTML = items
      .map((_, i) => `<button class="testimonial-dot${i === 0 ? ' is-active' : ''}" data-index="${i}" aria-label="Go to testimonial ${i + 1}"></button>`)
      .join('');

    const cards = Array.from(track.children);
    const dots = Array.from(controls.children);

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        cards[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target);
            dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    cards.forEach((card) => observer.observe(card));
  }

  observeReveal(track);
}

export function initTestimonials() {
  render();
  document.addEventListener('i18n:ready', render);
}
