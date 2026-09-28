// Voix néerlandaise (synthèse vocale de l’appareil) et petits sons de retour.
//
// La qualité dépend des voix installées sur l’appareil. On choisit automatiquement la plus naturelle :
// voix « améliorées / premium / naturelles » d’abord (iPhone, Edge, Chrome), néerlandais des Pays-Bas avant
// celui de Belgique. L’utilisateur peut aussi choisir sa voix dans les Réglages.

import { store } from './store.js';

let voices = [];
let unlocked = false;
const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

const QUALITY = /(premium|enhanced|verbeterd|neural|natural|online|siri|wavenet|studio)/i;
const ROBOTIC = /(espeak|compact|eloquence|novelty|robot)/i;

export function scoreVoice(v) {
  let s = 0;
  const lang = (v.lang || '').toLowerCase().replace('_', '-');
  if (lang === 'nl-nl') s += 30; else if (lang.startsWith('nl')) s += 20; else return -1;
  if (QUALITY.test(v.name)) s += 40;
  if (/google/i.test(v.name)) s += 25; // voix réseau de Chrome, assez naturelle
  if (/microsoft/i.test(v.name) && /online/i.test(v.name)) s += 10;
  if (!v.localService) s += 5;
  if (ROBOTIC.test(v.name)) s -= 50;
  return s;
}

function refreshVoices() {
  if (!supported) return;
  voices = window.speechSynthesis.getVoices();
}

export function dutchVoices() {
  refreshVoices();
  return voices.filter((v) => scoreVoice(v) >= 0).sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

function currentVoice() {
  const list = dutchVoices();
  const chosen = store.data.settings.voiceURI;
  return list.find((v) => v.voiceURI === chosen) || list[0] || null;
}

export const isEnhanced = (v) => !!v && (QUALITY.test(v.name) || /google/i.test(v.name));

if (supported) {
  refreshVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', refreshVoices);
}

// iOS n’autorise la voix qu’après un premier geste de l’utilisateur.
export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  try {
    if (supported) {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
    ctx();
  } catch { /* rien */ }
}

export const speechInfo = () => {
  const v = currentVoice();
  return { supported, voice: v ? `${v.name} (${v.lang})` : null, enhanced: isEnhanced(v), count: dutchVoices().length };
};

// Lecture d’un texte. Les phrases sont lues séparément avec une petite pause : plus naturel sur les voix de base.
export function speak(text, rateFactor = 1, voiceURI = null, onEnd = null) {
  if (!supported || !text) { onEnd?.(); return false; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const voice = (voiceURI && dutchVoices().find((v) => v.voiceURI === voiceURI)) || currentVoice();
  const parts = String(text).match(/[^.!?]+[.!?]*/g) || [text];
  const list = parts.map((p) => p.trim()).filter(Boolean);
  list.forEach((part, i) => {
    const u = new SpeechSynthesisUtterance(part);
    if (onEnd && i === list.length - 1) { u.onend = () => onEnd(); u.onerror = () => onEnd(); }
    u.lang = voice?.lang || 'nl-NL';
    u.rate = store.data.settings.rate * rateFactor;
    u.pitch = 1;
    if (voice) u.voice = voice;
    synth.speak(u);
  });
  return true;
}

export const stopSpeaking = () => supported && window.speechSynthesis.cancel();

// ── Sons ──
let audioCtx = null;
function ctx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

export function playSound(type) {
  if (!store.data.settings.sound) return;
  try {
    const ac = ctx();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    const tones = {
      correct: ['sine', [523.25, 659.25], 0.12, 0.25],
      wrong: ['triangle', [240, 190], 0.15, 0.3],
      fanfare: ['triangle', [523.25, 659.25, 783.99], 0.15, 0.6],
    }[type];
    if (!tones) return;
    const [wave, freqs, vol, dur] = tones;
    osc.type = wave;
    freqs.forEach((f, i) => osc.frequency.setValueAtTime(f, now + i * (dur / (freqs.length + 1))));
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
    osc.start(now);
    osc.stop(now + dur);
  } catch { /* rien */ }
}
