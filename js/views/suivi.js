// Examen blanc, révisions et progrès.

import { esc, shuffle, pct } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, bar, pageTitle, pageHero, backLink } from '../core/ui.js';
import { dueIds, summary, weakest, lastDays, accuracyLastDays, currentStreak, get, MASTERED_BOX, INTERVALS, activityBetween, masteredSince } from '../core/learner.js';
import { weekKey, catLabel, catLink, PARTS, readiness } from '../core/plan.js';
import { levelInfo, totalXp, streakInfo } from '../core/game.js';
import { session, describe } from '../core/engine.js';
import { store } from '../core/store.js';
import { KNS_CATS, KNS_QUESTIONS, TYPE_LABELS, lookup, idsOf } from '../content/index.js';
import { tr, tri } from '../core/i18n.js';
import { icon, KNS_ICON } from '../core/icons.js';

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

const fmtDate = (t) => new Date(t).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
const historyOf = (kind) => store.data.exams.filter((e) => (e.kind || 'kns') === kind).reverse().slice(0, 5);
const historyList = (kind) => {
  const hist = historyOf(kind);
  return hist.length ? `<div class="${CARD} p-5 space-y-2"><h2 class="font-black dark:text-white">${tri('Je laatste resultaten', 'vos derniers résultats')}</h2>
    ${hist.map((h) => `<div class="flex justify-between text-sm dark:text-white"><span>${fmtDate(h.date)}${h.seconds ? ` · ${Math.floor(h.seconds / 60)} min` : ''}</span><span class="font-bold ${h.passed ? 'text-emerald-600' : 'text-red-600'}">${h.good}/${h.total} ${h.passed ? '✓' : '✗'}</span></div>`).join('')}</div>` : '';
};

export function renderExamen(el, params) {
  const p = params[0];
  if (p === 'go' || p === 'start-societe') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, {
      title: 'Oefenexamen KNS', ids: examQuestions(), exam: true, timeLimit: 30 * 60, passMark: PASS_MARK, backHash: '#/examen', backLabel: 'Terug naar Oefenexamens',
      onFinish: (results, { good, total, seconds, passed }) => {
        store.data.exams.push({ kind: 'kns', date: Date.now(), good, total, seconds, passed, byCat: byCategory(results) });
        store.save();
      },
      summaryExtra: (results) => {
        const rows = byCategory(results);
        return `<div class="text-left pt-3 space-y-1.5">${Object.entries(rows).sort((a, b) => a[1].good / a[1].total - b[1].good / b[1].total).map(([cat, r]) => `
          <div class="flex items-center gap-2 text-xs dark:text-white"><span class="w-40 truncate flex items-center gap-1.5">${icon(KNS_ICON[cat], 'w-4 h-4 shrink-0')} ${esc(KNS_CATS[cat].nl)}</span><span class="flex-1">${bar(r.good, r.total, r.good / r.total >= 0.7 ? 'bg-emerald-500' : 'bg-red-400')}</span><span class="w-10 text-right font-bold">${r.good}/${r.total}</span></div>`).join('')}</div>`;
      },
    });
    return;
  }

  if (p === 'societe') {
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4 animate-pop">
        ${pageHero('societe', 'Oefenexamen KNS', '', ['30 vragen', '2 antwoorden', '30 min', 'grens 21'], 'Examen blanc : connaissance de la société')}
        <div class="${CARD} p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <ul class="space-y-1.5">
            <li>• Net als op het echte examen: <b>${EXAM_SIZE} vragen</b>, steeds <b>twee antwoorden</b>. Je hebt <b>${PASS_MARK} goede antwoorden</b> nodig.</li>
            <li>• 30 minuten. Je hoort elke vraag en de twee antwoorden.</li>
            <li>• De vragen komen uit alle 8 thema’s (${KNS_QUESTIONS.length} vragen).</li>
            <li>• Tijdens het examen zie je niet of je antwoord goed is. De uitslag komt aan het eind.</li>
            ${tr('', `Comme à l’examen officiel : ${EXAM_SIZE} questions à deux réponses, ${PASS_MARK} bonnes réponses pour réussir, 30 minutes. Pas de correction pendant l’examen : le bilan détaillé arrive à la fin.`)}
          </ul>
          <p class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border border-amber-200 dark:border-amber-800 rounded-2xl p-3">${tri('Op het echte examen hoort bij elke vraag een foto uit het lespakket „Naar Nederland”. Oefen ook met dat pakket (naarnederland.nl).', 'À l’examen officiel, chaque question est accompagnée d’une photo du pack « Naar Nederland ». Entraînez-vous aussi avec ce pack (naarnederland.nl) : nos questions couvrent les mêmes thèmes, mais ce ne sont pas les questions officielles.')}</p>
          <a href="#/examen/start-societe" class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-play" aria-hidden="true"></i> Start het examen</a>
        </div>
        ${historyList('kns')}
        ${backLink('#/examen', 'Oefenexamens')}
      </div>`;
    return;
  }

  if (p === 'lecture') {
    el.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4 animate-pop">
        ${pageHero('lecture', 'Oefenexamen Lezen', '', ['9 teksten', '18 vragen', '35 min'], 'Examen blanc : lecture')}
        <div class="${CARD} p-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          <ul class="space-y-1.5">
            <li>• Net als op het examen: <b>9 korte teksten</b> uit het dagelijks leven (berichten, brieven, tabellen, advertenties).</li>
            <li>• <b>2 vragen per tekst</b> (18 in totaal), met <b>3 antwoorden</b>.</li>
            <li>• <b>35 minuten.</b> Is de tijd om? Dan tellen vragen zonder antwoord als fout.</li>
            ${tr('', 'Comme à l’examen depuis mai 2023 : 9 textes, 2 questions par texte (l’examen en compte environ 19), 3 réponses possibles, 35 minutes. Le bilan avec les explications arrive à la fin.')}
          </ul>
          <div class="rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 p-3 text-teal-950 dark:text-teal-100 space-y-1">
            <p class="font-black">Tips</p>
            <p>1. ${tri('Lees eerst de vraag. Zoek dan het antwoord in de tekst.', 'lisez d’abord la question')}</p>
            <p>2. ${tri('Je hoeft niet elk woord te begrijpen. Zoek tijden, dagen, prijzen en namen.', 'repérez heures, jours, prix, noms')}</p>
            <p>3. ${tri('Ongeveer 4 minuten per tekst. Weet je het niet? Kies een antwoord en ga door.', 'environ 4 minutes par texte')}</p>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">${tri('Richtgrens: ongeveer 74 %.', 'Seuil indicatif (comme 14 sur 19 dans les guides) : DUO ne publie pas le seuil officiel.')}</p>
          <a href="#/lecture/examen" class="${BTN_PRIMARY} w-full !bg-teal-600"><i class="fa-solid fa-play" aria-hidden="true"></i> Start het examen</a>
        </div>
        ${historyList('lecture')}
        ${backLink('#/examen', 'Oefenexamens')}
      </div>`;
    return;
  }

  // Page d’accueil des examens blancs : les trois parties de l’examen.
  const card = (href, iconName, title, fr, details, kind, grad) => {
    const last = historyOf(kind)[0];
    return `<a href="${href}" class="block bg-gradient-to-r ${grad} text-white p-5 rounded-3xl shadow-lg touch-active">
      <div class="flex items-center justify-between gap-3">
        <div class="min-w-0 flex items-center gap-3"><span class="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">${icon(iconName, 'w-8 h-8')}</span><div class="min-w-0"><div class="text-lg font-black" lang="nl">${title}</div><div class="fr text-xs text-white/80" lang="fr">${fr}</div><div class="text-xs text-white/85">${details}</div>
          ${last ? `<div class="text-xs font-bold mt-1">Laatste keer: ${last.good}/${last.total} ${last.passed ? '✓' : '✗'} (${fmtDate(last.date)})</div>` : ''}</div></div>
        <i class="fa-solid fa-chevron-right text-xl" aria-hidden="true"></i>
      </div>
    </a>`;
  };
  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageHero('examen', 'Oefenexamens', tr('Je moet voor alle drie de delen slagen. Doe elk oefenexamen zoals het echte examen: rustig, in één keer, zonder hulp.', 'Il faut réussir les trois parties. Faites chaque examen blanc dans les conditions réelles : au calme, d’une traite, sans aide.'), [], 'Examens blancs')}
      ${card('#/examen/societe', 'kns', 'KNS', 'Connaissance de la société', '30 vragen · 2 antwoorden · 30 min · grens 21', 'kns', 'from-orange-700 to-orange-600')}
      ${card('#/examen/lecture', 'read', 'Lezen', 'Lecture', '9 teksten · 18 vragen · 3 antwoorden · 35 min', 'lecture', 'from-teal-700 to-delftBlue')}
      ${card('#/parler/examen', 'mic', 'Spreken', 'Expression orale', '10 vragen + 12 zinnen · 60 sec. per antwoord', 'parler', 'from-blue-700 to-delftBlue')}
      ${backLink('#/', 'Start')}
    </div>`;
}

// ── Réviser (répétition espacée) ────────────────────────
export function renderReviser(el, params) {
  if (params[0] === 'go') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title: 'Herhalen', ids: dueIds().slice(0, 20), backHash: '#/reviser', backLabel: 'Terug naar Herhalen' });
    return;
  }
  if (params[0] === 'faibles') {
    el.innerHTML = '<div></div>';
    session(el.firstElementChild, { title: 'Mijn zwakke punten', ids: weakest(10).map((w) => w.id), backHash: '#/progres', backLabel: 'Terug naar Voortgang' });
    return;
  }

  const due = dueIds();
  const byType = {};
  due.forEach((id) => { const t = lookup(id)?.type; if (t) byType[t] = (byType[t] || 0) + 1; });
  const upcoming = Object.values(store.data.items).map((it) => it.due).filter((d) => d > Date.now()).sort((a, b) => a - b)[0];
  const when = upcoming ? new Date(upcoming).toLocaleString('nl-NL', { weekday: 'long', hour: '2-digit', minute: '2-digit' }) : null;

  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageHero('reviser', 'Herhalen', tr('Alles komt terug net voordat je het vergeet: na 1 dag, dan na 2, 4, 8, 16 en 32 dagen. Een fout komt snel terug.', 'Chaque élément revient juste avant que vous risquiez de l’oublier : après 1, 2, 4, 8, 16 puis 32 jours. Une erreur le fait revenir rapidement.'), [], 'Réviser')}
      <div class="${CARD} p-6 text-center space-y-4">
        ${due.length ? `
          <p class="text-5xl font-black text-dutchOrange">${due.length}</p>
          <p class="font-bold dark:text-white">${tri('om nu te herhalen', 'éléments à réviser maintenant')}</p>
          <div class="flex flex-wrap justify-center gap-1.5">${Object.entries(byType).map(([t, n]) => `<span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs font-bold dark:text-white">${TYPE_LABELS[t]}: ${n}</span>`).join('')}</div>
          <a href="#/reviser/go" class="${BTN_PRIMARY} w-full"><i class="fa-solid fa-play" aria-hidden="true"></i> Herhaal er ${Math.min(due.length, 20)}</a>
          ${due.length > 20 ? `<p class="text-xs text-slate-500">${tri('Maximaal 20 per keer. Doe daarna nog een ronde.', '20 éléments maximum par séance')}</p>` : ''}` : `
          <p class="flex justify-center text-emerald-500">${icon('star', 'w-12 h-12')}</p>
          <p class="font-bold dark:text-white">${tri('Nu niets te herhalen.', 'Rien à réviser pour le moment.')}</p>
          ${when ? `<p class="text-sm text-slate-500">Volgende keer: ${esc(when)}.</p>` : `<p class="text-sm text-slate-500">${tri('Begin met leren. Wat je leert, komt hier op tijd terug.', 'Commencez par apprendre : les éléments reviendront ici au bon moment.')}</p>`}
          <div class="flex flex-wrap justify-center gap-2"><a href="#/mots" class="${BTN_SECONDARY}">${icon('cards', 'w-5 h-5')} Nieuwe woorden</a><a href="#/kns/mix" class="${BTN_SECONDARY}">${icon('kns', 'w-5 h-5')} KNS-vragen</a></div>`}
      </div>
      ${backLink('#/', 'Start')}
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
    return `<section class="${CARD} p-5 space-y-2"><h2 class="font-black dark:text-white flex items-center gap-2">${icon('chart', 'w-5 h-5')} Deze week</h2><p class="text-sm text-slate-500">${tri('Geen oefeningen in de laatste 7 dagen. Een korte les vandaag helpt al!', 'Pas d’activité ces 7 derniers jours.')}</p><a href="#/plan" class="${BTN_PRIMARY}">Les van vandaag</a></section>`;
  }
  return `<section class="${CARD} p-5 space-y-4">
    <h2 class="font-black dark:text-white flex items-center gap-2">${icon('chart', 'w-5 h-5')} Deze week <span class="text-xs font-bold text-slate-500">(laatste 7 dagen)</span></h2>
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-3"><div class="text-xl font-black text-delftBlue dark:text-white">${now.days} / 7</div><div class="text-xs text-slate-500">dagen geoefend</div></div>
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-3"><div class="text-xl font-black text-delftBlue dark:text-white">${mastered}</div><div class="text-xs text-slate-500">nieuw geleerd</div></div>
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-3"><div class="text-xl font-black text-delftBlue dark:text-white">${aNow} %</div><div class="text-xs text-slate-500">goed${delta !== null ? ` (${delta >= 0 ? '+' : ''}${delta} t.o.v. vorige week)` : ''}</div></div>
    </div>
    ${strongCats.length ? `<div class="text-sm"><p class="font-bold text-emerald-700 dark:text-emerald-400">✓ ${tri('Dit gaat goed', 'points forts')}</p><ul class="text-slate-700 dark:text-slate-300">${strongCats.map((c) => `<li>${esc(catLabel(c.k))}: ${c.a} %</li>`).join('')}</ul></div>` : ''}
    ${weakCats.length ? `<div class="text-sm"><p class="font-bold text-red-700 dark:text-red-400">${tri('Nog oefenen', 'à retravailler')}</p><ul class="space-y-1">${weakCats.map((c) => `<li><a href="${catLink(c.k)}" class="underline text-slate-700 dark:text-slate-300">${esc(catLabel(c.k))}: ${c.a} % van ${c.n} antwoorden</a></li>`).join('')}</ul></div>` : ''}
    <div class="rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 text-sm text-amber-950 dark:text-amber-100 space-y-2">
      <p class="font-black flex items-center gap-2">${icon('target', 'w-5 h-5')} ${tri('Doel voor volgende week', 'objectif de la semaine')}</p>
      <p>Eerst: <b>${esc(focus.label)}</b>. Oefen minstens ${Math.min(7, Math.max(4, now.days + 1))} dagen${parts[0].exams ? '' : ` en doe een oefenexamen ${PARTS[parts[0].k].label}`}.</p>
      <a href="${focus.href}" class="${BTN_PRIMARY}">Begin nu</a>
    </div>
  </section>`;
}

// ── Progrès ─────────────────────────────────────────────
export function renderProgres(el) {
  const types = ['kns', 'manuel', 'speak', 'reading', 'story', 'vocab', 'dehet', 'typing', 'dictee', 'wordmatch', 'puzzle', 'grammar', 'listening'];
  const allIds = types.flatMap(idsOf);
  const tot = summary(allIds);
  const days = lastDays(14);
  const maxN = Math.max(1, ...days.map((d) => d.n));
  const acc7 = accuracyLastDays(7);
  const weak = weakest(5);
  const examKinds = [['kns', 'KNS'], ['lecture', 'Lezen'], ['parler', 'Spreken']].map(([k, label]) => ({ k, label, list: store.data.exams.filter((e) => (e.kind || 'kns') === k).slice(-5) })).filter((x) => x.list.length);

  const stat = (value, label) => `<div class="${CARD} p-4 text-center"><div class="text-2xl font-black text-delftBlue dark:text-white">${value}</div><div class="text-xs font-bold text-slate-500 dark:text-slate-400">${label}</div></div>`;

  el.innerHTML = `
    <div class="max-w-3xl mx-auto space-y-5 animate-pop">
      ${pageHero('progres', 'Voortgang', tr('Iets is „geleerd” na 3 goede antwoorden op verschillende dagen.', 'Un élément est « maîtrisé » après 3 bonnes réponses espacées dans le temps.'), [`Niveau ${levelInfo().level} · ${levelInfo().tier.nl}`, `${totalXp()} XP totaal`], 'Mes progrès')}
      ${weeklyReport()}
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <!-- 4 indicateurs -->
        ${stat(streakInfo().count + (streakInfo().count === 1 ? ' dag' : ' dagen'), 'Reeks')}
        ${stat(`${tot.mastered}/${tot.total}`, 'Geleerd')}
        ${stat(tot.seen ? Math.round((tot.firstOk / tot.seen) * 100) + ' %' : '—', 'In één keer goed')}
        ${stat(acc7 === null ? '—' : acc7 + ' %', 'Goed (7 dagen)')}
      </div>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Activiteit (14 dagen)', 'activité')}</h2>
        <div class="flex items-end gap-1 h-24" role="img" aria-label="Antwoorden per dag, 14 dagen">
          ${days.map((d) => `<div class="flex-1 flex flex-col items-center gap-1 h-full justify-end"><div class="w-full rounded-t-md ${d.n ? 'bg-dutchOrange' : 'bg-slate-200 dark:bg-slate-700'}" style="height:${d.n ? Math.max(8, (d.n / maxN) * 100) : 4}%" title="${d.n} antwoorden"></div><span class="text-[10px] text-slate-400">${d.date.getDate()}</span></div>`).join('')}
        </div>
      </section>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('KNS per thema', 'société par thème')}</h2>
        <div class="space-y-3">
          ${Object.entries(KNS_CATS).map(([key, c]) => {
            const s = summary(KNS_QUESTIONS.filter((q) => q.cat === key).map((q) => q.id));
            return `<a href="#/kns/${key}" class="block space-y-1 touch-active">
              <div class="flex justify-between text-sm dark:text-white"><span class="font-bold flex items-center gap-1.5">${icon(KNS_ICON[key], 'w-4 h-4 text-orange-600 dark:text-orange-300')} ${esc(c.nl)}</span><span class="text-xs text-slate-500 dark:text-slate-400">${s.mastered}/${s.total} · ${s.accuracy === null ? 'nog niet begonnen' : s.accuracy + ' % goed'}</span></div>
              ${bar(s.mastered, s.total, s.accuracy !== null && s.accuracy < 60 ? 'bg-red-400' : 'bg-emerald-500')}
            </a>`;
          }).join('')}
        </div>
      </section>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Per onderdeel', 'par module')}</h2>
        ${types.map((t) => { const s = summary(idsOf(t)); return `<div class="space-y-1"><div class="flex justify-between text-sm dark:text-white"><span class="font-bold">${TYPE_LABELS[t]}</span><span class="text-xs text-slate-500 dark:text-slate-400">${s.mastered}/${s.total} geleerd · ${s.seen} gezien</span></div>${bar(s.mastered, s.total)}</div>`; }).join('')}
      </section>

      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Mijn zwakke punten', 'mes points faibles')}</h2>
        ${weak.length ? `<ul class="space-y-2">${weak.map((w) => { const d = describe(w.id); return `<li class="text-sm flex justify-between gap-3 dark:text-white"><span class="min-w-0"><span class="block font-bold truncate" lang="nl">${esc(d.label)}</span><span class="block text-xs text-slate-500">${TYPE_LABELS[lookup(w.id)?.type] || ''}</span></span><span class="shrink-0 text-xs font-bold text-red-600 dark:text-red-400">${w.errors} ${w.errors > 1 ? 'fouten' : 'fout'} / ${w.n}</span></li>`; }).join('')}</ul>
          <a href="#/reviser/faibles" class="${BTN_PRIMARY}"><i class="fa-solid fa-bullseye" aria-hidden="true"></i> Oefen mijn zwakke punten</a>`
          : `<p class="text-sm text-slate-500">${tri('Nog geen fouten. Ga zo door!', 'pas encore d’erreurs')}</p>`}
      </section>

      ${examKinds.length ? `<section class="${CARD} p-5 space-y-4"><div class="flex justify-between items-center"><h2 class="font-black dark:text-white">Oefenexamens</h2><a href="#/examen" class="text-sm font-bold text-dutchOrange">Doe een examen</a></div>
        ${examKinds.map((x) => `<div class="space-y-1"><p class="text-sm font-bold dark:text-white">${x.label}</p>
          <div class="flex items-end gap-2 h-16">${x.list.map((h) => `<div class="flex-1 flex flex-col items-center gap-1 h-full justify-end"><span class="text-[10px] font-bold dark:text-white">${h.good}/${h.total}</span><div class="w-full rounded-t-md ${h.passed ? 'bg-emerald-500' : 'bg-red-400'}" style="height:${Math.max(6, pct(h.good, h.total))}%"></div></div>`).join('')}</div></div>`).join('')}
        <p class="text-xs text-slate-500">${tri(`Groen = geslaagd. KNS: ${PASS_MARK}/${EXAM_SIZE} (officieel). Lezen en Spreken: richtgrens.`, 'vert = seuil atteint ; Lecture et Parler : seuils indicatifs')}</p></section>` : ''}
    </div>`;
}

export { INTERVALS, MASTERED_BOX, get };
