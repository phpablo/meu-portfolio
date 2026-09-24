/**
 * Ponto de entrada do portfólio (ES modules, sem build).
 * Módulos de seções futuras são carregados sob demanda, só se o DOM existir.
 */
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initCarousels } from './modules/carousel.js';
import { initTimelines } from './modules/timeline.js';
import { initCounters } from './modules/counter.js';
import { initPortfolio } from './modules/portfolio.js';
import { initBeforeAfter } from './modules/beforeafter.js';
import { initSpotlight } from './modules/spotlight.js';

function init() {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  initNav();
  initReveal();
  initCarousels();
  initTimelines();
  initCounters();
  initPortfolio();   // depois do carrossel (usa a API dele)
  initBeforeAfter();
  initSpotlight();

  // Formulário de contato (Web3Forms com fallback mailto)
  if (document.getElementById('contactForm')) {
    import('./modules/contact.js').then((m) => m.initContact());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
