/**
 * Contador animado para números em destaque.
 *
 *   <span data-count="6" data-suffix="+">6+</span>
 *
 * O HTML já traz o valor final (funciona sem JS e para leitores de tela).
 * Ao entrar na tela, conta de 0 até o alvo. Com movimento reduzido, nada muda.
 * Atributos opcionais: data-prefix, data-suffix, data-duration (ms).
 */
export function initCounters(root = document) {
  const items = [...root.querySelectorAll('[data-count]')];
  if (!items.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;

  const format = (el, n) => `${el.dataset.prefix || ''}${n}${el.dataset.suffix || ''}`;
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function run(el) {
    const target = Number(el.dataset.count);
    if (!Number.isFinite(target)) return;
    const duration = Number(el.dataset.duration) || 1400;
    const start = performance.now();

    const frame = (now) => {
      const t = Math.min(1, (now - start) / duration);
      el.textContent = format(el, Math.round(target * easeOut(t)));
      if (t < 1) requestAnimationFrame(frame);
    };
    el.textContent = format(el, 0);
    requestAnimationFrame(frame);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      run(entry.target);
    });
  }, { threshold: 0.6 });

  items.forEach((el) => {
    // Evita "salto" de largura durante a contagem
    el.style.fontVariantNumeric = 'tabular-nums';
    observer.observe(el);
  });
}
