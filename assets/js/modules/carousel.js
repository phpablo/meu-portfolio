/**
 * Carrossel genérico baseado em scroll-snap nativo.
 *
 * Marcação:
 *   <div data-carousel>
 *     <div data-carousel-track tabindex="0" role="region" aria-label="...">   ← contêiner rolável
 *       <ul> <li data-carousel-slide>…</li> … </ul>
 *     </div>
 *     <div data-carousel-dots></div>                                            ← opcional
 *   </div>
 *
 * Opções por atributo no [data-carousel]:
 *   data-dot-label="Ir para o item {n}"   rótulo acessível de cada ponto
 *   data-align="center"                 slide ativo centralizado (vizinhos aparecendo)
 *   data-autoplay="6000"                avanço automático (ms). Pausa com mouse/foco,
 *                                       fora da tela, aba oculta e pelo botão
 *                                       [data-carousel-toggle]. Desligado com movimento reduzido.
 * O slide atual recebe .is-active.
 *
 * Recursos: pontos clicáveis que refletem a posição, arrastar com o mouse,
 * setas / Home / End no teclado, respeito a prefers-reduced-motion.
 */

const DRAG_THRESHOLD = 6;

export function initCarousels(root = document) {
  root.querySelectorAll('[data-carousel]').forEach((el) => {
    if (!el.dataset.carouselReady) {
      el.dataset.carouselReady = 'true';
      el.carousel = createCarousel(el);
    }
  });
}

/** API do carrossel já iniciado (ou null). */
export function getCarousel(el) {
  return el?.carousel || null;
}

function createCarousel(root) {
  const track = root.querySelector('[data-carousel-track]');
  const allSlides = [...root.querySelectorAll('[data-carousel-slide]')];
  const dotsBox = root.querySelector('[data-carousel-dots]');
  if (!track || !allSlides.length) return null;

  // Slides ocultos (atributo hidden, ex.: filtros) ficam fora das posições
  let slides = allSlides.filter((s) => !s.hidden);

  const dotLabel = root.dataset.dotLabel || 'Ir para o item {n}';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior = () => (reduceMotion.matches ? 'auto' : 'smooth');
  const centered = root.dataset.align === 'center';

  /** Posições de rolagem alcançáveis: [{ index, left }] */
  let stops = [];
  let dots = [];
  let current = -1;

  const maxScroll = () => track.scrollWidth - track.clientWidth;

  function slideLeft(slide) {
    const r = slide.getBoundingClientRect();
    const t = track.getBoundingClientRect();
    let left = r.left - t.left + track.scrollLeft;
    if (centered) left -= (track.clientWidth - r.width) / 2;
    else left -= parseFloat(getComputedStyle(track).scrollPaddingInlineStart) || 0;
    return Math.max(0, Math.round(left));
  }

  function computeStops() {
    const max = maxScroll();
    const next = [];
    slides.forEach((slide, index) => {
      const left = Math.min(slideLeft(slide), max);
      // Ignora slides que caem na mesma posição final (já visíveis no fim)
      if (!next.length || left - next[next.length - 1].left > 4) next.push({ index, left });
    });
    stops = next;
  }

  function renderDots() {
    if (!dotsBox) return;
    dotsBox.hidden = stops.length < 2;
    dotsBox.replaceChildren();
    dots = stops.map((stop, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'carousel__dot';
      btn.setAttribute('aria-label', dotLabel.replace('{n}', String(stop.index + 1)));
      btn.addEventListener('click', () => goTo(i));
      dotsBox.append(btn);
      return btn;
    });
    current = -1;
    updateActive();
  }

  function nearestStop() {
    const x = track.scrollLeft;
    if (x >= maxScroll() - 2) return stops.length - 1;
    let best = 0;
    stops.forEach((stop, i) => {
      if (Math.abs(stop.left - x) < Math.abs(stops[best].left - x)) best = i;
    });
    return best;
  }

  function updateActive() {
    if (!stops.length) return;
    const i = nearestStop();
    if (i === current) return;
    current = i;
    const slide = slides[stops[i].index];
    allSlides.forEach((s) => s.classList.toggle('is-active', s === slide));
    root.dispatchEvent(new CustomEvent('carousel:change', {
      detail: { position: i, slide, index: allSlides.indexOf(slide) },
    }));
    dots.forEach((dot, d) => {
      const active = d === i;
      dot.classList.toggle('is-active', active);
      if (active) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function goTo(i) {
    const stop = stops[Math.max(0, Math.min(stops.length - 1, i))];
    if (stop) track.scrollTo({ left: stop.left, behavior: behavior() });
  }

  /* Rolagem → pontos (rAF) */
  let ticking = false;
  track.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { updateActive(); ticking = false; });
  }, { passive: true });

  /* Teclado */
  track.addEventListener('keydown', (event) => {
    const keys = { ArrowRight: 1, ArrowLeft: -1, Home: -Infinity, End: Infinity };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const step = keys[event.key];
    if (step === -Infinity) goTo(0);
    else if (step === Infinity) goTo(stops.length - 1);
    else goTo(nearestStop() + step);
  });

  /* Arrastar com o mouse (touch e trackpad usam a rolagem nativa) */
  let drag = null;
  let suppressClick = false;

  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, start: nearestStop(), moved: false };
  });

  track.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      drag.moved = true;
      track.setPointerCapture(event.pointerId);
      track.classList.add('is-dragging');
    }
    track.scrollLeft = drag.left - dx;
  });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const { moved, x, start } = drag;
    drag = null;
    if (!moved) return;

    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);

    // Avança na direção do gesto se passou de ~15% de um slide
    const dx = event.clientX - x;
    const width = slides[0]?.offsetWidth || 300;
    let target = start;
    if (Math.abs(dx) > width * 0.15) {
      target = start + Math.sign(-dx) * Math.max(1, Math.round(Math.abs(dx) / width));
    }
    goTo(target);

    // Reativa o snap só quando a rolagem suave terminar
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      track.classList.remove('is-dragging');
    };
    track.addEventListener('scrollend', release, { once: true });
    setTimeout(release, 700);
  }

  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);

  // Um arraste não deve disparar o clique do link sob o cursor
  track.addEventListener('click', (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick = false;
    }
  }, true);

  track.addEventListener('dragstart', (event) => event.preventDefault());

  /* Layout responsivo */
  const refresh = () => {
    slides = allSlides.filter((s) => !s.hidden);
    computeStops();
    renderDots();
  };
  let resizeRaf = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(refresh);
  });
  ro.observe(track);

  refresh();

  /* Autoplay (opcional) */
  const autoplayMs = Number(root.dataset.autoplay) || 0;
  if (autoplayMs > 0) setupAutoplay(autoplayMs);

  function setupAutoplay(ms) {
    const toggle = root.querySelector('[data-carousel-toggle]');
    let timer = 0;
    let userPaused = false;
    let hovering = false;
    let focused = false;
    let visible = false;

    const canRun = () => !reduceMotion.matches && !userPaused && !hovering && !focused && visible && !document.hidden && stops.length > 1;

    function schedule() {
      clearTimeout(timer);
      if (canRun()) timer = setTimeout(() => {
        const next = nearestStop() + 1;
        goTo(next >= stops.length ? 0 : next);
        schedule();
      }, ms);
    }

    function renderToggle() {
      if (!toggle) return;
      toggle.hidden = reduceMotion.matches;
      toggle.setAttribute('aria-pressed', String(userPaused));
      toggle.setAttribute('aria-label', userPaused ? 'Retomar rotação automática' : 'Pausar rotação automática');
      toggle.classList.toggle('is-paused', userPaused);
    }

    toggle?.addEventListener('click', () => { userPaused = !userPaused; renderToggle(); schedule(); });
    root.addEventListener('mouseenter', () => { hovering = true; schedule(); });
    root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
    root.addEventListener('focusin', () => { focused = true; schedule(); });
    root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { focused = false; schedule(); } });
    // Interação manual reinicia a contagem
    track.addEventListener('pointerdown', schedule);
    document.addEventListener('visibilitychange', schedule);
    reduceMotion.addEventListener('change', () => { renderToggle(); schedule(); });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }, { threshold: 0.35 }).observe(root);

    renderToggle();
  }

  return {
    /** Recalcula posições/pontos (após filtrar ou mudar o layout). */
    refresh,
    /** Vai para a posição N (índice dos pontos). */
    goTo,
    /** Vai até o slide informado (elemento). */
    goToSlide(slide, { instant = false } = {}) {
      const i = stops.findIndex((s) => slides[s.index] === slide);
      if (i === -1) return;
      track.scrollTo({ left: stops[i].left, behavior: instant ? 'auto' : behavior() });
    },
  };
}
