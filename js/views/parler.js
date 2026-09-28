// Parler (Spreken) : les deux parties de l’examen + entraînement à la prononciation.

import { shuffle } from '../core/util.js';
import { CARD, BTN_PRIMARY, bar, pageTitle, backLink } from '../core/ui.js';
import { summary, pick } from '../core/learner.js';
import { session } from '../core/engine.js';
import { canRecord, canRecognize } from '../core/micro.js';
import { SPEAK_QUESTIONS, SPEAK_COMPLETE, SPEAK_REPEAT } from '../content/index.js';

const ids = (list) => list.map((x) => x.id);

function run(el, cfg) {
  el.innerHTML = '<div></div>';
  session(el.firstElementChild, { backHash: '#/parler', backLabel: 'Retour à Parler', ...cfg });
}

export function render(el, params) {
  const p = params[0];
  if (p === 'questions') return run(el, { title: 'Partie 1 : répondre', ids: shuffle(pick(ids(SPEAK_QUESTIONS), 10)) });
  if (p === 'completer') return run(el, { title: 'Partie 2 : compléter', ids: shuffle(pick(ids(SPEAK_COMPLETE), 12)) });
  if (p === 'repeter') return run(el, { title: 'Répéter', ids: pick(ids(SPEAK_REPEAT), 10) });
  if (p === 'examen') {
    return run(el, {
      title: 'Examen blanc : Parler',
      ids: [...shuffle(ids(SPEAK_QUESTIONS)).slice(0, 10), ...shuffle(ids(SPEAK_COMPLETE)).slice(0, 12)],
      summaryExtra: () => '<p class="text-xs text-slate-500 pt-2">Score basé sur votre propre évaluation. À l’examen, deux examinateurs écoutent vos réponses enregistrées.</p>',
    });
  }

  const card = (href, icon, title, sub, list) => {
    const s = summary(ids(list));
    return `<a href="${href}" class="${CARD} p-5 flex items-center gap-4 touch-active">
      <span class="w-12 h-12 shrink-0 rounded-2xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-2xl" aria-hidden="true">${icon}</span>
      <span class="flex-1 min-w-0 space-y-1.5"><span class="block font-black dark:text-white">${title}</span><span class="block text-xs text-slate-500 dark:text-slate-400">${sub}</span>${bar(s.mastered, s.total, 'bg-blue-500')}</span>
    </a>`;
  };

  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-4 animate-pop">
      ${pageTitle('Parler', 'À l’examen, vous parlez dans un micro avec un casque, sans examinateur en face. Vos réponses sont enregistrées puis notées par des personnes.')}
      <div class="${CARD} p-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
        <h2 class="font-black text-slate-900 dark:text-white">Déroulé de l’épreuve</h2>
        <p><b>Partie 1 :</b> une dizaine de questions simples sur vous-même. Répondez par une phrase complète, en reprenant le verbe de la question.</p>
        <p><b>Partie 2 :</b> une douzaine de phrases à terminer. Vous entendez une courte phrase, puis le début d’une autre : vous la complétez.</p>
        <p class="text-xs text-slate-500 dark:text-slate-400">Pour chaque exercice : écoutez, répondez à voix haute, puis comparez avec le modèle et évaluez-vous honnêtement. Ce que vous jugez « à retravailler » reviendra plus souvent.</p>
        ${canRecord || canRecognize ? '<p class="text-xs text-slate-500 dark:text-slate-400">🎙️ Si votre navigateur l’autorise, vous pouvez aussi vous enregistrer ou faire vérifier votre réponse.</p>' : ''}
      </div>
      ${card('#/parler/questions', '❓', 'Partie 1 : répondre à des questions', `${SPEAK_QUESTIONS.length} questions personnelles avec exemples de réponses.`, SPEAK_QUESTIONS)}
      ${card('#/parler/completer', '🧩', 'Partie 2 : compléter des phrases', `${SPEAK_COMPLETE.length} phrases du quotidien à terminer.`, SPEAK_COMPLETE)}
      ${card('#/parler/repeter', '🔁', 'Entraînement : répéter', `${SPEAK_REPEAT.length} phrases pour travailler la prononciation, avec conseils.`, SPEAK_REPEAT)}
      <a href="#/parler/examen" class="block bg-gradient-to-r from-blue-600 to-delftBlue text-white p-5 rounded-3xl shadow-lg touch-active">
        <div class="flex items-center justify-between gap-3">
          <div><div class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-black w-fit mb-1">🎧 Examen blanc</div><div class="text-lg font-black">10 questions + 12 phrases</div></div>
          <span class="${BTN_PRIMARY} !bg-white !text-delftBlue">Commencer</span>
        </div>
      </a>
      ${backLink('#/', 'Accueil')}
    </div>`;
}
