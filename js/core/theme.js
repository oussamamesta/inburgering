// Thème clair / sombre (automatique = suit le réglage du téléphone).

import { store } from './store.js';

const media = window.matchMedia('(prefers-color-scheme: dark)');

export function applyTheme() {
  const t = store.data.settings.theme;
  // En mode automatique, on suit d’abord le thème imposé par la page hôte (data-theme), sinon le téléphone.
  const host = document.documentElement.dataset.theme;
  const dark = t === 'dark' || (t === 'system' && (host ? host === 'dark' : media.matches));
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0f172a' : '#0A2540');
}

media.addEventListener?.('change', applyTheme);
new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
