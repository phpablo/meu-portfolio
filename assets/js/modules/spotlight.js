/**
 * Spotlight que segue o mouse em elementos [data-spotlight].
 * Define --mx / --my (px) no elemento; o visual fica no CSS (::before/::after).
 * Só em dispositivos com mouse (hover + pointer fino) e sem movimento reduzido.
 */
export function initSpotlight(root = document) {
  const items = root.querySelectorAll('[data-spotlight]');
  if (!items.length) return;

  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || reduce.matches) return;

  items.forEach((el) => {
    let raf = 0;
    let x = 0;
    let y = 0;
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--mx', `${x}px`);
        el.style.setProperty('--my', `${y}px`);
        raf = 0;
      });
    }, { passive: true });
  });
}
