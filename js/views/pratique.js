// Grammaire, lecture et écoute : listes d’exercices + séances.

import { esc, shuffle } from '../core/util.js';
import { CARD, BTN_PRIMARY, bar, pageTitle, backLink } from '../core/ui.js';
import { summary, get, pick, MASTERED_BOX } from '../core/learner.js';
import { session } from '../core/engine.js';
import { store } from '../core/store.js';
import { PUZZLES, GRAMMAR_Q, READING, LISTENING, WORDMATCH } from '../content/index.js';

const statusIcon = (id) => {
  const it = get(id);
  if (!it) return '<span class="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" aria-label="Nouveau"></span>';
  if (it.box >= MASTERED_BOX) return '<span class="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center" aria-label="Maîtrisé">✓</span>';
  return `<span class="w-6 h-6 rounded-full ${it.lastOk ? 'bg-amber-400' : 'bg-red-400'} text-white text-xs flex items-center justify-center" aria-label="En cours">•</span>`;
};

function runIn(el, cfg) {
  el.innerHTML = '<div></div>';
  session(el.firstElementChild, cfg);
}

export function renderGrammaire(el, params) {
  if (params[0] === 'phrases') return runIn(el, { title: 'Construire des phrases', ids: pick(PUZZLES.map((p) => p.id), 10), backHash: '#/grammaire' });
  if (params[0] === 'questions') return runIn(el, { title: 'Questions de grammaire', ids: shuffle(pick(GRAMMAR_Q.map((q) => q.id), 10)), backHash: '#/grammaire' });

  const sp = summary(PUZZLES.map((p) => p.id));
  const sq = summary(GRAMMAR_Q.map((q) => q.id));
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageTitle('Phrases & grammaire', 'L’ordre des mots est la difficulté n°1 pour les francophones. Chaque correction explique la règle en français.')}
      <a href="#/grammaire/phrases" class="${CARD} p-5 flex items-center gap-4 touch-active">
        <span class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-2xl" aria-hidden="true">🧩</span>
        <span class="flex-1 space-y-1.5"><span class="block font-black dark:text-white">Construire des phrases</span><span class="block text-xs text-slate-500 dark:text-slate-400">Remettez les mots dans l’ordre. Plusieurs ordres corrects sont acceptés.</span>${bar(sp.mastered, sp.total, 'bg-purple-500')}</span>
      </a>
      <a href="#/grammaire/questions" class="${CARD} p-5 flex items-center gap-4 touch-active">
        <span class="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center text-2xl" aria-hidden="true">✍️</span>
        <span class="flex-1 space-y-1.5"><span class="block font-black dark:text-white">Questions de grammaire</span><span class="block text-xs text-slate-500 dark:text-slate-400">Articles de / het, niet / geen, conjugaison, prépositions.</span>${bar(sq.mastered, sq.total, 'bg-purple-500')}</span>
      </a>
      ${backLink('#/', 'Accueil')}
    </div>`;
}

function docList(el, params, { key, title, sub, list: all, label, icon, extra = '' }) {
  // Un document peut avoir plusieurs questions (id « …b ») : on liste chaque document une fois.
  const group = (d) => d.textId || d.id;
  const list = all.filter((d, i) => all.findIndex((x) => group(x) === group(d)) === i);
  const idsFrom = (i) => list.slice(i).flatMap((d) => all.filter((x) => group(x) === group(d)).map((x) => x.id));
  const ids = idsFrom(0);
  if (key === 'lecture' && params[0] === 'mots') return runIn(el, { title: 'Échauffement : mots', ids: shuffle(pick(WORDMATCH.map((w) => w.id), 10)), backHash: '#/lecture' });
  if (key === 'lecture' && params[0] === 'examen') {
    // Format de l’examen depuis mai 2023 : 9 textes, questions à 3 choix, 35 minutes.
    const texts = shuffle([...new Set(all.map((d) => d.textId))]).slice(0, 9);
    const examIds = texts.flatMap((t) => all.filter((d) => d.textId === t).map((d) => d.id));
    const mark = Math.ceil(examIds.length * 0.74);
    return runIn(el, {
      title: 'Examen blanc : Lecture', ids: examIds, exam: true, timeLimit: 35 * 60, passMark: mark, backHash: '#/lecture', backLabel: 'Retour à Lecture',
      passNote: 'Seuil indicatif (environ 74 %, comme 14/19 dans les guides de préparation) : DUO ne publie pas le seuil officiel.',
      onFinish: (results, { good, total, seconds, passed }) => { store.data.exams.push({ kind: 'lecture', date: Date.now(), good, total, seconds, passed }); store.save(); },
    });
  }
  if (params[0] === 'tout') return runIn(el, { title, ids, backHash: `#/${key}` });
  if (params[0] !== undefined) {
    const start = Number(params[0]);
    if (start >= 0 && start < list.length) return runIn(el, { title, ids: idsFrom(start), backHash: `#/${key}` });
  }
  const s = summary(ids);
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageTitle(title, sub)}
      <div class="${CARD} p-4 space-y-3">
        <div class="flex justify-between text-sm font-bold dark:text-white"><span>${s.mastered} / ${s.total} maîtrisés</span><span>${s.accuracy === null ? '' : s.accuracy + ' % justes'}</span></div>
        ${bar(s.mastered, s.total, 'bg-teal-500')}
        <a href="#/${key}/tout" class="${BTN_PRIMARY}"><i class="fa-solid fa-play" aria-hidden="true"></i> Tout faire à la suite</a>
      </div>
      ${extra}
      <ul class="space-y-2">
        ${list.map((d, i) => `<li><a href="#/${key}/${i}" class="${CARD} !rounded-2xl p-3.5 flex items-center gap-3 touch-active">
          <span class="text-xl" aria-hidden="true">${icon}</span>
          <span class="flex-1 font-bold text-sm dark:text-white">${esc(label(d, i))}</span>
          ${statusIcon(d.id)}
        </a></li>`).join('')}
      </ul>
      ${backLink('#/', 'Accueil')}
    </div>`;
}

export const renderLecture = (el, params) => docList(el, params, {
  key: 'lecture', title: 'Lecture', icon: '📄', list: READING, label: (d) => d.title,
  sub: 'À l’examen (depuis mai 2023) : 9 courts textes du quotidien (annonces, messages, tableaux, petites histoires), des questions à 3 choix, 35 minutes. Cherchez l’information précise : pas besoin de comprendre chaque mot.',
  extra: (() => { const s = summary(WORDMATCH.map((w) => w.id)); return `<a href="#/lecture/mots" class="${CARD} p-4 flex items-center gap-3 touch-active">
    <span class="w-11 h-11 shrink-0 rounded-2xl bg-teal-100 dark:bg-teal-950/50 flex items-center justify-center text-xl" aria-hidden="true">🔤</span>
    <span class="flex-1 min-w-0 space-y-1.5"><span class="block font-black dark:text-white">Échauffement : reconnaître des mots</span><span class="block text-xs text-slate-500 dark:text-slate-400">Entendre un mot → choisir le mot écrit, ou l’inverse. Utile pour le vocabulaire (cette partie a été retirée de l’examen en mai 2023). ${s.mastered}/${s.total} maîtrisés.</span>${bar(s.mastered, s.total, 'bg-teal-500')}</span>
  </a><a href="#/lecture/examen" class="block bg-gradient-to-r from-teal-600 to-delftBlue text-white p-5 rounded-3xl shadow-lg touch-active">
    <div class="flex items-center justify-between gap-3">
      <div><div class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-black w-fit mb-1">⏳ Examen blanc · 35 min</div><div class="text-lg font-black">9 textes, 18 questions</div></div>
      <span class="${BTN_PRIMARY} !bg-white !text-delftBlue">Commencer</span>
    </div>
  </a><h2 class="text-sm font-black text-slate-700 dark:text-slate-200 pt-2">Tous les textes (${new Set(READING.map((d) => d.textId)).size})</h2>`; })(),
});

export const renderEcoute = (el, params) => docList(el, params, {
  key: 'ecoute', title: 'Écoute', icon: '🎧', list: LISTENING, label: (d, i) => `Message ${i + 1}`,
  sub: 'Des messages courts lus par la voix néerlandaise de votre appareil. La transcription s’affiche après votre réponse.',
});
