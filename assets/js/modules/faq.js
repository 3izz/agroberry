import { t } from './i18n.js';
import { observeReveal } from './reveal.js';

function render() {
  const list = document.getElementById('faqList');
  if (!list) return;

  const items = t('faq.items', []);
  if (!Array.isArray(items) || !items.length) return;

  list.innerHTML = items
    .map(
      (item) => `
    <div class="faq-item reveal">
      <button class="faq-question" aria-expanded="false">
        <span>${item.q}</span>
        <span class="faq-icon"><svg><use href="#icon-plus"></use></svg></span>
      </button>
      <div class="faq-answer">
        <div class="faq-answer-inner"><p>${item.a}</p></div>
      </div>
    </div>`
    )
    .join('');

  list.querySelectorAll('.faq-item').forEach((item) => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      list.querySelectorAll('.faq-item.is-open').forEach((open) => {
        open.classList.remove('is-open');
        open.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  observeReveal(list);
}

export function initFaq() {
  render();
  document.addEventListener('i18n:ready', render);
}
