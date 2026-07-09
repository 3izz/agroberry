import { t } from './i18n.js';

const BUSINESS_EMAIL = 'info@agroberry.jo';

export function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const service = form.service.value.trim();
    const message = form.message.value.trim();

    if (!name || !phone || !email || !message) {
      status.textContent = t('contact.form.required', 'Please fill in all required fields.');
      status.className = 'form-status is-visible is-error';
      return;
    }

    const subject = `AgroBerry Inquiry — ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      service ? `Service: ${service}` : null,
      '',
      message,
    ].filter(Boolean);

    const mailto = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    window.location.href = mailto;

    status.textContent = t('contact.form.success', "Thank you — we'll be in touch shortly.");
    status.className = 'form-status is-visible is-success';
    form.reset();
  });
}
