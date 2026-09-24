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

// Um módulo com erro não pode derrubar os demais
function safe(fn, name) {
  try { fn(); } catch (err) { console.error(`[init] ${name}:`, err); }
}

function init() {
  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // reveal primeiro: é ele que torna o conteúdo visível
  safe(initReveal, 'reveal');
  safe(initNav, 'nav');
  safe(initCarousels, 'carousel');
  safe(initTimelines, 'timeline');
  safe(initCounters, 'counter');
  safe(initPortfolio, 'portfolio');   // depois do carrossel (usa a API dele)
  safe(initBeforeAfter, 'beforeafter');
  safe(initSpotlight, 'spotlight');

  // sinaliza ao failsafe do <head> que o JS carregou
  window.__appReady = true;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
