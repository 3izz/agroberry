let state = {
  items: [],
  index: 0,
};

let lightbox, content, closeBtn, prevBtn, nextBtn;

function renderCurrent() {
  const item = state.items[state.index];
  if (!item) return;
  content.innerHTML = '';

  if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    if (item.poster) video.poster = item.poster;
    content.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || '';
    content.appendChild(img);
  }

  if (item.caption) {
    const cap = document.createElement('p');
    cap.className = 'lightbox-caption';
    cap.textContent = item.caption;
    content.appendChild(cap);
  }

  const multi = state.items.length > 1;
  prevBtn.style.display = multi ? '' : 'none';
  nextBtn.style.display = multi ? '' : 'none';
}

function stopMedia() {
  content.querySelectorAll('video').forEach((v) => v.pause());
}

export function closeLightbox() {
  stopMedia();
  lightbox.classList.remove('is-open');
  document.body.style.overflow = '';
}

export function openLightbox(items, startIndex = 0) {
  state.items = items;
  state.index = startIndex;
  lightbox.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  renderCurrent();
}

function next() {
  stopMedia();
  state.index = (state.index + 1) % state.items.length;
  renderCurrent();
}

function prev() {
  stopMedia();
  state.index = (state.index - 1 + state.items.length) % state.items.length;
  renderCurrent();
}

export function initLightbox() {
  lightbox = document.getElementById('lightbox');
  content = document.getElementById('lightboxContent');
  closeBtn = document.getElementById('lightboxClose');
  prevBtn = document.getElementById('lightboxPrev');
  nextBtn = document.getElementById('lightboxNext');
  if (!lightbox) return;

  closeBtn.addEventListener('click', closeLightbox);
  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}
