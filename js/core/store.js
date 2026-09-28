// Sauvegarde locale (localStorage) + export / import des progrès.
// Les données restent sur l’appareil ; l’export permet de les transférer.

import { emit } from './util.js';

const KEY = 'inburgering_a1_v1';

const defaults = () => ({
  version: 1,
  createdAt: Date.now(),
  settings: { theme: 'system', rate: 0.9, showFr: false, sound: true, voiceURI: null },
  items: {},        // progrès par élément (voir learner.js)
  days: {},         // activité par jour : { 'AAAA-MM-JJ': { n, c } }
  studyStreak: { last: null, count: 0 },
  exams: [],        // historique des examens blancs
  ui: { manuelCh: 0, manuelPg: 0, flashSet: 0, flashIdx: 0 },
  seenVoiceWarning: false,
});

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    return merge(defaults(), JSON.parse(raw));
  } catch {
    return defaults();
  }
}

function merge(base, saved) {
  const out = { ...base, ...saved };
  out.settings = { ...base.settings, ...(saved.settings || {}) };
  out.ui = { ...base.ui, ...(saved.ui || {}) };
  out.studyStreak = { ...base.studyStreak, ...(saved.studyStreak || {}) };
  return out;
}

export const store = {
  data: load(),
  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.data)); } catch { /* stockage indisponible : on continue en mémoire */ }
    emit('change');
  },
  exportJSON() {
    return JSON.stringify({ app: 'inburgering-a1', exportedAt: new Date().toISOString(), data: this.data }, null, 2);
  },
  importJSON(text) {
    const parsed = JSON.parse(text);
    const data = parsed && parsed.app === 'inburgering-a1' ? parsed.data : null;
    if (!data || typeof data.items !== 'object') throw new Error('Fichier non reconnu');
    this.data = merge(defaults(), data);
    this.save();
  },
  reset() {
    this.data = defaults();
    this.save();
  },
};
