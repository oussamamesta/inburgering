// Réglages : thème, voix, traductions, sons, sauvegarde des progrès.

import { dayKey } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, pageTitle, pageHero, toast, ask } from '../core/ui.js';
import { store } from '../core/store.js';
import { speak, speechInfo, dutchVoices, isEnhanced } from '../core/audio.js';
import { esc, onLeave } from '../core/util.js';
import { applyTheme } from '../core/theme.js';
import { GOALS } from '../core/game.js';
import { tr, tri, applyLang } from '../core/i18n.js';
import { icon } from '../core/icons.js';

const seg = (name, value, options) => `
  <div class="grid grid-cols-${options.length} gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-2xl" role="radiogroup">
    ${options.map(([v, label]) => `<button type="button" role="radio" aria-checked="${v === value}" data-${name}="${v}" class="py-2 rounded-xl text-xs font-black ${v === value ? 'bg-white dark:bg-slate-900 text-dutchOrange shadow-sm' : 'text-slate-600 dark:text-slate-300'}">${label}</button>`).join('')}
  </div>`;

const toggle = (name, on, label, sub) => `
  <label class="flex items-center justify-between gap-4 cursor-pointer">
    <span><span class="block font-bold text-sm dark:text-white">${label}</span><span class="block text-xs text-slate-500 dark:text-slate-400">${sub}</span></span>
    <input type="checkbox" data-${name} ${on ? 'checked' : ''} class="w-6 h-6 accent-orange-600 shrink-0">
  </label>`;

function voiceList(s) {
  const list = dutchVoices();
  if (!list.length) {
    return `<div class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border border-amber-200 dark:border-amber-800 rounded-2xl p-3"><p class="font-bold">Geen Nederlandse stem gevonden.</p><p lang="fr">Aucune voix néerlandaise sur cet appareil : suivez les étapes ci-dessous pour en installer une.</p></div>`;
  }
  const current = list.find((v) => v.voiceURI === s.voiceURI) || list[0];
  return `<div class="space-y-1.5" role="radiogroup" aria-label="Stem kiezen">
    <p class="text-xs font-bold text-slate-500 dark:text-slate-400">Stemmen (${list.length}, de meest natuurlijke eerst)</p>
    ${list.slice(0, 8).map((v) => { const on = v === current; return `
      <div class="flex items-center gap-2 p-2 rounded-2xl border ${on ? 'border-dutchOrange bg-orange-50 dark:bg-orange-950/30' : 'border-slate-200 dark:border-slate-700'}">
        <button type="button" role="radio" aria-checked="${on}" data-voice="${esc(v.voiceURI)}" class="flex-1 text-left min-w-0">
          <span class="block text-sm font-bold truncate dark:text-white">${on ? '● ' : ''}${esc(v.name)}</span>
          <span class="block text-xs text-slate-500 dark:text-slate-400">${esc(v.lang)}${isEnhanced(v) ? ' · <b class="text-emerald-700 dark:text-emerald-400">natuurlijk</b>' : ''}</span>
        </button>
        <button type="button" data-try="${esc(v.voiceURI)}" class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center" aria-label="Luister naar ${esc(v.name)}"><i class="fa-solid fa-play" aria-hidden="true"></i></button>
      </div>`; }).join('')}
  </div>`;
}

export function render(el) {
  const s = store.data.settings;
  const sp = speechInfo();
  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageHero('progres', 'Instellingen', '', [], 'Réglages')}
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Datum van mijn examen', 'date de mon examen')}</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">${tri('Voor de les van vandaag en het aftellen.', 'sert au plan du jour et au compte à rebours')}</p>
        <div class="flex flex-wrap gap-2 items-center">
          <label for="examDateSet" class="sr-only">Examendatum</label>
          <input id="examDateSet" type="date" data-examdate value="${s.examDate || ''}" class="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-bold">
          ${s.examDate ? `<button type="button" data-cleardate class="${BTN_SECONDARY}">Wissen</button>` : ''}
        </div>
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white flex items-center gap-2">${icon('target', 'w-5 h-5 text-dutchOrange')} ${tri('Doel per dag', 'objectif du jour')}</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">${tri('Goed antwoord: 10 XP (15 in een reeks). Doel gehaald? Dan groeit je reeks. Eén rustdag per week mag.', 'Une bonne réponse = 10 XP (15 pendant un combo). Chaque jour où l’objectif est atteint prolonge la série ; un jour de repos par semaine ne la casse pas.')}</p>
        <div class="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Doel per dag">
          ${GOALS.map((g) => { const on = (s.dailyGoal || 100) === g.xp; return `<button type="button" role="radio" aria-checked="${on}" data-goal="${g.xp}" class="p-3 rounded-2xl border-2 text-center ${on ? 'border-dutchOrange bg-orange-50 dark:bg-orange-950/40' : 'border-slate-200 dark:border-slate-700'}">
            <span class="block font-black text-sm dark:text-white">${g.label}</span><span class="fr text-[11px] text-slate-500" lang="fr">${g.fr}</span><span class="block text-xs font-bold text-dutchOrange">${g.xp} XP</span><span class="block text-[11px] text-slate-500 dark:text-slate-400">${g.sub}</span></button>`; }).join('')}
        </div>
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Weergave', 'affichage')}</h2>
        ${seg('theme', s.theme, [['system', 'Automatisch'], ['light', 'Licht'], ['dark', 'Donker']])}
        ${toggle('showfr', s.showFr, 'Franse vertaling tonen · traduction française', 'Même réglage que le bouton 🇫🇷 FR en haut. Désactivé : tout est en néerlandais ; touchez « Vertaling tonen » pour une question.')}
        ${toggle('sound', s.sound, 'Geluid bij antwoorden', tri('Een kort geluidje bij goed of fout.', 'petit son pour bonne / mauvaise réponse'))}
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Nederlandse stem', 'voix néerlandaise')}</h2>
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">${tri('Snelheid', 'vitesse')}</p>
        ${seg('rate', String(s.rate), [['0.75', 'Langzaam'], ['0.9', 'Normaal'], ['1.05', 'Snel']])}
        <button type="button" data-test class="${BTN_SECONDARY}"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Test: „Goedemorgen, hoe gaat het?”</button>
        ${voiceList(s)}
        <details class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3" ${sp.enhanced ? '' : 'open'}>
          <summary class="font-bold cursor-pointer">Klinkt de stem als een robot? <span lang="fr" class="font-medium">· installer une voix naturelle (gratuit)</span></summary>
          <div class="space-y-1.5 pt-2" lang="fr">
            <p><b>iPhone / iPad :</b> Réglages › Accessibilité › Contenu énoncé › Voix › Néerlandais. Téléchargez une voix marquée « améliorée » (par ex. Xander ou Claire), puis rouvrez l’application et choisissez-la ci-dessus.</p>
            <p><b>Android :</b> Paramètres › Synthèse vocale › Moteur Google › Installer les données vocales › Néerlandais, et choisissez une voix. Dans Chrome, la voix « Google Nederlands » est souvent la plus naturelle.</p>
            <p><b>Ordinateur :</b> dans Microsoft Edge, les voix « Online (Natural) » (Fenna, Maarten, Colette) sont très naturelles ; dans Chrome, choisissez « Google Nederlands ».</p>
            <p>Une vitesse « Normaal » ou « Snel » sonne souvent plus naturelle que « Langzaam ».</p>
          </div>
        </details>
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">${tri('Voortgang bewaren', 'sauvegarde des progrès')}</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400" lang="fr">Vos progrès sont enregistrés dans ce navigateur, sur cet appareil. Exportez-les pour les garder ou les transférer sur un autre téléphone.</p>
        <div class="flex flex-wrap gap-2">
          <button type="button" data-export class="${BTN_PRIMARY}"><i class="fa-solid fa-download" aria-hidden="true"></i> Exporteren · exporter</button>
          <label class="${BTN_SECONDARY} cursor-pointer"><i class="fa-solid fa-upload" aria-hidden="true"></i> Importeren · importer<input type="file" accept="application/json,.json" data-import class="sr-only"></label>
        </div>
        <details class="text-sm">
          <summary class="font-bold text-slate-700 dark:text-slate-200 cursor-pointer py-1">Kopiëren / plakken <span lang="fr" class="font-medium text-xs">· sans fichier</span></summary>
          <div class="space-y-2 pt-2">
            <p class="text-xs text-slate-500 dark:text-slate-400" lang="fr">Copiez le texte de sauvegarde (par exemple dans une note), puis collez-le ici sur l’autre appareil.</p>
            <button type="button" data-copy class="${BTN_SECONDARY}"><i class="fa-solid fa-copy" aria-hidden="true"></i> Kopieer · copier</button>
            <label for="pasteBackup" class="sr-only">Plak een back-up</label>
            <textarea id="pasteBackup" data-paste rows="3" placeholder="Plak hier… / collez ici…" class="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-xs font-mono dark:text-white"></textarea>
            <button type="button" data-restore class="${BTN_SECONDARY}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Terugzetten · restaurer</button>
          </div>
        </details>
        <button type="button" data-reset class="text-sm font-bold text-red-600 dark:text-red-400 py-2"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> Alles wissen · tout effacer…</button>
      </section>
      <p class="text-center text-xs text-slate-400">${tri('Inhoud gecontroleerd in september 2026. Bij twijfel: kijk op DUO, IND of Rijksoverheid.', 'en cas de doute, les sites officiels font foi')}</p>
    </div>`;

  // Redessine seulement si l’on est toujours sur les Réglages (sinon on écraserait la page suivante).
  const timers = [];
  onLeave(() => timers.forEach(clearTimeout));
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const redraw = () => { if (location.hash.startsWith('#/reglages')) render(el); };
  el.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => { s.theme = b.dataset.theme; store.save(); applyTheme(); redraw(); }));
  el.querySelectorAll('[data-rate]').forEach((b) => b.addEventListener('click', () => { s.rate = Number(b.dataset.rate); store.save(); speak('Dit is de nieuwe snelheid.'); redraw(); }));
  el.querySelectorAll('[data-goal]').forEach((b) => b.addEventListener('click', () => { s.dailyGoal = Number(b.dataset.goal); store.save(); toast(`Doel: ${s.dailyGoal} XP per dag.`); redraw(); }));
  el.querySelector('[data-examdate]').addEventListener('change', (e) => { s.examDate = e.target.value || null; store.save(); toast(s.examDate ? 'Examendatum opgeslagen.' : 'Datum gewist.'); redraw(); });
  el.querySelector('[data-cleardate]')?.addEventListener('click', () => { s.examDate = null; store.save(); redraw(); });
  el.querySelector('[data-showfr]').addEventListener('change', (e) => { s.showFr = e.target.checked; store.save(); applyLang(); });
  el.querySelector('[data-sound]').addEventListener('change', (e) => { s.sound = e.target.checked; store.save(); });
  el.querySelector('[data-test]').addEventListener('click', () => { speak('Goedemorgen, hoe gaat het?'); later(redraw, 800); });
  el.querySelectorAll('[data-voice]').forEach((b) => b.addEventListener('click', () => { s.voiceURI = b.dataset.voice; store.save(); speak('Hallo, ik ben uw nieuwe stem.'); redraw(); }));
  el.querySelectorAll('[data-try]').forEach((b) => b.addEventListener('click', () => speak('Goedemorgen. Ik woon in Amsterdam.', 1, b.dataset.try)));
  // Sur certains téléphones, la liste des voix arrive un peu après l’ouverture de la page.
  if (!dutchVoices().length && !el.dataset.retried) { el.dataset.retried = '1'; later(redraw, 1200); }

  el.querySelector('[data-export]').addEventListener('click', () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `inburgering-progres-${dayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    toast('Back-up gemaakt · fichier créé.');
  });
  el.querySelector('[data-import]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    e.target.value = '';
    restore(text);
  });
  const restore = async (text) => {
    if (!text.trim()) { toast('Plak eerst een back-up · collez d’abord une sauvegarde.'); return; }
    if (!(await ask('Je voortgang vervangen door deze back-up?', 'Vervangen', false, 'Remplacer vos progrès actuels par cette sauvegarde ?'))) return;
    try {
      store.importJSON(text);
      applyTheme();
      toast('Voortgang teruggezet.');
      redraw();
    } catch {
      toast('Geen geldige back-up · sauvegarde non valide.');
    }
  };
  el.querySelector('[data-restore]').addEventListener('click', () => restore(el.querySelector('[data-paste]').value));
  el.querySelector('[data-copy]').addEventListener('click', async () => {
    const text = store.exportJSON();
    try {
      await navigator.clipboard.writeText(text);
      toast('Gekopieerd.');
    } catch {
      const ta = el.querySelector('[data-paste]');
      ta.value = text;
      ta.focus();
      ta.select();
      toast('Tekst geselecteerd: kopieer hem · copiez-le.');
    }
  });
  el.querySelector('[data-reset]').addEventListener('click', async () => {
    if (!(await ask('Alle voortgang definitief wissen?', 'Alles wissen', true, 'Effacer définitivement tous vos progrès ? Conseil : exportez-les d’abord.'))) return;
    store.reset();
    applyTheme();
    toast('Alles gewist.');
    location.hash = '#/';
  });
}
