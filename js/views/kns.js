// KNS (Kennis van de Nederlandse Samenleving) : séances par thème ou mélangées.

import { esc, shuffle } from '../core/util.js';
import { CARD, BTN_PRIMARY, bar, pageHero, backLink } from '../core/ui.js';
import { summary, pick } from '../core/learner.js';
import { session } from '../core/engine.js';
import { KNS_CATS, KNS_QUESTIONS } from '../content/index.js';
import { tr, tri } from '../core/i18n.js';
import { icon, KNS_ICON } from '../core/icons.js';

const idsFor = (cat) => KNS_QUESTIONS.filter((q) => cat === 'mix' || q.cat === cat).map((q) => q.id);

export function render(el, params) {
  const cat = params[0];
  if (cat && (cat === 'mix' || KNS_CATS[cat])) {
    const title = cat === 'mix' ? 'KNS: alle thema’s' : KNS_CATS[cat].nl;
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title, ids: shuffle(pick(idsFor(cat), 10)), backHash: '#/kns', backLabel: 'Terug naar KNS' });
    return;
  }

  const all = summary(idsFor('mix'));
  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-5 animate-pop">
      ${pageHero('societe', 'KNS', tr('Kennis van de Nederlandse Samenleving. De vragen zijn in het Nederlands, net als op het examen. Tik op 🇫🇷 FR of op „Vertaling tonen” als je hulp nodig hebt.', 'Connaissance de la société néerlandaise. Questions en néerlandais comme à l’examen ; touchez FR ou « Vertaling tonen » pour la traduction. Chaque réponse est expliquée en français.'),
        [`${KNS_QUESTIONS.length} vragen`, `${all.mastered} gekend`, '8 thema’s'], 'Connaissance de la société néerlandaise')}
      <div class="${CARD} p-5 space-y-3">
        <div class="flex justify-between text-sm font-bold dark:text-white"><span>${tri('Voortgang', 'Progression')}</span><span>${all.mastered} / ${all.total} ${tri('gekend', 'maîtrisées')}</span></div>
        ${bar(all.mastered, all.total, 'bg-orange-500')}
        <div class="flex flex-wrap gap-2 pt-1">
          <a href="#/kns/mix" class="${BTN_PRIMARY} !bg-orange-600"><i class="fa-solid fa-shuffle" aria-hidden="true"></i> ${tri('Alle thema’s (10 vragen)', 'Séance mélangée')}</a>
          <a href="#/manuel" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-200 text-sm font-bold">${icon('book', 'w-5 h-5')} ${tri('Lees eerst het handboek', 'Lire le manuel d’abord')}</a>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        ${Object.entries(KNS_CATS).map(([key, c]) => {
          const s = summary(idsFor(key));
          return `<a href="#/kns/${key}" class="${CARD} p-4 space-y-2.5 touch-active">
            <div class="flex items-center gap-3">
              <span class="w-11 h-11 rounded-2xl bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 flex items-center justify-center shrink-0">${icon(KNS_ICON[key], 'w-7 h-7')}</span>
              <span class="flex-1 min-w-0"><span class="block font-black text-slate-900 dark:text-white" lang="nl">${esc(c.nl)}</span><span class="fr text-xs text-slate-500 dark:text-slate-400" lang="fr">${esc(c.label)}</span></span>
              <i class="fa-solid fa-chevron-right text-dutchOrange" aria-hidden="true"></i>
            </div>
            ${bar(s.mastered, s.total, 'bg-orange-500')}
            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400"><span>${s.mastered}/${s.total} gekend · ${s.seen} gezien</span><span>${s.accuracy === null ? '—' : s.accuracy + ' % goed'}</span></div>
          </a>`;
        }).join('')}
      </div>
      <p class="text-xs text-slate-500 dark:text-slate-400">${tr('Elke oefening kiest eerst de vragen die je moet herhalen, dan nieuwe vragen. De antwoorden staan elke keer in een andere volgorde.', 'Chaque séance choisit d’abord les questions à revoir, puis les nouvelles. L’ordre des réponses change : apprenez le contenu, pas la position.')}</p>
      ${backLink('#/', 'Start')}
    </div>`;
}
