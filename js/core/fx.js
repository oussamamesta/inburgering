// Effets visuels : confettis, « +10 XP » flottant, anneaux de progression.
// Tout mouvement est désactivé si le téléphone demande de réduire les animations.

const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const COLORS = ['#D93F00', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FFFFFF', '#21468B', '#AE1C28'];

// Confettis dans un calque plein écran, supprimé automatiquement.
export function confetti({ count = 90, spread = 1 } = {}) {
  if (reduced()) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'fixed inset-0 pointer-events-none z-[70]';
  canvas.setAttribute('aria-hidden', 'true');
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = window.innerWidth;
  const parts = Array.from({ length: count }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3 * spread,
    y: window.innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 9 * spread,
    vy: -Math.random() * 11 - 4,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
  const start = performance.now();
  const frame = (t) => {
    const age = t - start;
    ctx.clearRect(0, 0, W, window.innerHeight);
    for (const p of parts) {
      p.vy += 0.32; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - age / 2200);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (age < 2200) requestAnimationFrame(frame); else canvas.remove();
  };
  requestAnimationFrame(frame);
}

// Petit texte qui monte et disparaît au-dessus d’un élément (ex. « +10 XP »).
export function floatText(anchor, text, cls = 'text-emerald-600 dark:text-emerald-400') {
  if (!anchor || reduced()) return;
  const r = anchor.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = `fixed z-[65] pointer-events-none font-black text-lg drop-shadow animate-float-up ${cls}`;
  el.style.left = `${r.left + r.width / 2}px`;
  el.style.top = `${r.top}px`;
  el.textContent = text;
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

// Anneau de progression en SVG. `track` et `color` sont des classes de couleur (currentColor).
export function ring(percent, { size = 64, stroke = 8, color = 'text-dutchOrange', track = 'text-slate-200 dark:text-slate-700', inner = '', animate = true, label = '' } = {}) {
  const p = Math.max(0, Math.min(100, percent || 0));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - p / 100);
  return `<div class="relative shrink-0" style="width:${size}px;height:${size}px" role="img" aria-label="${label || `${Math.round(p)} %`}">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="-rotate-90">
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-width="${stroke}" class="${track}"></circle>
      <circle cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round"
        class="${color} ${animate ? 'ring-anim' : ''}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" style="--ring-from:${c.toFixed(1)}"></circle>
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">${inner}</div>
  </div>`;
}
