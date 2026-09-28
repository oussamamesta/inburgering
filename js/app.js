// Point d’entrée : navigation, bandeau de progression, voix, mode hors ligne.

import { $, $$, on, runLeave, dayKey } from './core/util.js';
import { store } from './core/store.js';
import { applyTheme } from './core/theme.js';
import { speak, unlockAudio, speechInfo } from './core/audio.js';
import { dueIds, accuracyLastDays, currentStreak } from './core/learner.js';
import { toast } from './core/ui.js';
import { render as accueil } from './views/accueil.js';
import { render as manuel } from './views/manuel.js';
import { render as kns } from './views/kns.js';
import { renderCards, renderDico } from './views/mots.js';
import { renderGrammaire, renderLecture, renderEcoute } from './views/pratique.js';
import { renderExamen, renderReviser, renderProgres } from './views/suivi.js';
import { render as reglages } from './views/reglages.js';
import { render as parler } from './views/parler.js';

const ROUTES = {
  '': accueil, manuel, kns, mots: renderCards, dico: renderDico, grammaire: renderGrammaire,
  lecture: renderLecture, ecoute: renderEcoute, examen: renderExamen, reviser: renderReviser,
  progres: renderProgres, reglages, parler,
};

// Onglet mis en évidence pour chaque page.
const NAV_OF = { dico: 'mots' };

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const name = ROUTES[parts[0] || ''] ? parts[0] || '' : '';
  runLeave();
  closeSheet();
  const view = $('#view');
  view.innerHTML = '';
  ROUTES[name](view, parts.slice(1));
  const active = NAV_OF[name] ?? name;
  $$('[data-nav]').forEach((a) => {
    const on = a.dataset.nav === active;
    a.classList.toggle('is-active', on);
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0 });
  updateHud();
}

function updateHud() {
  const due = dueIds().length;
  const today = store.data.days[dayKey()] || { n: 0 };
  const acc = accuracyLastDays(7);
  $('#hudDue').textContent = due;
  $('#hudToday').textContent = today.n;
  $('#hudAcc').textContent = acc === null ? '—' : acc + ' %';
  $('#hudStreak').textContent = currentStreak() + ' j';
  $('#hudDueTile').classList.toggle('ring-2', due > 0);
}

// ── Menu « Plus » (mobile) ──
const sheet = () => $('#moreSheet');
function openSheet() { sheet().classList.remove('opacity-0', 'pointer-events-none'); sheet().setAttribute('aria-hidden', 'false'); $('#moreSheet a')?.focus(); }
function closeSheet() { sheet().classList.add('opacity-0', 'pointer-events-none'); sheet().setAttribute('aria-hidden', 'true'); }

// ── Démarrage ──
applyTheme();
window.addEventListener('hashchange', route);
on('answered', ({ ok }) => {
  updateHud();
  const b = $('#hudBadge');
  b.textContent = ok ? '+1 ✓' : '✗';
  b.className = `absolute -top-2 right-2 font-black text-xs px-2.5 py-1 rounded-xl animate-pop ${ok ? 'bg-emerald-500' : 'bg-red-500'} text-white`;
  clearTimeout(updateHud.t);
  updateHud.t = setTimeout(() => b.classList.add('hidden'), 1000);
});

document.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
document.addEventListener('keydown', unlockAudio, { once: true });

document.addEventListener('click', (e) => {
  const sayBtn = e.target.closest('[data-say]');
  if (sayBtn) {
    e.preventDefault();
    unlockAudio();
    const played = speak(sayBtn.dataset.say, Number(sayBtn.dataset.sayRate || 1));
    if (!played) toast('La lecture audio n’est pas disponible sur ce navigateur.');
    else if (!speechInfo().voice && !store.data.seenVoiceWarning) {
      store.data.seenVoiceWarning = true;
      store.save();
      toast('Pas de voix néerlandaise sur l’appareil : voir Réglages.');
    }
    return;
  }
  if (e.target.closest('[data-open-more]')) openSheet();
  else if (e.target.closest('[data-close-more]') || e.target === sheet()) closeSheet();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

route();
setInterval(updateHud, 60000);

// Mode hors ligne : le « service worker » garde une copie de l’application.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
