// Point d’entrée : navigation, bandeau de progression, voix, mode hors ligne.

import { $, $$, on, runLeave, dayKey } from './core/util.js';
import { store } from './core/store.js';
import { applyTheme } from './core/theme.js';
import { speak, unlockAudio, speechInfo } from './core/audio.js';
import { dueIds } from './core/learner.js';
import { toast, BTN_PRIMARY } from './core/ui.js';
import { levelInfo, streakInfo, todayXp, dailyGoal, resetCombo, setQuiet } from './core/game.js';
import { confetti, ring } from './core/fx.js';
import { playSound } from './core/audio.js';
import { applyLang, toggleLang, tr, frOn } from './core/i18n.js';
import { icon } from './core/icons.js';
import { render as accueil } from './views/accueil.js';
import { render as manuel } from './views/manuel.js';
import { render as kns } from './views/kns.js';
import { renderCards, renderDico } from './views/mots.js';
import { renderGrammaire, renderLecture, renderEcoute } from './views/pratique.js';
import { renderExamen, renderReviser, renderProgres } from './views/suivi.js';
import { render as reglages } from './views/reglages.js';
import { render as parler } from './views/parler.js';
import { session } from './core/engine.js';
import { dailyPlan } from './core/plan.js';

// Séance du jour (plan d’étude).
function planSession(el) {
  el.innerHTML = '<div></div>';
  session(el.firstElementChild, { title: 'Les van vandaag', ids: dailyPlan().sessionIds, backHash: '#/', backLabel: 'Start' });
}

const ROUTES = {
  '': accueil, manuel, kns, mots: renderCards, dico: renderDico, grammaire: renderGrammaire,
  lecture: renderLecture, ecoute: renderEcoute, examen: renderExamen, reviser: renderReviser,
  progres: renderProgres, reglages, parler, plan: planSession,
};

// Onglet mis en évidence pour chaque page.
const NAV_OF = { dico: 'mots', plan: '' };

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const name = ROUTES[parts[0] || ''] ? parts[0] || '' : '';
  runLeave();
  resetCombo();
  setQuiet(false);
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
  const st = streakInfo();
  const lv = levelInfo();
  const xp = todayXp();
  const goal = dailyGoal();
  $('#hudDue').textContent = due;
  $('#hudDueTile').classList.toggle('ring-2', due > 0);
  $('#hudStreak').textContent = st.count;
  $('#hudFlame').className = st.todayMet ? 'text-orange-400 animate-flame' : 'text-slate-500';
  $('#hudGoal').textContent = `${Math.min(xp, 9999)}/${goal}`;
  $('#hudGoalRing').innerHTML = ring((xp / goal) * 100, { size: 30, stroke: 5, color: xp >= goal ? 'text-emerald-400' : 'text-amber-400', track: 'text-slate-700', animate: false, inner: xp >= goal ? '<span class="text-[11px]">✓</span>' : '' });
  $('#hudLevel').textContent = `Niv. ${lv.level}`;
  $('#hudTier').textContent = lv.tier.nl;
  $('#hudLevelIcon').textContent = lv.tier.icon;
}

// Carte de célébration (niveau, objectif du jour) : ne bloque pas, se ferme seule.
function celebrateCard(icon, title, sub) {
  document.getElementById('celebration')?.remove();
  const wrap = document.createElement('div');
  wrap.id = 'celebration';
  wrap.className = 'fixed inset-x-0 bottom-24 lg:bottom-8 z-[66] flex justify-center px-4 pointer-events-none';
  wrap.setAttribute('role', 'status');
  wrap.innerHTML = `<div class="pointer-events-auto w-full max-w-sm bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 rounded-3xl shadow-2xl p-5 text-center space-y-2 animate-combo">
    <div class="text-5xl" aria-hidden="true">${icon}</div>
    <p class="text-lg font-black text-slate-900 dark:text-white">${title}</p>
    <p class="text-sm text-slate-600 dark:text-slate-300">${sub}</p>
    <button type="button" class="${BTN_PRIMARY} w-full">Super!</button>
  </div>`;
  document.body.appendChild(wrap);
  const close = () => wrap.remove();
  wrap.querySelector('button').addEventListener('click', close);
  setTimeout(close, 6000);
  confetti();
  playSound('levelup');
}

// ── Menu « Plus » (mobile) ──
const sheet = () => $('#moreSheet');
function openSheet() { sheet().classList.remove('opacity-0', 'pointer-events-none'); sheet().setAttribute('aria-hidden', 'false'); $('#moreSheet a')?.focus(); }
function closeSheet() { sheet().classList.add('opacity-0', 'pointer-events-none'); sheet().setAttribute('aria-hidden', 'true'); }

// ── Démarrage ──
applyTheme();
applyLang();
// Icônes SVG déclarées dans index.html (data-icon).
document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, el.dataset.iconCls || 'w-6 h-6'); });
// Le bouton FR agit sur place (sans recharger la page, pour ne pas perdre un exercice en cours).
document.getElementById('frToggle')?.addEventListener('click', () => {
  toggleLang();
  const on = frOn();
  document.querySelectorAll('[data-fr]').forEach((el) => el.classList.toggle('hidden', !on));
  document.querySelectorAll('[data-toggle-fr] span').forEach((el) => { el.textContent = on ? 'Vertaling verbergen' : 'Vertaling tonen'; });
  document.querySelectorAll('details[data-fr-details]').forEach((d) => { d.open = on; });
  toast(on ? 'Vertaling aan · Français affiché' : 'Vertaling uit');
});
window.addEventListener('hashchange', route);
on('xp', ({ gain }) => {
  updateHud();
  const b = $('#hudBadge');
  b.textContent = `+${gain} XP`;
  b.className = `absolute -top-2 right-2 font-black text-xs px-2.5 py-1 rounded-xl animate-pop ${gain > 2 ? 'bg-emerald-500' : 'bg-slate-600'} text-white`;
  clearTimeout(updateHud.t);
  updateHud.t = setTimeout(() => b.classList.add('hidden'), 1000);
});
on('levelup', (lv) => celebrateCard(lv.tier.icon, `Niveau ${lv.level}!`, tr(`Je bent nu <b>${lv.tier.nl}</b>. Ga zo door!`, `Vous êtes « ${lv.tier.nl} » (${lv.tier.fr}). Continuez comme ça !`)));
on('goal', ({ streak }) => celebrateCard('🔥', 'Doel gehaald!', tr(`<b>${streak} ${streak > 1 ? 'dagen' : 'dag'}</b> op rij. Tot morgen!`, 'Objectif du jour atteint. Revenez demain pour prolonger la série.')));

document.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
document.addEventListener('keydown', unlockAudio, { once: true });

document.addEventListener('click', (e) => {
  const sayBtn = e.target.closest('[data-say]');
  if (sayBtn) {
    e.preventDefault();
    unlockAudio();
    const played = speak(sayBtn.dataset.say, Number(sayBtn.dataset.sayRate || 1));
    if (!played) toast('Geluid werkt niet in deze browser. (Audio indisponible)');
    else if (!speechInfo().voice && !store.data.seenVoiceWarning) {
      store.data.seenVoiceWarning = true;
      store.save();
      toast('Geen Nederlandse stem gevonden: zie Instellingen.');
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
