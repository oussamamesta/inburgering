// Moteur d’exercices commun : QCM, cartes-mots, construction de phrases, et séances.
// Chaque exercice enregistre la réponse dans le modèle de l’apprenant (learner.js).

import { esc, shuffle, $, $$, onLeave } from './util.js';
import { record, get, MASTERED_BOX } from './learner.js';
import { playSound } from './audio.js';
import { store } from './store.js';
import { CARD, BTN_PRIMARY, BTN_SECONDARY, audioBtn, iconSay, bar, ask, THEMES } from './ui.js';
import { currentCombo, lastGain, setQuiet, totalXp } from './game.js';
import { confetti, floatText, ring } from './fx.js';
import { catLabel } from './plan.js';
import { lookup, KNS_CATS, STORIES } from '../content/index.js';
import { scene } from './scenes.js';
import { knsPicture } from '../content/pics.js';
import { keywordsFor } from '../content/glossaire.js';
import { POS_LABELS } from '../content/vocab.js';
import { VOCAB } from '../content/index.js';
import { speak, stopSpeaking } from './audio.js';
import { tr, tri, frOn } from './i18n.js';
import { icon, KNS_ICON } from './icons.js';
import { canRecord, canRecognize, startRecording, recognize, normText, micErrorText } from './micro.js';

const LETTERS = ['A', 'B', 'C', 'D'];

const OPT_BASE = 'flex-1 text-left p-3.5 rounded-2xl border-2 font-bold text-sm flex items-start gap-3 transition';
const OPT_IDLE = `${OPT_BASE} border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 dark:text-white touch-active`;
const OPT_OK = `${OPT_BASE} border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100 animate-correct`;
const OPT_BAD = `${OPT_BASE} border-red-500 bg-red-50 text-red-900 dark:bg-red-950/50 dark:text-red-100 animate-shake`;
const OPT_DIM = `${OPT_BASE} border-slate-200 dark:border-slate-700 opacity-50 dark:text-white`;
const OPT_PICKED = `${OPT_BASE} border-delftBlue bg-blue-50 text-delftBlue dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100`;

const feedbackBox = (ok, inner) => `
  <div class="p-4 rounded-2xl border text-sm space-y-2 animate-pop ${ok
    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100'
    : 'bg-red-50 border-red-300 text-red-950 dark:bg-red-950/40 dark:border-red-800 dark:text-red-100'}" role="status">
    <p class="font-black">${ok ? `<i class="fa-solid fa-circle-check" aria-hidden="true"></i> ${tri('Goed zo!', 'Bonne réponse !')}` : `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i> ${tri('Helaas, niet goed.', 'Pas tout à fait.')}`}</p>
    ${inner}
  </div>`;

function statusLabel(id) {
  const it = get(id);
  if (!it) return `<span class="text-slate-400">${tri('Nieuw', 'nouveau')}</span>`;
  if (it.box >= MASTERED_BOX) return `<span class="text-emerald-600 dark:text-emerald-400">${tri('Geleerd', 'maîtrisé')}</span>`;
  return `<span class="text-amber-600 dark:text-amber-400">${tri('Bezig', 'en cours')}</span>`;
}

// ── QCM ─────────────────────────────────────────────────
// cfg : { id, type, cat, prompt, promptFr, opts, optsFr, corr, expl, lang ('nl'|'fr'), audio, top, after, exam }
export function mcq(host, cfg, onDone) {
  const lang = cfg.lang || 'nl';
  const hasFr = !cfg.exam && lang === 'nl' && (cfg.promptFr || cfg.optsFr); // pas de traduction pendant un examen blanc
  let showFr = hasFr && frOn();
  const order = shuffle(cfg.opts.map((_, i) => i));

  host.innerHTML = `
    <div class="space-y-4">
      ${cfg.top || ''}
      <div class="${CARD} p-5 space-y-4">
        <div class="flex items-start gap-3">
          <h2 class="flex-1 text-lg font-black leading-snug text-slate-900 dark:text-white selectable" lang="${lang}">${esc(cfg.prompt)}</h2>
          ${cfg.audio ? iconSay(cfg.prompt) : ''}
        </div>
        ${cfg.keywords?.length ? `<div data-fr class="flex flex-wrap gap-1.5 ${showFr ? '' : 'hidden'}" aria-label="Kernwoorden">${cfg.keywords.map((k) => `<span class="text-xs px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100"><b lang="nl">${esc(k.nl)}</b> = ${esc(k.fr)}</span>`).join('')}</div>` : ''}
        ${cfg.promptFr ? `<p data-fr class="text-sm italic text-slate-500 dark:text-slate-400 ${showFr ? '' : 'hidden'}">${esc(cfg.promptFr)}</p>` : ''}
        ${hasFr ? `<button type="button" data-toggle-fr class="inline-flex items-center gap-1.5 text-xs font-bold text-delftBlue dark:text-blue-300 py-1"><i class="fa-solid fa-language" aria-hidden="true"></i> <span>${showFr ? 'Vertaling verbergen' : 'Vertaling tonen'}</span></button>` : ''}
        <div class="space-y-2" role="group" aria-label="Antwoorden">
          ${order.map((oi, pos) => `
            <div class="flex items-stretch gap-2">
              <button type="button" data-opt="${oi}" class="${OPT_IDLE}">
                <span data-badge class="w-7 h-7 shrink-0 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-xs font-black">${LETTERS[pos]}</span>
                <span class="flex-1"><span lang="${lang}">${esc(cfg.opts[oi])}</span>
                ${cfg.optsFr ? `<span data-fr class="block text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5 ${showFr ? '' : 'hidden'}">${esc(cfg.optsFr[oi])}</span>` : ''}</span>
              </button>
              ${cfg.audio ? iconSay(cfg.opts[oi]) : ''}
            </div>`).join('')}
        </div>
        <div data-feedback></div>
      </div>
    </div>`;

  const setFr = (v) => {
    showFr = v;
    $$('[data-fr]', host).forEach((el) => el.classList.toggle('hidden', !v));
    const t = $('[data-toggle-fr] span', host);
    if (t) t.textContent = v ? 'Vertaling verbergen' : 'Vertaling tonen';
  };
  $('[data-toggle-fr]', host)?.addEventListener('click', () => setFr(!showFr));

  // Mode examen : la question et les réponses sont lues à voix haute, comme à l’examen officiel.
  if (cfg.autoRead) {
    const text = `${cfg.prompt} ${order.map((oi, pos) => `${LETTERS[pos]}. ${cfg.opts[oi]}.`).join(' ')}`;
    setTimeout(() => { if (document.body.contains(host)) speak(text); }, 300);
  }

  let answered = false;
  $$('[data-opt]', host).forEach((btn) =>
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      const chosen = Number(btn.dataset.opt);
      const ok = chosen === cfg.corr;
      if (cfg.id) record(cfg.id, ok, { type: cfg.type, cat: cfg.cat });
      $$('[data-opt]', host).forEach((b) => (b.disabled = true));

      if (cfg.exam) {
        stopSpeaking();
        btn.className = OPT_PICKED;
        onDone?.(ok, chosen);
        return;
      }
      playSound(ok ? 'correct' : 'wrong');
      $$('[data-opt]', host).forEach((b) => {
        const oi = Number(b.dataset.opt);
        const badge = $('[data-badge]', b);
        if (oi === cfg.corr) {
          b.className = OPT_OK;
          badge.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
          b.setAttribute('aria-label', 'Goed antwoord: ' + cfg.opts[oi]);
        } else if (oi === chosen) {
          b.className = OPT_BAD;
          badge.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
          b.setAttribute('aria-label', 'Jouw antwoord (fout): ' + cfg.opts[oi]);
        } else b.className = OPT_DIM;
      });
      $('[data-feedback]', host).innerHTML = feedbackBox(ok, `
        ${!ok ? `<p>${tri('Het goede antwoord:', 'Bonne réponse :')} <b lang="${lang}">${esc(cfg.opts[cfg.corr])}</b></p>` : ''}
        ${cfg.expl ? `<p class="selectable" lang="fr"><span class="block text-[11px] font-black uppercase tracking-wide opacity-70">Uitleg · explication</span>${esc(cfg.expl)}</p>` : ''}
        ${cfg.after || ''}`);
      onDone?.(ok, chosen);
    }),
  );
}

// ── Carte-mot ───────────────────────────────────────────
export function flashcard(host, w, onDone) {
  const head = w.art ? `<span class="text-slate-400 font-bold text-2xl mr-1">${w.art}</span>` : '';
  const say = (w.art ? w.art + ' ' : '') + w.nl;
  host.innerHTML = `
    <div class="space-y-4">
      <div class="perspective-1000">
        <div data-card role="button" tabindex="0" aria-label="Draai de kaart om" class="transform-style-3d relative w-full h-[300px] cursor-pointer">
          <div class="backface-hidden absolute inset-0 ${CARD} border-2 p-6 flex flex-col justify-between text-center">
            <div class="flex justify-between text-xs font-bold">
              <span class="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">${esc(w.theme)}</span>
              ${statusLabel(w.id)}
            </div>
            <div class="space-y-3">
              <div lang="nl">${head}<span class="text-4xl font-black text-slate-900 dark:text-white">${esc(w.nl)}</span></div>
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">${POS_LABELS[w.pos]}</div>
              <div>${audioBtn(say)}</div>
            </div>
            <p class="text-xs text-slate-400">${tr('Tik op de kaart voor de betekenis', 'Touchez la carte pour voir la traduction')}</p>
          </div>
          <div class="backface-hidden rotate-y-180 absolute inset-0 p-6 flex flex-col justify-between text-center bg-slate-900 text-white rounded-3xl border-2 border-slate-700">
            <div class="text-xs text-slate-400 text-left font-bold">Betekenis</div>
            <div class="space-y-2">
              <p class="text-2xl font-black text-amber-400">${esc(w.fr)}</p>
              ${w.art ? `<p class="text-xs text-slate-300">Lidwoord: <b>${w.art}</b>${w.pl ? ` · meervoud: <b lang="nl">de ${esc(w.pl)}</b>` : ''}</p>` : ''}
              <p class="text-base font-bold selectable" lang="nl">${esc(w.ex)}</p>
              <p class="text-xs text-slate-300 italic">${esc(w.exFr)}</p>
              <div>${audioBtn(w.ex, 'Luister naar de zin')}</div>
            </div>
            <span></span>
          </div>
        </div>
      </div>
      <div data-rate class="hidden grid grid-cols-2 gap-2">
        <button type="button" data-ok="0" class="py-3.5 rounded-2xl font-bold text-sm bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 touch-active"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> ${tri('Ik wist het niet', 'Je ne savais pas')}</button>
        <button type="button" data-ok="1" class="py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 text-white shadow-md touch-active"><i class="fa-solid fa-check" aria-hidden="true"></i> ${tri('Ik wist het', 'Je savais')}</button>
      </div>
      <p data-hint class="text-center text-xs text-slate-400">${tr('Weet je wat het betekent? Draai dan de kaart om.', 'Trouvez le sens, puis retournez la carte.')}</p>
    </div>`;

  const card = $('[data-card]', host);
  let flipped = false;
  const flip = () => {
    flipped = !flipped;
    card.classList.toggle('rotate-y-180', flipped);
    if (flipped) {
      $('[data-rate]', host).classList.remove('hidden');
      $('[data-hint]', host).classList.add('hidden');
    }
  };
  card.addEventListener('click', (e) => { if (!e.target.closest('[data-say]')) flip(); });
  card.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  $$('[data-ok]', host).forEach((b) => b.addEventListener('click', () => {
    const ok = b.dataset.ok === '1';
    record(w.id, ok, { type: 'vocab', cat: w.theme });
    playSound(ok ? 'correct' : 'wrong');
    onDone?.(ok, null, { auto: true });
  }));
}

// ── Construire une phrase ───────────────────────────────
const norm = (s) => s.toLowerCase().replace(/[.,!?¿¡;:]/g, '').replace(/\s+/g, ' ').trim();

export function puzzle(host, p, onDone) {
  const words = p.answer.replace(/[.,!?]/g, '').split(/\s+/).map((w, i) => (i === 0 ? w.toLowerCase() : w));
  let bank = shuffle(words.map((w, i) => ({ w, i })));
  for (let t = 0; t < 5 && bank.map((b) => b.w).join(' ') === words.join(' '); t++) bank = shuffle(bank);
  let chosen = [];
  let done = false;

  const draw = () => {
    host.innerHTML = `
      <div class="${CARD} p-5 space-y-4">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">${tr('Maak deze zin in het Nederlands. Tik de woorden in de goede volgorde.', 'Traduisez en touchant les mots dans le bon ordre.')}</p>
        <p class="bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 p-3 rounded-2xl text-base font-black">« ${esc(p.fr)} »</p>
        <div class="min-h-[64px] p-2 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-purple-300 dark:border-slate-600 rounded-2xl flex flex-wrap gap-1.5" aria-label="Jouw zin">
          ${chosen.length ? chosen.map((bi, k) => `<button type="button" data-remove="${k}" ${done ? 'disabled' : ''} class="bg-purple-600 text-white px-3 py-2 rounded-xl text-sm font-bold animate-pop" lang="nl">${esc(bank[bi].w)}${done ? '' : ' <span aria-hidden="true">×</span>'}</button>`).join('') : '<span class="text-sm text-slate-400 p-2">Tik op de woorden hieronder…</span>'}
        </div>
        <div class="flex flex-wrap gap-1.5" aria-label="Woorden">
          ${bank.map((b, bi) => { const used = chosen.includes(bi); return `<button type="button" data-add="${bi}" ${used || done ? 'disabled' : ''} class="px-3 py-2 rounded-xl text-sm font-bold border ${used ? 'bg-slate-200 dark:bg-slate-700 border-transparent opacity-30' : 'bg-white dark:bg-slate-700 dark:text-white border-slate-200 dark:border-slate-600 shadow-sm touch-active'}" lang="nl">${esc(b.w)}</button>`; }).join('')}
        </div>
        ${done ? '' : `<div class="flex justify-between items-center pt-1">
          <button type="button" data-clear class="text-sm font-bold text-slate-500 py-2 px-1">Wissen</button>
          <button type="button" data-check class="${BTN_PRIMARY} !bg-purple-600" ${chosen.length === words.length ? '' : 'disabled'}>Controleer</button>
        </div>`}
        <div data-feedback></div>
      </div>`;
    $$('[data-add]', host).forEach((b) => b.addEventListener('click', () => { chosen.push(Number(b.dataset.add)); draw(); }));
    $$('[data-remove]', host).forEach((b) => b.addEventListener('click', () => { chosen.splice(Number(b.dataset.remove), 1); draw(); }));
    $('[data-clear]', host)?.addEventListener('click', () => { chosen = []; draw(); });
    $('[data-check]', host)?.addEventListener('click', check);
  };

  const check = () => {
    const built = chosen.map((bi) => bank[bi].w).join(' ');
    const ok = [p.answer, ...p.alts].some((a) => norm(a) === norm(built));
    record(p.id, ok, { type: 'puzzle', cat: 'phrases' });
    playSound(ok ? 'correct' : 'wrong');
    done = true;
    draw();
    const others = [p.answer, ...p.alts];
    $('[data-feedback]', host).innerHTML = feedbackBox(ok, `
      <p class="flex flex-wrap items-center gap-2">${ok ? 'Je zin is goed:' : 'De goede zin:'} <b lang="nl" class="selectable">${esc(p.answer)}</b> ${audioBtn(p.answer)}</p>
      ${others.length > 1 ? `<p class="text-xs">Ook goed: ${others.filter((a) => a !== p.answer).map((a) => `<span lang="nl" class="font-bold">${esc(a)}</span>`).join(' · ')}</p>` : ''}
      <p class="text-sm" lang="fr">💡 ${p.rule}</p>`);
    onDone?.(ok);
  };
  draw();
}


// ── Parler : répondre, compléter, répéter ───────────────
// Déroulé : écouter → répondre à voix haute (enregistrement / vérification facultatifs) → voir le modèle → s’auto-évaluer.
export function speakItem(host, it, onDone) {
  const kinds = {
    vraag: { label: tri('Beantwoord de vraag', 'Répondez à la question'), say: it.q, text: it.q, fr: it.qFr, models: it.model, keys: it.keys },
    afmaken: { label: tri('Luister en maak de zin af', 'Écoutez, puis complétez la phrase'), say: `${it.context} ${it.start?.replace('…', '')}`, text: `${it.context} ${it.start}`, fr: it.fr, models: [it.full], keys: it.answers },
    nazeggen: { label: tri('Luister en zeg het na', 'Écoutez, puis répétez'), say: it.nl, text: it.nl, fr: it.fr, models: [it.nl], keys: normText(it.nl || '').split(' ') },
  };
  const k = kinds[it.kind];
  const showTextDefault = it.kind === 'nazeggen';

  host.innerHTML = `
    <div class="${CARD} p-5 space-y-4">
      <p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${k.label}</p>
      ${it.pic ? `<div class="text-6xl text-center py-4 rounded-2xl bg-sky-50 dark:bg-slate-900/60" role="img" aria-label="Plaatje">${it.pic}</div>` : ''}
      <div class="flex flex-wrap gap-2">
        <button type="button" data-play class="${BTN_PRIMARY} !bg-blue-600"><i class="fa-solid fa-play" aria-hidden="true"></i> Luister</button>
        <button type="button" data-play-slow class="${BTN_SECONDARY}"><i class="fa-solid fa-gauge-simple" aria-hidden="true"></i> Langzamer</button>
        <button type="button" data-show-text class="${BTN_SECONDARY}"><i class="fa-solid fa-eye" aria-hidden="true"></i> <span>${showTextDefault ? 'Verberg de tekst' : 'Toon de tekst'}</span></button>
      </div>
      <div data-text class="${showTextDefault ? '' : 'hidden'} space-y-1">
        <p class="text-lg font-black text-slate-900 dark:text-white selectable" lang="nl">${esc(k.text)}</p>
        <p class="fr text-sm text-slate-500 dark:text-slate-400" lang="fr">${esc(k.fr)}</p>
      </div>
      <div class="rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
        <p class="text-sm font-bold text-slate-800 dark:text-slate-100">🗣️ ${tr('Nu jij! Antwoord hardop, in een hele zin.', 'À vous : répondez à voix haute, en phrase complète.')}</p>
        <div class="flex flex-wrap gap-2">
          ${canRecord ? `<button type="button" data-rec class="${BTN_SECONDARY}"><i class="fa-solid fa-microphone" aria-hidden="true"></i> <span>Opnemen</span></button>` : ''}
          ${canRecognize ? `<button type="button" data-check class="${BTN_SECONDARY}"><i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> Controleer mijn antwoord</button>` : ''}
        </div>
        <div data-rec-out class="text-sm"></div>
      </div>
      <button type="button" data-reveal class="${BTN_PRIMARY} w-full">${tri('Toon een goed antwoord', 'Voir une bonne réponse')}</button>
      <div data-model class="hidden space-y-3">
        <div class="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 space-y-2">
          <p class="text-xs font-black uppercase tracking-wider">${it.kind === 'vraag' ? 'Voorbeelden' : 'Voorbeeldzin'}</p>
          ${k.models.map((m) => `<p class="flex flex-wrap items-center gap-2"><b lang="nl" class="selectable">${esc(m)}</b> ${audioBtn(m)}</p>`).join('')}
          ${it.kind === 'afmaken' && it.answers.length > 1 ? `<p class="text-xs">Ook goed: ${it.answers.map((a) => `<span lang="nl" class="font-bold">${esc(a)}</span>`).join(', ')}</p>` : ''}
          ${it.tip ? `<p class="text-sm" lang="fr">💡 ${esc(it.tip)}</p>` : ''}
        </div>
        <p class="text-sm font-bold text-slate-700 dark:text-slate-200">${tr('Hoe ging het?', 'Comment était votre réponse ?')}</p>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" data-rate="0" class="py-3.5 rounded-2xl font-bold text-sm bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 touch-active"><i class="fa-solid fa-rotate-left" aria-hidden="true"></i> ${tri('Nog oefenen', 'À retravailler')}</button>
          <button type="button" data-rate="1" class="py-3.5 rounded-2xl font-bold text-sm bg-emerald-500 text-white shadow-md touch-active"><i class="fa-solid fa-check" aria-hidden="true"></i> ${tri('Goed gezegd', 'Bien dit')}</button>
        </div>
      </div>
    </div>`;

  const play = (f = 1) => speak(k.say, f);
  $('[data-play]', host).addEventListener('click', () => play());
  $('[data-play-slow]', host).addEventListener('click', () => play(0.75));
  $('[data-show-text]', host).addEventListener('click', (e) => {
    const box = $('[data-text]', host);
    box.classList.toggle('hidden');
    e.currentTarget.querySelector('span').textContent = box.classList.contains('hidden') ? 'Toon de tekst' : 'Verberg de tekst';
  });
  // Lecture automatique à l’ouverture (si le navigateur l’autorise après un premier geste).
  setTimeout(() => { if (document.body.contains(host)) play(); }, 350);

  const out = $('[data-rec-out]', host);
  let recording = null;
  $('[data-rec]', host)?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (recording) { recording.stop(); return; }
    try {
      recording = await startRecording(20000);
      btn.querySelector('span').textContent = 'Stop';
      btn.classList.add('!bg-red-600', '!text-white');
      out.innerHTML = '<p class="text-red-600 dark:text-red-400 font-bold">● Opname… praat nu.</p>';
      const url = await recording.done;
      recording = null;
      btn.querySelector('span').textContent = 'Opnieuw opnemen';
      btn.classList.remove('!bg-red-600', '!text-white');
      out.innerHTML = `<p class="text-xs font-bold mb-1">${tr('Jouw opname. Vergelijk met het voorbeeld.', 'Votre enregistrement : comparez-le au modèle.')}</p><audio controls src="${url}" class="w-full"></audio>`;
    } catch (err) {
      recording = null;
      out.innerHTML = `<p class="text-amber-700 dark:text-amber-300">${esc(micErrorText(err))}</p>`;
    }
  });
  $('[data-check]', host)?.addEventListener('click', async () => {
    out.innerHTML = '<p class="font-bold text-blue-700 dark:text-blue-300">🎙️ Ik luister… praat nu.</p>';
    try {
      const alts = await recognize();
      if (!alts.length) { out.innerHTML = `<p class="text-amber-700 dark:text-amber-300">${esc(micErrorText({ message: 'no-speech' }))}</p>`; return; }
      const heard = alts[0];
      const all = alts.map(normText).join(' ');
      const found = (k.keys || []).filter((w) => all.includes(normText(w)));
      const good = it.kind === 'nazeggen' ? found.length >= Math.ceil(k.keys.length * 0.7) : found.length > 0;
      out.innerHTML = `<p>De telefoon hoorde: <b lang="nl">„${esc(heard)}”</b></p>
        <p class="${good ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'} font-bold">${good ? tr('✓ De belangrijke woorden zijn er.', 'Les mots importants sont là.') : tr('De woorden zijn niet herkend. Probeer het nog eens, of kijk naar het voorbeeld.', 'Mots non reconnus. Réessayez ou regardez le modèle.')}</p>
        <p class="text-xs text-slate-500">${tr('Let op: de computer maakt soms fouten. Bij het examen luisteren mensen.', 'La reconnaissance automatique n’est pas parfaite : à l’examen, ce sont des personnes qui écoutent.')}</p>`;
    } catch (err) {
      out.innerHTML = `<p class="text-amber-700 dark:text-amber-300">${esc(micErrorText(err))}</p>`;
    }
  });

  $('[data-reveal]', host).addEventListener('click', (e) => {
    e.currentTarget.classList.add('hidden');
    $('[data-model]', host).classList.remove('hidden');
    $('[data-text]', host).classList.remove('hidden');
  });
  $$('[data-rate]', host).forEach((b) => b.addEventListener('click', () => {
    const ok = b.dataset.rate === '1';
    record(it.id, ok, { type: 'speak', cat: it.kind });
    playSound(ok ? 'correct' : 'wrong');
    onDone?.(ok, null, { auto: true });
  }));
}

// ── Lecture, partie 1 : reconnaître des mots ────────────
// Mode « écouter » : on entend un mot et on choisit le mot écrit. Mode « lire » : on lit un mot et on choisit le bon son.
export function wordMatch(host, it, onDone) {
  const w = it.word;
  const mode = Math.random() < 0.5 ? 'ecouter' : 'lire';
  const similar = VOCAB.filter((x) => x.nl !== w.nl && x.nl.length > 1)
    .map((x) => [x, Math.abs(x.nl.length - w.nl.length) + (x.nl[0] === w.nl[0] ? -2 : 0) + Math.random() * 3])
    .sort((a, b) => a[1] - b[1]).slice(0, 3).map(([x]) => x);
  const options = shuffle([w, ...similar]);
  const label = (x) => (x.art ? x.art + ' ' : '') + x.nl;

  host.innerHTML = `
    <div class="${CARD} p-5 space-y-4">
      <p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${mode === 'ecouter' ? tri('Luister en kies het goede woord', 'Écoutez, puis choisissez le mot écrit') : tri('Lees het woord en kies het goede geluid', 'Lisez, puis choisissez le bon son')}</p>
      ${mode === 'ecouter'
        ? `<button type="button" data-say="${esc(label(w))}" class="${BTN_PRIMARY} !bg-teal-600"><i class="fa-solid fa-play" aria-hidden="true"></i> Luister</button>`
        : `<p class="text-3xl font-black text-center text-slate-900 dark:text-white py-2" lang="nl">${esc(label(w))}</p>`}
      <div class="grid grid-cols-2 gap-2" role="group" aria-label="Antwoorden">
        ${options.map((x, i) => mode === 'ecouter'
          ? `<button type="button" data-pick="${esc(x.nl)}" class="${OPT_IDLE} justify-center text-center" lang="nl">${esc(label(x))}</button>`
          : `<div class="flex gap-1.5"><button type="button" data-say="${esc(label(x))}" class="flex-1 ${BTN_SECONDARY}" aria-label="Luister naar geluid ${i + 1}"><i class="fa-solid fa-volume-high" aria-hidden="true"></i> Geluid ${i + 1}</button><button type="button" data-pick="${esc(x.nl)}" class="px-3 rounded-2xl border-2 border-slate-200 dark:border-slate-600 font-black text-sm dark:text-white" aria-label="Kies geluid ${i + 1}">${LETTERS[i]}</button></div>`).join('')}
      </div>
      <div data-feedback></div>
    </div>`;
  if (mode === 'ecouter') setTimeout(() => { if (document.body.contains(host)) speak(label(w)); }, 350);

  let answered = false;
  $$('[data-pick]', host).forEach((b) => b.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    const ok = b.dataset.pick === w.nl;
    record(it.id, ok, { type: 'wordmatch', cat: 'mots-lecture' });
    playSound(ok ? 'correct' : 'wrong');
    $$('[data-pick]', host).forEach((x) => { x.disabled = true; if (x.dataset.pick === w.nl) x.classList.add('!border-emerald-500', '!bg-emerald-50', 'dark:!bg-emerald-950/50'); else if (x === b) x.classList.add('!border-red-500'); });
    $('[data-feedback]', host).innerHTML = feedbackBox(ok, `<p class="flex flex-wrap items-center gap-2">Het woord was <b lang="nl">${esc(label(w))}</b> <span lang="fr">= ${esc(w.fr)}</span> ${audioBtn(label(w))}</p>`);
    onDone?.(ok);
  }));
}


// ── Vocabulaire : de / het, écrire le mot, dictée ───────
const normWord = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '').replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
function distance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export function deHet(host, it, onDone) {
  const w = it.word;
  host.innerHTML = `
    <div class="${CARD} p-6 space-y-5 text-center">
      <p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${tri('de of het?', '« de » ou « het » ?')}</p>
      <p class="text-4xl font-black text-slate-900 dark:text-white" lang="nl">… ${esc(w.nl)}</p>
      <p class="fr text-sm text-slate-500 dark:text-slate-400" lang="fr">${esc(w.fr)}</p>
      <div class="grid grid-cols-2 gap-3">
        <button type="button" data-art="de" class="${OPT_IDLE} justify-center text-2xl">de</button>
        <button type="button" data-art="het" class="${OPT_IDLE} justify-center text-2xl">het</button>
      </div>
      <div data-feedback class="text-left"></div>
    </div>`;
  let answered = false;
  $$('[data-art]', host).forEach((b) => b.addEventListener('click', () => {
    if (answered) return;
    answered = true;
    const ok = b.dataset.art === w.art;
    record(it.id, ok, { type: 'dehet', cat: 'de-het' });
    playSound(ok ? 'correct' : 'wrong');
    $$('[data-art]', host).forEach((x) => { x.disabled = true; x.className = (x.dataset.art === w.art ? OPT_OK : x === b ? OPT_BAD : OPT_DIM) + ' justify-center text-2xl'; });
    $('[data-feedback]', host).innerHTML = feedbackBox(ok, `<p class="flex flex-wrap items-center gap-2"><b lang="nl">${w.art} ${esc(w.nl)}</b>${w.pl ? ` · meervoud: <b lang="nl">de ${esc(w.pl)}</b>` : ''} ${audioBtn(`${w.art} ${w.nl}`)}</p>
      ${w.art === 'het' ? `<p class="text-xs">${tr('Meervoud: altijd „de”.', 'Au pluriel, tous les noms prennent « de ».')}</p>` : ''}`);
    onDone?.(ok);
  }));
}

// mode : 'ecrire' (on voit le français) ou 'dictee' (on entend le mot).
export function typeWord(host, it, mode, onDone) {
  const w = it.word;
  const target = w.nl;
  const withArt = w.art ? `${w.art} ${w.nl}` : w.nl;
  host.innerHTML = `
    <div class="${CARD} p-6 space-y-4">
      <p class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">${mode === 'dictee' ? tri('Dictee: luister en schrijf het woord', 'Dictée : écoutez et écrivez') : tri('Schrijf het Nederlandse woord', 'Écrivez le mot en néerlandais')}</p>
      ${mode === 'dictee'
        ? `<div class="flex flex-wrap gap-2"><button type="button" data-say="${esc(withArt)}" class="${BTN_PRIMARY} !bg-emerald-600"><i class="fa-solid fa-play" aria-hidden="true"></i> Luister</button><button type="button" data-say="${esc(withArt)}" data-say-rate="0.7" class="${BTN_SECONDARY}">Langzamer</button></div>`
        : `<p class="text-2xl font-black text-slate-900 dark:text-white">${esc(w.fr)}</p><p class="text-xs text-slate-500">${POS_LABELS[w.pos]}${w.art ? ' · lidwoord mag, hoeft niet' : ''}</p>`}
      <form data-form class="flex gap-2" autocomplete="off">
        <label for="typeInput" class="sr-only">Jouw antwoord</label>
        <input id="typeInput" data-input lang="nl" autocapitalize="off" autocorrect="off" spellcheck="false" class="flex-1 min-w-0 p-3 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 dark:text-white font-bold" placeholder="…">
        <button type="submit" class="${BTN_PRIMARY}">Controleer</button>
      </form>
      <button type="button" data-hint class="text-xs font-bold text-slate-500 dark:text-slate-400">💡 Hint: eerste letter</button>
      <div data-feedback></div>
    </div>`;
  if (mode === 'dictee') setTimeout(() => { if (document.body.contains(host)) speak(withArt); }, 350);
  const input = $('[data-input]', host);
  setTimeout(() => input.focus({ preventScroll: true }), 50);
  $('[data-hint]', host).addEventListener('click', (e) => { e.currentTarget.textContent = `💡 Begint met „${target[0]}” (${target.length} letters)`; });
  let answered = false;
  $('[data-form]', host).addEventListener('submit', (e) => {
    e.preventDefault();
    if (answered || !input.value.trim()) return;
    answered = true;
    let given = normWord(input.value);
    if (w.art) given = given.replace(/^(de|het)\s+/, '');
    const goal = normWord(target);
    const ok = given === goal;
    const close = !ok && goal.length >= 4 && distance(given, goal) === 1;
    record(it.id, ok, { type: mode === 'dictee' ? 'dictee' : 'typing', cat: mode });
    playSound(ok ? 'correct' : 'wrong');
    input.disabled = true;
    input.classList.add(ok ? '!border-emerald-500' : '!border-red-500');
    $('[data-feedback]', host).innerHTML = feedbackBox(ok, `
      ${close ? `<p class="font-bold">${tri('Bijna! Eén letter is anders.', 'Presque ! Une seule lettre de différence.')}</p>` : ''}
      <p class="flex flex-wrap items-center gap-2">Antwoord: <b lang="nl">${esc(withArt)}</b> <span lang="fr">= ${esc(w.fr)}</span> ${audioBtn(withArt)}</p>
      <p class="text-xs selectable" lang="nl">${esc(w.ex)} <span class="fr-i" lang="fr">${esc(w.exFr)}</span></p>`);
    onDone?.(ok);
  });
}

// ── Rendu d’un élément selon son type ───────────────────
const DOC_STYLES = {
  blue: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900',
  green: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-900',
  amber: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900',
  orange: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900',
  red: 'bg-white dark:bg-slate-800 border-red-500 text-red-700 dark:text-red-300',
  grey: 'bg-slate-100 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600',
  plain: 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600',
};

export function renderItem(host, id, opts = {}, onDone) {
  const entry = lookup(id);
  if (!entry) { host.innerHTML = '<p class="text-sm text-slate-500">Niet gevonden.</p>'; return; }
  const { type, item } = entry;
  const exam = !!opts.exam;

  if (type === 'kns') {
    const cat = KNS_CATS[item.cat];
    let { opts: kOpts, optsFr: kFr, corr: kCorr } = item;
    if (exam) {
      // Comme à l’examen officiel : deux réponses possibles seulement.
      const others = kOpts.map((_, i) => i).filter((i) => i !== kCorr);
      const pickIdx = [kCorr, others[Math.floor(Math.random() * others.length)]];
      kOpts = pickIdx.map((i) => item.opts[i]);
      kFr = pickIdx.map((i) => item.optsFr[i]);
      kCorr = 0;
    }
    mcq(host, { id, type, cat: item.cat, prompt: item.q, promptFr: item.qFr, opts: kOpts, optsFr: kFr, corr: kCorr, expl: item.expl, audio: true, exam,
      autoRead: exam, keywords: exam ? null : keywordsFor(item.q),
      top: `<div class="flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-300">${icon(KNS_ICON[item.cat], 'w-4 h-4')} <span lang="nl">${esc(cat.nl)}</span><span class="fr-i" lang="fr">${esc(cat.label)}</span></div>
        <div class="text-6xl text-center py-5 rounded-3xl bg-sky-50 dark:bg-slate-800 border border-sky-100 dark:border-slate-700" role="img" aria-label="Plaatje">${knsPicture(item, cat.icon)}</div>` }, onDone);
  } else if (type === 'grammar') {
    mcq(host, { id, type, cat: 'grammaire', prompt: item.q, promptFr: item.qFr, opts: item.opts, corr: item.corr, expl: item.expl, audio: true, exam }, onDone);
  } else if (type === 'reading') {
    mcq(host, { id, type, cat: 'lecture', prompt: item.q, promptFr: item.qFr, opts: item.opts, corr: item.corr, expl: item.expl, audio: false, exam,
      top: `<div class="${CARD} p-4 space-y-2"><div class="text-xs font-bold text-slate-500 dark:text-slate-400"><i class="fa-solid fa-file-lines" aria-hidden="true"></i> ${esc(item.title)}</div>
        <div class="p-4 rounded-2xl border ${DOC_STYLES[item.style] || DOC_STYLES.plain} text-[15px] leading-relaxed dark:text-slate-100 selectable" lang="nl">${item.doc}</div></div>` }, onDone);
  } else if (type === 'listening') {
    mcq(host, { id, type, cat: 'ecoute', prompt: item.q, promptFr: item.qFr, opts: item.opts, corr: item.corr, audio: true, exam,
      top: `<div class="${CARD} p-5 text-center space-y-3">
          <div class="w-14 h-14 bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 rounded-2xl flex items-center justify-center mx-auto" aria-hidden="true">${icon('headphones', 'w-8 h-8')}</div>
          <p class="text-sm text-slate-600 dark:text-slate-300">${tr('Luister naar het bericht (zo vaak als je wilt). Beantwoord dan de vraag.', 'Écoutez le message (autant de fois que nécessaire), puis répondez.')}</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button type="button" data-say="${esc(item.text)}" class="${BTN_PRIMARY} !bg-blue-600"><i class="fa-solid fa-play" aria-hidden="true"></i> Luister</button>
            <button type="button" data-say="${esc(item.text)}" data-say-rate="0.75" class="${BTN_SECONDARY}"><i class="fa-solid fa-gauge-simple" aria-hidden="true"></i> Langzamer</button>
          </div></div>`,
      after: `<div class="pt-2 border-t border-black/10 dark:border-white/10 space-y-1"><p class="text-xs font-bold">Tekst:</p><p class="selectable" lang="nl">${esc(item.text)}</p><p class="fr text-xs" lang="fr">${esc(item.textFr)}</p></div>` }, onDone);
  } else if (type === 'manuel') {
    const nl = !!item.qNl;
    mcq(host, { id, type, cat: item.cat, prompt: nl ? item.qNl : item.q, promptFr: nl ? item.q : '', opts: nl ? item.optsNl : item.opts, optsFr: nl ? item.opts : null,
      corr: item.corr, expl: item.tip, lang: nl ? 'nl' : 'fr', audio: nl, exam,
      top: `<div class="flex items-center gap-1.5 text-xs font-bold text-orange-700 dark:text-orange-300">${icon('book', 'w-4 h-4')} Handboek: ${esc(item.titleNl || item.title)}</div>` }, onDone);
  } else if (type === 'story') {
    const st = STORIES.find((x) => x.id === item.story);
    const text = st.scenes.flat().map(([nl]) => nl).join(' ');
    mcq(host, { id, type, cat: 'verhaal', prompt: item.q, promptFr: item.qFr, opts: item.opts, optsFr: item.optsFr, corr: item.corr, audio: true, exam,
      top: `<details class="${CARD} overflow-hidden group" ${opts.inStory ? '' : 'open'}>
        <summary class="cursor-pointer list-none p-3 flex items-center gap-3"><span class="w-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">${scene(st.id, 0, st.title)}</span>
          <span class="flex-1 min-w-0"><span class="block text-xs font-bold text-teal-700 dark:text-teal-300">Verhaal</span><span class="block font-black text-sm dark:text-white" lang="nl">${esc(st.title)}</span></span>
          <i class="fa-solid fa-chevron-down text-slate-400 transition-transform group-open:rotate-180" aria-hidden="true"></i></summary>
        <p class="px-4 pb-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200 selectable" lang="nl">${esc(text)}</p></details>` }, onDone);
  } else if (type === 'vocab') {
    flashcard(host, item, onDone);
  } else if (type === 'puzzle') {
    puzzle(host, item, onDone);
  } else if (type === 'speak') {
    speakItem(host, item, onDone);
  } else if (type === 'wordmatch') {
    wordMatch(host, item, onDone);
  } else if (type === 'dehet') {
    deHet(host, item, onDone);
  } else if (type === 'typing') {
    typeWord(host, item, 'ecrire', onDone);
  } else if (type === 'dictee') {
    typeWord(host, item, 'dictee', onDone);
  }
}

// Texte court décrivant un élément (pour les bilans).
export function describe(id) {
  const e = lookup(id);
  if (!e) return { label: id };
  const it = e.item;
  switch (e.type) {
    case 'kns': case 'grammar': case 'reading': case 'listening':
      return { label: it.q, answer: it.opts[it.corr], expl: it.expl || '', fr: it.qFr };
    case 'story': return { label: it.q, fr: it.qFr, answer: it.opts[it.corr] };
    case 'manuel': return it.qNl ? { label: it.qNl, fr: it.q, answer: it.optsNl[it.corr], expl: it.tip } : { label: it.q, answer: it.opts[it.corr], expl: it.tip };
    case 'vocab': return { label: (it.art ? it.art + ' ' : '') + it.nl, answer: it.fr };
    case 'puzzle': return { label: it.fr, answer: it.answer };
    case 'speak': return it.kind === 'vraag' ? { label: it.q, fr: it.qFr, answer: it.model[0], expl: it.tip }
      : it.kind === 'afmaken' ? { label: `${it.context} ${it.start}`, fr: it.fr, answer: it.full } : { label: it.nl, fr: it.fr, answer: it.nl, expl: it.tip };
    case 'wordmatch': case 'dehet': case 'typing': case 'dictee': return { label: (it.word.art ? it.word.art + ' ' : '') + it.word.nl, answer: it.word.fr };
    default: return { label: id };
  }
}

// ── Séance : enchaîne plusieurs éléments, puis affiche un bilan ──
// cfg : { title, ids, exam, backHash, backLabel, onFinish(results), passMark }
// Couleur d’une séance selon le type d’exercices.
const TYPE_THEME = { kns: 'societe', manuel: 'handboek', story: 'verhalen', reading: 'lecture', speak: 'parler', vocab: 'mots', dehet: 'mots', typing: 'mots', dictee: 'mots', wordmatch: 'mots', puzzle: 'grammaire', grammar: 'grammaire', listening: 'ecoute' };
function themeFor(ids, cfg) {
  if (cfg.theme) return cfg.theme;
  const kinds = new Set(ids.map((id) => TYPE_THEME[lookup(id)?.type] || 'plan'));
  return kinds.size === 1 ? [...kinds][0] : 'plan';
}

// Félicitations en néerlandais (avec la traduction) selon le score.
function praise(p) {
  if (p >= 90) return ['Uitstekend!', 'Excellent !', '🏆'];
  if (p >= 70) return ['Goed gedaan!', 'Bien joué !', '👏'];
  if (p >= 50) return ['Bijna!', 'Presque !', '💪'];
  return ['Blijf oefenen!', 'Continuez à vous entraîner !', '📚'];
}

// ── Séance : enchaîne plusieurs éléments, puis affiche un bilan ──
// cfg : { title, ids, exam, timeLimit, passMark, passNote, backHash, backLabel, theme, onFinish(results), summaryExtra(results) }
export function session(host, cfg) {
  const ids = cfg.ids;
  const results = [];
  let idx = 0;
  let timer = null;
  let bestCombo = 0;
  const start = Date.now();
  const xpStart = totalXp();
  const t = THEMES[themeFor(ids, cfg)] || THEMES.plan;

  if (!ids.length) {
    host.innerHTML = `<div class="${CARD} p-6 text-center space-y-3"><p class="text-3xl">🎉</p><p class="font-bold dark:text-white">${tr('Niets te doen op dit moment.', 'Rien à faire pour l’instant.')}</p><a href="${cfg.backHash || '#/'}" class="${BTN_PRIMARY}">Terug</a></div>`;
    return;
  }
  setQuiet(!!cfg.exam);

  host.innerHTML = `
    <div class="max-w-xl mx-auto space-y-4">
      <div class="flex items-center justify-between gap-2">
        <a href="${cfg.backHash || '#/'}" data-quit class="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 py-1 shrink-0"><i class="fa-solid fa-xmark" aria-hidden="true"></i> Stoppen</a>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${t.tint} ${t.text} text-sm font-black truncate min-w-0">${icon(t.iconName, 'w-4 h-4 shrink-0')}<span class="truncate">${esc(cfg.title)}</span></span>
        <span class="shrink-0 min-w-[3.5rem] text-right">${cfg.exam
          ? `<span data-timer class="text-xs font-bold text-slate-500 tabular-nums">${cfg.timeLimit ? `⏳ ${Math.floor(cfg.timeLimit / 60)}:00` : '0:00'}</span>`
          : '<span data-combo aria-live="polite"></span>'}</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex-1 h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden" role="progressbar" aria-label="Voortgang"><div data-barfill class="h-full ${t.bar} rounded-full transition-all duration-500" style="width:0%"></div></div>
        <span data-count class="text-xs font-black text-slate-500 dark:text-slate-400 tabular-nums"></span>
      </div>
      <div data-ex></div>
      <div data-foot class="flex justify-end"></div>
    </div>`;

  const exHost = $('[data-ex]', host);
  const foot = $('[data-foot]', host);

  $('[data-quit]', host).addEventListener('click', async (e) => {
    if (!results.length || results.length >= ids.length) return;
    e.preventDefault();
    if (await ask('Wil je stoppen?\nJe antwoorden zijn bewaard.', 'Stoppen', false, 'Quitter ? Vos réponses sont enregistrées.')) location.hash = cfg.backHash || '#/';
  });

  let finished = false;
  if (cfg.exam) {
    // Chronomètre ; avec timeLimit (secondes), c’est un compte à rebours qui termine l’examen à 0.
    timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const s = cfg.timeLimit ? Math.max(0, cfg.timeLimit - elapsed) : elapsed;
      const el = $('[data-timer]', host);
      if (el) {
        el.textContent = `${cfg.timeLimit ? '⏳ ' : ''}${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
        if (cfg.timeLimit && s <= 60) el.classList.add('text-red-600');
      }
      if (cfg.timeLimit && s === 0 && !finished) finish(true);
    }, 1000);
  }
  onLeave(() => { clearInterval(timer); setQuiet(false); });

  const header = () => {
    const done = results.filter(Boolean).length;
    const c = $('[data-count]', host);
    if (c) c.textContent = `${Math.min(idx + 1, ids.length)} / ${ids.length}`;
    const f = $('[data-barfill]', host);
    if (f) f.style.width = `${(done / ids.length) * 100}%`;
  };

  // Combo : « 🔥 ×3 » à partir de 2 bonnes réponses d’affilée ; confettis tous les 5.
  const showCombo = (ok) => {
    const el = $('[data-combo]', host);
    if (!el) return;
    const n = currentCombo();
    bestCombo = Math.max(bestCombo, n);
    if (ok && n >= 2) {
      el.innerHTML = `<span class="inline-block animate-combo text-sm font-black text-orange-600 dark:text-orange-400 tabular-nums">🔥 ×${n}</span>`;
      if (n % 5 === 0) confetti({ count: 60, spread: 0.8 });
    } else el.innerHTML = '';
    if (ok) floatText(exHost.querySelector('h2, [data-card], p') || exHost, `+${lastGain().gain} XP`);
  };

  const next = () => {
    idx += 1;
    if (finished) return;
    if (idx >= ids.length) finish();
    else show();
  };

  const show = () => {
    header();
    foot.innerHTML = '';
    exHost.classList.remove('animate-slide-in');
    void exHost.offsetWidth; // relance l’animation
    exHost.classList.add('animate-slide-in');
    renderItem(exHost, ids[idx], { exam: cfg.exam }, (ok, chosen, meta = {}) => {
      results[idx] = { id: ids[idx], ok, chosen };
      header();
      if (!cfg.exam) showCombo(ok);
      if (cfg.exam || meta.auto) { setTimeout(next, cfg.exam ? 300 : 350); return; }
      const last = idx === ids.length - 1;
      foot.innerHTML = `<button type="button" class="${BTN_PRIMARY} ${t.btn}">${last ? 'Bekijk de uitslag' : 'Volgende'} <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>`;
      const b = foot.querySelector('button');
      b.addEventListener('click', next);
      b.focus({ preventScroll: true });
      foot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finish = (timeUp = false) => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    // Questions sans réponse (temps écoulé) = fausses.
    ids.forEach((id, i) => { if (!results[i]) results[i] = { id, ok: false, skipped: true }; });
    const skipped = results.filter((r) => r.skipped).length;
    const good = results.filter((r) => r.ok).length;
    const total = ids.length;
    const seconds = Math.round((Date.now() - start) / 1000);
    const passed = cfg.passMark ? good >= cfg.passMark : null;
    const score = Math.round((good / total) * 100);
    const xpGained = totalXp() - xpStart;
    cfg.onFinish?.(results, { good, total, seconds, passed });
    const wrong = results.filter((r) => !r.ok);
    const [nl, fr, emoji] = praise(score);

    // Ce qui va bien : groupes (thème, type d’exercice) réussis à 80 % ou plus.
    const groups = {};
    for (const r of results) {
      const cat = lookup(r.id)?.cat;
      if (!cat) continue;
      const g = groups[cat] || (groups[cat] = { good: 0, n: 0 });
      g.n += 1;
      if (r.ok) g.good += 1;
    }
    const wentWell = Object.entries(groups).filter(([, g]) => g.good / g.n >= 0.8).sort((a, b) => b[1].n - a[1].n).slice(0, 4);

    host.innerHTML = `
      <div class="max-w-xl mx-auto space-y-4">
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br ${t.hero} text-white p-6 shadow-xl text-center space-y-4 animate-rise">
          <div class="absolute -right-6 -top-6 text-9xl opacity-20 select-none" aria-hidden="true">${emoji}</div>
          <p class="relative text-xs font-black uppercase tracking-wider text-white/90">${esc(cfg.title)} — klaar</p>
          <div class="relative flex justify-center">${ring(score, { size: 150, stroke: 14, color: 'text-white', track: 'text-black/20', label: `Score: ${score} %`,
            inner: `<span class="text-4xl font-black tabular-nums">${score}%</span><span class="text-xs font-bold mt-1 text-white/90">${good} / ${total}</span>` })}</div>
          <div class="relative"><p class="text-2xl font-black" lang="nl">${nl} ${emoji}</p><p class="fr text-sm text-white/90" lang="fr">${fr}</p></div>
          <div class="relative flex flex-wrap justify-center gap-2 text-xs font-bold">
            <span class="px-3 py-1.5 rounded-full bg-black/30">⭐ +${xpGained} XP</span>
            ${!cfg.exam && bestCombo >= 2 ? `<span class="px-3 py-1.5 rounded-full bg-black/30">🔥 beste reeks ×${bestCombo}</span>` : ''}
            ${cfg.exam ? `<span class="px-3 py-1.5 rounded-full bg-black/30">⏱️ ${Math.floor(seconds / 60)} min ${seconds % 60} s</span>` : ''}
          </div>
          ${cfg.passMark ? `<p class="relative inline-block px-4 py-2 rounded-2xl bg-white ${passed ? 'text-emerald-700' : 'text-red-700'} text-sm font-black">${passed ? '✓ Geslaagd' : '✗ Nog niet geslaagd'} · grens ${cfg.passMark} / ${total}</p>` : ''}
        </div>
        ${timeUp || cfg.passNote || cfg.summaryExtra ? `<div class="${CARD} p-5 space-y-2 text-center">
          ${timeUp ? `<p class="text-sm font-bold text-red-600">${tr(`De tijd is om: ${skipped} ${skipped > 1 ? 'vragen' : 'vraag'} zonder antwoord.`, `Temps écoulé : ${skipped} sans réponse.`)}</p>` : ''}
          ${cfg.passNote ? `<p class="text-xs text-slate-500 dark:text-slate-400">${cfg.passNote}</p>` : ''}
          ${cfg.summaryExtra ? cfg.summaryExtra(results) : ''}
        </div>` : ''}
        ${good ? `<div class="${CARD} p-5 space-y-2 animate-rise" style="animation-delay:.1s">
          <h3 class="font-black text-emerald-700 dark:text-emerald-400">✓ ${tri('Wat ging goed', 'Ce qui va bien')}</h3>
          ${wentWell.length ? `<ul class="space-y-1.5">${wentWell.map(([cat, g]) => `<li class="flex justify-between gap-3 text-sm text-slate-700 dark:text-slate-200"><span>${esc(catLabel(cat))}</span><span class="font-black text-emerald-700 dark:text-emerald-400 tabular-nums">${g.good}/${g.n}</span></li>`).join('')}</ul>`
            : `<p class="text-sm text-slate-700 dark:text-slate-200">${tr(`${good} ${good > 1 ? 'goede antwoorden' : 'goed antwoord'}. Elk goed antwoord brengt je dichter bij het examen.`, 'Chaque réponse juste vous rapproche de l’examen.')}</p>`}
        </div>` : ''}
        ${wrong.length ? `
          <div class="${CARD} p-5 space-y-3 animate-rise" style="animation-delay:.2s">
            <h3 class="font-black text-red-700 dark:text-red-400">${tri(`Nog oefenen (${wrong.length})`, 'À revoir')}</h3>
            <ul class="space-y-3">
              ${wrong.map((r) => { const d = describe(r.id); return `<li class="text-sm border-l-4 border-red-400 pl-3 space-y-0.5"><p class="font-bold dark:text-white" lang="nl">${esc(d.label)}</p>${d.fr ? `<p class="fr text-xs text-slate-500" lang="fr">${esc(d.fr)}</p>` : ''}<p class="text-emerald-700 dark:text-emerald-400 font-bold">✓ ${esc(d.answer)}</p>${d.expl ? `<p class="text-slate-600 dark:text-slate-300 text-xs" lang="fr">${esc(d.expl)}</p>` : ''}</li>`; }).join('')}
            </ul>
            <p class="text-xs text-slate-500 dark:text-slate-400">${tr('Deze vragen komen later terug bij „Herhalen”.', 'Ces éléments reviendront dans « Réviser ».')}</p>
          </div>` : ''}
        <div class="flex flex-wrap gap-2 justify-center">
          ${wrong.length ? `<button type="button" data-retry class="${BTN_PRIMARY} ${t.btn}"><i class="fa-solid fa-rotate" aria-hidden="true"></i> ${tri('Oefen mijn fouten', 'Refaire mes erreurs')}</button>` : ''}
          <a href="${cfg.backHash || '#/'}" class="${BTN_SECONDARY}">${esc(cfg.backLabel || 'Terug')}</a>
        </div>
      </div>`;
    $('[data-retry]', host)?.addEventListener('click', () =>
      session(host, { ...cfg, title: 'Mijn fouten', ids: shuffle(wrong.map((r) => r.id)), exam: false, timeLimit: null, passMark: null, passNote: null, onFinish: null, summaryExtra: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const great = passed ?? score >= 80;
    playSound(great ? 'fanfare' : passed === false ? 'wrong' : 'fanfare');
    if (great) setTimeout(() => confetti({ count: 120 }), 350);
    setQuiet(false); // affiche maintenant un éventuel passage de niveau
  };

  show();
}
