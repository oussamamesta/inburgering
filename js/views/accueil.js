// Accueil : l’examen visé, la séance du jour proposée, et l’accès aux modules.

import { esc } from '../core/util.js';
import { CARD, BTN_PRIMARY, bar } from '../core/ui.js';
import { dueIds, summary, get } from '../core/learner.js';
import { KNS_CATS, KNS_QUESTIONS, MANUEL_PAGES, VOCAB, idsOf } from '../content/index.js';
import { PARTS, readiness, dailyPlan, weekKey } from '../core/plan.js';
import { activityBetween } from '../core/learner.js';
import { store } from '../core/store.js';
import { toast } from '../core/ui.js';

function suggestions() {
  const out = [];
  const due = dueIds().length;
  if (due) out.push({ icon: '🔁', title: `Réviser ${due} élément${due > 1 ? 's' : ''}`, sub: 'Ce que vous risquez d’oublier aujourd’hui, en premier.', href: '#/reviser' });

  const nextPage = MANUEL_PAGES.find((p) => !get(p.id));
  if (nextPage) out.push({ icon: '📖', title: `Manuel : ${nextPage.title}`, sub: `Chapitre ${nextPage.ci + 1}, page ${nextPage.pi + 1} — lisez puis répondez au mini-quiz.`, href: `#/manuel/${nextPage.ci}/${nextPage.pi}` });

  // Thème de la société le plus faible (au moins 3 questions déjà vues).
  let weakest = null;
  for (const cat of Object.keys(KNS_CATS)) {
    const s = summary(KNS_QUESTIONS.filter((q) => q.cat === cat).map((q) => q.id));
    if (s.seen >= 3 && s.accuracy !== null && (!weakest || s.accuracy < weakest.acc)) weakest = { cat, acc: s.accuracy };
  }
  if (weakest && weakest.acc < 80) out.push({ icon: '🎯', title: `Point faible : ${KNS_CATS[weakest.cat].label}`, sub: `${weakest.acc} % de bonnes réponses. Une séance ciblée de 10 questions.`, href: `#/kns/${weakest.cat}` });

  const newSpeak = idsOf('speak').filter((id) => !get(id)).length;
  if (newSpeak && out.length < 3) out.push({ icon: '🗣️', title: 'Parler : répondre à des questions', sub: 'Entraînez-vous à voix haute, comme à l’examen.', href: '#/parler/questions' });

  const newWords = VOCAB.filter((w) => !get(w.id)).length;
  if (newWords) out.push({ icon: '🎴', title: 'Apprendre de nouveaux mots', sub: `${newWords} mots pas encore vus.`, href: '#/mots' });

  const newKns = KNS_QUESTIONS.filter((q) => !get(q.id)).length;
  if (newKns && out.length < 4) out.push({ icon: '🏛️', title: 'Questions sur la société', sub: `${newKns} questions pas encore vues.`, href: '#/kns/mix' });
  return out.slice(0, 4);
}


const LEVEL_COLORS = { 'Prêt': 'bg-emerald-500', 'En bonne voie': 'bg-amber-400', 'À travailler': 'bg-red-400' };

function planCard() {
  const plan = dailyPlan();
  const dateLabel = store.data.settings.examDate
    ? new Date(`${store.data.settings.examDate}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  const readinessRows = Object.entries(PARTS).map(([k, p]) => {
    const r = readiness(k);
    return `<a href="${p.href}" class="block space-y-1 touch-active">
      <div class="flex justify-between text-sm"><span class="font-bold text-slate-800 dark:text-white">${p.icon} ${p.label}</span><span class="text-xs font-bold text-slate-500 dark:text-slate-400">${r.level} · ${r.score} %</span></div>
      <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div class="h-full ${LEVEL_COLORS[r.level]} rounded-full" style="width:${Math.max(3, r.score)}%"></div></div>
    </a>`;
  }).join('');

  if (plan.days === null) {
    return `<section class="${CARD} p-5 space-y-4">
      <h2 class="text-lg font-black text-delftBlue dark:text-white">📅 Mon plan d’étude</h2>
      <p class="text-sm text-slate-600 dark:text-slate-300">Indiquez la date de votre examen : l’application répartit tout le contenu sur les jours qui restent et vous propose une séance chaque jour.</p>
      <form data-date-form class="flex flex-wrap gap-2 items-center">
        <label for="examDate" class="sr-only">Date de l’examen</label>
        <input id="examDate" type="date" required min="${new Date().toISOString().slice(0, 10)}" class="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-bold">
        <button type="submit" class="${BTN_PRIMARY}">Enregistrer</button>
      </form>
      <p class="text-xs text-slate-500 dark:text-slate-400">Pas encore de date ? Voici quand même la séance du jour, calculée pour un examen dans environ 7 semaines.</p>
      <a href="#/plan" class="${BTN_PRIMARY} w-full">Commencer la séance du jour (${plan.size} exercices)</a>
      <div class="space-y-2.5 pt-1"><p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Ma préparation</p>${readinessRows}</div>
    </section>`;
  }

  const lines = [];
  if (plan.due) lines.push(`🔁 ${plan.due} révision${plan.due > 1 ? 's' : ''}`);
  if (plan.vocab) lines.push(`🎴 ${plan.vocab} nouveaux mots`);
  if (plan.kns) lines.push(`🏛️ ${plan.kns} questions de société`);
  if (plan.texts) lines.push(`📄 ${plan.texts} texte${plan.texts > 1 ? 's' : ''} à lire`);
  if (plan.speak) lines.push(`🗣️ ${plan.speak} exercice${plan.speak > 1 ? 's' : ''} de parole`);
  const pct = plan.size ? Math.min(100, Math.round((plan.doneToday / plan.size) * 100)) : 100;
  const next = plan.nextManuel ? MANUEL_PAGES.find((p) => p.id === plan.nextManuel) : null;

  return `<section class="${CARD} p-5 space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div><h2 class="text-lg font-black text-delftBlue dark:text-white">📅 ${plan.days > 0 ? `Examen dans ${plan.days} jour${plan.days > 1 ? 's' : ''}` : plan.days === 0 ? 'Examen aujourd’hui : bonne chance !' : 'Date d’examen passée'}</h2>
      <p class="text-xs text-slate-500 dark:text-slate-400">${esc(dateLabel)} · <a href="#/reglages" class="underline">modifier</a></p></div>
      <span class="text-3xl font-black text-dutchOrange tabular-nums">${Math.max(0, plan.days)}</span>
    </div>
    ${plan.days < 0 ? '<p class="text-sm text-slate-600 dark:text-slate-300">Changez la date dans les Réglages pour recalculer votre plan.</p>' : `
    <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
      <p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${plan.finalWeek ? 'Dernière semaine : révisions et examens blancs' : 'Aujourd’hui'}</p>
      ${lines.length ? `<ul class="text-sm text-slate-700 dark:text-slate-200 space-y-1">${lines.map((l) => `<li>${l}</li>`).join('')}</ul>` : '<p class="text-sm dark:text-white">Rien de nouveau aujourd’hui : tout est à jour.</p>'}
      ${next && plan.manuel ? `<a href="#/manuel/${next.ci}/${next.pi}" class="block text-sm font-bold text-delftBlue dark:text-blue-300 underline">📖 Lire aussi : ${esc(next.title)}</a>` : ''}
      ${plan.mock ? `<a href="${PARTS[plan.mock].examHref}" class="block text-sm font-bold text-delftBlue dark:text-blue-300 underline">🏆 Examen blanc du jour : ${PARTS[plan.mock].label}</a>` : ''}
      ${plan.size ? `<div class="space-y-1"><div class="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400"><span>Fait aujourd’hui</span><span>${Math.min(plan.doneToday, plan.size)} / ${plan.size}</span></div>${bar(Math.min(plan.doneToday, plan.size), plan.size, 'bg-dutchOrange')}</div>
      <a href="#/plan" class="${BTN_PRIMARY} w-full">${pct >= 100 ? 'Séance terminée ✓ Refaire une séance' : pct > 0 ? 'Continuer la séance du jour' : 'Commencer la séance du jour'}</a>` : ''}
    </div>`}
    <div class="space-y-2.5"><p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Ma préparation</p>${readinessRows}</div>
  </section>`;
}

function reportBanner() {
  const wk = weekKey();
  if (store.data.ui.lastReportWeek === wk) return '';
  const last = activityBetween(13, 7);
  if (!last.n) return '';
  return `<a href="#/progres" class="block ${CARD} p-4 border-2 !border-emerald-400 touch-active"><span class="font-black text-emerald-700 dark:text-emerald-300">📊 Votre bilan de la semaine est prêt</span><span class="block text-xs text-slate-500 dark:text-slate-400">Ce que vous avez maîtrisé, vos points faibles et votre objectif pour cette semaine.</span></a>`;
}

function moduleCard(href, icon, title, ids, accent) {
  const s = summary(ids);
  return `<a href="${href}" class="${CARD} p-4 flex flex-col gap-3 touch-active hover:border-orange-300 dark:hover:border-orange-800">
    <div class="flex items-center justify-between"><span class="w-11 h-11 rounded-2xl ${accent} flex items-center justify-center text-xl" aria-hidden="true">${icon}</span><span class="text-xs font-bold text-slate-500 dark:text-slate-400">${s.mastered} / ${s.total} maîtrisés</span></div>
    <h3 class="font-black text-slate-900 dark:text-white">${title}</h3>
    ${bar(s.mastered, s.total)}
  </a>`;
}

export function render(el) {
  const sug = suggestions();
  el.innerHTML = `
    <div class="space-y-6 animate-pop">
      <section class="bg-gradient-to-br from-delftBlue to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 space-y-4">
        <div class="inline-flex items-center gap-2 bg-orange-500/20 text-orange-200 px-3 py-1 rounded-full text-xs font-black">🎯 Objectif : examen de base à l’étranger (A1)</div>
        <h1 class="text-2xl sm:text-4xl font-black leading-tight">Préparez l’examen d’intégration A1</h1>
        <p class="text-sm text-slate-300 max-w-2xl">L’examen se passe sur ordinateur, à l’ambassade ou au consulat. Il comporte trois parties : la connaissance de la société néerlandaise (KNS), la lecture et l’expression orale ; il faut réussir les trois. Toutes les explications sont en français ; tout ce que vous pratiquez est en néerlandais, comme à l’examen.</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <a href="#/kns" class="bg-white/10 rounded-2xl p-3 border border-white/10 touch-active"><div class="font-black">🏛️ Société (KNS)</div><div class="text-xs text-slate-300">Manuel + ${KNS_QUESTIONS.length} questions</div></a>
          <a href="#/lecture" class="bg-white/10 rounded-2xl p-3 border border-white/10 touch-active"><div class="font-black">📄 Lecture</div><div class="text-xs text-slate-300">Mots et textes du quotidien</div></a>
          <a href="#/parler" class="bg-white/10 rounded-2xl p-3 border border-white/10 touch-active"><div class="font-black">🗣️ Parler</div><div class="text-xs text-slate-300">Répondre et compléter des phrases</div></a>
        </div>
      </section>

      ${reportBanner()}
      ${planCard()}

      <section class="space-y-3">
        <h2 class="text-lg font-black text-delftBlue dark:text-white">Autres idées pour aujourd’hui</h2>
        ${sug.length ? `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">${sug.map((s, i) => `
          <a href="${s.href}" class="${CARD} p-4 flex items-center gap-3 touch-active ${i === 0 ? 'ring-2 ring-dutchOrange' : ''}">
            <span class="text-2xl" aria-hidden="true">${s.icon}</span>
            <span class="flex-1 min-w-0"><span class="block font-black text-slate-900 dark:text-white">${esc(s.title)}</span><span class="block text-xs text-slate-500 dark:text-slate-400">${esc(s.sub)}</span></span>
            <i class="fa-solid fa-chevron-right text-dutchOrange" aria-hidden="true"></i>
          </a>`).join('')}</div>` : `<div class="${CARD} p-5 text-sm dark:text-white">Tout est à jour. Tentez un examen blanc !</div>`}
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-black text-delftBlue dark:text-white">Modules</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          ${moduleCard('#/manuel', '📖', 'Manuel de la société (en français)', idsOf('manuel'), 'bg-orange-100 dark:bg-orange-950/50')}
          ${moduleCard('#/kns', '🏛️', `Société : ${KNS_QUESTIONS.length} questions`, idsOf('kns'), 'bg-orange-100 dark:bg-orange-950/50')}
          ${moduleCard('#/parler', '🗣️', 'Parler', idsOf('speak'), 'bg-blue-100 dark:bg-blue-950/50')}
          ${moduleCard('#/mots', '🎴', 'Mots (cartes)', idsOf('vocab'), 'bg-emerald-100 dark:bg-emerald-950/50')}
          ${moduleCard('#/grammaire', '✍️', 'Phrases & grammaire', [...idsOf('puzzle'), ...idsOf('grammar')], 'bg-purple-100 dark:bg-purple-950/50')}
          ${moduleCard('#/lecture', '📄', 'Lecture', idsOf('reading'), 'bg-teal-100 dark:bg-teal-950/50')}
          ${moduleCard('#/ecoute', '🎧', 'Écoute', idsOf('listening'), 'bg-blue-100 dark:bg-blue-950/50')}
        </div>
        <a href="#/examen" class="block bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-3xl shadow-lg touch-active">
          <div class="flex items-center justify-between gap-3">
            <div><div class="text-xs bg-white/20 px-2 py-0.5 rounded-full font-black w-fit mb-1">🏆 Examen blanc</div><div class="text-lg font-black">Société : 30 questions, seuil 21</div></div>
            <span class="${BTN_PRIMARY} !bg-slate-900">Commencer</span>
          </div>
        </a>
      </section>
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
}
