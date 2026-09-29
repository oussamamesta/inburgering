// Registre de tout le contenu : retrouve un élément et son type à partir de son identifiant.

import { KNS_QUESTIONS, KNS_CATS } from './kns.js';
import { MANUEL } from './manuel.js';
import { MANUEL_NL } from './manuel_nl.js';
import { VOCAB } from './vocab.js';
import { PUZZLES, GRAMMAR_Q, READING, LISTENING } from './lessons.js';
import { SPEAK_QUESTIONS, SPEAK_COMPLETE, SPEAK_REPEAT, SPEAK_ALL } from './spreken.js';
import { STORIES, STORY_QUESTIONS } from './verhalen.js';

export { KNS_QUESTIONS, KNS_CATS, MANUEL, VOCAB, PUZZLES, GRAMMAR_Q, READING, LISTENING, SPEAK_QUESTIONS, SPEAK_COMPLETE, SPEAK_REPEAT, STORIES, STORY_QUESTIONS };

// Mots à reconnaître (lecture, partie 1 de l’examen) : un exercice par mot du vocabulaire.
export const WORDMATCH = VOCAB.map((w) => ({ id: 'wm:' + w.nl, word: w }));
// Exercices de vocabulaire : article (noms seulement), écrire le mot (fr → nl), dictée (audio → écrit).
export const DEHET = VOCAB.filter((w) => w.art).map((w) => ({ id: 'dh:' + w.nl, word: w }));
export const TYPING = VOCAB.map((w) => ({ id: 'ty:' + w.nl, word: w }));
export const DICTEE = VOCAB.map((w) => ({ id: 'dc:' + w.nl, word: w }));

export const MANUEL_PAGES = MANUEL.flatMap((ch, ci) => ch.pages.map((p, pi) => {
  const n = MANUEL_NL[p.id];
  // Version néerlandaise simple (titre, phrases, question) + français en traduction.
  if (n) Object.assign(p, { titleNl: n.t, lines: n.nl, qNl: n.q, optsNl: n.opts });
  return Object.assign(p, { ci, pi, cat: ch.cat });
}));

const registry = new Map();
const add = (type, list, catOf = () => type) => list.forEach((item) => registry.set(item.id, { type, item, cat: catOf(item) }));

add('kns', KNS_QUESTIONS, (q) => q.cat);
add('manuel', MANUEL_PAGES, (p) => p.cat);
add('vocab', VOCAB, (w) => w.theme);
add('puzzle', PUZZLES, () => 'phrases');
add('grammar', GRAMMAR_Q, () => 'grammaire');
add('reading', READING, () => 'lecture');
add('listening', LISTENING, () => 'ecoute');
add('story', STORY_QUESTIONS, () => 'verhaal');
add('speak', SPEAK_ALL, (s) => s.kind);
add('wordmatch', WORDMATCH, () => 'mots-lecture');
add('dehet', DEHET, () => 'de-het');
add('typing', TYPING, () => 'ecrire');
add('dictee', DICTEE, () => 'dictee');

export const lookup = (id) => registry.get(id) || null;

export const TYPE_LABELS = {
  kns: 'KNS', manuel: 'Handboek', vocab: 'Woorden', puzzle: 'Zinnen maken',
  grammar: 'Grammatica', reading: 'Lezen: teksten', listening: 'Luisteren', speak: 'Spreken', wordmatch: 'Woorden herkennen', dehet: 'De of het', typing: 'Woorden schrijven', dictee: 'Dictee', story: 'Lezen: verhalen',
};

export const idsOf = (type) => [...registry.entries()].filter(([, v]) => v.type === type).map(([id]) => id);
