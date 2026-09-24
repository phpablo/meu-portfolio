/**
 * Comparador "antes × depois" com abas de projeto.
 *
 * Marcação (atributos data-ba*):
 *   [data-ba]                      raiz
 *     [data-ba-tab]                abas (role="tab"): data-before / data-after = caminho base
 *                                  (gera "<base>-800.webp 800w, <base>.webp 1400w"),
 *                                  data-name (texto alternativo), data-bar (barra do navegador),
 *                                  data-query (sufixo de cache opcional, ex.: "?v=2")
 *     [data-ba-stage]              área arrastável; recebe --pos (0–100%)
 *       [data-ba-before] / [data-ba-after]   imagens
 *       [data-ba-range]            input range acessível (visualmente oculto)
 *     [data-ba-bar]                texto da barra falsa do navegador (opcional)
 *
 * API: selectBeforeAfter(key) ou o evento `ba:select` ({ detail: { key } }) em document.
 */

const KEY_STEP = 5;
const instances = [];

export function initBeforeAfter(root = document) {
  root.querySelectorAll('[data-ba]').forEach((el) => {
    if (el.dataset.baReady) return;
    el.dataset.baReady = 'true';
    const api = createComparator(el);
    if (api) instances.push(api);
  });

  if (!initBeforeAfter.listening) {
    initBeforeAfter.listening = true;
    document.addEventListener('ba:select', (event) => selectBeforeAfter(event.detail?.key));
  }
}

/** Seleciona o par pelo nome (ex.: "facilita") em todos os comparadores que o tenham. */
export function selectBeforeAfter(key) {
  instances.forEach((api) => api.select(key));
}

function createComparator(root) {
  const stage = root.querySelector('[data-ba-stage]');
  const before = root.querySelector('[data-ba-before]');
  const after = root.querySelector('[data-ba-after]');
  const range = root.querySelector('[data-ba-range]');
  const tabs = [...root.querySelectorAll('[data-ba-tab]')];
  const bar = root.querySelector('[data-ba-bar]');
  const panel = stage?.closest('[role="tabpanel"]');
  if (!stage || !before || !after || !range) return null;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pos = Number(range.value) || 50;
  let hintRaf = 0;
  let userTouched = false;

  /* ---------- Posição ---------- */
  function setPos(value) {
    pos = Math.min(100, Math.max(0, value));
    stage.style.setProperty('--pos', `${pos}%`);
    const rounded = Math.round(pos);
    range.value = String(rounded);
    range.setAttribute('aria-valuetext', `Mostrando ${100 - rounded}% do depois`);
  }

  const posFromEvent = (event) => {
    const rect = stage.getBoundingClientRect();
    return ((event.clientX - rect.left) / rect.width) * 100;
  };

  function stopHint() {
    userTouched = true;
    if (hintRaf) {
      cancelAnimationFrame(hintRaf);
      hintRaf = 0;
    }
  }

  /* ---------- Ponteiro (mouse, caneta, toque) ---------- */
  let dragging = null;
  let start = null;
  let engaged = false; // gesto de toque já assumido como horizontal

  stage.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 && event.pointerType === 'mouse') return;
    stopHint();
    dragging = event.pointerId;
    start = { x: event.clientX, y: event.clientY };
    engaged = event.pointerType === 'mouse';
    stage.classList.add('is-dragging');
    // Mouse: pula direto para o ponto clicado. Toque: só depois de mover na horizontal.
    if (event.pointerType === 'mouse') {
      stage.setPointerCapture(event.pointerId);
      setPos(posFromEvent(event));
      event.preventDefault();
    }
  });

  stage.addEventListener('pointermove', (event) => {
    if (dragging !== event.pointerId) return;
    // Toque: só assume o gesto se ele for mais horizontal que vertical
    // (o toque tem captura implícita, por isso uma flag própria)
    if (!engaged) {
      const dx = Math.abs(event.clientX - start.x);
      const dy = Math.abs(event.clientY - start.y);
      if (dx < 6 || dy > dx) return;
      engaged = true;
    }
    if (!stage.hasPointerCapture(event.pointerId)) stage.setPointerCapture(event.pointerId);
    setPos(posFromEvent(event));
  });

  const endDrag = (event) => {
    if (dragging !== event.pointerId) return;
    // Toque rápido (tap, sem deslocamento) também posiciona
    const moved = start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 10;
    if (event.type === 'pointerup' && event.pointerType !== 'mouse' && !moved) setPos(posFromEvent(event));
    dragging = null;
    stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', (event) => {
    // Rolagem vertical nativa (touch-action: pan-y) cancela o gesto
    dragging = null;
    stage.classList.remove('is-dragging');
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
  });

  /* ---------- Teclado ---------- */
  range.addEventListener('keydown', (event) => {
    const map = {
      ArrowLeft: -KEY_STEP, ArrowDown: -KEY_STEP, ArrowRight: KEY_STEP, ArrowUp: KEY_STEP,
      PageDown: -20, PageUp: 20,
    };
    if (event.key in map) setPos(pos + map[event.key]);
    else if (event.key === 'Home') setPos(0);
    else if (event.key === 'End') setPos(100);
    else return;
    event.preventDefault();
    stopHint();
  });
  range.addEventListener('input', () => { stopHint(); setPos(Number(range.value)); });

  /* ---------- Abas ---------- */
  // data-query (opcional) na aba: sufixo de cache, ex. "?v=2"
  const srcset = (base, q = '') => `${base}-800.webp${q} 800w, ${base}.webp${q} 1400w`;

  async function loadPair(tab) {
    const imgs = [tab.dataset.before, tab.dataset.after].map((base) => {
      const img = new Image();
      img.sizes = before.sizes;
      img.srcset = srcset(base, tab.dataset.query);
      img.src = `${base}-800.webp${tab.dataset.query || ''}`;
      return img.decode().catch(() => {});
    });
    await Promise.all(imgs);
  }

  let switchToken = 0;
  async function activate(tab, { focus = false } = {}) {
    if (!tab) return;
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    if (focus) tab.focus();
    if (panel) panel.setAttribute('aria-labelledby', tab.id);
    // incrementa antes da checagem: cancela uma troca pendente (A→B→A rápido)
    const token = ++switchToken;
    if (before.dataset.current === tab.dataset.baTab) {
      root.classList.remove("is-switching");
      return;
    }

    root.classList.add('is-switching');
    await Promise.all([loadPair(tab), wait(reduceMotion.matches ? 0 : 180)]);
    if (token !== switchToken) return;

    const name = tab.dataset.name || tab.textContent.trim();
    const q = tab.dataset.query || '';
    before.srcset = srcset(tab.dataset.before, q);
    before.src = `${tab.dataset.before}-800.webp${q}`;
    before.alt = `${name}: versão antiga`;
    after.srcset = srcset(tab.dataset.after, q);
    after.src = `${tab.dataset.after}-800.webp${q}`;
    after.alt = `${name}: versão nova`;
    before.dataset.current = tab.dataset.baTab;
    if (bar) bar.textContent = tab.dataset.bar || name;

    requestAnimationFrame(() => root.classList.remove('is-switching'));
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: last }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      const target = tabs[(next + tabs.length) % tabs.length];
      activate(target, { focus: true });
      target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  });
  if (tabs[0]) before.dataset.current = (tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0]).dataset.baTab;

  /* ---------- Dica animada + pré-carregamento ---------- */
  function playHint() {
    if (reduceMotion.matches || userTouched) return;
    const keys = [50, 25, 75, 50];
    const segment = 650;
    const start = performance.now();
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const frame = (now) => {
      if (userTouched) return;
      const elapsed = now - start;
      const i = Math.min(keys.length - 2, Math.floor(elapsed / segment));
      const t = Math.min(1, (elapsed - i * segment) / segment);
      setPos(keys[i] + (keys[i + 1] - keys[i]) * ease(t));
      if (elapsed < segment * (keys.length - 1)) hintRaf = requestAnimationFrame(frame);
      else { hintRaf = 0; setPos(50); }
    };
    hintRaf = requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      setTimeout(playHint, 400);
      // Carrega os demais pares quando o navegador estiver livre
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 600));
      idle(() => tabs.forEach((tab) => { if (tab.dataset.baTab !== before.dataset.current) loadPair(tab); }));
    }, { threshold: 0.5 });
    io.observe(stage);
  }

  setPos(pos);

  return {
    select(key) {
      const tab = tabs.find((t) => t.dataset.baTab === key);
      if (tab) activate(tab);
      return Boolean(tab);
    },
    setPos,
  };
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
