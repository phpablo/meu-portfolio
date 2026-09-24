/**
 * Linha do tempo com progresso ligado à rolagem.
 *
 * Marcação:
 *   <ol data-timeline>
 *     <span data-timeline-line><span class="…-fill"></span></span>
 *     <li data-timeline-item> … <span data-timeline-dot></span> … </li>
 *   </ol>
 *
 * Define no [data-timeline]:
 *   --tl-top / --tl-height  trilho do centro do 1º ao último ponto (px)
 *   --tl-progress           0 → 1 conforme a linha de leitura (60% da tela) avança
 * e marca cada item com .is-reached quando a linha de leitura passa pelo ponto.
 */

const READ_LINE = 0.6;

export function initTimelines(root = document) {
  root.querySelectorAll('[data-timeline]').forEach(createTimeline);
}

function createTimeline(tl) {
  const items = [...tl.querySelectorAll('[data-timeline-item]')];
  const dots = items.map((item) => item.querySelector('[data-timeline-dot]'));
  if (!items.length || dots.some((d) => !d)) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let centers = [];   // centro de cada ponto, relativo ao topo da lista
  let active = false; // só calcula enquanto a seção está perto da tela
  let ticking = false;

  function measure() {
    const top = tl.getBoundingClientRect().top;
    centers = dots.map((dot) => {
      const r = dot.getBoundingClientRect();
      return r.top - top + r.height / 2;
    });
    const first = centers[0];
    const last = centers[centers.length - 1];
    tl.style.setProperty('--tl-top', `${first}px`);
    tl.style.setProperty('--tl-height', `${Math.max(0, last - first)}px`);
  }

  function update() {
    ticking = false;

    if (reduceMotion.matches) {
      tl.style.setProperty('--tl-progress', '1');
      items.forEach((item) => item.classList.add('is-reached'));
      return;
    }

    const top = tl.getBoundingClientRect().top;
    const readY = window.innerHeight * READ_LINE - top; // linha de leitura no referencial da lista
    const first = centers[0];
    const span = centers[centers.length - 1] - first || 1;
    const progress = Math.min(1, Math.max(0, (readY - first) / span));
    tl.style.setProperty('--tl-progress', progress.toFixed(4));

    // Pontos "aparecem" uma vez e permanecem
    items.forEach((item, i) => {
      if (readY >= centers[i] - 8) item.classList.add('is-reached');
    });
  }

  const schedule = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', () => { if (active) schedule(); }, { passive: true });

  new ResizeObserver(() => { measure(); schedule(); }).observe(tl);

  new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) schedule();
  }, { rootMargin: '25% 0px 25% 0px' }).observe(tl);

  reduceMotion.addEventListener('change', schedule);

  measure();
  update();
}
