// Mots : cartes par série de 10, et dictionnaire consultable.

import { esc } from '../core/util.js';
import { CARD, CHIP, BTN_SECONDARY, audioBtn, bar, pageTitle } from '../core/ui.js';
import { summary, get, MASTERED_BOX } from '../core/learner.js';
import { renderItem } from '../core/engine.js';
import { store } from '../core/store.js';
import { VOCAB } from '../content/index.js';
import { FLASH_SETS, POS_LABELS } from '../content/vocab.js';

const byId = new Map(VOCAB.map((w) => [w.id, w]));

export function renderCards(el) {
  const ui = store.data.ui;
  const setIdx = Math.min(Math.max(ui.flashSet, 0), FLASH_SETS.length - 1);
  const set = FLASH_SETS[setIdx];
  const idx = ((ui.flashIdx % set.ids.length) + set.ids.length) % set.ids.length;
  const s = summary(set.ids);

  const go = (setI, i) => { ui.flashSet = setI; ui.flashIdx = i; store.save(); renderCards(el); };

  el.innerHTML = `
    <div class="max-w-md mx-auto space-y-4 animate-pop">
      ${pageTitle('Mots', '10 séries de 10 mots. Retournez la carte, puis dites honnêtement si vous saviez : les mots difficiles reviendront plus souvent.')}
      <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" aria-label="Séries">
        ${FLASH_SETS.map((st, i) => { const m = summary(st.ids).mastered; return `<button type="button" data-set="${i}" class="${CHIP} ${i === setIdx ? 'bg-emerald-600 text-white' : 'bg-white dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'}">${i + 1}. ${esc(st.label)}${m === 10 ? ' ✓' : ''}</button>`; }).join('')}
      </div>
      <div class="space-y-1.5"><div class="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Carte ${idx + 1} / ${set.ids.length}</span><span>${s.mastered} / 10 maîtrisés</span></div>${bar(s.mastered, 10)}</div>
      <div data-cardhost></div>
      <div class="flex justify-between">
        <button type="button" data-prev class="${BTN_SECONDARY}"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Précédente</button>
        <a href="#/dico" class="${BTN_SECONDARY}"><i class="fa-solid fa-book" aria-hidden="true"></i> Dictionnaire</a>
        <button type="button" data-next class="${BTN_SECONDARY}">Passer <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
      </div>
    </div>`;

  el.querySelectorAll('[data-set]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.set), 0)));
  el.querySelector('[data-prev]').addEventListener('click', () => go(setIdx, idx - 1));
  el.querySelector('[data-next]').addEventListener('click', () => go(setIdx, idx + 1));
  renderItem(el.querySelector("[data-cardhost]"), set.ids[idx], {}, () => setTimeout(() => { if (location.hash.startsWith("#/mots")) go(setIdx, idx + 1); }, 250));
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
