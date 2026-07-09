export function initBeforeAfter() {
  const slider = document.getElementById('baSlider');
  const range = document.getElementById('baRange');
  const beforeImg = document.getElementById('baBeforeImg');
  const handle = document.getElementById('baHandle');
  if (!slider || !range || !beforeImg) return;

  const rtl = () => document.documentElement.dir === 'rtl';

  function setPosition(percent) {
    const clamped = Math.min(100, Math.max(0, percent));
    const inset = rtl() ? `0 0 0 ${100 - clamped}%` : `0 ${100 - clamped}% 0 0`;
    beforeImg.style.clipPath = `inset(${inset})`;
    handle.style.insetInlineStart = `${clamped}%`;
  }

  let dragging = false;
  const updateFromClientX = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let percent = ((clientX - rect.left) / rect.width) * 100;
    if (rtl()) percent = 100 - percent;
    setPosition(percent);
    range.value = String(Math.round(percent));
  };

  range.addEventListener('input', () => setPosition(Number(range.value)));

  slider.addEventListener('pointerdown', (e) => {
    dragging = true;
    updateFromClientX(e.clientX);
  });
  window.addEventListener('pointermove', (e) => {
    if (dragging) updateFromClientX(e.clientX);
  });
  window.addEventListener('pointerup', () => {
    dragging = false;
  });

  setPosition(50);
}
