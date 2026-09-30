// Mots : thèmes, cartes, exercices (de/het, écrire, dictée) et dictionnaire.

import { esc, shuffle } from '../core/util.js';
import { CARD, CHIP, BTN_SECONDARY, audioBtn, bar, pageTitle, pageHero } from '../core/ui.js';
import { summary, get, pick, MASTERED_BOX } from '../core/learner.js';
import { renderItem, session } from '../core/engine.js';
import { store } from '../core/store.js';
import { VOCAB } from '../content/index.js';
import { FLASH_SETS, THEMES as THEMES_LIST, POS_LABELS, THEME_FR } from '../content/vocab.js';
import { tr, tri } from '../core/i18n.js';
import { icon } from '../core/icons.js';

const byId = new Map(VOCAB.map((w) => [w.id, w]));

// Écran « Mots » : exercices, puis thèmes et séries de cartes.
export function renderCards(el, params = []) {
  const [mode, arg] = params;
  const seenPool = () => {
    // Les exercices portent d’abord sur les mots déjà vus en cartes, puis sur les suivants dans l’ordre.
    const seen = VOCAB.filter((w) => get(w.id));
    const rest = VOCAB.filter((w) => !get(w.id));
    return [...seen, ...rest.slice(0, Math.max(0, 30 - seen.length))];
  };
  const drill = (prefix, onlyNouns, title) => {
    const pool = seenPool().filter((w) => !onlyNouns || w.art).map((w) => prefix + w.nl);
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title, ids: shuffle(pick(pool, 10)), backHash: '#/mots', backLabel: 'Terug naar Woorden' });
  };
  if (mode === 'dehet') return drill('dh:', true, 'De of het?');
  if (mode === 'ecrire') return drill('ty:', false, 'Schrijf het woord');
  if (mode === 'dictee') return drill('dc:', false, 'Dictee');
  if (mode === 'serie') return renderSet(el, Number(arg) || 0);

  const all = summary(VOCAB.map((w) => w.id));
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-5 animate-pop">
      ${pageHero('mots', 'Woorden', tr('Begin met de kaarten. De oefeningen gebruiken daarna de woorden die je al kent.', 'Commencez par les cartes ; les exercices reprennent ensuite les mots déjà vus.'), [`${VOCAB.length} woorden A1`, `${all.mastered} geleerd`, `${THEMES_LIST.length} thema’s`], 'Vocabulaire')}
      <div class="${CARD} p-4 space-y-2">
        <div class="flex justify-between text-sm font-bold dark:text-white"><span>${tri('Geleerde woorden', 'Mots maîtrisés')}</span><span>${all.mastered} / ${all.total} · ${all.seen} gezien</span></div>
        ${bar(all.mastered, all.total)}
      </div>
      <div class="grid grid-cols-3 gap-2">
        <a href="#/mots/dehet" class="${CARD} !rounded-2xl p-3 text-center touch-active"><div class="flex justify-center text-emerald-600 dark:text-emerald-400">${icon('cards', 'w-8 h-8')}</div><div class="text-sm font-black dark:text-white">De / het</div><div class="fr text-[11px] text-slate-500" lang="fr">l’article</div></a>
        <a href="#/mots/ecrire" class="${CARD} !rounded-2xl p-3 text-center touch-active"><div class="flex justify-center text-emerald-600 dark:text-emerald-400">${icon('pencil', 'w-8 h-8')}</div><div class="text-sm font-black dark:text-white">Schrijven</div><div class="fr text-[11px] text-slate-500" lang="fr">écrire</div></a>
        <a href="#/mots/dictee" class="${CARD} !rounded-2xl p-3 text-center touch-active"><div class="flex justify-center text-emerald-600 dark:text-emerald-400">${icon('headphones', 'w-8 h-8')}</div><div class="text-sm font-black dark:text-white">Dictee</div><div class="fr text-[11px] text-slate-500" lang="fr">dictée</div></a>
      </div>
      <div class="flex justify-between items-center"><h2 class="font-black text-delftBlue dark:text-white">${tri('Kaarten per thema', 'Cartes par thème')}</h2><a href="#/dico" class="inline-flex items-center gap-1.5 text-sm font-bold text-dutchOrange">${icon('book', 'w-5 h-5')} Woordenboek</a></div>
      <div class="space-y-3">
        ${THEMES_LIST.map((t) => {
          const sets = FLASH_SETS.map((st, i) => ({ ...st, i })).filter((st) => st.theme === t);
          const ids = sets.flatMap((st) => st.ids);
          const sm = summary(ids);
          return `<div class="${CARD} p-4 space-y-2">
            <div class="flex justify-between text-sm"><span><span class="font-black dark:text-white" lang="nl">${esc(t)}</span><span class="fr-i text-xs text-slate-500" lang="fr">${esc(THEME_FR[t] || '')}</span></span><span class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">${sm.mastered}/${sm.total} geleerd</span></div>
            ${bar(sm.mastered, sm.total)}
            <div class="flex flex-wrap gap-1.5 pt-1">${sets.map((st, k) => { const m = summary(st.ids); return `<a href="#/mots/serie/${st.i}" class="${CHIP} ${m.mastered === st.ids.length ? 'bg-emerald-600 text-white' : m.seen ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-700 dark:text-white'}">Serie ${k + 1} · ${st.ids.length} woorden${m.mastered === st.ids.length ? ' ✓' : ''}</a>`; }).join('')}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

function renderSet(el, setIdx) {
  const ui = store.data.ui;
  setIdx = Math.min(Math.max(setIdx, 0), FLASH_SETS.length - 1);
  const set = FLASH_SETS[setIdx];
  if (ui.flashSet !== setIdx) { ui.flashSet = setIdx; ui.flashIdx = 0; }
  const idx = ((ui.flashIdx % set.ids.length) + set.ids.length) % set.ids.length;
  const s = summary(set.ids);
  const go = (i) => { ui.flashIdx = i; store.save(); renderSet(el, setIdx); };

  el.innerHTML = `
    <div class="max-w-md mx-auto space-y-4 animate-pop">
      <a href="#/mots" class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 py-1"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Thema’s</a>
      <h1 class="text-xl font-black text-delftBlue dark:text-white">${esc(set.label)}</h1>
      <div class="space-y-1.5"><div class="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Kaart ${idx + 1} / ${set.ids.length}</span><span>${s.mastered} / ${set.ids.length} geleerd</span></div>${bar(s.mastered, set.ids.length)}</div>
      <div data-cardhost></div>
      <div class="flex justify-between">
        <button type="button" data-prev class="${BTN_SECONDARY}"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Vorige</button>
        <button type="button" data-next class="${BTN_SECONDARY}">Overslaan <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>`;
  el.querySelector('[data-prev]').addEventListener('click', () => go(idx - 1));
  el.querySelector('[data-next]').addEventListener('click', () => go(idx + 1));
  renderItem(el.querySelector('[data-cardhost]'), set.ids[idx], {}, () => setTimeout(() => { if (location.hash.startsWith('#/mots/serie')) go(idx + 1); }, 250));
}

export function renderDico(el) {
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageHero('mots', 'Woordenboek', tr('Lidwoord, meervoud, voorbeeld en audio voor elk woord.', 'Article, pluriel, exemple et audio pour chaque mot.'), [`${VOCAB.length} woorden`], 'Dictionnaire')}
      <label class="block"><span class="sr-only">Zoek een woord</span>
        <input type="search" data-q placeholder="🔍 Zoek in het Nederlands of Frans… (NL / FR)" class="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold shadow-sm dark:text-white" autocomplete="off"></label>
      <p data-count class="text-xs text-slate-500"></p>
      <ul data-list class="space-y-2 pb-8"></ul>
    </div>`;
  const input = el.querySelector('[data-q]');
  const list = el.querySelector('[data-list]');
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const draw = () => {
    const q = norm(input.value.trim());
    const rows = [...VOCAB].sort((a, b) => a.nl.localeCompare(b.nl, 'nl')).filter((w) => !q || norm(w.nl).includes(q) || norm(w.fr).includes(q));
    el.querySelector('[data-count]').textContent = `${rows.length} ${rows.length === 1 ? 'resultaat' : 'resultaten'}`;
    list.innerHTML = rows.map((w) => {
      const it = get(w.id);
      const dot = !it ? 'bg-slate-300 dark:bg-slate-600' : it.box >= MASTERED_BOX ? 'bg-emerald-500' : 'bg-amber-400';
      return `<li class="${CARD} !rounded-2xl p-3 flex justify-between items-center gap-3">
        <div class="min-w-0">
          <div class="text-sm dark:text-white"><span class="inline-block w-2 h-2 rounded-full ${dot} mr-1.5" aria-hidden="true"></span>${w.art ? `<span class="text-slate-400">${w.art}</span> ` : ''}<b lang="nl" class="selectable">${esc(w.nl)}</b> <span class="text-amber-700 dark:text-amber-400" lang="fr">— ${esc(w.fr)}</span></div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${POS_LABELS[w.pos]}${w.pl ? ` · mv. <span lang="nl">${esc(w.pl)}</span>` : ''} · <span lang="nl" class="selectable">${esc(w.ex)}</span></div>
        </div>
        ${audioBtn((w.art ? w.art + ' ' : '') + w.nl)}
      </li>`;
    }).join('');
  };
  input.addEventListener('input', draw);
  draw();
}

export { byId };
