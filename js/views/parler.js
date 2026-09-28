// Parler (Spreken) : les deux parties de l’examen + entraînement à la prononciation.

import { shuffle, esc, $, $$, onLeave } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, bar, pageTitle, backLink, audioBtn, ask } from '../core/ui.js';
import { summary, pick, record } from '../core/learner.js';
import { session } from '../core/engine.js';
import { canRecord, canRecognize, startRecording, micErrorText } from '../core/micro.js';
import { speak, stopSpeaking, playSound } from '../core/audio.js';
import { store } from '../core/store.js';
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
  if (p === 'examen') return speakExam(el);

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
          <div><div class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-black w-fit mb-1">⏳ Examen blanc chronométré</div><div class="text-lg font-black">10 questions + 12 phrases</div></div>
          <span class="${BTN_PRIMARY} !bg-white !text-delftBlue">Commencer</span>
        </div>
      </a>
      ${backLink('#/', 'Accueil')}
    </div>`;
}

// ── Examen blanc « Parler » chronométré ──────────────────
// Comme à l’examen : on entend la question (texte caché), puis on répond. Chaque réponse dure au maximum 60 secondes
// (durée maximale d’enregistrement indiquée par les guides de préparation). Notation ensuite : 2 points par réponse
// (1 pour une réponse adaptée, 1 pour une prononciation compréhensible), soit 44 points.
const ANSWER_SECONDS = 60;

function speakExam(el) {
  const withPic = shuffle(SPEAK_COMPLETE.filter((x) => x.pic));
  const noPic = shuffle(SPEAK_COMPLETE.filter((x) => !x.pic));
  const items = [...shuffle(SPEAK_QUESTIONS).slice(0, 10), ...[...withPic.slice(0, 8), ...noPic.slice(0, 4)]];
  const recordings = [];
  let useMic = false;
  let idx = 0;
  let timers = [];
  let rec = null;
  const clearTimers = () => { timers.forEach((t) => { clearTimeout(t); clearInterval(t); }); timers = []; };
  onLeave(() => { clearTimers(); stopSpeaking(); rec?.stop(); });

  const intro = () => {
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4 animate-pop">
        ${pageTitle('Examen blanc : Parler')}
        <div class="${CARD} p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <p>• <b>Partie 1 :</b> 10 questions sur la vie de tous les jours. <b>Partie 2 :</b> 12 phrases à compléter, souvent avec une image.</p>
          <p>• Chaque question est lue <b>une seule fois</b>, sans le texte. Ensuite vous avez <b>60 secondes au maximum</b> pour répondre à voix haute. Une réponse courte et complète suffit.</p>
          <p>• À la fin, vous comparez avec les modèles et vous vous notez : 1 point si la réponse est adaptée, 1 point si la prononciation est compréhensible (44 points au total).</p>
          <p class="text-xs text-slate-500 dark:text-slate-400">La durée de 60 secondes et la notation sur 2 points viennent des guides de préparation ; DUO publie peu de détails. À l’examen, ce sont deux examinateurs qui notent.</p>
          ${canRecord ? `<label class="flex items-center gap-3 font-bold text-slate-800 dark:text-white pt-1"><input type="checkbox" data-mic class="w-6 h-6 accent-orange-600"> Enregistrer mes réponses pour les réécouter</label>` : ''}
          <button type="button" data-start class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-play" aria-hidden="true"></i> Commencer (environ 25 minutes)</button>
        </div>
        ${backLink('#/parler', 'Retour à Parler')}
      </div>`;
    $('[data-start]', el).addEventListener('click', async () => {
      useMic = !!$('[data-mic]', el)?.checked;
      if (useMic) {
        // Vérifie tout de suite l’accès au micro, pour ne pas bloquer pendant l’examen.
        try { const t = await startRecording(500); t.stop(); await t.done; } catch (err) { useMic = false; await ask(micErrorText(err) + '\n\nL’examen continue sans enregistrement.', 'Continuer'); }
      }
      show();
    });
  };

  const show = () => {
    clearTimers();
    const it = items[idx];
    const part1 = it.kind === 'vraag';
    const n = part1 ? idx + 1 : idx - 9;
    const say = part1 ? it.q : `${it.context} ${it.start.replace('…', '')}`;
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4">
        <div class="flex justify-between items-center text-sm font-bold text-slate-600 dark:text-slate-300">
          <a href="#/parler" data-quit class="inline-flex items-center gap-1.5 text-slate-500"><i class="fa-solid fa-xmark" aria-hidden="true"></i> Quitter</a>
          <span>${part1 ? `Partie 1 · question ${n} / 10` : `Partie 2 · phrase ${n} / 12`}</span>
        </div>
        ${bar(idx, items.length, 'bg-blue-600')}
        <div class="${CARD} p-6 space-y-5 text-center">
          ${it.pic ? `<div class="text-7xl py-4 rounded-2xl bg-sky-50 dark:bg-slate-900/60" role="img" aria-label="Image de la situation">${it.pic}</div>` : ''}
          <div data-phase class="space-y-2">
            <p class="text-4xl" aria-hidden="true">🔊</p>
            <p class="font-black text-lg text-slate-900 dark:text-white">Écoutez…</p>
          </div>
          <div data-answer class="hidden space-y-3">
            <p class="font-black text-lg text-blue-700 dark:text-blue-300">🎙️ Répondez maintenant${useMic ? ' (enregistrement)' : ''}</p>
            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div data-countbar class="h-full bg-blue-600 transition-all duration-1000 ease-linear" style="width:100%"></div></div>
            <p data-count class="text-sm font-bold tabular-nums text-slate-600 dark:text-slate-300">${ANSWER_SECONDS} s</p>
            <button type="button" data-done class="${BTN_PRIMARY} w-full">Réponse terminée <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>
          </div>
        </div>
      </div>`;
    $('[data-quit]', el).addEventListener('click', async (e) => {
      e.preventDefault();
      if (await ask('Quitter l’examen blanc ?', 'Quitter')) { clearTimers(); stopSpeaking(); rec?.stop(); location.hash = '#/parler'; }
    });

    let answering = false;
    const startAnswer = async () => {
      if (answering) return;
      answering = true;
      $('[data-phase]', el).classList.add('hidden');
      $('[data-answer]', el).classList.remove('hidden');
      if (useMic) {
        try { rec = await startRecording(ANSWER_SECONDS * 1000); rec.done.then((url) => { recordings[idx] = url; }); } catch { rec = null; }
      }
      let left = ANSWER_SECONDS;
      const bar = $('[data-countbar]', el);
      requestAnimationFrame(() => { if (bar) bar.style.width = `${((left - 1) / ANSWER_SECONDS) * 100}%`; });
      timers.push(setInterval(() => {
        left -= 1;
        const c = $('[data-count]', el);
        if (c) c.textContent = `${left} s`;
        if (bar) bar.style.width = `${Math.max(0, (left - 1) / ANSWER_SECONDS) * 100}%`;
        if (left <= 0) done();
      }, 1000));
      $('[data-done]', el).addEventListener('click', done);
    };
    const itemIdx = idx;
    const done = () => {
      if (idx !== itemIdx) return;
      clearTimers();
      const r = rec; rec = null;
      const finishStep = () => { idx += 1; if (idx >= items.length) review(); else show(); };
      if (r) { r.stop(); r.done.then(() => setTimeout(finishStep, 50)); } else finishStep();
    };

    // Lecture unique de la question, puis temps de réponse. Sécurité si la fin de lecture n’est pas signalée.
    const fallback = setTimeout(startAnswer, Math.max(3500, say.length * 110));
    timers.push(fallback);
    setTimeout(() => speak(say, 1, null, () => setTimeout(startAnswer, 300)), 400);
  };

  const review = () => {
    playSound('fanfare');
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4 animate-pop">
        ${pageTitle('Correction de l’examen blanc', 'Réécoutez vos réponses (si enregistrées), comparez avec le modèle, et cochez honnêtement.')}
        <ol class="space-y-3">
          ${items.map((it, i) => {
            const q = it.kind === 'vraag' ? it.q : `${it.context} ${it.start}`;
            const fr = it.kind === 'vraag' ? it.qFr : it.fr;
            const model = it.kind === 'vraag' ? it.model[0] : it.full;
            return `<li class="${CARD} p-4 space-y-2">
              <div class="flex items-start gap-2"><span class="text-xs font-black text-slate-400 pt-1">${i + 1}</span><div class="min-w-0 flex-1">
                ${it.pic ? `<span class="text-2xl" aria-hidden="true">${it.pic}</span>` : ''}
                <p class="font-bold dark:text-white" lang="nl">${esc(q)}</p><p class="text-xs italic text-slate-500">${esc(fr)}</p></div></div>
              ${recordings[i] ? `<audio controls src="${recordings[i]}" class="w-full"></audio>` : ''}
              <p class="flex flex-wrap items-center gap-2 text-sm text-emerald-800 dark:text-emerald-300">Modèle : <b lang="nl">${esc(model)}</b> ${audioBtn(model, 'Écouter')}</p>
              <div class="flex flex-wrap gap-4 text-sm dark:text-white">
                <label class="flex items-center gap-2"><input type="checkbox" data-content="${i}" class="w-5 h-5 accent-emerald-600"> Réponse adaptée</label>
                <label class="flex items-center gap-2"><input type="checkbox" data-pron="${i}" class="w-5 h-5 accent-emerald-600"> Prononciation compréhensible</label>
              </div>
            </li>`; }).join('')}
        </ol>
        <button type="button" data-score class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-calculator" aria-hidden="true"></i> Calculer mon score</button>
        <div data-result></div>
      </div>`;
    window.scrollTo({ top: 0 });
    $('[data-score]', el).addEventListener('click', () => {
      let points = 0;
      items.forEach((it, i) => {
        const c = $(`[data-content="${i}"]`, el).checked;
        const pr = $(`[data-pron="${i}"]`, el).checked;
        points += (c ? 1 : 0) + (pr ? 1 : 0);
        record(it.id, c && pr, { type: 'speak', cat: it.kind });
      });
      const target = 34;
      const passed = points >= target;
      store.data.exams.push({ kind: 'parler', date: Date.now(), good: points, total: 44, passed });
      store.save();
      $('[data-score]', el).remove();
      $('[data-result]', el).innerHTML = `<div class="${CARD} p-6 text-center space-y-2">
        <p class="text-3xl font-black ${passed ? 'text-emerald-600' : 'text-red-600'}">${points} / 44</p>
        <p class="text-sm font-bold ${passed ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}">${passed ? 'Objectif atteint' : 'Pas encore'} (objectif indicatif : ${target} / 44, d’après les guides de préparation)</p>
        <p class="text-xs text-slate-500">Les réponses que vous n’avez pas cochées deux fois reviendront dans « Réviser ».</p>
        <div class="flex justify-center gap-2 pt-2"><a href="#/parler" class="${BTN_SECONDARY}">Retour à Parler</a></div>
      </div>`;
      $$('input[type=checkbox]', el).forEach((x) => (x.disabled = true));
    });
  };

  intro();
}
