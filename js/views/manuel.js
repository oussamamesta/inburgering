// Handboek : chaque page en néerlandais simple (A1), avec l’explication détaillée en français à la demande.

import { esc } from '../core/util.js';
import { CARD, CHIP, BTN_PRIMARY, BTN_SECONDARY, audioBtn } from '../core/ui.js';
import { get } from '../core/learner.js';
import { renderItem } from '../core/engine.js';
import { store } from '../core/store.js';
import { MANUEL } from '../content/index.js';
import { tr, tri, frOn } from '../core/i18n.js';
import { icon, KNS_ICON } from '../core/icons.js';

const SHORT = { wonen: 'Wonen', geschiedenis: 'Geschiedenis', staat: 'Staat', taal: 'Taal', onderwijs: 'School', zorg: 'Zorg', werk: 'Werk', usages: 'Omgang' };

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
  const lines = p.lines || [];

  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-4 animate-pop">
      <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist" aria-label="Thema’s">
        ${MANUEL.map((c, i) => { const done = c.pages.filter((pg) => get(pg.id)).length; return `<a href="#/manuel/${i}/0" role="tab" aria-selected="${i === ci}" class="${CHIP} inline-flex items-center gap-1.5 ${i === ci ? 'bg-dutchOrange text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}" title="${esc(c.nl)} · ${esc(c.t)}">${icon(KNS_ICON[c.cat] || 'book', 'w-4 h-4')} ${SHORT[c.id] || esc(c.nl)}${done === c.pages.length ? ' ✓' : ''}</a>`; }).join('')}
      </div>
      <article class="${CARD} overflow-hidden">
        <header class="bg-gradient-to-r from-orange-800 to-orange-700 text-white p-5 flex items-center gap-4">
          <span class="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">${icon(KNS_ICON[ch.cat] || 'book', 'w-9 h-9')}</span>
          <div class="min-w-0"><div class="text-xs font-black text-orange-200">Thema ${ci + 1} · Handboek</div><h1 class="text-xl font-black" lang="nl">${esc(ch.nl)}</h1><p class="fr text-sm text-orange-100" lang="fr">${esc(ch.t)}</p></div>
        </header>
        <div class="flex gap-1 p-2 bg-slate-100 dark:bg-slate-700/60 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-none">
          ${ch.pages.map((pg, i) => `<a href="#/manuel/${ci}/${i}" class="px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap ${i === pi ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-300 shadow-sm' : 'text-slate-500 dark:text-slate-400'}">Pagina ${i + 1}${get(pg.id) ? ' ✓' : ''}</a>`).join('')}
        </div>
        <div class="p-5 sm:p-6 space-y-5">
          <div class="flex items-start justify-between gap-3">
            <div><h2 class="text-lg font-black text-slate-900 dark:text-white" lang="nl">${esc(p.titleNl || p.title)}</h2><p class="fr text-sm text-slate-500 dark:text-slate-400" lang="fr">${esc(p.title)}</p></div>
            ${lines.length ? `<button type="button" data-say="${esc(lines.join(' '))}" data-say-rate="0.85" class="${BTN_SECONDARY} shrink-0"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Lees voor</button>` : ''}
          </div>
          ${lines.length ? `<ol class="space-y-2">
            ${lines.map((s) => `<li><button type="button" data-say="${esc(s)}" class="w-full text-left flex gap-3 items-start p-3 rounded-2xl bg-orange-50/60 dark:bg-slate-700/40 hover:bg-orange-100 dark:hover:bg-slate-700 touch-active">
              <i class="fa-solid fa-volume-low text-orange-500 mt-1 text-xs" aria-hidden="true"></i>
              <span class="text-[16px] leading-relaxed text-slate-800 dark:text-slate-100 selectable" lang="nl">${esc(s)}</span></button></li>`).join('')}
          </ol>
          <p class="text-xs text-slate-500 dark:text-slate-400">${tri('Tik op een zin om hem te horen.', 'Touchez une phrase pour l’écouter.')}</p>` : ''}
          <div class="bg-slate-50 dark:bg-slate-700/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-600 space-y-2">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${tri('Belangrijke woorden', 'Mots clés')}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${p.vocab.map((v) => `<div class="flex justify-between items-center gap-2 p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"><div class="min-w-0"><div class="font-black text-sm dark:text-white selectable" lang="nl">${esc(v.d)}</div><div class="text-xs text-slate-500 dark:text-slate-400" lang="fr">${esc(v.f)}</div></div>${audioBtn(v.d)}</div>`).join('')}
            </div>
          </div>
          <details data-fr-details class="group rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/60 dark:bg-blue-950/30" ${frOn() ? 'open' : ''}>
            <summary class="cursor-pointer list-none p-4 flex items-center gap-2 font-black text-sm text-blue-900 dark:text-blue-200">
              <span aria-hidden="true">🇫🇷</span> Uitleg in het Frans <span class="font-medium text-xs text-blue-700/80 dark:text-blue-300/80" lang="fr">· explication détaillée</span>
              <i class="fa-solid fa-chevron-down ml-auto transition-transform group-open:rotate-180" aria-hidden="true"></i>
            </summary>
            <div class="px-4 pb-4 space-y-3" lang="fr">
              <p class="text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed selectable">${esc(p.txt)}</p>
              <div class="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-sm text-amber-950 dark:text-amber-100"><b>À retenir :</b> ${esc(p.tip)}</div>
            </div>
          </details>
          <div class="space-y-2"><h3 class="text-sm font-black dark:text-white flex items-center gap-2">${icon('target', 'w-5 h-5 text-orange-500')} ${tri('Heb je het begrepen?', 'Avez-vous compris ?')}</h3><div data-quiz></div></div>
          ${ch.sources?.length ? `<p class="text-xs text-slate-500 dark:text-slate-400">Bronnen: ${ch.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener" class="underline">${esc(x.label)}</a>`).join(' · ')}</p>` : ''}
          <div class="flex justify-between gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
            ${prevHash ? `<a href="${prevHash}" class="${BTN_SECONDARY}"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Vorige</a>` : '<span></span>'}
            ${isLast ? `<a href="#/kns" class="${BTN_PRIMARY}">Naar de KNS-vragen</a>` : `<a href="${nextHash}" class="${BTN_PRIMARY}">Volgende pagina <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>`}
          </div>
        </div>
      </article>
    </div>`;

  renderItem(el.querySelector('[data-quiz]'), p.id, {}, () => {});
}
