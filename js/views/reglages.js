// Réglages : thème, voix, traductions, sons, sauvegarde des progrès.

import { dayKey } from '../core/util.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, pageTitle, toast, ask } from '../core/ui.js';
import { store } from '../core/store.js';
import { speak, speechInfo, dutchVoices, isEnhanced } from '../core/audio.js';
import { esc, onLeave } from '../core/util.js';
import { applyTheme } from '../core/theme.js';

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
    return `<div class="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 border border-amber-200 dark:border-amber-800 rounded-2xl p-3"><p class="font-bold">Aucune voix néerlandaise trouvée sur cet appareil.</p><p>Suivez les étapes ci-dessous pour en installer une.</p></div>`;
  }
  const current = list.find((v) => v.voiceURI === s.voiceURI) || list[0];
  return `<div class="space-y-1.5" role="radiogroup" aria-label="Choix de la voix">
    <p class="text-xs font-bold text-slate-500 dark:text-slate-400">Voix (${list.length} disponible${list.length > 1 ? 's' : ''}, la plus naturelle en premier)</p>
    ${list.slice(0, 8).map((v) => { const on = v === current; return `
      <div class="flex items-center gap-2 p-2 rounded-2xl border ${on ? 'border-dutchOrange bg-orange-50 dark:bg-orange-950/30' : 'border-slate-200 dark:border-slate-700'}">
        <button type="button" role="radio" aria-checked="${on}" data-voice="${esc(v.voiceURI)}" class="flex-1 text-left min-w-0">
          <span class="block text-sm font-bold truncate dark:text-white">${on ? '● ' : ''}${esc(v.name)}</span>
          <span class="block text-xs text-slate-500 dark:text-slate-400">${esc(v.lang)}${isEnhanced(v) ? ' · <b class="text-emerald-700 dark:text-emerald-400">naturelle</b>' : ''}</span>
        </button>
        <button type="button" data-try="${esc(v.voiceURI)}" class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center" aria-label="Écouter la voix ${esc(v.name)}"><i class="fa-solid fa-play" aria-hidden="true"></i></button>
      </div>`; }).join('')}
  </div>`;
}

export function render(el) {
  const s = store.data.settings;
  const sp = speechInfo();
  el.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4 animate-pop">
      ${pageTitle('Réglages')}
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Date de mon examen</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Elle sert à calculer votre séance du jour et le compte à rebours.</p>
        <div class="flex flex-wrap gap-2 items-center">
          <label for="examDateSet" class="sr-only">Date de l’examen</label>
          <input id="examDateSet" type="date" data-examdate value="${s.examDate || ''}" class="p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-bold">
          ${s.examDate ? `<button type="button" data-cleardate class="${BTN_SECONDARY}">Effacer</button>` : ''}
        </div>
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Affichage</h2>
        ${seg('theme', s.theme, [['system', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']])}
        ${toggle('showfr', s.showFr, 'Traductions affichées d’office', 'Sinon, touchez « Voir la traduction » sous chaque question.')}
        ${toggle('sound', s.sound, 'Sons de réponse', 'Petit son pour une bonne ou une mauvaise réponse.')}
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Voix néerlandaise</h2>
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">Vitesse de lecture</p>
        ${seg('rate', String(s.rate), [['0.75', 'Lente'], ['0.9', 'Normale'], ['1.05', 'Rapide']])}
        <button type="button" data-test class="${BTN_SECONDARY}"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Tester : « Goedemorgen, hoe gaat het? »</button>
        ${voiceList(s)}
        <details class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3" ${sp.enhanced ? '' : 'open'}>
          <summary class="font-bold cursor-pointer">La voix sonne robotique ? Installez une voix naturelle (gratuit)</summary>
          <div class="space-y-1.5 pt-2">
            <p><b>iPhone / iPad :</b> Réglages › Accessibilité › Contenu énoncé › Voix › Néerlandais. Téléchargez une voix marquée « améliorée » (par ex. Xander ou Claire), puis rouvrez l’application et choisissez-la ci-dessus.</p>
            <p><b>Android :</b> Paramètres › Synthèse vocale › Moteur Google › Installer les données vocales › Néerlandais, et choisissez une voix. Dans Chrome, la voix « Google Nederlands » est souvent la plus naturelle.</p>
            <p><b>Ordinateur :</b> dans Microsoft Edge, les voix « Online (Natural) » (Fenna, Maarten, Colette) sont très naturelles ; dans Chrome, choisissez « Google Nederlands ».</p>
            <p>Une vitesse « Normale » ou « Rapide » sonne souvent plus naturelle que « Lente ».</p>
          </div>
        </details>
      </section>
      <section class="${CARD} p-5 space-y-3">
        <h2 class="font-black dark:text-white">Sauvegarde des progrès</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Vos progrès sont enregistrés dans ce navigateur, sur cet appareil. Exportez-les pour les garder ou les transférer sur un autre téléphone.</p>
        <div class="flex flex-wrap gap-2">
          <button type="button" data-export class="${BTN_PRIMARY}"><i class="fa-solid fa-download" aria-hidden="true"></i> Exporter (fichier)</button>
          <label class="${BTN_SECONDARY} cursor-pointer"><i class="fa-solid fa-upload" aria-hidden="true"></i> Importer un fichier<input type="file" accept="application/json,.json" data-import class="sr-only"></label>
        </div>
        <details class="text-sm">
          <summary class="font-bold text-slate-700 dark:text-slate-200 cursor-pointer py-1">Sans fichier : copier / coller la sauvegarde</summary>
          <div class="space-y-2 pt-2">
            <p class="text-xs text-slate-500 dark:text-slate-400">Copiez le texte de sauvegarde (par exemple dans une note), puis collez-le ici sur l’autre appareil.</p>
            <button type="button" data-copy class="${BTN_SECONDARY}"><i class="fa-solid fa-copy" aria-hidden="true"></i> Copier ma sauvegarde</button>
            <label for="pasteBackup" class="sr-only">Coller une sauvegarde</label>
            <textarea id="pasteBackup" data-paste rows="3" placeholder="Collez ici une sauvegarde…" class="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-xs font-mono dark:text-white"></textarea>
            <button type="button" data-restore class="${BTN_SECONDARY}"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> Restaurer depuis le texte collé</button>
          </div>
        </details>
        <button type="button" data-reset class="text-sm font-bold text-red-600 dark:text-red-400 py-2"><i class="fa-solid fa-trash-can" aria-hidden="true"></i> Tout effacer…</button>
      </section>
      <p class="text-center text-xs text-slate-400">Contenu vérifié en septembre 2026. En cas de doute, les sites officiels (DUO, IND, Rijksoverheid) font foi.</p>
    </div>`;

  // Redessine seulement si l’on est toujours sur les Réglages (sinon on écraserait la page suivante).
  const timers = [];
  onLeave(() => timers.forEach(clearTimeout));
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const redraw = () => { if (location.hash.startsWith('#/reglages')) render(el); };
  el.querySelectorAll('[data-theme]').forEach((b) => b.addEventListener('click', () => { s.theme = b.dataset.theme; store.save(); applyTheme(); redraw(); }));
  el.querySelectorAll('[data-rate]').forEach((b) => b.addEventListener('click', () => { s.rate = Number(b.dataset.rate); store.save(); speak('Dit is de nieuwe snelheid.'); redraw(); }));
  el.querySelector('[data-examdate]').addEventListener('change', (e) => { s.examDate = e.target.value || null; store.save(); toast(s.examDate ? 'Date d’examen enregistrée.' : 'Date effacée.'); redraw(); });
  el.querySelector('[data-cleardate]')?.addEventListener('click', () => { s.examDate = null; store.save(); redraw(); });
  el.querySelector('[data-showfr]').addEventListener('change', (e) => { s.showFr = e.target.checked; store.save(); });
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
    toast('Fichier de sauvegarde créé.');
  });
  el.querySelector('[data-import]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    e.target.value = '';
    restore(text);
  });
  const restore = async (text) => {
    if (!text.trim()) { toast('Collez d’abord une sauvegarde.'); return; }
    if (!(await ask('Remplacer vos progrès actuels par cette sauvegarde ?', 'Remplacer'))) return;
    try {
      store.importJSON(text);
      applyTheme();
      toast('Progrès importés.');
      redraw();
    } catch {
      toast('Ce n’est pas une sauvegarde valide.');
    }
  };
  el.querySelector('[data-restore]').addEventListener('click', () => restore(el.querySelector('[data-paste]').value));
  el.querySelector('[data-copy]').addEventListener('click', async () => {
    const text = store.exportJSON();
    try {
      await navigator.clipboard.writeText(text);
      toast('Sauvegarde copiée.');
    } catch {
      const ta = el.querySelector('[data-paste]');
      ta.value = text;
      ta.focus();
      ta.select();
      toast('Texte sélectionné : copiez-le.');
    }
  });
  el.querySelector('[data-reset]').addEventListener('click', async () => {
    if (!(await ask('Effacer définitivement tous vos progrès ?\n\nConseil : copiez ou exportez-les d’abord.', 'Tout effacer', true))) return;
    store.reset();
    applyTheme();
    toast('Progrès effacés.');
    location.hash = '#/';
  });
}
