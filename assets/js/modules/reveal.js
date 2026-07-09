const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let revealObserver = null;

function getRevealObserver() {
  if (revealObserver || prefersReduced) return revealObserver;
  revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );
  return revealObserver;
}

export function observeReveal(scope = document) {
  const els = scope.querySelectorAll('.reveal:not(.is-visible), .reveal-scale:not(.is-visible)');
  if (!els.length) return;
  if (prefersReduced) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = getRevealObserver();
  els.forEach((el) => observer.observe(el));
}

export function initReveal() {
  observeReveal(document);
}

export function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (prefersReduced) {
      el.textContent = target.toLocaleString();
      return;
    }
    const duration = 1600;
    const start = performance.now();
    const ease = (x) => 1 - Math.pow(1 - x, 3);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(ease(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}
