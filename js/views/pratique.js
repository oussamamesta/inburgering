// Grammatica, Lezen (verhalen + teksten) en Luisteren : listes d’exercices + séances.

import { esc, shuffle } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, bar, pageHero, backLink, audioBtn } from '../core/ui.js';
import { summary, get, pick, MASTERED_BOX } from '../core/learner.js';
import { session } from '../core/engine.js';
import { store } from '../core/store.js';
import { PUZZLES, GRAMMAR_Q, READING, LISTENING, WORDMATCH, STORIES, STORY_QUESTIONS } from '../content/index.js';
import { tr, tri } from '../core/i18n.js';
import { icon } from '../core/icons.js';
import { scene } from '../core/scenes.js';

const statusIcon = (id) => {
  const it = get(id);
  if (!it) return '<span class="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" aria-label="Nieuw"></span>';
  if (it.box >= MASTERED_BOX) return '<span class="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center" aria-label="Geleerd">✓</span>';
  return `<span class="w-6 h-6 rounded-full ${it.lastOk ? 'bg-amber-400' : 'bg-red-400'} text-white text-xs flex items-center justify-center" aria-label="Bezig">•</span>`;
};

function runIn(el, cfg) {
  el.innerHTML = '<div></div>';
  session(el.firstElementChild, cfg);
}

const rowLink = (href, iconName, tint, title, fr, desc, extra = '') => `<a href="${href}" class="${CARD} p-4 flex items-center gap-4 touch-active">
  <span class="w-12 h-12 shrink-0 rounded-2xl ${tint} flex items-center justify-center">${icon(iconName, 'w-7 h-7')}</span>
  <span class="flex-1 min-w-0 space-y-1.5"><span class="block font-black dark:text-white" lang="nl">${title}</span>${fr ? `<span class="fr text-xs text-slate-500 dark:text-slate-400" lang="fr">${fr}</span>` : ''}${desc ? `<span class="block text-xs text-slate-500 dark:text-slate-400">${desc}</span>` : ''}${extra}</span>
  <i class="fa-solid fa-chevron-right text-slate-400" aria-hidden="true"></i>
</a>`;

// ── Grammatica ──
export function renderGrammaire(el, params) {
  if (params[0] === 'phrases') return runIn(el, { title: 'Zinnen maken', ids: pick(PUZZLES.map((p) => p.id), 10), backHash: '#/grammaire', backLabel: 'Terug naar Grammatica' });
  if (params[0] === 'questions') return runIn(el, { title: 'Grammaticavragen', ids: shuffle(pick(GRAMMAR_Q.map((q) => q.id), 10)), backHash: '#/grammaire', backLabel: 'Terug naar Grammatica' });

  const sp = summary(PUZZLES.map((p) => p.id));
  const sq = summary(GRAMMAR_Q.map((q) => q.id));
  const tint = 'bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300';
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageHero('grammaire', 'Grammatica', tr('De woordvolgorde is het moeilijkste voor Franstaligen. Oefen hier zinnen maken.', 'L’ordre des mots est la difficulté n°1 pour les francophones. Chaque correction explique la règle en français.'), [], 'Phrases et grammaire')}
      ${rowLink('#/grammaire/phrases', 'pencil', tint, 'Zinnen maken', 'Construire des phrases', tri('Zet de woorden in de goede volgorde.', 'Remettez les mots dans l’ordre.'), bar(sp.mastered, sp.total, 'bg-purple-500'))}
      ${rowLink('#/grammaire/questions', 'target', tint, 'Grammaticavragen', 'Questions de grammaire', 'de / het · niet / geen · werkwoorden · voorzetsels', bar(sq.mastered, sq.total, 'bg-purple-500'))}
      ${backLink('#/', 'Start')}
    </div>`;
}

// ── Verhalen ──
function storyList(el) {
  const all = summary(STORY_QUESTIONS.map((q) => q.id));
  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-4 animate-pop">
      ${pageHero('verhalen', 'Verhalen', tr('Korte verhalen uit het dagelijks leven in Nederland, op A1-niveau. Lees, luister en beantwoord drie vragen.', 'De courtes histoires illustrées de la vie quotidienne, niveau A1. Lisez, écoutez, puis répondez à trois questions. Ce n’est pas un format d’examen : c’est pour lire avec plaisir et fixer le vocabulaire.'),
        [`${STORIES.length} verhalen`, `${all.mastered}/${all.total} vragen geleerd`], 'Histoires illustrées')}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${STORIES.map((s, i) => {
          const sm = summary(STORY_QUESTIONS.filter((q) => q.story === s.id).map((q) => q.id));
          const done = sm.mastered === sm.total;
          return `<a href="#/lecture/verhalen/${i}" class="${CARD} overflow-hidden touch-active block">
            <div class="border-b border-slate-200 dark:border-slate-700">${scene(s.id, 0, s.title)}</div>
            <div class="p-4 flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 font-black flex items-center justify-center shrink-0">${i + 1}</span>
              <span class="flex-1 min-w-0"><span class="block font-black text-slate-900 dark:text-white" lang="nl">${esc(s.title)}</span><span class="fr text-xs text-slate-500 dark:text-slate-400" lang="fr">${esc(s.fr)}</span></span>
              <span class="text-xs font-bold ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'} whitespace-nowrap">${done ? '✓ gelezen' : sm.seen ? `${sm.mastered}/${sm.total}` : `± ${s.minutes} min`}</span>
            </div>
          </a>`;
        }).join('')}
      </div>
      ${backLink('#/lecture', 'Lezen')}
    </div>`;
}

function storyReader(el, i, sub) {
  const s = STORIES[i];
  if (!s) return storyList(el);
  const qIds = STORY_QUESTIONS.filter((q) => q.story === s.id).map((q) => q.id);
  if (sub === 'vragen') return runIn(el, { title: `Vragen: ${s.title}`, ids: qIds, backHash: `#/lecture/verhalen/${i}`, backLabel: 'Terug naar het verhaal', theme: 'verhalen' });
  const all = s.scenes.flat().map(([nl]) => nl).join(' ');
  const next = STORIES[i + 1] ? `#/lecture/verhalen/${i + 1}` : null;
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      <a href="#/lecture/verhalen" class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 py-1"><i class="fa-solid fa-chevron-left" aria-hidden="true"></i> Verhalen</a>
      <header class="flex items-end justify-between gap-3">
        <div><div class="text-xs font-black text-teal-700 dark:text-teal-300 uppercase tracking-wider">Verhaal ${i + 1} · A1</div>
          <h1 class="text-2xl font-black text-slate-900 dark:text-white" lang="nl">${esc(s.title)}</h1><p class="fr text-sm text-slate-500 dark:text-slate-400" lang="fr">${esc(s.fr)}</p></div>
        <button type="button" data-say="${esc(all)}" data-say-rate="0.85" class="${BTN_PRIMARY} !bg-teal-600 shrink-0"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Lees voor</button>
      </header>
      ${s.scenes.map((lines, k) => `
        <figure class="${CARD} overflow-hidden">
          <div class="border-b border-slate-200 dark:border-slate-700">${scene(s.id, k, `${s.title}, deel ${k + 1}`)}</div>
          <figcaption class="p-4 sm:p-5 space-y-1">
            ${lines.map(([nl, fr]) => `<button type="button" data-say="${esc(nl)}" class="w-full text-left rounded-xl px-2 py-1.5 -mx-2 hover:bg-teal-50 dark:hover:bg-slate-700/60 touch-active">
              <span class="block text-[17px] leading-relaxed text-slate-800 dark:text-slate-100 selectable" lang="nl">${esc(nl)}</span>
              <span class="fr text-slate-500 dark:text-slate-400" lang="fr">${esc(fr)}</span></button>`).join('')}
          </figcaption>
        </figure>`).join('')}
      <p class="text-xs text-center text-slate-500 dark:text-slate-400">${tri('Tik op een zin om hem te horen.', 'Touchez une phrase pour l’écouter.')}</p>
      <section class="${CARD} p-4 space-y-2">
        <h2 class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${tri('Woorden uit het verhaal', 'Mots de l’histoire')}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${s.words.map(([nl, fr]) => `<div class="flex justify-between items-center gap-2 p-2.5 rounded-xl bg-teal-50/60 dark:bg-slate-700/40"><div class="min-w-0"><div class="font-black text-sm dark:text-white" lang="nl">${esc(nl)}</div><div class="text-xs text-slate-500 dark:text-slate-400" lang="fr">${esc(fr)}</div></div>${audioBtn(nl)}</div>`).join('')}
        </div>
      </section>
      <div class="bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-3xl p-5 flex items-center justify-between gap-3 shadow-lg">
        <div><div class="font-black text-lg">Heb je het begrepen?</div><div class="text-sm text-teal-50">3 vragen${summary(qIds).mastered === qIds.length ? ' · ✓ al geleerd' : ''}</div></div>
        <a href="#/lecture/verhalen/${i}/vragen" class="${BTN_PRIMARY} !bg-white !text-teal-800">Vragen <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
      </div>
      <div class="flex justify-between gap-2">
        <a href="#/lecture/verhalen" class="${BTN_SECONDARY}"><i class="fa-solid fa-grip" aria-hidden="true"></i> Alle verhalen</a>
        ${next ? `<a href="${next}" class="${BTN_SECONDARY}">Volgend verhaal <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>` : ''}
      </div>
    </div>`;
}

// ── Lezen / Luisteren ──
function docList(el, params, { key, title, titleFr, sub, list: all, label, iconName, extra = '' }) {
  // Un document peut avoir plusieurs questions (id « …b ») : on liste chaque document une fois.
  const group = (d) => d.textId || d.id;
  const list = all.filter((d, i) => all.findIndex((x) => group(x) === group(d)) === i);
  const idsFrom = (i) => list.slice(i).flatMap((d) => all.filter((x) => group(x) === group(d)).map((x) => x.id));
  const ids = idsFrom(0);
  const back = { backHash: `#/${key}`, backLabel: `Terug naar ${title}` };
  if (key === 'lecture' && params[0] === 'verhalen') return params[1] !== undefined ? storyReader(el, Number(params[1]), params[2]) : storyList(el);
  if (key === 'lecture' && params[0] === 'mots') return runIn(el, { title: 'Opwarmen: woorden', ids: shuffle(pick(WORDMATCH.map((w) => w.id), 10)), ...back });
  if (key === 'lecture' && params[0] === 'examen') {
    // Format de l’examen depuis mai 2023 : 9 textes, questions à 3 choix, 35 minutes.
    const texts = shuffle([...new Set(all.map((d) => d.textId))]).slice(0, 9);
    const examIds = texts.flatMap((t) => all.filter((d) => d.textId === t).map((d) => d.id));
    const mark = Math.ceil(examIds.length * 0.74);
    return runIn(el, {
      title: 'Oefenexamen Lezen', ids: examIds, exam: true, timeLimit: 35 * 60, passMark: mark, backHash: '#/examen/lecture', backLabel: 'Terug naar het oefenexamen',
      passNote: tr('Richtgrens: ongeveer 74 %. DUO publiceert de officiële grens niet.', 'Seuil indicatif (environ 74 %, comme 14/19 dans les guides de préparation) : DUO ne publie pas le seuil officiel.'),
      onFinish: (results, { good, total, seconds, passed }) => { store.data.exams.push({ kind: 'lecture', date: Date.now(), good, total, seconds, passed }); store.save(); },
    });
  }
  if (params[0] === 'tout') return runIn(el, { title, ids, ...back });
  if (params[0] !== undefined) {
    const start = Number(params[0]);
    if (start >= 0 && start < list.length) return runIn(el, { title, ids: idsFrom(start), ...back });
  }
  const s = summary(ids);
  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageHero(key, title, sub, [`${list.length} ${key === 'lecture' ? 'teksten' : 'berichten'}`, `${s.mastered}/${s.total} geleerd`], titleFr)}
      ${extra}
      <div class="${CARD} p-4 space-y-3">
        <div class="flex justify-between text-sm font-bold dark:text-white"><span>${s.mastered} / ${s.total} ${tri('geleerd', 'maîtrisées')}</span><span>${s.accuracy === null ? '' : s.accuracy + ' % goed'}</span></div>
        ${bar(s.mastered, s.total, key === 'lecture' ? 'bg-teal-500' : 'bg-blue-500')}
        <a href="#/${key}/tout" class="${BTN_PRIMARY}"><i class="fa-solid fa-play" aria-hidden="true"></i> ${tri('Alles na elkaar', 'Tout à la suite')}</a>
      </div>
      <ul class="space-y-2">
        ${list.map((d, i) => `<li><a href="#/${key}/${i}" class="${CARD} !rounded-2xl p-3.5 flex items-center gap-3 touch-active">
          <span class="text-slate-400 dark:text-slate-500">${icon(iconName, 'w-6 h-6')}</span>
          <span class="flex-1 font-bold text-sm dark:text-white" lang="nl">${esc(label(d, i))}</span>
          ${statusIcon(d.id)}
        </a></li>`).join('')}
      </ul>
      ${backLink('#/', 'Start')}
    </div>`;
}

export const renderLecture = (el, params) => docList(el, params, {
  key: 'lecture', title: 'Lezen', titleFr: 'Lecture', iconName: 'read', list: READING, label: (d) => d.title,
  sub: tr('Op het examen: 9 korte teksten uit het dagelijks leven, vragen met 3 antwoorden, 35 minuten. Zoek de informatie die je nodig hebt.', 'À l’examen (depuis mai 2023) : 9 courts textes du quotidien (annonces, messages, tableaux), des questions à 3 choix, 35 minutes. Cherchez l’information précise : pas besoin de comprendre chaque mot.'),
  extra: (() => {
    const w = summary(WORDMATCH.map((x) => x.id));
    const st = summary(STORY_QUESTIONS.map((q) => q.id));
    return `
    <a href="#/lecture/verhalen" class="${CARD} overflow-hidden touch-active block">
      <div class="grid grid-cols-2 border-b border-slate-200 dark:border-slate-700">${scene('markt', 0, 'Op de markt')}${scene('soep', 3, 'Soep voor de buurvrouw')}</div>
      <div class="p-4 flex items-center gap-3">
        <span class="w-11 h-11 shrink-0 rounded-2xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 flex items-center justify-center">${icon('story', 'w-7 h-7')}</span>
        <span class="flex-1 min-w-0 space-y-1"><span class="block font-black dark:text-white">Verhalen <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white align-middle">Nieuw</span></span>
          <span class="block text-xs text-slate-500 dark:text-slate-400">${tri(`${STORIES.length} geïllustreerde verhalen · lezen en luisteren`, 'histoires illustrées pour lire avec plaisir')}</span>${bar(st.mastered, st.total, 'bg-teal-500')}</span>
        <i class="fa-solid fa-chevron-right text-slate-400" aria-hidden="true"></i>
      </div>
    </a>
    <a href="#/examen/lecture" class="block bg-gradient-to-r from-teal-700 to-delftBlue text-white p-5 rounded-3xl shadow-lg touch-active">
      <div class="flex items-center justify-between gap-3">
        <div><div class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-black w-fit mb-1">⏳ Oefenexamen · 35 min</div><div class="text-lg font-black">9 teksten, 18 vragen</div><div class="fr text-xs text-teal-100" lang="fr">Examen blanc</div></div>
        <span class="${BTN_PRIMARY} !bg-white !text-delftBlue">Start</span>
      </div>
    </a>
    ${rowLink('#/lecture/mots', 'cards', 'bg-teal-100 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300', 'Opwarmen: woorden herkennen', 'Échauffement : reconnaître des mots', tri(`Hoor een woord en kies het goede woord. ${w.mastered}/${w.total} geleerd.`, 'utile pour le vocabulaire (retiré de l’examen en mai 2023)'), bar(w.mastered, w.total, 'bg-teal-500'))}
    <h2 class="text-sm font-black text-slate-700 dark:text-slate-200 pt-2">${tri(`Examenteksten (${new Set(READING.map((d) => d.textId)).size})`, 'textes de type examen')}</h2>`;
  })(),
});

export const renderEcoute = (el, params) => docList(el, params, {
  key: 'ecoute', title: 'Luisteren', titleFr: 'Écoute', iconName: 'headphones', list: LISTENING, label: (d, i) => `Bericht ${i + 1}`,
  sub: tr('Korte berichten, voorgelezen door de Nederlandse stem van je toestel. Na je antwoord zie je de tekst.', 'Des messages courts lus par la voix néerlandaise de votre appareil. La transcription s’affiche après votre réponse.'),
});
