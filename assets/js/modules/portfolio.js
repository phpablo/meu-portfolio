/**
 * Seção de projetos: filtros por categoria, painel do projeto ativo,
 * ação dos cards (comparador antes/depois ou lightbox).
 *
 * Depende do carrossel (carousel.js) já iniciado em [data-carousel].
 * Cada slide traz: data-categories, data-title, data-desc, data-ba-target,
 * data-full, data-alt e data-url (link do site ao vivo; vazio = sem link).
 */
import { getCarousel } from './carousel.js';

const FADE_MS = 160;

export function initPortfolio(root = document) {
  const section = root.querySelector('[data-portfolio]');
  if (!section) return;

  const carouselEl = section.querySelector('[data-carousel]');
  const carousel = getCarousel(carouselEl);
  const slides = [...section.querySelectorAll('[data-carousel-slide]')];
  const list = section.querySelector('.carousel__list');
  const chips = [...section.querySelectorAll('[data-filter]')];
  const detail = {
    title: section.querySelector('[data-detail-title]'),
    desc: section.querySelector('[data-detail-desc]'),
    action: section.querySelector('[data-detail-action]'),
    link: section.querySelector('[data-detail-link]'),
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = slides[0];

  /* ---------- Painel do projeto ativo ---------- */
  function showDetail(slide) {
    if (!slide) return;
    active = slide;
    detail.title.textContent = slide.dataset.title;
    detail.desc.textContent = slide.dataset.desc;
    detail.action.setAttribute('aria-label', actionLabel(slide));
    const url = slide.dataset.url?.trim();
    detail.link.hidden = !url;
    if (url) detail.link.href = url;
  }

  const actionLabel = (slide) => {
    const name = slide.dataset.title.split(' — ')[0];
    return slide.dataset.baTarget ? `Comparar antes e depois: ${name}` : `Ampliar imagem: ${name}`;
  };

  carouselEl?.addEventListener('carousel:change', (event) => showDetail(event.detail.slide));

  // No desktop (2 por vez) o último card divide a posição final com o penúltimo:
  // passar o mouse ou focar um card também atualiza o painel.
  slides.forEach((slide) => {
    slide.addEventListener('pointerenter', (event) => { if (event.pointerType === 'mouse') showDetail(slide); });
    slide.addEventListener('focusin', () => showDetail(slide));
  });

  /* ---------- Filtros ---------- */
  function applyFilter(value) {
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === value)));
    const apply = () => {
      slides.forEach((slide) => {
        const cats = slide.dataset.categories.split(/\s+/);
        slide.hidden = value !== 'todos' && !cats.includes(value);
      });
      carouselEl.querySelector('[data-carousel-track]').scrollTo({ left: 0, behavior: 'instant' });
      carousel?.refresh();
      showDetail(slides.find((s) => !s.hidden));
      list.classList.remove('is-filtering');
    };
    if (reduceMotion.matches) return apply();
    list.classList.add('is-filtering');
    setTimeout(apply, FADE_MS);
  }

  chips.forEach((chip) => chip.addEventListener('click', () => {
    if (chip.getAttribute('aria-pressed') !== 'true') applyFilter(chip.dataset.filter);
  }));

  /* ---------- Ações ---------- */
  const lightbox = createLightbox(section.querySelector('[data-lightbox]'));

  function runAction(slide, trigger) {
    const key = slide.dataset.baTarget;
    if (key) {
      const target = document.getElementById('antes-depois');
      document.dispatchEvent(new CustomEvent('ba:select', { detail: { key } }));
      target?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      // Leva o foco ao comparador (sem pular a rolagem)
      const tab = target?.querySelector(`[data-ba-tab="${key}"]`);
      tab?.focus({ preventScroll: true });
    } else {
      lightbox?.open(slide, trigger);
    }
  }

  section.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-project-action]');
    if (!btn) return;
    const slide = btn.closest('[data-carousel-slide]');
    showDetail(slide);
    runAction(slide, btn);
  });
  detail.action.addEventListener('click', () => runAction(active, detail.action));

  showDetail(active);
}

/* ---------- Lightbox (<dialog>) ---------- */
function createLightbox(dialog) {
  if (!dialog || typeof dialog.showModal !== 'function') return null;
  const img = dialog.querySelector('[data-lightbox-img]');
  const title = dialog.querySelector('[data-lightbox-title]');
  const link = dialog.querySelector('[data-lightbox-link]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');
  let returnFocus = null;

  closeBtn.addEventListener('click', () => dialog.close());
  // Clique no fundo (fora do conteúdo) fecha
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('is-dialog-open');
    returnFocus?.focus({ preventScroll: true });
  });

  return {
    open(slide, trigger) {
      returnFocus = trigger || document.activeElement;
      img.src = slide.dataset.full;
      img.alt = slide.dataset.alt || '';
      title.textContent = slide.dataset.title;
      const url = slide.dataset.url?.trim();
      link.hidden = !url;
      if (url) link.href = url;
      document.documentElement.classList.add('is-dialog-open');
      dialog.showModal();
      closeBtn.focus();
    },
  };
}
