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

// ── Une couleur par partie ──
// Toutes les classes sont écrites en entier pour que Tailwind les garde dans app.css.
export const THEMES = {
  societe: { icon: '🏛️', name: 'Société', hero: 'from-orange-700 to-dutchOrange', bar: 'bg-orange-500', ring: 'text-orange-500', soft: 'bg-orange-50 dark:bg-orange-950/40', tint: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', btn: '!bg-orange-600', border: 'border-orange-200 dark:border-orange-900' },
  lecture: { icon: '📄', name: 'Lecture', hero: 'from-teal-800 to-teal-700', bar: 'bg-teal-500', ring: 'text-teal-500', soft: 'bg-teal-50 dark:bg-teal-950/40', tint: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-700 dark:text-teal-300', btn: '!bg-teal-600', border: 'border-teal-200 dark:border-teal-900' },
  parler: { icon: '🗣️', name: 'Parler', hero: 'from-blue-800 to-blue-600', bar: 'bg-blue-500', ring: 'text-blue-500', soft: 'bg-blue-50 dark:bg-blue-950/40', tint: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-300', btn: '!bg-blue-600', border: 'border-blue-200 dark:border-blue-900' },
  mots: { icon: '🎴', name: 'Mots', hero: 'from-emerald-800 to-emerald-700', bar: 'bg-emerald-500', ring: 'text-emerald-500', soft: 'bg-emerald-50 dark:bg-emerald-950/40', tint: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-700 dark:text-emerald-300', btn: '!bg-emerald-600', border: 'border-emerald-200 dark:border-emerald-900' },
  grammaire: { icon: '✍️', name: 'Grammaire', hero: 'from-violet-800 to-violet-600', bar: 'bg-violet-500', ring: 'text-violet-500', soft: 'bg-violet-50 dark:bg-violet-950/40', tint: 'bg-violet-100 dark:bg-violet-900/50', text: 'text-violet-700 dark:text-violet-300', btn: '!bg-violet-600', border: 'border-violet-200 dark:border-violet-900' },
  ecoute: { icon: '🎧', name: 'Écoute', hero: 'from-indigo-800 to-indigo-600', bar: 'bg-indigo-500', ring: 'text-indigo-500', soft: 'bg-indigo-50 dark:bg-indigo-950/40', tint: 'bg-indigo-100 dark:bg-indigo-900/50', text: 'text-indigo-700 dark:text-indigo-300', btn: '!bg-indigo-600', border: 'border-indigo-200 dark:border-indigo-900' },
  examen: { icon: '🏆', name: 'Examens blancs', hero: 'from-amber-800 to-amber-700', bar: 'bg-amber-500', ring: 'text-amber-500', soft: 'bg-amber-50 dark:bg-amber-950/40', tint: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-300', btn: '!bg-amber-600', border: 'border-amber-200 dark:border-amber-900' },
  reviser: { icon: '🔁', name: 'Réviser', hero: 'from-rose-800 to-rose-600', bar: 'bg-rose-500', ring: 'text-rose-500', soft: 'bg-rose-50 dark:bg-rose-950/40', tint: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-700 dark:text-rose-300', btn: '!bg-rose-600', border: 'border-rose-200 dark:border-rose-900' },
  plan: { icon: '⭐', name: 'Séance du jour', hero: 'from-orange-700 to-dutchOrange', bar: 'bg-dutchOrange', ring: 'text-dutchOrange', soft: 'bg-orange-50 dark:bg-orange-950/40', tint: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-700 dark:text-orange-300', btn: '', border: 'border-orange-200 dark:border-orange-900' },
  progres: { icon: '📈', name: 'Progrès', hero: 'from-slate-800 to-delftBlue', bar: 'bg-slate-500', ring: 'text-slate-500', soft: 'bg-slate-50 dark:bg-slate-800/60', tint: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300', btn: '', border: 'border-slate-200 dark:border-slate-700' },
};

// En-tête coloré d’une partie : pastille, titre, et petites étiquettes (ex. « 12/164 maîtrisées »).
export function pageHero(themeKey, title, sub = '', chips = []) {
  const t = THEMES[themeKey] || THEMES.progres;
  return `<div class="space-y-3">
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br ${t.hero} text-white p-5 shadow-lg">
      <div class="absolute -right-4 -bottom-6 text-8xl opacity-20 select-none" aria-hidden="true">${t.icon}</div>
      <div class="relative flex items-center gap-3">
        <span class="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">${t.icon}</span>
        <h1 class="text-2xl font-black leading-tight">${esc(title)}</h1>
      </div>
      ${chips.length ? `<div class="relative flex flex-wrap gap-2 mt-3">${chips.map((c) => `<span class="px-2.5 py-1 rounded-full bg-black/40 text-xs font-bold">${c}</span>`).join('')}</div>` : ''}
    </div>
    ${sub ? `<p class="text-sm text-slate-600 dark:text-slate-400 px-1">${sub}</p>` : ''}
  </div>`;
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
