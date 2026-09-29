// Langue de l’interface : néerlandais d’abord, français sur demande.
//
// tr(nl, fr)  → texte néerlandais, et en dessous la traduction française (visible en mode « FR »).
// tri(nl, fr) → même chose, mais la traduction reste sur la même ligne (boutons, étiquettes).
// Le français reste toujours visible seulement quand il est nécessaire : explications de règles,
// informations sur la société, aide technique.

import { store } from './store.js';

export const tr = (nl, fr) => `<span lang="nl">${nl}</span><span class="fr" lang="fr">${fr}</span>`;
export const tri = (nl, fr) => `<span lang="nl">${nl}</span><span class="fr-i" lang="fr">${fr}</span>`;

// Bloc français facultatif (visible seulement en mode FR).
export const frOnly = (fr, cls = '') => `<span class="fr ${cls}" lang="fr">${fr}</span>`;

export const frOn = () => !!store.data.settings.showFr;

export function applyLang() {
  const on = frOn();
  document.documentElement.classList.toggle('show-fr', on);
  const b = document.getElementById('frToggle');
  if (b) {
    b.setAttribute('aria-pressed', String(on));
    b.title = on ? 'Vertaling uit (masquer le français)' : 'Vertaling aan (afficher le français)';
  }
}

export function toggleLang() {
  store.data.settings.showFr = !frOn();
  store.save();
  applyLang();
}
