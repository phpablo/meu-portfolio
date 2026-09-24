/**
 * Revela elementos `.reveal` quando entram na viewport.
 * Atraso opcional por elemento: data-reveal-delay="120" (ms).
 * Sem IntersectionObserver ou com movimento reduzido, tudo aparece de imediato.
 */
export function initReveal(selector = '.reveal') {
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.revealDelay) el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}ms`);
      el.classList.add('is-visible');
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el) => observer.observe(el));
}
