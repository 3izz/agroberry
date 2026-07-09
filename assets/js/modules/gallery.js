import { t } from './i18n.js';
import { observeReveal } from './reveal.js';
import { openLightbox } from './lightbox.js';
import { mediaData } from '../data/media-data.js';

let activeFilter = 'all';

function renderFilterBar(categories) {
  const bar = document.getElementById('galleryFilterBar');
  if (!bar) return;
  bar.innerHTML = categories
    .map(
      (cat) => `
      <button class="filter-btn${cat.id === activeFilter ? ' is-active' : ''}" data-filter="${cat.id}">
        ${t(cat.labelKey, cat.id)}
      </button>`
    )
    .join('');

  bar.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeFilter = btn.getAttribute('data-filter');
      bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderGrid(mediaData.items);
    });
  });
}

function itemToLightboxEntry(item) {
  const caption = t(item.captionKey, '');
  if (item.type === 'video') {
    return { type: 'video', src: item.src, poster: `${item.poster}.jpg`, caption };
  }
  return { type: 'image', src: `${item.src}.jpg`, caption };
}

function renderGrid(items) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const filtered = activeFilter === 'all' ? items : items.filter((i) => i.category === activeFilter);

  grid.innerHTML = filtered
    .map((item, i) => {
      const caption = t(item.captionKey, '');
      const tall = item.height / item.width > 1.4;
      if (item.type === 'video') {
        return `
        <div class="media-card gallery-item${tall ? ' is-tall' : ''} reveal" data-index="${i}" tabindex="0" role="button" aria-label="${caption}">
          <div class="media-frame">
            <img src="${item.poster}.jpg" alt="${caption}" loading="lazy" width="${item.width}" height="${item.height}" />
          </div>
          <div class="play-badge"><svg><use href="#icon-play"></use></svg></div>
          <div class="media-overlay">
            <span class="pill">${t(`gallery.filter.${item.category}`, item.category)}</span>
            <p>${caption}</p>
          </div>
        </div>`;
      }
      return `
        <div class="media-card gallery-item${tall ? ' is-tall' : ''} reveal" data-index="${i}" tabindex="0" role="button" aria-label="${caption}">
          <div class="media-frame">
            <picture>
              <source srcset="${item.src}-thumb.webp" type="image/webp" />
              <img src="${item.src}-thumb.jpg" alt="${caption}" loading="lazy" width="${item.width}" height="${item.height}" />
            </picture>
          </div>
          <div class="media-zoom-icon"><svg><use href="#icon-expand"></use></svg></div>
          <div class="media-overlay">
            <span class="pill">${t(`gallery.filter.${item.category}`, item.category)}</span>
            <p>${caption}</p>
          </div>
        </div>`;
    })
    .join('');

  const lightboxEntries = filtered.map(itemToLightboxEntry);
  grid.querySelectorAll('.media-card').forEach((card) => {
    const openIt = () => {
      const idx = parseInt(card.getAttribute('data-index'), 10);
      openLightbox(lightboxEntries, idx);
    };
    card.addEventListener('click', openIt);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openIt();
      }
    });
  });

  observeReveal(grid);
}

export function initGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  renderFilterBar(mediaData.categories);
  renderGrid(mediaData.items);

  document.addEventListener('i18n:ready', () => {
    renderFilterBar(mediaData.categories);
    renderGrid(mediaData.items);
  });
}
