export function initProjectFilter() {
  const bar = document.getElementById('projectFilterBar');
  const grid = document.getElementById('projectGrid');
  if (!bar || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.project-card'));
  const buttons = Array.from(bar.querySelectorAll('.filter-btn'));

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      buttons.forEach((b) => b.classList.toggle('is-active', b === btn));

      cards.forEach((card) => {
        const match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}
