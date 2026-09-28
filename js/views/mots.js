// Mots : thèmes, cartes, exercices (de/het, écrire, dictée) et dictionnaire.

import { esc, shuffle } from '../core/util.js';
import { CARD, CHIP, BTN_SECONDARY, audioBtn, bar, pageTitle } from '../core/ui.js';
import { summary, get, pick, MASTERED_BOX } from '../core/learner.js';
import { renderItem, session } from '../core/engine.js';
import { store } from '../core/store.js';
import { VOCAB } from '../content/index.js';
import { FLASH_SETS, THEMES, POS_LABELS } from '../content/vocab.js';

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
    session(el.firstElementChild, { title, ids: shuffle(pick(pool, 10)), backHash: '#/mots', backLabel: 'Retour aux mots' });
  };
  if (mode === 'dehet') return drill('dh:', true, 'De ou het ?');
  if (mode === 'ecrire') return drill('ty:', false, 'Écrire le mot');
  if (mode === 'dictee') return drill('dc:', false, 'Dictée');
  if (mode === 'serie') return renderSet(el, Number(arg) || 0);

  const all = summary(VOCAB.map((w) => w.id));
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-5 animate-pop">
      ${pageTitle('Mots', `${VOCAB.length} mots du niveau A1, par thème. Commencez par les cartes ; les exercices reprennent ensuite les mots que vous avez vus.`)}
      <div class="${CARD} p-4 space-y-2">
        <div class="flex justify-between text-sm font-bold dark:text-white"><span>Mots maîtrisés</span><span>${all.mastered} / ${all.total} · ${all.seen} vus</span></div>
        ${bar(all.mastered, all.total)}
      </div>
      <div class="grid grid-cols-3 gap-2">
        <a href="#/mots/dehet" class="${CARD} !rounded-2xl p-3 text-center touch-active"><div class="text-2xl" aria-hidden="true">🔤</div><div class="text-sm font-black dark:text-white">De / het</div></a>
        <a href="#/mots/ecrire" class="${CARD} !rounded-2xl p-3 text-center touch-active"><div class="text-2xl" aria-hidden="true">✍️</div><div class="text-sm font-black dark:text-white">Écrire</div></a>
        <a href="#/mots/dictee" class="${CARD} !rounded-2xl p-3 text-center touch-active"><div class="text-2xl" aria-hidden="true">🎧</div><div class="text-sm font-black dark:text-white">Dictée</div></a>
      </div>
      <div class="flex justify-between items-center"><h2 class="font-black text-delftBlue dark:text-white">Cartes par thème</h2><a href="#/dico" class="text-sm font-bold text-dutchOrange">📚 Dictionnaire</a></div>
      <div class="space-y-3">
        ${THEMES.map((t) => {
          const sets = FLASH_SETS.map((st, i) => ({ ...st, i })).filter((st) => st.theme === t);
          const ids = sets.flatMap((st) => st.ids);
          const sm = summary(ids);
          return `<div class="${CARD} p-4 space-y-2">
            <div class="flex justify-between text-sm"><span class="font-black dark:text-white">${esc(t)}</span><span class="text-xs text-slate-500 dark:text-slate-400">${sm.mastered}/${sm.total} maîtrisés</span></div>
            ${bar(sm.mastered, sm.total)}
            <div class="flex flex-wrap gap-1.5 pt-1">${sets.map((st, k) => { const m = summary(st.ids); return `<a href="#/mots/serie/${st.i}" class="${CHIP} ${m.mastered === st.ids.length ? 'bg-emerald-600 text-white' : m.seen ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-700 dark:text-white'}">Série ${k + 1} · ${st.ids.length} mots${m.mastered === st.ids.length ? ' ✓' : ''}</a>`; }).join('')}</div>
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
      <a href="#/mots" class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 py-1"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Thèmes</a>
      <h1 class="text-xl font-black text-delftBlue dark:text-white">${esc(set.label)}</h1>
      <div class="space-y-1.5"><div class="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Carte ${idx + 1} / ${set.ids.length}</span><span>${s.mastered} / ${set.ids.length} maîtrisés</span></div>${bar(s.mastered, set.ids.length)}</div>
      <div data-cardhost></div>
      <div class="flex justify-between">
        <button type="button" data-prev class="${BTN_SECONDARY}"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Précédente</button>
        <button type="button" data-next class="${BTN_SECONDARY}">Passer <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>`;
  el.querySelector('[data-prev]').addEventListener('click', () => go(idx - 1));
  el.querySelector('[data-next]').addEventListener('click', () => go(idx + 1));
  renderItem(el.querySelector('[data-cardhost]'), set.ids[idx], {}, () => setTimeout(() => { if (location.hash.startsWith('#/mots/serie')) go(idx + 1); }, 250));
}

export function renderDico(el) {
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageTitle('Dictionnaire', `${VOCAB.length} mots A1 avec article, pluriel, exemple et audio.`)}
      <label class="block"><span class="sr-only">Rechercher un mot</span>
        <input type="search" data-q placeholder="🔍 Chercher en néerlandais ou en français…" class="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold shadow-sm dark:text-white" autocomplete="off"></label>
      <p data-count class="text-xs text-slate-500"></p>
      <ul data-list class="space-y-2 pb-8"></ul>
    </div>`;
  const input = el.querySelector('[data-q]');
  const list = el.querySelector('[data-list]');
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const draw = () => {
    const q = norm(input.value.trim());
    const rows = [...VOCAB].sort((a, b) => a.nl.localeCompare(b.nl, 'nl')).filter((w) => !q || norm(w.nl).includes(q) || norm(w.fr).includes(q));
    el.querySelector('[data-count]').textContent = `${rows.length} résultat${rows.length > 1 ? 's' : ''}`;
    list.innerHTML = rows.map((w) => {
      const it = get(w.id);
      const dot = !it ? 'bg-slate-300 dark:bg-slate-600' : it.box >= MASTERED_BOX ? 'bg-emerald-500' : 'bg-amber-400';
      return `<li class="${CARD} !rounded-2xl p-3 flex justify-between items-center gap-3">
        <div class="min-w-0">
          <div class="text-sm dark:text-white"><span class="inline-block w-2 h-2 rounded-full ${dot} mr-1.5" aria-hidden="true"></span>${w.art ? `<span class="text-slate-400">${w.art}</span> ` : ''}<b lang="nl" class="selectable">${esc(w.nl)}</b> <span class="text-amber-700 dark:text-amber-400">— ${esc(w.fr)}</span></div>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${POS_LABELS[w.pos]}${w.pl ? ` · pl. <span lang="nl">${esc(w.pl)}</span>` : ''} · <span lang="nl" class="selectable">${esc(w.ex)}</span></div>
        </div>
        ${audioBtn((w.art ? w.art + ' ' : '') + w.nl, 'Écouter')}
      </li>`;
    }).join('');
  };
  input.addEventListener('input', draw);
  draw();
}

export { byId };
