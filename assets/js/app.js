import { initSidebar }       from './modules/sidebar.js';
import { initScrollReveal, initScrollSpy } from './modules/scroll.js';
import { initSkills }         from './modules/skills.js';
import { initProjectFilter }  from './modules/projects.js';
import { initContact }        from './modules/contact.js';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  initSidebar();
  initScrollReveal();
  initScrollSpy();
  initSkills();
  initProjectFilter();
  initContact();
});
