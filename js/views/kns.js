// Société néerlandaise (KNS) : séances par thème ou mélangées.

import { esc, shuffle } from '../core/util.js';
import { CARD, BTN_PRIMARY, bar, pageTitle, backLink } from '../core/ui.js';
import { summary, pick } from '../core/learner.js';
import { session } from '../core/engine.js';
import { KNS_CATS, KNS_QUESTIONS } from '../content/index.js';

const idsFor = (cat) => KNS_QUESTIONS.filter((q) => cat === 'mix' || q.cat === cat).map((q) => q.id);

export function render(el, params) {
  const cat = params[0];
  if (cat && (cat === 'mix' || KNS_CATS[cat])) {
    const title = cat === 'mix' ? 'Société : séance mélangée' : `${KNS_CATS[cat].icon} ${KNS_CATS[cat].label}`;
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title, ids: shuffle(pick(idsFor(cat), 10)), backHash: '#/kns', backLabel: 'Retour aux thèmes' });
    return;
  }

  const all = summary(idsFor('mix'));
  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-5 animate-pop">
      ${pageTitle('Connaissance de la société (KNS)', `${KNS_QUESTIONS.length} questions réparties dans les thèmes de l’examen. Les questions sont en néerlandais, comme à l’examen ; touchez « Voir la traduction » si besoin. Chaque réponse est expliquée en français.`)}
      <div class="${CARD} p-5 space-y-3">
        <div class="flex justify-between text-sm font-bold dark:text-white"><span>Progression globale</span><span>${all.mastered} / ${all.total} maîtrisées</span></div>
        ${bar(all.mastered, all.total)}
        <div class="flex flex-wrap gap-2 pt-1">
          <a href="#/kns/mix" class="${BTN_PRIMARY}"><i class="fa-solid fa-shuffle" aria-hidden="true"></i> Séance mélangée (10)</a>
          <a href="#/manuel" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-700 text-sm font-bold dark:text-white">📖 Lire le manuel d’abord</a>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${Object.entries(KNS_CATS).map(([key, c]) => {
          const s = summary(idsFor(key));
          return `<a href="#/kns/${key}" class="${CARD} p-4 space-y-2 touch-active">
            <div class="flex items-center justify-between gap-2">
              <span class="min-w-0"><span class="block font-black text-slate-900 dark:text-white">${c.icon} ${esc(c.label)}</span><span class="block text-xs text-slate-500 dark:text-slate-400" lang="nl">${esc(c.nl)}</span></span>
              <i class="fa-solid fa-chevron-right text-dutchOrange" aria-hidden="true"></i>
            </div>
            ${bar(s.mastered, s.total)}
            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>${s.mastered}/${s.total} maîtrisées · ${s.seen} vues</span><span>${s.accuracy === null ? '—' : s.accuracy + ' % justes'}</span></div>
          </a>`;
        }).join('')}
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400">Chaque séance choisit d’abord les questions à revoir, puis celles que vous n’avez jamais vues. L’ordre des réponses change à chaque fois : apprenez le contenu, pas la position.</p>
      ${backLink('#/', 'Accueil')}
    </div>`;
}
