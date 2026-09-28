// Examen blanc, révisions et progrès.

import { esc, shuffle, pct } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, bar, pageTitle, backLink } from '../core/ui.js';
import { dueIds, summary, weakest, lastDays, accuracyLastDays, currentStreak, get, MASTERED_BOX, INTERVALS } from '../core/learner.js';
import { session, describe } from '../core/engine.js';
import { store } from '../core/store.js';
import { KNS_CATS, KNS_QUESTIONS, TYPE_LABELS, lookup, idsOf } from '../content/index.js';

// ── Examen blanc (Société) ──────────────────────────────
const EXAM_SIZE = 30;
const PASS_MARK = 21;

function examQuestions() {
  const count = {};
  const out = [];
  for (const q of shuffle(KNS_QUESTIONS)) {
    if ((count[q.cat] || 0) >= 5) continue;
    count[q.cat] = (count[q.cat] || 0) + 1;
    out.push(q.id);
    if (out.length === EXAM_SIZE) break;
  }
  return out;
}

function byCategory(results) {
  const rows = {};
  for (const r of results) {
    const cat = lookup(r.id)?.item.cat;
    const row = rows[cat] || (rows[cat] = { good: 0, total: 0 });
    row.total += 1;
    if (r.ok) row.good += 1;
  }
  return rows;
}

export function renderExamen(el, params) {
  if (params[0] === 'go') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, {
      title: 'Examen blanc — Société', ids: examQuestions(), exam: true, passMark: PASS_MARK, backHash: '#/examen', backLabel: 'Retour',
      onFinish: (results, { good, total, seconds, passed }) => {
        store.data.exams.push({ date: Date.now(), good, total, seconds, passed, byCat: byCategory(results) });
        store.save();
      },
      summaryExtra: (results) => {
        const rows = byCategory(results);
        return `<div class="text-left pt-3 space-y-1.5">${Object.entries(rows).sort((a, b) => a[1].good / a[1].total - b[1].good / b[1].total).map(([cat, r]) => `
          <div class="flex items-center gap-2 text-xs dark:text-white"><span class="w-40 truncate">${KNS_CATS[cat].icon} ${esc(KNS_CATS[cat].label)}</span><span class="flex-1">${bar(r.good, r.total, r.good / r.total >= 0.7 ? 'bg-emerald-500' : 'bg-red-400')}</span><span class="w-10 text-right font-bold">${r.good}/${r.total}</span></div>`).join('')}</div>`;
      },
    });
    return;
  }

  const hist = [...store.data.exams].reverse().slice(0, 5);
  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageTitle('Examen blanc — Société')}
      <div class="${CARD} p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
        <p class="text-4xl text-center" aria-hidden="true">🏆</p>
        <ul class="space-y-1.5">
          <li>• Comme à l’examen officiel : <b>${EXAM_SIZE} questions</b>, <b>deux réponses possibles</b> à chaque fois, et il faut <b>${PASS_MARK} bonnes réponses</b> pour réussir.</li>
          <li>• À l’examen, vous avez 30 minutes. Le chronomètre vous aide à suivre votre rythme.</li>
          <li>• Les questions sont tirées des ${KNS_QUESTIONS.length} questions de l’application, dans les 8 thèmes.</li>
          <li>• Pas de correction pendant l’examen : le bilan détaillé arrive à la fin.</li>
        </ul>
        <p class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border border-amber-200 dark:border-amber-800 rounded-2xl p-3">À l’examen officiel, chaque question accompagne une photo du pack d’étude « Naar Nederland » de DUO et elle est aussi lue à voix haute. Nos questions couvrent les mêmes thèmes mais ne sont pas les 100 questions officielles : travaillez aussi avec ce pack (naarnederland.nl).</p>
        <a href="#/examen/go" class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-play" aria-hidden="true"></i> Commencer l’examen</a>
      </div>
      ${hist.length ? `<div class="${CARD} p-5 space-y-2"><h2 class="font-black dark:text-white">Vos derniers examens</h2>
        ${hist.map((h) => `<div class="flex justify-between text-sm dark:text-white"><span>${new Date(h.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span><span class="font-bold ${h.passed ? 'text-emerald-600' : 'text-red-600'}">${h.good}/${h.total} ${h.passed ? '✓' : '✗'}</span></div>`).join('')}</div>` : ''}
      ${backLink('#/', 'Accueil')}
    </div>`;
}

// ── Réviser (répétition espacée) ────────────────────────
export function renderReviser(el, params) {
  if (params[0] === 'go') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title: 'Révision', ids: dueIds().slice(0, 20), backHash: '#/reviser' });
    return;
  }
  if (params[0] === 'faibles') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title: 'Mes points faibles', ids: weakest(10).map((w) => w.id), backHash: '#/progres', backLabel: 'Retour aux progrès' });
    return;
  }

  const due = dueIds();
  const byType = {};
  due.forEach((id) => { const t = lookup(id)?.type; if (t) byType[t] = (byType[t] || 0) + 1; });
  const upcoming = Object.values(store.data.items).map((it) => it.due).filter((d) => d > Date.now()).sort((a, b) => a - b)[0];
  const when = upcoming ? new Date(upcoming).toLocaleString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : null;

  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageTitle('Réviser', 'Chaque élément revient juste avant que vous risquiez de l’oublier : après 1 jour, puis 2, 4, 8, 16 et 32 jours. Une erreur le fait revenir rapidement.')}
      <div class="${CARD} p-6 text-center space-y-4">
        ${due.length ? `
          <p class="text-5xl font-black text-dutchOrange">${due.length}</p>
          <p class="font-bold dark:text-white">élément${due.length > 1 ? 's' : ''} à réviser maintenant</p>
          <div class="flex flex-wrap justify-center gap-1.5">${Object.entries(byType).map(([t, n]) => `<span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold dark:text-white">${TYPE_LABELS[t]} : ${n}</span>`).join('')}</div>
          <a href="#/reviser/go" class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-play" aria-hidden="true"></i> Réviser ${Math.min(due.length, 20)} élément${due.length > 1 ? 's' : ''}</a>
          ${due.length > 20 ? '<p class="text-xs text-slate-500">Les séances font 20 éléments au maximum : faites-en une autre ensuite.</p>' : ''}` : `
          <p class="text-4xl" aria-hidden="true">✅</p>
          <p class="font-bold dark:text-white">Rien à réviser pour le moment.</p>
          ${when ? `<p class="text-sm text-slate-500">Prochaine révision : ${esc(when)}.</p>` : '<p class="text-sm text-slate-500">Commencez par apprendre : les éléments étudiés reviendront ici au bon moment.</p>'}
          <div class="flex flex-wrap justify-center gap-2"><a href="#/mots" class="${BTN_SECONDARY}">🎴 Nouveaux mots</a><a href="#/kns/mix" class="${BTN_SECONDARY}">🏛️ Questions société</a></div>`}
      </div>
      ${backLink('#/', 'Accueil')}
    </div>`;
}

// ── Progrès ─────────────────────────────────────────────
export function renderProgres(el) {
  const types = ['kns', 'manuel', 'speak', 'wordmatch', 'reading', 'vocab', 'puzzle', 'grammar', 'listening'];
  const allIds = types.flatMap(idsOf);
  const tot = summary(allIds);
  const days = lastDays(14);
  const maxN = Math.max(1, ...days.map((d) => d.n));
  const acc7 = accuracyLastDays(7);
  const weak = weakest(5);
  const exams = store.data.exams.slice(-5);

  const stat = (value, label) => `<div class="${CARD} p-4 text-center"><div class="text-2xl font-black text-delftBlue dark:text-white">${value}</div><div class="text-xs font-bold text-slate-500 dark:text-slate-400">${label}</div></div>`;

  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-5 animate-pop">
      ${pageTitle('Mes progrès', 'Un élément est « maîtrisé » après 3 bonnes réponses espacées dans le temps.')}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- 4 indicateurs -->
        ${stat(currentStreak() + ' j', 'Série de jours')}
        ${stat(`${tot.mastered}/${tot.total}`, 'Éléments maîtrisés')}
        ${stat(tot.seen ? Math.round((tot.firstOk / tot.seen) * 100) + ' %' : '—', 'Justes du 1er coup')}
        ${stat(acc7 === null ? '—' : acc7 + ' %', 'Précision (7 jours)')}
      </div>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Activité (14 derniers jours)</h2>
        <div class="flex items-end gap-1 h-24" role="img" aria-label="Réponses par jour sur 14 jours">
          ${days.map((d) => `<div class="flex-1 flex flex-col items-center gap-1 h-full justify-end"><div class="w-full rounded-t-md ${d.n ? 'bg-dutchOrange' : 'bg-slate-200 dark:bg-slate-700'}" style="height:${d.n ? Math.max(8, (d.n / maxN) * 100) : 4}%" title="${d.n} réponses"></div><span class="text-[10px] text-slate-400">${d.date.getDate()}</span></div>`).join('')}
        </div>
      </section>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Société : par thème</h2>
        <div class="space-y-3">
          ${Object.entries(KNS_CATS).map(([key, c]) => {
            const s = summary(KNS_QUESTIONS.filter((q) => q.cat === key).map((q) => q.id));
            return `<a href="#/kns/${key}" class="block space-y-1 touch-active">
              <div class="flex justify-between text-sm dark:text-white"><span class="font-bold">${c.icon} ${esc(c.label)}</span><span class="text-xs text-slate-500 dark:text-slate-400">${s.mastered}/${s.total} · ${s.accuracy === null ? 'pas commencé' : s.accuracy + ' % justes'}</span></div>
              ${bar(s.mastered, s.total, s.accuracy !== null && s.accuracy < 60 ? 'bg-red-400' : 'bg-emerald-500')}
            </a>`;
          }).join('')}
        </div>
      </section>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Par module</h2>
        ${types.map((t) => { const s = summary(idsOf(t)); return `<div class="space-y-1"><div class="flex justify-between text-sm dark:text-white"><span class="font-bold">${TYPE_LABELS[t]}</span><span class="text-xs text-slate-500 dark:text-slate-400">${s.mastered}/${s.total} maîtrisés · ${s.seen} vus</span></div>${bar(s.mastered, s.total)}</div>`; }).join('')}
      </section>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Mes points faibles</h2>
        ${weak.length ? `<ul class="space-y-2">${weak.map((w) => { const d = describe(w.id); return `<li class="text-sm flex justify-between gap-3 dark:text-white"><span class="min-w-0"><span class="block font-bold truncate" lang="nl">${esc(d.label)}</span><span class="block text-xs text-slate-500">${TYPE_LABELS[lookup(w.id)?.type] || ''}</span></span><span class="shrink-0 text-xs font-bold text-red-600 dark:text-red-400">${w.errors} erreur${w.errors > 1 ? 's' : ''} / ${w.n}</span></li>`; }).join('')}</ul>
          <a href="#/reviser/faibles" class="${BTN_PRIMARY}"><i class="fa-solid fa-bullseye" aria-hidden="true"></i> Travailler mes points faibles</a>`
          : '<p class="text-sm text-slate-500">Pas encore d’erreurs enregistrées. Continuez !</p>'}
      </section>

      ${exams.length ? `<section class="${CARD} p-5 space-y-2"><h2 class="font-black dark:text-white">Examens blancs</h2>
        <div class="flex items-end gap-2 h-20">${exams.map((h) => `<div class="flex-1 flex flex-col items-center gap-1 h-full justify-end"><span class="text-[10px] font-bold dark:text-white">${h.good}</span><div class="w-full rounded-t-md ${h.passed ? 'bg-emerald-500' : 'bg-red-400'}" style="height:${pct(h.good, h.total)}%"></div></div>`).join('')}</div>
        <p class="text-xs text-slate-500">Seuil de réussite : ${PASS_MARK} / ${EXAM_SIZE}.</p></section>` : ''}
    </div>`;
}

export { INTERVALS, MASTERED_BOX, get };
