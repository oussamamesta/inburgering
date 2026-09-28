// Modèle de l’apprenant : suivi de chaque question / mot + répétition espacée (boîtes de Leitner).
//
// Pour chaque élément on garde : nombre d’essais, réussites, 1re réponse, boîte, prochaine révision.
// Bonne réponse au moment prévu → boîte suivante (intervalle plus long).
// Erreur → retour en boîte 0 et nouvelle révision dans 10 minutes.
// Répondre juste avant la date prévue ne fait pas monter de boîte (pas de « triche » en répétant).

import { store } from './store.js';
import { dayKey, emit } from './util.js';

const DAY = 86400000;
export const INTERVALS = [0, 1, 2, 4, 8, 16, 32]; // en jours, par boîte
export const MASTERED_BOX = 3; // 3 bonnes réponses espacées = maîtrisé

const items = () => store.data.items;

export function get(id) {
  return items()[id] || null;
}

export function record(id, ok, meta = {}) {
  const now = Date.now();
  const all = items();
  const it = all[id] || (all[id] = { n: 0, c: 0, box: 0, due: 0, last: 0, first: null });
  if (meta.type) it.type = meta.type;
  if (meta.cat) it.cat = meta.cat;

  const onTime = it.n === 0 || now >= it.due;
  it.n += 1;
  if (ok) it.c += 1;
  if (it.first === null) it.first = ok;

  if (!ok) {
    it.box = 0;
    it.due = now + 10 * 60 * 1000;
  } else if (onTime) {
    it.box = Math.min(it.box + 1, INTERVALS.length - 1);
    it.due = now + INTERVALS[it.box] * DAY;
  }
  it.last = now;
  it.lastOk = ok;

  // Activité du jour + série de jours d’étude.
  const k = dayKey();
  const d = store.data.days[k] || (store.data.days[k] = { n: 0, c: 0 });
  d.n += 1;
  if (ok) d.c += 1;
  bumpStreak(k);

  store.save();
  emit('answered', { id, ok });
  return it;
}

function bumpStreak(today) {
  const s = store.data.studyStreak;
  if (s.last === today) return;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  s.count = s.last === dayKey(y) ? s.count + 1 : 1;
  s.last = today;
}

export function isDue(id, now = Date.now()) {
  const it = get(id);
  return !!it && it.due <= now;
}

export function dueIds(now = Date.now()) {
  return Object.entries(items())
    .filter(([, it]) => it.due <= now)
    .sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due)
    .map(([id]) => id);
}

export const isMastered = (id) => (get(id)?.box ?? 0) >= MASTERED_BOX;

// Résumé pour une liste d’identifiants : vus, maîtrisés, précision à la 1re réponse.
export function summary(ids) {
  let seen = 0, mastered = 0, firstOk = 0, n = 0, c = 0;
  for (const id of ids) {
    const it = get(id);
    if (!it) continue;
    seen += 1;
    if (it.box >= MASTERED_BOX) mastered += 1;
    if (it.first) firstOk += 1;
    n += it.n;
    c += it.c;
  }
  return { total: ids.length, seen, mastered, firstOk, n, c, accuracy: n ? Math.round((c / n) * 100) : null };
}

// Choisit n éléments pour une séance : d’abord ceux à revoir, puis les nouveaux, puis les plus faibles.
export function pick(ids, n) {
  const now = Date.now();
  const rank = (id) => {
    const it = get(id);
    if (!it) return 1 + Math.random(); // jamais vu
    if (it.due <= now) return it.box * 0.1 + Math.random() * 0.05; // à réviser : priorité
    return 2 + it.box + Math.random(); // déjà su : en dernier
  };
  return ids.map((id) => [id, rank(id)]).sort((a, b) => a[1] - b[1]).slice(0, n).map(([id]) => id);
}

export function lastDays(count = 14) {
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = dayKey(d);
    out.push({ key: k, date: d, ...(store.data.days[k] || { n: 0, c: 0 }) });
  }
  return out;
}

export function accuracyLastDays(count = 7) {
  const days = lastDays(count);
  const n = days.reduce((s, d) => s + d.n, 0);
  const c = days.reduce((s, d) => s + d.c, 0);
  return n ? Math.round((c / n) * 100) : null;
}

export function currentStreak() {
  const s = store.data.studyStreak;
  if (!s.last) return 0;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  return s.last === dayKey() || s.last === dayKey(y) ? s.count : 0;
}

// Éléments les plus souvent ratés (pour « Mes points faibles »).
export function weakest(limit = 5, filter = () => true) {
  return Object.entries(items())
    .filter(([id, it]) => filter(id, it) && it.n - it.c > 0)
    .map(([id, it]) => ({ id, ...it, errors: it.n - it.c, rate: it.c / it.n }))
    .sort((a, b) => a.rate - b.rate || b.errors - a.errors)
    .slice(0, limit);
}
