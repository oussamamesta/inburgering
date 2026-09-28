// Plan d’étude : date d’examen, niveau de préparation par partie, et séance du jour.
//
// Principe : tout le contenu nouveau est réparti sur les jours qui restent avant l’examen,
// en gardant la dernière semaine pour les révisions et les examens blancs.

import { store } from './store.js';
import { get, summary, dueIds } from './learner.js';
import { dayKey } from './util.js';
import { idsOf, READING, KNS_CATS } from '../content/index.js';
import { VOCAB } from '../content/vocab.js';

export const PARTS = {
  kns: { label: 'Société (KNS)', icon: '🏛️', href: '#/kns', exam: 'kns', examHref: '#/examen', ids: () => [...idsOf('kns'), ...idsOf('manuel')] },
  lecture: { label: 'Lecture', icon: '📄', href: '#/lecture', exam: 'lecture', examHref: '#/lecture/examen', ids: () => idsOf('reading') },
  parler: { label: 'Parler', icon: '🗣️', href: '#/parler', exam: 'parler', examHref: '#/parler/examen', ids: () => idsOf('speak').filter((id) => !id.startsWith('sp-n')) },
};

export function daysUntilExam() {
  const d = store.data.settings.examDate;
  if (!d) return null;
  const exam = new Date(`${d}T00:00:00`);
  const today = new Date(`${dayKey()}T00:00:00`);
  return Math.round((exam - today) / 86400000);
}

// Préparation (0–100) : maîtrise 40 %, couverture 20 %, résultats des examens blancs 40 %
// (sans examen blanc, on utilise la précision au premier essai sur ce qui a été vu).
export function readiness(key) {
  const p = PARTS[key];
  const s = summary(p.ids());
  const mastery = s.total ? s.mastered / s.total : 0;
  const coverage = s.total ? s.seen / s.total : 0;
  const exams = store.data.exams.filter((e) => (e.kind || 'kns') === p.exam).slice(-2);
  const examScore = exams.length ? exams.reduce((a, e) => a + e.good / e.total, 0) / exams.length : null;
  const firstTry = s.seen ? s.firstOk / s.seen : 0;
  const score = Math.round(100 * (0.4 * mastery + 0.2 * coverage + 0.4 * (examScore ?? firstTry * coverage)));
  const level = score >= 75 ? 'Prêt' : score >= 45 ? 'En bonne voie' : 'À travailler';
  return { score, level, mastery, coverage, examScore, exams: exams.length };
}

const unseen = (ids) => ids.filter((id) => !get(id));

export function dailyPlan() {
  const days = daysUntilExam();
  const finalWeek = days !== null && days <= 7;
  const studyDays = days === null ? 42 : Math.max(1, days - 7);
  const quota = (list, min) => (list.length ? Math.min(list.length, Math.max(min, Math.ceil(list.length / studyDays))) : 0);

  const manuel = unseen(idsOf('manuel'));
  const kns = unseen(idsOf('kns'));
  const vocab = unseen(VOCAB.map((w) => w.id));
  const texts = [...new Set(READING.filter((r) => !get(r.id)).map((r) => r.textId))];
  const speak = unseen(PARTS.parler.ids());
  const due = dueIds();

  const plan = {
    days, finalWeek, studyDays,
    due: Math.min(due.length, 20),
    manuel: finalWeek ? 0 : quota(manuel, 1),
    kns: finalWeek ? 0 : quota(kns, 3),
    vocab: finalWeek ? 0 : quota(vocab, 5),
    texts: finalWeek ? 0 : quota(texts, 1),
    speak: finalWeek ? 0 : quota(speak, 2),
  };

  // Dernière semaine : un examen blanc par jour, en alternant les trois parties.
  if (finalWeek) {
    const order = ['kns', 'lecture', 'parler'];
    plan.mock = order[(days ?? 0) % 3];
  }

  plan.nextManuel = manuel.length ? manuel[0] : null;
  plan.sessionIds = [
    ...due.slice(0, plan.due),
    ...vocab.slice(0, plan.vocab),
    ...kns.slice(0, plan.kns),
    ...texts.slice(0, plan.texts).flatMap((t) => READING.filter((r) => r.textId === t).map((r) => r.id)),
    ...speak.slice(0, plan.speak),
  ];
  plan.size = plan.sessionIds.length;
  plan.doneToday = (store.data.days[dayKey()] || { n: 0 }).n;
  return plan;
}

// ── Bilan de la semaine ──
export function weekKey(d = new Date()) {
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(monday);
}

const CAT_LABELS = {
  vraag: 'Parler : questions', afmaken: 'Parler : phrases à compléter', nazeggen: 'Parler : répéter', lecture: 'Lecture', ecoute: 'Écoute',
  grammaire: 'Grammaire', phrases: 'Construire des phrases', 'de-het': 'Mots : de / het', ecrire: 'Mots : écrire', dictee: 'Mots : dictée', 'mots-lecture': 'Mots : reconnaître',
};
const CAT_LINKS = {
  vraag: '#/parler/questions', afmaken: '#/parler/completer', nazeggen: '#/parler/repeter', lecture: '#/lecture', ecoute: '#/ecoute',
  grammaire: '#/grammaire/questions', phrases: '#/grammaire/phrases', 'de-het': '#/mots/dehet', ecrire: '#/mots/ecrire', dictee: '#/mots/dictee', 'mots-lecture': '#/lecture/mots',
};
export const catLabel = (cat) => KNS_CATS[cat] ? `Société : ${KNS_CATS[cat].label}` : CAT_LABELS[cat] || `Mots : ${cat}`;
export const catLink = (cat) => KNS_CATS[cat] ? `#/kns/${cat}` : CAT_LINKS[cat] || '#/mots';
