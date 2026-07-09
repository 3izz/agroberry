import { t } from './i18n.js';

export function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const note = document.getElementById('newsletterNote');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    note.textContent = t('footer.newsletterSuccess', 'Thank you for subscribing.');
    form.reset();
  });
}
