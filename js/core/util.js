// Petits utilitaires partagés.

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const dayKey = (d = new Date()) => {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);

// Nettoyage quand on quitte une page (minuteurs, etc.).
let leaveFns = [];
export const onLeave = (fn) => leaveFns.push(fn);
export const runLeave = () => { leaveFns.forEach((fn) => { try { fn(); } catch { /* rien */ } }); leaveFns = []; };

// Événements simples entre modules (ex. : mettre à jour le bandeau après une réponse).
const listeners = {};
export const on = (evt, fn) => ((listeners[evt] ||= []).push(fn));
export const emit = (evt, data) => (listeners[evt] || []).forEach((fn) => fn(data));
