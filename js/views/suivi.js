// Examen blanc, révisions et progrès.

import { esc, shuffle, pct } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, bar, pageTitle, pageHero, backLink } from '../core/ui.js';
import { dueIds, summary, weakest, lastDays, accuracyLastDays, currentStreak, get, MASTERED_BOX, INTERVALS, activityBetween, masteredSince } from '../core/learner.js';
import { weekKey, catLabel, catLink, PARTS, readiness } from '../core/plan.js';
import { levelInfo, totalXp, streakInfo } from '../core/game.js';
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

const fmtDate = (t) => new Date(t).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
const historyOf = (kind) => store.data.exams.filter((e) => (e.kind || 'kns') === kind).reverse().slice(0, 5);
const historyList = (kind) => {
  const hist = historyOf(kind);
  return hist.length ? `<div class="${CARD} p-5 space-y-2"><h2 class="font-black dark:text-white">Vos derniers résultats</h2>
    ${hist.map((h) => `<div class="flex justify-between text-sm dark:text-white"><span>${fmtDate(h.date)}${h.seconds ? ` · ${Math.floor(h.seconds / 60)} min` : ''}</span><span class="font-bold ${h.passed ? 'text-emerald-600' : 'text-red-600'}">${h.good}/${h.total} ${h.passed ? '✓' : '✗'}</span></div>`).join('')}</div>` : '';
};

export function renderExamen(el, params) {
  const p = params[0];
  if (p === 'go' || p === 'start-societe') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, {
      title: 'Examen blanc — Société', ids: examQuestions(), exam: true, timeLimit: 30 * 60, passMark: PASS_MARK, backHash: '#/examen', backLabel: 'Retour aux examens',
      onFinish: (results, { good, total, seconds, passed }) => {
        store.data.exams.push({ kind: 'kns', date: Date.now(), good, total, seconds, passed, byCat: byCategory(results) });
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

  if (p === 'societe') {
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4 animate-pop">
        ${pageHero('societe', 'Examen blanc : Société', '', ['30 questions', '2 réponses', '30 min', 'seuil 21'])}
        <div class="${CARD} p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <ul class="space-y-1.5">
            <li>• Comme à l’examen officiel : <b>${EXAM_SIZE} questions</b>, <b>deux réponses possibles</b> à chaque fois, et il faut <b>${PASS_MARK} bonnes réponses</b> pour réussir.</li>
            <li>• 30 minutes, avec un compte à rebours. Chaque question est lue à voix haute, avec les deux réponses.</li>
            <li>• Les questions sont tirées des ${KNS_QUESTIONS.length} questions de l’application, dans les 8 thèmes.</li>
            <li>• Pas de correction pendant l’examen : le bilan détaillé arrive à la fin.</li>
          </ul>
          <p class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border border-amber-200 dark:border-amber-800 rounded-2xl p-3">À l’examen officiel, chaque question accompagne une photo du pack d’étude « Naar Nederland » de DUO. Nos questions couvrent les mêmes thèmes mais ne sont pas les 100 questions officielles : travaillez aussi avec ce pack (naarnederland.nl).</p>
          <a href="#/examen/start-societe" class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-play" aria-hidden="true"></i> Commencer l’examen</a>
        </div>
        ${historyList('kns')}
        ${backLink('#/examen', 'Tous les examens blancs')}
      </div>`;
    return;
  }

  if (p === 'lecture') {
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4 animate-pop">
        ${pageHero('lecture', 'Examen blanc : Lecture', '', ['9 textes', '18 questions', '35 min'])}
        <div class="${CARD} p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <ul class="space-y-1.5">
            <li>• Comme à l’examen depuis mai 2023 : <b>9 textes courts</b> du quotidien (annonces, messages, tableaux, lettres, petites histoires).</li>
            <li>• <b>2 questions par texte</b> (18 au total ; l’examen en compte environ 19), avec <b>3 réponses possibles</b>.</li>
            <li>• <b>35 minutes</b> avec compte à rebours. À la fin du temps, les questions sans réponse comptent comme fausses.</li>
            <li>• Pas de correction pendant l’examen : le bilan avec les explications arrive à la fin.</li>
          </ul>
          <div class="rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 p-3 text-teal-950 dark:text-teal-100 space-y-1">
            <p class="font-black">Conseils</p>
            <p>1. Lisez d’abord la question, puis cherchez l’information dans le texte.</p>
            <p>2. Pas besoin de comprendre chaque mot : repérez les heures, les jours, les prix, les noms.</p>
            <p>3. Environ 4 minutes par texte. Si vous bloquez, choisissez une réponse et avancez.</p>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">Seuil indicatif : environ 74 % (comme 14 sur 19 dans les guides de préparation). DUO ne publie pas le seuil officiel.</p>
          <a href="#/lecture/examen" class="${BTN_PRIMARY} w-full !bg-teal-600"><i class="fa-solid fa-play" aria-hidden="true"></i> Commencer l’examen</a>
        </div>
        ${historyList('lecture')}
        ${backLink('#/examen', 'Tous les examens blancs')}
      </div>`;
    return;
  }

  // Page d’accueil des examens blancs : les trois parties de l’examen.
  const card = (href, icon, title, details, kind, grad) => {
    const last = historyOf(kind)[0];
    return `<a href="${href}" class="block bg-gradient-to-r ${grad} text-white p-5 rounded-3xl shadow-lg touch-active">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0"><div class="text-2xl" aria-hidden="true">${icon}</div><div class="text-lg font-black">${title}</div><div class="text-xs text-white/80">${details}</div>
          ${last ? `<div class="text-xs font-bold mt-1">Dernier résultat : ${last.good}/${last.total} ${last.passed ? '✓' : '✗'} (${fmtDate(last.date)})</div>` : ''}</div>
        <i class="fa-solid fa-chevron-right text-xl" aria-hidden="true"></i>
      </div>
    </a>`;
  };
  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageHero('examen', 'Examens blancs', 'Il faut réussir les trois parties. Faites chaque examen blanc dans les conditions réelles : au calme, d’une traite, sans aide.')}
      ${card('#/examen/societe', '🏛️', 'Société (KNS)', '30 questions · 2 réponses · 30 min · seuil 21', 'kns', 'from-amber-500 to-orange-600')}
      ${card('#/examen/lecture', '📄', 'Lecture', '9 textes · 18 questions · 3 réponses · 35 min', 'lecture', 'from-teal-600 to-delftBlue')}
      ${card('#/parler/examen', '🗣️', 'Parler', '10 questions + 12 phrases · 60 s par réponse', 'parler', 'from-blue-600 to-delftBlue')}
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
      ${pageHero('reviser', 'Réviser', 'Chaque élément revient juste avant que vous risquiez de l’oublier : après 1 jour, puis 2, 4, 8, 16 et 32 jours. Une erreur le fait revenir rapidement.')}
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


// ── Bilan de la semaine ──
function weeklyReport() {
  store.data.ui.lastReportWeek = weekKey();
  store.save();
  const now = activityBetween(6, 0);
  const prev = activityBetween(13, 7);
  const acc = (x) => (x.n ? Math.round((x.c / x.n) * 100) : null);
  const mastered = masteredSince(Date.now() - 7 * 86400000).length;
  const cats = Object.entries(now.cats).filter(([, v]) => v.n >= 4).map(([k, v]) => ({ k, n: v.n, a: Math.round((v.c / v.n) * 100) }));
  const weakCats = [...cats].sort((a, b) => a.a - b.a).slice(0, 3).filter((c) => c.a < 85);
  const strongCats = [...cats].sort((a, b) => b.a - a.a).slice(0, 2).filter((c) => c.a >= 80);
  const parts = Object.keys(PARTS).map((k) => ({ k, ...readiness(k) })).sort((a, b) => a.score - b.score);
  const focus = weakCats[0] ? { label: catLabel(weakCats[0].k), href: catLink(weakCats[0].k) } : { label: PARTS[parts[0].k].label, href: PARTS[parts[0].k].href };
  const aNow = acc(now), aPrev = acc(prev);
  const delta = aNow !== null && aPrev !== null ? aNow - aPrev : null;

  if (!now.n) {
    return `<section class="${CARD} p-5 space-y-2"><h2 class="font-black dark:text-white">📊 Bilan de la semaine</h2><p class="text-sm text-slate-500">Pas d’activité ces 7 derniers jours. Une petite séance aujourd’hui relancera votre progression.</p><a href="#/plan" class="${BTN_PRIMARY}">Séance du jour</a></section>`;
  }
  return `<section class="${CARD} p-5 space-y-4">
    <h2 class="font-black dark:text-white">📊 Bilan de la semaine <span class="text-xs font-bold text-slate-500">(7 derniers jours)</span></h2>
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-3"><div class="text-xl font-black text-delftBlue dark:text-white">${now.days} / 7</div><div class="text-xs text-slate-500">jours d’étude</div></div>
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-3"><div class="text-xl font-black text-delftBlue dark:text-white">${mastered}</div><div class="text-xs text-slate-500">nouveaux éléments maîtrisés</div></div>
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-3"><div class="text-xl font-black text-delftBlue dark:text-white">${aNow} %</div><div class="text-xs text-slate-500">de bonnes réponses${delta !== null ? ` (${delta >= 0 ? '+' : ''}${delta} vs sem. passée)` : ''}</div></div>
    </div>
    ${strongCats.length ? `<div class="text-sm"><p class="font-bold text-emerald-700 dark:text-emerald-400">✓ Points forts</p><ul class="text-slate-700 dark:text-slate-300">${strongCats.map((c) => `<li>${esc(catLabel(c.k))} : ${c.a} %</li>`).join('')}</ul></div>` : ''}
    ${weakCats.length ? `<div class="text-sm"><p class="font-bold text-red-700 dark:text-red-400">À retravailler</p><ul class="space-y-1">${weakCats.map((c) => `<li><a href="${catLink(c.k)}" class="underline text-slate-700 dark:text-slate-300">${esc(catLabel(c.k))} : ${c.a} % sur ${c.n} réponses</a></li>`).join('')}</ul></div>` : ''}
    <div class="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-950 dark:text-amber-100 space-y-2">
      <p class="font-black">🎯 Objectif pour la semaine qui vient</p>
      <p>Priorité : <b>${esc(focus.label)}</b>. Visez au moins ${Math.min(7, Math.max(4, now.days + 1))} jours d’étude${parts[0].exams ? '' : `, et faites un examen blanc de ${PARTS[parts[0].k].label}`}.</p>
      <a href="${focus.href}" class="${BTN_PRIMARY}">S’y mettre maintenant</a>
    </div>
  </section>`;
}

// ── Progrès ─────────────────────────────────────────────
export function renderProgres(el) {
  const types = ['kns', 'manuel', 'speak', 'reading', 'vocab', 'dehet', 'typing', 'dictee', 'wordmatch', 'puzzle', 'grammar', 'listening'];
  const allIds = types.flatMap(idsOf);
  const tot = summary(allIds);
  const days = lastDays(14);
  const maxN = Math.max(1, ...days.map((d) => d.n));
  const acc7 = accuracyLastDays(7);
  const weak = weakest(5);
  const examKinds = [['kns', '🏛️ Société'], ['lecture', '📄 Lecture'], ['parler', '🗣️ Parler']].map(([k, label]) => ({ k, label, list: store.data.exams.filter((e) => (e.kind || 'kns') === k).slice(-5) })).filter((x) => x.list.length);

  const stat = (value, label) => `<div class="${CARD} p-4 text-center"><div class="text-2xl font-black text-delftBlue dark:text-white">${value}</div><div class="text-xs font-bold text-slate-500 dark:text-slate-400">${label}</div></div>`;

  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-5 animate-pop">
      ${pageHero('progres', 'Mes progrès', 'Un élément est « maîtrisé » après 3 bonnes réponses espacées dans le temps.', [`Niveau ${levelInfo().level} · ${levelInfo().tier.nl}`, `${totalXp()} XP au total`])}
      ${weeklyReport()}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- 4 indicateurs -->
        ${stat('🔥 ' + streakInfo().count + ' j', 'Série de jours')}
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

      ${examKinds.length ? `<section class="${CARD} p-5 space-y-4"><div class="flex justify-between items-center"><h2 class="font-black dark:text-white">Examens blancs</h2><a href="#/examen" class="text-sm font-bold text-dutchOrange">Passer un examen</a></div>
        ${examKinds.map((x) => `<div class="space-y-1"><p class="text-sm font-bold dark:text-white">${x.label}</p>
          <div class="flex items-end gap-2 h-16">${x.list.map((h) => `<div class="flex-1 flex flex-col items-center gap-1 h-full justify-end"><span class="text-[10px] font-bold dark:text-white">${h.good}/${h.total}</span><div class="w-full rounded-t-md ${h.passed ? 'bg-emerald-500' : 'bg-red-400'}" style="height:${Math.max(6, pct(h.good, h.total))}%"></div></div>`).join('')}</div></div>`).join('')}
        <p class="text-xs text-slate-500">Vert = seuil atteint. Société : ${PASS_MARK}/${EXAM_SIZE} (officiel) ; Lecture et Parler : seuils indicatifs.</p></section>` : ''}
    </div>`;
}

export { INTERVALS, MASTERED_BOX, get };
