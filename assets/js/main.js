import { initI18n } from './modules/i18n.js';
import { initNav } from './modules/nav.js';
import { initHero } from './modules/hero.js';
import { initReveal, initCounters } from './modules/reveal.js';
import { initServices } from './modules/services.js';
import { initGallery } from './modules/gallery.js';
import { initMediaTriggers } from './modules/media-triggers.js';
import { initProjectFilter } from './modules/project-filter.js';
import { initBeforeAfter } from './modules/before-after.js';
import { initTestimonials } from './modules/testimonials.js';
import { initFaq } from './modules/faq.js';
import { initContactForm } from './modules/contact-form.js';
import { initNewsletter } from './modules/newsletter.js';
import { initLightbox } from './modules/lightbox.js';

function safe(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`[AgroBerry] ${name} failed to initialize:`, err);
  }
}

function bootstrap() {
  safe('i18n', initI18n);
  safe('nav', initNav);
  safe('hero', initHero);
  safe('lightbox', initLightbox);
  safe('services', initServices);
  safe('gallery', initGallery);
  safe('project-filter', initProjectFilter);
  safe('media-triggers', initMediaTriggers);
  safe('before-after', initBeforeAfter);
  safe('testimonials', initTestimonials);
  safe('faq', initFaq);
  safe('contact-form', initContactForm);
  safe('newsletter', initNewsletter);
  safe('reveal', initReveal);
  safe('counters', initCounters);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

bootstrap();
