/**
 * Navbar: menu mobile, scroll-spy e estado "rolado".
 *
 * Marcação esperada:
 *   [data-header] > [data-nav] > [data-nav-toggle] + [data-nav-menu] a.nav__link[href^="#"]
 */

const MOBILE_QUERY = '(max-width: 899.98px)';
const SCROLLED_OFFSET = 16;

export function initNav() {
  const header = document.querySelector('[data-header]');
  const nav = header?.querySelector('[data-nav]');
  const toggle = nav?.querySelector('[data-nav-toggle]');
  const menu = nav?.querySelector('[data-nav-menu]');
  if (!header || !nav || !toggle || !menu) return;

  const links = [...menu.querySelectorAll('.nav__link[href^="#"]')];
  const mq = window.matchMedia(MOBILE_QUERY);

  setupMenu({ nav, toggle, menu, mq });
  setupScrolledState(header);
  setupScrollSpy(links);
}

/* ------------------------------------------------------------------------ */
/* Menu mobile                                                               */
/* ------------------------------------------------------------------------ */
function setupMenu({ nav, toggle, menu, mq }) {
  const root = document.documentElement;
  let lastFocus = null;

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  const focusables = () =>
    [toggle, ...menu.querySelectorAll('a[href], button:not([disabled])')];

  function open() {
    lastFocus = document.activeElement;
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Fechar menu');
    nav.classList.add('is-open');
    root.classList.add('is-menu-open');
    menu.querySelector('.nav__link')?.focus({ preventScroll: true });
  }

  function close({ restoreFocus = true } = {}) {
    if (!isOpen()) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    nav.classList.remove('is-open');
    root.classList.remove('is-menu-open');
    if (restoreFocus) (lastFocus && lastFocus !== document.body ? lastFocus : toggle).focus({ preventScroll: true });
  }

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));

  // Fecha ao escolher um destino (sem roubar o foco da âncora)
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a') && isOpen()) close({ restoreFocus: false });
  });

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }

    // Mantém o foco dentro do menu aberto
    if (event.key === 'Tab') {
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // Voltou para desktop com o menu aberto: limpa o estado
  mq.addEventListener('change', (event) => {
    if (!event.matches) close({ restoreFocus: false });
  });
}

/* ------------------------------------------------------------------------ */
/* Sombra / encolhimento ao rolar                                            */
/* ------------------------------------------------------------------------ */
function setupScrolledState(header) {
  let ticking = false;

  const update = () => {
    header.classList.toggle('is-scrolled', window.scrollY > SCROLLED_OFFSET);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
}

/* ------------------------------------------------------------------------ */
/* Scroll-spy: destaca o item da seção visível                               */
/* Seções sem link no menu usam data-nav="<id do item>" (ex.: #ia → sobre).   */
/* ------------------------------------------------------------------------ */
function setupScrollSpy(links) {
  const byId = new Map();
  links.forEach((link) => {
    const id = link.hash.slice(1);
    if (document.getElementById(id)) byId.set(id, link);
  });
  if (!byId.size || !('IntersectionObserver' in window)) return;

  const setActive = (id) => {
    if (!byId.has(id)) return; // sem correspondência: mantém o item atual
    links.forEach((link) => {
      const active = byId.get(id) === link;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const keyOf = (el) => el.dataset.nav || el.id;
  const targets = [...document.querySelectorAll('main section[id], [data-nav]:not([data-nav=""])')];

  // Linha de detecção no meio da viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(keyOf(entry.target));
    });
  }, { rootMargin: '-45% 0px -55% 0px' });

  targets.forEach((el) => observer.observe(el));
}
