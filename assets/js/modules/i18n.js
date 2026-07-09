import { en, ar } from '../data/i18n-data.js';

const STORAGE_KEY = 'agroberry:lang';
const SUPPORTED = ['en', 'ar'];
const RTL_LANGS = new Set(['ar']);
const LOCALES = { en, ar };

let currentLang = 'en';
let dict = en;

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function t(key, fallback = '') {
  const value = getByPath(dict, key);
  return value !== undefined ? value : fallback;
}

export function getLang() {
  return currentLang;
}

export function isRTL() {
  return RTL_LANGS.has(currentLang);
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isRTL() ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const value = getByPath(dict, key);
    if (value !== undefined) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = getByPath(dict, key);
    if (value !== undefined) el.setAttribute('placeholder', value);
  });

  document.title = getByPath(dict, 'meta.title') || document.title;
  const setMeta = (selector, attr, key) => {
    const el = document.querySelector(selector);
    const value = getByPath(dict, key);
    if (el && value !== undefined) el.setAttribute(attr, value);
  };
  setMeta('meta[name="description"]', 'content', 'meta.description');
  setMeta('meta[property="og:title"]', 'content', 'meta.ogTitle');
  setMeta('meta[property="og:description"]', 'content', 'meta.ogDescription');
  setMeta('meta[name="twitter:title"]', 'content', 'meta.ogTitle');
  setMeta('meta[name="twitter:description"]', 'content', 'meta.ogDescription');

  document.querySelectorAll('[data-lang]').forEach((el) => {
    el.classList.toggle('is-active', el.getAttribute('data-lang') === currentLang);
  });

  document.dispatchEvent(new CustomEvent('i18n:ready', { detail: { lang: currentLang, dict } }));
}

export function setLang(lang) {
  if (!SUPPORTED.includes(lang)) lang = 'en';
  dict = LOCALES[lang] || en;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (err) {
    // localStorage unavailable (e.g. file:// in some browsers) — safe to ignore
  }
  applyTranslations();
}

export function initI18n() {
  let saved = null;
  try {
    saved = localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    // ignore
  }
  const initial = SUPPORTED.includes(saved) ? saved : 'en';
  setLang(initial);

  const langSwitch = document.getElementById('langSwitch');
  if (langSwitch) {
    langSwitch.addEventListener('click', () => {
      const next = currentLang === 'en' ? 'ar' : 'en';
      setLang(next);
    });
  }
}
