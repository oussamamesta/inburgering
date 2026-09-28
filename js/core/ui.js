// Éléments d’interface réutilisables (classes Tailwind écrites en entier pour la compilation CSS).

import { esc, pct } from './util.js';

export const CARD = 'bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm';
export const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-dutchOrange text-white text-sm font-black shadow-md touch-active disabled:opacity-40';
export const BTN_SECONDARY = 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-100 text-sm font-bold touch-active';
export const CHIP = 'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap touch-active';

// Bouton « écouter » : le texte est lu par la voix néerlandaise (gestion globale dans app.js).
export function audioBtn(text, label = 'Écouter', extra = '') {
  return `<button type="button" data-say="${esc(text)}" class="inline-flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/70 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800 px-2.5 py-1.5 rounded-xl text-xs font-bold touch-active ${extra}" aria-label="${esc(label)} : ${esc(text)}"><i class="fa-solid fa-volume-high" aria-hidden="true"></i><span>${esc(label)}</span></button>`;
}

export function iconSay(text) {
  return `<button type="button" data-say="${esc(text)}" class="shrink-0 w-10 h-10 rounded-xl bg-orange-50 dark:bg-slate-700 text-orange-700 dark:text-orange-300 flex items-center justify-center touch-active" aria-label="Écouter : ${esc(text)}"><i class="fa-solid fa-volume-high" aria-hidden="true"></i></button>`;
}

export function bar(value, total, color = 'bg-emerald-500') {
  const p = pct(value, total);
  return `<div class="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><div class="h-full ${color} rounded-full" style="width:${p}%"></div></div>`;
}

export function backLink(hash, label = 'Retour') {
  return `<a href="${hash}" class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 py-1"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i> ${esc(label)}</a>`;
}

export function pageTitle(title, sub = '') {
  return `<div class="space-y-1"><h1 class="text-2xl font-black text-delftBlue dark:text-white">${esc(title)}</h1>${sub ? `<p class="text-sm text-slate-500 dark:text-slate-400">${sub}</p>` : ''}</div>`;
}

// Fenêtre de confirmation dans la page (remplace confirm(), bloqué dans certains cadres).
export function ask(message, okLabel = 'Confirmer', danger = false) {
  return new Promise((resolve) => {
    const wrap = document.createElement('div');
    wrap.className = 'fixed inset-0 z-[60] bg-slate-900/60 flex items-end sm:items-center justify-center p-4';
    wrap.setAttribute('role', 'alertdialog');
    wrap.setAttribute('aria-modal', 'true');
    wrap.innerHTML = `
      <div class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl p-5 space-y-4 shadow-2xl animate-pop">
        <p class="text-sm font-bold text-slate-800 dark:text-white whitespace-pre-line">${esc(message)}</p>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" data-no class="${BTN_SECONDARY}">Annuler</button>
          <button type="button" data-yes class="${BTN_PRIMARY} ${danger ? '!bg-red-600' : ''}">${esc(okLabel)}</button>
        </div>
      </div>`;
    const done = (v) => { wrap.remove(); document.removeEventListener('keydown', onKey); resolve(v); };
    const onKey = (e) => { if (e.key === 'Escape') done(false); };
    wrap.addEventListener('click', (e) => { if (e.target === wrap) done(false); });
    wrap.querySelector('[data-no]').addEventListener('click', () => done(false));
    wrap.querySelector('[data-yes]').addEventListener('click', () => done(true));
    document.addEventListener('keydown', onKey);
    document.body.appendChild(wrap);
    wrap.querySelector('[data-yes]').focus();
  });
}

let toastTimer = null;
export function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  document.getElementById('toastMessage').textContent = msg;
  t.classList.remove('opacity-0', '-translate-y-20');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('opacity-0', '-translate-y-20'), 2600);
}
