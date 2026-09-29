// Motivation : points (XP), niveaux, objectif du jour, série de jours et combos.
//
// XP : +10 par bonne réponse, +2 par réponse fausse (l’effort compte), +5 de bonus à partir de 3 bonnes réponses d’affilée.
// Objectif du jour : 50, 100 ou 200 XP. Un jour « compte » dans la série quand l’objectif est atteint.
// Jour de repos : un jour manqué par semaine ne casse pas la série.

import { store } from './store.js';
import { dayKey, on, emit } from './util.js';
import { setPitchStep } from './audio.js';

export const XP_OK = 10;
export const XP_TRY = 2;
export const XP_COMBO = 5;

export const GOALS = [
  { xp: 50, label: 'Détendu', sub: '≈ 5 min par jour' },
  { xp: 100, label: 'Normal', sub: '≈ 10 min par jour' },
  { xp: 200, label: 'Intensif', sub: '≈ 20 min par jour' },
];

// Titres de niveau : un mot néerlandais, avec sa traduction.
const TIERS = [
  { from: 1, nl: 'Starter', fr: 'débutant', icon: '🌱' },
  { from: 4, nl: 'Fietser', fr: 'cycliste', icon: '🚲' },
  { from: 8, nl: 'Buurman', fr: 'voisin', icon: '🏡' },
  { from: 13, nl: 'Stroopwafel', fr: 'gaufre au sirop', icon: '🧇' },
  { from: 19, nl: 'Inburgeraar', fr: 'nouvel arrivant intégré', icon: '🎓' },
];

// XP nécessaire pour passer du niveau L au niveau L+1.
const stepFor = (level) => 100 + 50 * (level - 1);

export function levelInfo(xp = game().xp) {
  let level = 1;
  let floor = 0;
  while (xp >= floor + stepFor(level)) { floor += stepFor(level); level += 1; }
  const need = stepFor(level);
  const tier = [...TIERS].reverse().find((t) => level >= t.from);
  return { level, xpInLevel: xp - floor, need, pct: Math.round(((xp - floor) / need) * 100), tier, total: xp };
}

// ── État ──
function game() {
  const d = store.data;
  if (!d.game) {
    // Première utilisation : on crédite l’historique existant.
    let xp = 0;
    const goal = d.settings.dailyGoal || 100;
    for (const day of Object.values(d.days)) {
      day.xp = day.xp ?? (day.c * XP_OK + (day.n - day.c) * XP_TRY);
      if (day.xp >= goal) day.met = true;
      xp += day.xp;
    }
    d.game = { xp, bestCombo: 0 };
    store.save();
  }
  return d.game;
}

export const dailyGoal = () => store.data.settings.dailyGoal || 100;
export const todayXp = () => (store.data.days[dayKey()]?.xp) || 0;
export const totalXp = () => game().xp;

// ── Combo (réinitialisé à chaque changement de page) ──
let combo = 0;
let last = { gain: 0, combo: 0 };
export const currentCombo = () => combo;
export const lastGain = () => last;
export function resetCombo() { combo = 0; setPitchStep(0); }

// ── Mode discret pendant les examens blancs : les célébrations attendent la fin ──
let quiet = false;
const pending = [];
export function setQuiet(v) {
  quiet = v;
  if (!v) while (pending.length) { const [evt, data] = pending.shift(); emit(evt, data); }
}
const celebrate = (evt, data) => (quiet ? pending.push([evt, data]) : emit(evt, data));

// ── Attribution des points à chaque réponse ──
on('answered', ({ ok }) => {
  const g = game();
  const before = levelInfo(g.xp).level;
  combo = ok ? combo + 1 : 0;
  setPitchStep(Math.min(combo, 8));
  const gain = ok ? XP_OK + (combo >= 3 ? XP_COMBO : 0) : XP_TRY;
  g.xp += gain;
  if (combo > (g.bestCombo || 0)) g.bestCombo = combo;

  const day = store.data.days[dayKey()];
  if (day) {
    const wasMet = !!day.met;
    day.xp = (day.xp || 0) + gain;
    if (!wasMet && day.xp >= dailyGoal()) {
      day.met = true;
      celebrate('goal', { streak: streakInfo().count });
    }
  }
  store.save();
  last = { gain, combo };
  const after = levelInfo(g.xp).level;
  if (after > before) celebrate('levelup', levelInfo(g.xp));
  emit('xp', last);
});

// ── Série de jours avec un jour de repos par semaine ──
function weekOf(d) {
  const m = new Date(d);
  m.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(m);
}

export function streakInfo() {
  const days = store.data.days;
  const today = new Date();
  const todayMet = !!days[dayKey(today)]?.met;
  let count = todayMet ? 1 : 0;
  const restWeeks = new Set(); // jours de repos confirmés (suivis, plus tôt, d’un jour réussi)
  let tentative = null; // jour manqué couvert par un repos, en attente de confirmation
  for (let i = 1; i < 500; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (days[dayKey(d)]?.met) {
      if (tentative) { restWeeks.add(tentative); tentative = null; }
      count += 1;
      continue;
    }
    const wk = weekOf(d);
    if (!tentative && !restWeeks.has(wk)) { tentative = wk; continue; } // jour de repos possible
    break;
  }
  return { count, todayMet, restUsedThisWeek: restWeeks.has(weekOf(today)) };
}
