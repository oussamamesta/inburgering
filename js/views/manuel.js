// Manuel en français : chapitres, pages, vocabulaire clé et mini-quiz.

import { esc } from '../core/util.js';
import { CARD, CHIP, BTN_PRIMARY, BTN_SECONDARY, audioBtn } from '../core/ui.js';
import { get } from '../core/learner.js';
import { renderItem } from '../core/engine.js';
import { store } from '../core/store.js';
import { MANUEL } from '../content/index.js';

const SHORT = { wonen: 'Logement', geschiedenis: 'Histoire', staat: 'État', taal: 'Langue', onderwijs: 'Enfants', zorg: 'Santé', werk: 'Travail', usages: 'Usages' };

export function render(el, params) {
  let ci = params[0] !== undefined ? Number(params[0]) : store.data.ui.manuelCh;
  let pi = params[1] !== undefined ? Number(params[1]) : store.data.ui.manuelPg;
  if (!(ci >= 0 && ci < MANUEL.length)) ci = 0;
  if (!(pi >= 0 && pi < MANUEL[ci].pages.length)) pi = 0;
  store.data.ui.manuelCh = ci;
  store.data.ui.manuelPg = pi;
  store.save();

  const ch = MANUEL[ci];
  const p = ch.pages[pi];
  const isLast = ci === MANUEL.length - 1 && pi === ch.pages.length - 1;
  const nextHash = pi < ch.pages.length - 1 ? `#/manuel/${ci}/${pi + 1}` : `#/manuel/${ci + 1}/0`;
  const prevHash = pi > 0 ? `#/manuel/${ci}/${pi - 1}` : ci > 0 ? `#/manuel/${ci - 1}/${MANUEL[ci - 1].pages.length - 1}` : null;

  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-4 animate-pop">
      <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Thèmes">
        ${MANUEL.map((c, i) => { const done = c.pages.filter((pg) => get(pg.id)).length; return `<a href="#/manuel/${i}/0" role="tab" aria-selected="${i === ci}" class="${CHIP} ${i === ci ? 'bg-dutchOrange text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}" title="${esc(c.t)}">${c.icon} ${SHORT[c.id] || esc(c.t)}${done === c.pages.length ? ' ✓' : ''}</a>`; }).join('')}
      </div>
      <article class="${CARD} overflow-hidden">
        <header class="bg-gradient-to-r from-delftBlue to-slate-800 text-white p-5 flex items-center gap-4">
          <span class="text-4xl" aria-hidden="true">${ch.icon}</span>
          <div><div class="text-xs font-black text-orange-300">Thème ${ci + 1} · <span lang="nl">${esc(ch.nl)}</span></div><h1 class="text-xl font-black">${esc(ch.t)}</h1></div>
        </header>
        <div class="flex gap-1 p-2 bg-slate-100 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-700">
          ${ch.pages.map((pg, i) => `<a href="#/manuel/${ci}/${i}" class="px-3 py-1.5 rounded-xl text-xs font-black ${i === pi ? 'bg-white dark:bg-slate-800 text-dutchOrange shadow-sm' : 'text-slate-500 dark:text-slate-400'}">Page ${i + 1}${get(pg.id) ? ' ✓' : ''}</a>`).join('')}
        </div>
        <div class="p-5 sm:p-6 space-y-5">
          <h2 class="text-lg font-black text-slate-900 dark:text-white">${esc(p.title)}</h2>
          <p class="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed selectable">${esc(p.txt)}</p>
          <div class="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-600 space-y-2">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Vocabulaire clé</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${p.vocab.map((v) => `<div class="flex justify-between items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"><div class="min-w-0"><div class="font-black text-sm dark:text-white selectable" lang="nl">${esc(v.d)}</div><div class="text-xs text-slate-500 dark:text-slate-400">${esc(v.f)}</div></div>${audioBtn(v.d, 'Écouter')}</div>`).join('')}
            </div>
          </div>
          <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 rounded-2xl text-sm text-amber-950 dark:text-amber-100">💡 <b>À retenir :</b> ${esc(p.tip)}</div>
          <div class="space-y-2"><h3 class="text-sm font-black dark:text-white">❓ Vérifiez que vous avez compris</h3><div data-quiz></div></div>
          ${ch.sources?.length ? `<p class="text-xs text-slate-500 dark:text-slate-400">Sources : ${ch.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener" class="underline">${esc(x.label)}</a>`).join(' · ')}</p>` : ''}
          <div class="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
            ${prevHash ? `<a href="${prevHash}" class="${BTN_SECONDARY}"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Précédent</a>` : '<span></span>'}
            ${isLast ? '<a href="#/kns" class="' + BTN_PRIMARY + '">Passer aux questions</a>' : `<a href="${nextHash}" class="${BTN_PRIMARY}">Page suivante <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>`}
          </div>
        </div>
      </article>
    </div>`;

  renderItem(el.querySelector('[data-quiz]'), p.id, {}, () => {});
}
