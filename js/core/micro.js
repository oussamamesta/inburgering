// Outils pour « Parler » : enregistrer sa voix et (si le navigateur le permet) reconnaissance vocale.
// Tout est facultatif : si le micro est refusé ou absent, l’exercice fonctionne quand même (réponse à voix haute + auto-évaluation).

import { onLeave } from './util.js';

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
export const canRecognize = !!SR;
export const canRecord = typeof window !== 'undefined' && !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

let activeStream = null;
function stopStream() {
  activeStream?.getTracks().forEach((t) => t.stop());
  activeStream = null;
}

// Enregistre jusqu’à maxMs. Renvoie { stop(), done: Promise<url> }.
export async function startRecording(maxMs = 20000) {
  if (!canRecord) throw new Error('unsupported');
  stopStream();
  activeStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(activeStream);
  const chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise((resolve) => {
    rec.onstop = () => {
      stopStream();
      resolve(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' })));
    };
  });
  rec.start();
  const timer = setTimeout(() => rec.state === 'recording' && rec.stop(), maxMs);
  onLeave(() => { clearTimeout(timer); if (rec.state === 'recording') rec.stop(); stopStream(); });
  return { stop: () => { clearTimeout(timer); if (rec.state === 'recording') rec.stop(); }, done };
}

// Écoute une phrase et renvoie les transcriptions possibles (néerlandais).
export function recognize() {
  return new Promise((resolve, reject) => {
    if (!SR) { reject(new Error('unsupported')); return; }
    const r = new SR();
    r.lang = 'nl-NL';
    r.interimResults = false;
    r.maxAlternatives = 3;
    let settled = false;
    r.onresult = (e) => {
      settled = true;
      resolve([...e.results[0]].map((a) => a.transcript));
    };
    r.onerror = (e) => { if (!settled) { settled = true; reject(new Error(e.error || 'error')); } };
    r.onend = () => { if (!settled) { settled = true; resolve([]); } };
    onLeave(() => { try { r.abort(); } catch { /* rien */ } });
    r.start();
  });
}

export const normText = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’'.,!?¿¡;:]/g, ' ').replace(/\s+/g, ' ').trim();

export function micErrorText(err) {
  const m = String(err?.name || err?.message || '');
  if (/NotAllowed|Security|not-allowed|service-not-allowed/i.test(m)) return 'De microfoon is geblokkeerd. Antwoord gewoon hardop. (Micro bloqué : autorisez-le dans le navigateur, ou utilisez l’adresse GitHub Pages.)';
  if (/unsupported/i.test(m)) return 'Deze browser kan dit niet. Antwoord gewoon hardop. (Fonction non disponible.)';
  if (/no-speech/i.test(m)) return 'Ik hoor niets. Probeer het nog eens, iets harder. (Aucune voix détectée.)';
  return 'De microfoon werkt niet. Antwoord gewoon hardop. (Micro indisponible.)';
}
