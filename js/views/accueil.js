// Accueil : niveau, objectif du jour, séance du jour, préparation par partie, modules.

import { esc } from '../core/util.js';
import { CARD, BTN_PRIMARY, THEMES, toast } from '../core/ui.js';
import { dueIds, summary, activityBetween } from '../core/learner.js';
import { KNS_QUESTIONS, MANUEL_PAGES, idsOf } from '../content/index.js';
import { PARTS, readiness, dailyPlan, weekKey } from '../core/plan.js';
import { store } from '../core/store.js';
import { levelInfo, streakInfo, todayXp, dailyGoal } from '../core/game.js';
import { ring } from '../core/fx.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return ['Goedemorgen!', 'Bonjour !'];
  if (h < 18) return ['Goedemiddag!', 'Bon après-midi !'];
  return ['Goedenavond!', 'Bonsoir !'];
}

function reportBanner() {
  if (store.data.ui.lastReportWeek === weekKey()) return '';
  if (!activityBetween(13, 7).n) return '';
  return `<a href="#/progres" class="flex items-center gap-3 ${CARD} p-4 border-2 !border-emerald-400 touch-active animate-rise">
    <span class="text-3xl" aria-hidden="true">📊</span>
    <span class="flex-1 min-w-0"><span class="block font-black text-emerald-700 dark:text-emerald-300">Votre bilan de la semaine est prêt</span><span class="block text-xs text-slate-500 dark:text-slate-400">Ce que vous avez maîtrisé, vos points faibles et votre objectif.</span></span>
    <i class="fa-solid fa-chevron-right text-emerald-600" aria-hidden="true"></i>
  </a>`;
}

// Carte principale : objectif du jour + série + compte à rebours + bouton « Continuer ».
function todayCard(plan) {
  const xp = todayXp();
  const goal = dailyGoal();
  const st = streakInfo();
  const met = xp >= goal;
  const chips = [];
  if (plan.due) chips.push(`🔁 ${plan.due} à revoir`);
  if (plan.vocab) chips.push(`🎴 ${plan.vocab} mots`);
  if (plan.kns) chips.push(`🏛️ ${plan.kns} questions`);
  if (plan.texts) chips.push(`📄 ${plan.texts} texte${plan.texts > 1 ? 's' : ''}`);
  if (plan.speak) chips.push(`🗣️ ${plan.speak} à l’oral`);
  const done = Math.min(plan.doneToday, plan.size);
  const countdown = plan.days === null
    ? '<a href="#date" class="underline font-bold">📅 Ajouter la date de l’examen</a>'
    : plan.days > 0 ? `📅 Examen dans <b>${plan.days}</b> jour${plan.days > 1 ? 's' : ''}`
      : plan.days === 0 ? '📅 Examen aujourd’hui : bonne chance !' : '📅 Date d’examen passée · <a href="#/reglages" class="underline">modifier</a>';

  return `<section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-700 to-dutchOrange text-white p-5 shadow-xl space-y-4 animate-rise">
    <div class="absolute -right-8 -bottom-10 text-[9rem] leading-none opacity-20 select-none" aria-hidden="true">🌷</div>
    <div class="relative flex items-center gap-4">
      ${ring((xp / goal) * 100, { size: 108, stroke: 11, color: met ? 'text-emerald-300' : 'text-white', track: 'text-black/20', label: `Objectif du jour : ${xp} sur ${goal} XP`,
        inner: met ? '<span class="text-3xl" aria-hidden="true">✓</span><span class="text-[11px] font-bold mt-1">atteint</span>' : `<span class="text-2xl font-black tabular-nums">${xp}</span><span class="text-[11px] font-bold mt-1 text-white/90">/ ${goal} XP</span>` })}
      <div class="min-w-0 space-y-1.5">
        <p class="text-xs font-black uppercase tracking-wider text-white/90">Objectif du jour</p>
        <p class="text-lg font-black leading-tight">${met ? 'Bravo, objectif atteint\u00a0!' : xp ? `Encore ${goal - xp} XP` : 'C’est parti !'}</p>
        <p class="text-sm"><span class="${st.todayMet ? 'animate-flame' : ''}" aria-hidden="true">🔥</span> ${st.count ? `<b>${st.count}</b> jour${st.count > 1 ? 's' : ''} de suite` : 'Commencez une série aujourd’hui'}</p>
        <p class="text-xs text-white/90">${countdown}</p>
      </div>
    </div>
    ${chips.length ? `<div class="relative flex flex-wrap gap-1.5">${chips.map((c) => `<span class="px-2.5 py-1 rounded-full bg-black/25 text-xs font-bold">${c}</span>`).join('')}</div>` : ''}
    ${plan.size
      ? `<a href="#/plan" class="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white text-orange-700 font-black shadow-md touch-active">
          <i class="fa-solid fa-play" aria-hidden="true"></i> ${done >= plan.size ? 'Refaire une séance' : done > 0 ? `Continuer (${done}/${plan.size})` : `Commencer la séance du jour`}</a>`
      : `<a href="#/examen" class="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white text-orange-700 font-black shadow-md touch-active">🏆 Tout est à jour : un examen blanc ?</a>`}
    ${st.restUsedThisWeek ? '<p class="relative text-[11px] text-white/90">😴 Jour de repos utilisé cette semaine : votre série est protégée.</p>' : ''}
  </section>`;
}

function dateCard(plan) {
  if (plan.days !== null) return '';
  return `<section id="date" class="${CARD} p-4 space-y-3">
    <p class="text-sm font-bold text-slate-800 dark:text-white">📅 Quand passez-vous l’examen ?</p>
    <p class="text-xs text-slate-500 dark:text-slate-400">L’application répartit tout le contenu sur les jours qui restent.</p>
    <form data-date-form class="flex flex-wrap gap-2 items-center">
      <label for="examDate" class="sr-only">Date de l’examen</label>
      <input id="examDate" type="date" required min="${new Date().toISOString().slice(0, 10)}" class="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-bold">
      <button type="submit" class="${BTN_PRIMARY}">Enregistrer</button>
    </form>
  </section>`;
}

// Trois jauges : Société, Lecture, Parler.
function readinessCard() {
  const theme = { kns: 'societe', lecture: 'lecture', parler: 'parler' };
  return `<section class="${CARD} p-5 space-y-3">
    <div class="flex justify-between items-baseline"><h2 class="font-black text-slate-900 dark:text-white">Ma préparation</h2><a href="#/examen" class="text-xs font-bold text-dutchOrange">Examens blancs →</a></div>
    <div class="grid grid-cols-3 gap-2">
      ${Object.entries(PARTS).map(([k, p]) => {
        const r = readiness(k);
        const t = THEMES[theme[k]];
        return `<a href="${p.href}" class="flex flex-col items-center gap-1.5 text-center rounded-2xl p-2 touch-active">
          ${ring(r.score, { size: 76, stroke: 8, color: t.ring, label: `${p.label} : ${r.score} %`, inner: `<span class="text-lg" aria-hidden="true">${p.icon}</span><span class="text-xs font-black tabular-nums text-slate-800 dark:text-white">${r.score}%</span>` })}
          <span class="text-xs font-black text-slate-800 dark:text-white leading-tight">${p.label.replace(' (KNS)', '')}</span>
          <span class="text-[11px] font-bold ${r.level === 'Prêt' ? 'text-emerald-600 dark:text-emerald-400' : r.level === 'En bonne voie' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}">${r.level}</span>
        </a>`;
      }).join('')}
    </div>
  </section>`;
}

function tile(href, themeKey, icon, label, ids, badge = '') {
  const t = THEMES[themeKey];
  const s = ids ? summary(ids) : null;
  const p = s && s.total ? Math.round((s.mastered / s.total) * 100) : null;
  return `<a href="${href}" class="relative rounded-2xl ${t.soft} border ${t.border} p-3 flex flex-col items-center text-center gap-1.5 touch-active">
    ${badge ? `<span class="absolute -top-1.5 -right-1.5 min-w-[1.5rem] h-6 px-1.5 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center">${badge}</span>` : ''}
    <span class="w-11 h-11 rounded-2xl ${t.tint} flex items-center justify-center text-2xl" aria-hidden="true">${icon}</span>
    <span class="text-sm font-black text-slate-900 dark:text-white leading-tight">${label}</span>
    ${p !== null ? `<span class="w-full h-1.5 rounded-full bg-white/70 dark:bg-slate-900/60 overflow-hidden"><span class="block h-full ${t.bar} rounded-full" style="width:${Math.max(p, 2)}%"></span></span>` : ''}
  </a>`;
}

export function render(el) {
  const plan = dailyPlan();
  const lv = levelInfo();
  const [hello, helloFr] = greeting();
  const due = dueIds().length;

  el.innerHTML = `
    <div class="max-w-2xl mx-auto space-y-5">
      <div class="flex items-center justify-between gap-3 animate-rise">
        <div class="min-w-0">
          <h1 class="text-2xl font-black text-delftBlue dark:text-white" lang="nl">${hello} <span aria-hidden="true">👋</span></h1>
          <p class="text-sm text-slate-500 dark:text-slate-400">${helloFr} Prêt pour un peu de néerlandais ?</p>
        </div>
      </div>

      <a href="#/progres" class="${CARD} p-4 flex items-center gap-3 touch-active animate-rise">
        <span class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-2xl shrink-0" aria-hidden="true">${lv.tier.icon}</span>
        <span class="flex-1 min-w-0 space-y-1.5">
          <span class="flex justify-between items-baseline gap-2"><span class="font-black text-slate-900 dark:text-white">Niveau ${lv.level} · <span lang="nl">${lv.tier.nl}</span></span><span class="text-xs text-slate-500 dark:text-slate-400">${lv.tier.fr}</span></span>
          <span class="block h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><span class="block h-full rounded-full bg-gradient-to-r from-amber-400 to-dutchOrange transition-all" style="width:${Math.max(lv.pct, 2)}%"></span></span>
          <span class="block text-[11px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">${lv.xpInLevel} / ${lv.need} XP jusqu’au niveau ${lv.level + 1}</span>
        </span>
      </a>

      ${reportBanner()}
      ${todayCard(plan)}
      ${plan.nextManuel && plan.manuel ? (() => { const n = MANUEL_PAGES.find((p) => p.id === plan.nextManuel); return n ? `<a href="#/manuel/${n.ci}/${n.pi}" class="flex items-center gap-3 ${CARD} p-3.5 touch-active"><span class="text-2xl" aria-hidden="true">📖</span><span class="flex-1 min-w-0"><span class="block text-xs font-bold text-slate-500 dark:text-slate-400">À lire aujourd’hui</span><span class="block font-black text-slate-900 dark:text-white truncate">${esc(n.title)}</span></span><i class="fa-solid fa-chevron-right text-dutchOrange" aria-hidden="true"></i></a>` : ''; })() : ''}
      ${plan.mock ? `<a href="${PARTS[plan.mock].examHref}" class="flex items-center gap-3 ${CARD} p-3.5 touch-active"><span class="text-2xl" aria-hidden="true">🏆</span><span class="flex-1 font-black text-slate-900 dark:text-white">Examen blanc du jour : ${PARTS[plan.mock].label}</span><i class="fa-solid fa-chevron-right text-dutchOrange" aria-hidden="true"></i></a>` : ''}
      ${dateCard(plan)}
      ${readinessCard()}

      <section class="space-y-3">
        <h2 class="font-black text-slate-900 dark:text-white">Tout pratiquer</h2>
        <div class="grid grid-cols-3 gap-2.5">
          ${tile('#/manuel', 'societe', '📖', 'Manuel', idsOf('manuel'))}
          ${tile('#/kns', 'societe', '🏛️', 'Société', idsOf('kns'))}
          ${tile('#/parler', 'parler', '🗣️', 'Parler', idsOf('speak'))}
          ${tile('#/lecture', 'lecture', '📄', 'Lecture', idsOf('reading'))}
          ${tile('#/mots', 'mots', '🎴', 'Mots', idsOf('vocab'))}
          ${tile('#/grammaire', 'grammaire', '✍️', 'Grammaire', [...idsOf('puzzle'), ...idsOf('grammar')])}
          ${tile('#/ecoute', 'ecoute', '🎧', 'Écoute', idsOf('listening'))}
          ${tile('#/reviser', 'reviser', '🔁', 'Réviser', null, due ? String(Math.min(due, 99)) : '')}
          ${tile('#/examen', 'examen', '🏆', 'Examens', null)}
        </div>
      </section>

      <details class="${CARD} p-4 text-sm text-slate-700 dark:text-slate-300">
        <summary class="font-black text-slate-900 dark:text-white cursor-pointer">ℹ️ À propos de l’examen de base (A1)</summary>
        <div class="space-y-2 pt-3">
          <p>L’examen se passe sur ordinateur, à l’ambassade ou au consulat. Il comporte trois parties, et il faut réussir les trois :</p>
          <p>🏛️ <b>Société (KNS)</b> : questions sur la vie aux Pays-Bas. L’application en propose ${KNS_QUESTIONS.length}, avec un manuel en français.<br>📄 <b>Lecture</b> : 9 textes courts du quotidien.<br>🗣️ <b>Parler</b> : répondre à des questions et compléter des phrases.</p>
          <p>Toutes les explications sont en français ; tout ce que vous pratiquez est en néerlandais, comme à l’examen.</p>
        </div>
      </details>
    </div>`;

  el.querySelector('[data-date-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = el.querySelector('#examDate').value;
    if (!v) return;
    store.data.settings.examDate = v;
    store.save();
    toast('Date enregistrée : votre plan est prêt.');
    render(el);
  });
  el.querySelector('a[href="#date"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    el.querySelector('#date')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.querySelector('#examDate')?.focus({ preventScroll: true });
  });
}
