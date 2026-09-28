// Registre de tout le contenu : retrouve un élément et son type à partir de son identifiant.

import { KNS_QUESTIONS, KNS_CATS } from './kns.js';
import { MANUEL } from './manuel.js';
import { VOCAB } from './vocab.js';
import { PUZZLES, GRAMMAR_Q, READING, LISTENING } from './lessons.js';
import { SPEAK_QUESTIONS, SPEAK_COMPLETE, SPEAK_REPEAT, SPEAK_ALL } from './spreken.js';

export { KNS_QUESTIONS, KNS_CATS, MANUEL, VOCAB, PUZZLES, GRAMMAR_Q, READING, LISTENING, SPEAK_QUESTIONS, SPEAK_COMPLETE, SPEAK_REPEAT };

// Mots à reconnaître (lecture, partie 1 de l’examen) : un exercice par mot du vocabulaire.
export const WORDMATCH = VOCAB.map((w) => ({ id: 'wm:' + w.nl, word: w }));
// Exercices de vocabulaire : article (noms seulement), écrire le mot (fr → nl), dictée (audio → écrit).
export const DEHET = VOCAB.filter((w) => w.art).map((w) => ({ id: 'dh:' + w.nl, word: w }));
export const TYPING = VOCAB.map((w) => ({ id: 'ty:' + w.nl, word: w }));
export const DICTEE = VOCAB.map((w) => ({ id: 'dc:' + w.nl, word: w }));

export const MANUEL_PAGES = MANUEL.flatMap((ch, ci) => ch.pages.map((p, pi) => ({ ...p, ci, pi, cat: ch.cat })));

const registry = new Map();
const add = (type, list, catOf = () => type) => list.forEach((item) => registry.set(item.id, { type, item, cat: catOf(item) }));

add('kns', KNS_QUESTIONS, (q) => q.cat);
add('manuel', MANUEL_PAGES, (p) => p.cat);
add('vocab', VOCAB, (w) => w.theme);
add('puzzle', PUZZLES, () => 'phrases');
add('grammar', GRAMMAR_Q, () => 'grammaire');
add('reading', READING, () => 'lecture');
add('listening', LISTENING, () => 'ecoute');
add('speak', SPEAK_ALL, (s) => s.kind);
add('wordmatch', WORDMATCH, () => 'mots-lecture');
add('dehet', DEHET, () => 'de-het');
add('typing', TYPING, () => 'ecrire');
add('dictee', DICTEE, () => 'dictee');

export const lookup = (id) => registry.get(id) || null;

export const TYPE_LABELS = {
  kns: 'Société (KNS)', manuel: 'Manuel', vocab: 'Mots', puzzle: 'Construire des phrases',
  grammar: 'Grammaire', reading: 'Lecture (textes)', listening: 'Écoute', speak: 'Parler', wordmatch: 'Mots (reconnaître)', dehet: 'Mots (de / het)', typing: 'Mots (écrire)', dictee: 'Mots (dictée)',
};

export const idsOf = (type) => [...registry.entries()].filter(([, v]) => v.type === type).map(([id]) => id);
