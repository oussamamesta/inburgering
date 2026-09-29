// Illustrations « dessinées à la main » pour les Verhalen, en SVG pur (aucune image à télécharger).
// Style : trait d’encre légèrement tremblé (feTurbulence + feDisplacementMap), gouache aux couleurs douces, grain de papier.

const INK = '#3a2f2a';
const SK = { a: '#f1c9a5', b: '#d9a37a', c: '#b07850', d: '#7c4f32', e: '#5a3825' }; // teintes de peau
const C = {
  paper: '#f7f0e3', sky: '#cfe2e6', skyGrey: '#b9c3c9', skyEve: '#e9c9a8', grass: '#b9c98f', street: '#cdbfa3', brick: '#b8694d', brick2: '#9c5a45',
  wall: '#efe2c8', wall2: '#dfe7df', floor: '#c9a27a', wood: '#a8774f', white: '#fbf8f1', orange: '#ef8a3c', blue: '#5f86a8', teal: '#5f9c93',
  green: '#7d9f63', red: '#c9594a', yellow: '#e9c35b', plum: '#8a5a7a', grey: '#8d8f91', navy: '#46546b', rose: '#e3a6a0',
};

let uid = 0;
const S = (w = 2) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

// ── Cadre : papier + filtre tremblé + grain ──
function frame(body, label) {
  const n = ++uid;
  return `<svg viewBox="0 0 320 200" class="w-full h-auto block" role="img" aria-label="${label || 'Illustratie'}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="wob${n}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="${n % 9}" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3.2" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="grain${n}"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.28 0 0 0 0 0.2 0 0 0 0.22 0"/></filter>
    </defs>
    <rect width="320" height="200" fill="${C.paper}"/>
    <g filter="url(#wob${n})">${body}</g>
    <rect width="320" height="200" filter="url(#grain${n})" opacity=".55"/>
  </svg>`;
}

// ── Décors ──
const outdoor = (sky = C.sky, ground = C.street, gy = 168) => `<rect x="4" y="4" width="312" height="${gy - 4}" fill="${sky}"/><rect x="4" y="${gy}" width="312" height="${196 - gy}" fill="${ground}"/><path d="M4 ${gy} Q160 ${gy - 2} 316 ${gy}" fill="none" ${S(1.6)}/>`;
const indoor = (wall = C.wall, floor = C.floor, gy = 160) => `<rect x="4" y="4" width="312" height="${gy - 4}" fill="${wall}"/><rect x="4" y="${gy}" width="312" height="${196 - gy}" fill="${floor}"/><path d="M4 ${gy} L316 ${gy}" ${S(1.8)}/><path d="M40 ${gy + 12} L90 ${gy + 12} M150 ${gy + 22} L220 ${gy + 22} M250 ${gy + 10} L300 ${gy + 10}" ${S(1)} opacity=".35"/>`;

const cloud = (x, y, s = 1, fill = C.white) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 10 Q-2 0 10 0 Q14 -10 26 -6 Q36 -12 42 -2 Q54 0 50 10 Z" fill="${fill}" ${S(1.6)}/></g>`;
const sun = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="${C.yellow}" ${S(1.6)}/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => { const r = (a * Math.PI) / 180; return `<path d="M${x + Math.cos(r) * 18} ${y + Math.sin(r) * 18} L${x + Math.cos(r) * 24} ${y + Math.sin(r) * 24}" ${S(1.6)}/>`; }).join('')}`;
const rain = (x0 = 10, x1 = 310, y0 = 10, y1 = 160) => { let s = ''; for (let x = x0; x < x1; x += 17) for (let y = y0 + ((x * 7) % 30); y < y1; y += 38) s += `<path d="M${x} ${y} l-3 9" stroke="${C.blue}" stroke-width="1.6" stroke-linecap="round"/>`; return s; };
const tree = (x, gy, r = 26, fill = C.green) => `<path d="M${x - 3} ${gy} L${x - 2} ${gy - r - 8} L${x + 2} ${gy - r - 8} L${x + 3} ${gy} Z" fill="${C.wood}" ${S(1.6)}/><path d="M${x - r} ${gy - r - 10} Q${x - r - 4} ${gy - 2 * r - 14} ${x} ${gy - 2 * r - 16} Q${x + r + 4} ${gy - 2 * r - 14} ${x + r} ${gy - r - 10} Q${x + r - 2} ${gy - r + 2} ${x} ${gy - r - 2} Q${x - r + 2} ${gy - r + 2} ${x - r} ${gy - r - 10} Z" fill="${fill}" ${S(1.8)}/>`;
const win = (x, y, w = 16, h = 20, glow = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${glow ? '#f6dc8f' : '#dfeaf0'}" ${S(1.5)}/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" ${S(1.1)}/>`;

// Maison de canal avec pignon à gradins.
function gable(x, gy, w = 60, h = 90, fill = C.brick, glow = false) {
  const t = gy - h; const st = w / 6;
  return `<path d="M${x} ${gy} V${t + 20} H${x + st} V${t + 10} H${x + 2 * st} V${t} H${x + 4 * st} V${t + 10} H${x + 5 * st} V${t + 20} H${x + w} V${gy} Z" fill="${fill}" ${S(1.8)}/>
    ${win(x + w * 0.2, t + 28, w * 0.22, w * 0.3, glow)}${win(x + w * 0.58, t + 28, w * 0.22, w * 0.3, glow)}
    ${h > 70 ? `${win(x + w * 0.2, t + 28 + w * 0.42, w * 0.22, w * 0.3, glow)}` : ''}
    <rect x="${x + w * 0.56}" y="${gy - w * 0.46}" width="${w * 0.26}" height="${w * 0.46}" fill="${C.navy}" ${S(1.6)}/>`;
}

const facade = (x, gy, w, h, fill = C.brick) => `<rect x="${x}" y="${gy - h}" width="${w}" height="${h}" fill="${fill}" ${S(1.8)}/><rect x="${x - 4}" y="${gy - h - 6}" width="${w + 8}" height="8" fill="${C.white}" ${S(1.5)}/>`;
const door = (x, gy, fill = C.teal, w = 34, h = 68) => `<rect x="${x}" y="${gy - h}" width="${w}" height="${h}" fill="${fill}" ${S(1.8)}/><circle cx="${x + w - 7}" cy="${gy - h / 2}" r="2" fill="${C.yellow}" ${S(1)}/><rect x="${x + 7}" y="${gy - h + 8}" width="${w - 14}" height="16" fill="#dfeaf0" ${S(1.2)}/>`;
const sign = (x, y, text, fill = C.white, w = null) => { const ww = w || text.length * 7.2 + 16; return `<rect x="${x}" y="${y}" width="${ww}" height="20" rx="4" fill="${fill}" ${S(1.6)}/><text x="${x + ww / 2}" y="${y + 14.5}" text-anchor="middle" font-family="'Segoe Print','Bradley Hand','Chalkboard SE','Comic Sans MS',cursive" font-size="12" font-weight="700" fill="${INK}">${text}</text>`; };
const canal = (y = 176) => `<rect x="4" y="${y}" width="312" height="${196 - y}" fill="#8fb3c4"/><path d="M4 ${y} H316" ${S(1.8)}/><path d="M30 ${y + 9} q8 -3 16 0 M120 ${y + 13} q8 -3 16 0 M220 ${y + 8} q8 -3 16 0" ${S(1.1)} fill="none"/>`;
const clock = (x, y, h = 6) => { const a = (h / 12) * Math.PI * 2 - Math.PI / 2; return `<circle cx="${x}" cy="${y}" r="12" fill="${C.white}" ${S(1.6)}/><path d="M${x} ${y} L${x + Math.cos(a) * 6} ${y + Math.sin(a) * 6} M${x} ${y} L${x} ${y - 9}" ${S(1.5)}/>`; };
const table = (x, gy, w = 80, h = 36, fill = C.wood) => `<rect x="${x}" y="${gy - h}" width="${w}" height="6" fill="${fill}" ${S(1.6)}/><path d="M${x + 6} ${gy - h + 6} V${gy} M${x + w - 6} ${gy - h + 6} V${gy}" ${S(2.4)}/>`;
const chair = (x, gy, fill = C.wood, flip = false) => `<g transform="translate(${x} ${gy}) scale(${flip ? -1 : 1} 1)"><path d="M-10 0 V-22 H10 V0 M-10 -22 V-50" fill="none" ${S(2.4)}/><rect x="-12" y="-25" width="24" height="5" fill="${fill}" ${S(1.4)}/></g>`;
const cup = (x, y, fill = C.white, steam = true) => `<path d="M${x - 6} ${y - 10} H${x + 6} L${x + 5} ${y} H${x - 5} Z" fill="${fill}" ${S(1.4)}/><path d="M${x + 6} ${y - 7} q5 1 0 5" fill="none" ${S(1.2)}/>${steam ? `<path d="M${x - 2} ${y - 14} q-3 -4 0 -8 M${x + 3} ${y - 14} q-3 -4 0 -8" fill="none" ${S(1.1)} opacity=".6"/>` : ''}`;
const cake = (x, y, top = C.rose) => `<path d="M${x - 16} ${y} V${y - 14} Q${x} ${y - 20} ${x + 16} ${y - 14} V${y} Z" fill="#f2dfb8" ${S(1.6)}/><path d="M${x - 16} ${y - 14} Q${x} ${y - 20} ${x + 16} ${y - 14} q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0" fill="${top}" ${S(1.4)}/><ellipse cx="${x}" cy="${y + 1}" rx="21" ry="3.5" fill="${C.white}" ${S(1.3)}/>`;
const pot = (x, gy) => `<path d="M${x - 22} ${gy - 30} H${x + 22} L${x + 19} ${gy} H${x - 19} Z" fill="${C.red}" ${S(1.8)}/><path d="M${x - 22} ${gy - 30} h-7 M${x + 22} ${gy - 30} h7" ${S(2.4)}/><path d="M${x - 8} ${gy - 36} q-5 -7 0 -14 q5 -7 0 -14 M${x + 7} ${gy - 36} q-5 -7 0 -14 q5 -7 0 -14" fill="none" ${S(1.3)} opacity=".6"/>`;
const flowers = (x, y, cols = [C.red, C.yellow, C.rose]) => `<path d="M${x} ${y} L${x - 8} ${y - 22} M${x} ${y} L${x} ${y - 26} M${x} ${y} L${x + 8} ${y - 22}" stroke="${C.green}" stroke-width="2"/>${[[-8, -22], [0, -26], [8, -22]].map(([dx, dy], i) => `<path d="M${x + dx - 4} ${y + dy} q0 -8 4 -8 q4 0 4 8 q-4 3 -8 0 Z" fill="${cols[i % cols.length]}" ${S(1.2)}/>`).join('')}<path d="M${x - 6} ${y - 6} L${x} ${y + 6} L${x + 6} ${y - 6} Z" fill="#e8dcc4" ${S(1.2)}/>`;

function bike(x, gy, fill = C.blue, s = 1) {
  return `<g transform="translate(${x} ${gy}) scale(${s})">
    <circle cx="-24" cy="-16" r="15" fill="none" ${S(2)}/><circle cx="24" cy="-16" r="15" fill="none" ${S(2)}/>
    <circle cx="-24" cy="-16" r="2" fill="${INK}"/><circle cx="24" cy="-16" r="2" fill="${INK}"/>
    <path d="M-24 -16 L-6 -16 L-12 -40 M-6 -16 L16 -38 L-12 -38 M16 -38 L24 -16 M16 -38 L14 -46 L22 -48" fill="none" stroke="${fill}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M-17 -42 H-7" ${S(3)}/><path d="M-24 -16 L-6 -16 L-12 -40 M-6 -16 L16 -38 L-12 -38 M16 -38 L24 -16" fill="none" ${S(0.8)} opacity=".5"/></g>`;
}

const umbrella = (x, y, fill = C.red, broken = false) => broken
  ? `<path d="M${x - 22} ${y - 4} Q${x - 12} ${y - 30} ${x + 2} ${y - 14} Q${x + 10} ${y - 34} ${x + 26} ${y - 22} L${x + 2} ${y}" fill="${fill}" ${S(1.6)}/><path d="M${x + 2} ${y} L${x} ${y + 30}" ${S(1.8)}/><path d="M${x - 16} ${y - 28} l-6 -6 M${x + 22} ${y - 34} l5 -7" ${S(1.2)}/>`
  : `<path d="M${x - 26} ${y} Q${x} ${y - 30} ${x + 26} ${y} q-6.5 -5 -13 0 q-6.5 -5 -13 0 q-6.5 -5 -13 0 q-6.5 -5 -13 0 Z" fill="${fill}" ${S(1.6)}/><path d="M${x} ${y - 2} V${y + 30} q0 5 -5 4" fill="none" ${S(1.8)}/>`;

function stall(x, gy, w = 90, stripe = C.red, goods = '', top = 92) {
  let stripes = '';
  for (let i = 0; i < w; i += 15) stripes += `<path d="M${x + i} ${gy - top} h7.5 v14 q-3.75 4 -7.5 0 Z" fill="${stripe}" ${S(1)}/>`;
  return `<path d="M${x + 4} ${gy} V${gy - top} M${x + w - 4} ${gy} V${gy - top}" ${S(2.4)}/><rect x="${x - 4}" y="${gy - top - 4}" width="${w + 8}" height="6" fill="${C.white}" ${S(1.6)}/>
    <rect x="${x}" y="${gy - top}" width="${w}" height="14" fill="${C.white}" ${S(1.4)}/>${stripes}
    <rect x="${x - 2}" y="${gy - 44}" width="${w + 4}" height="44" fill="${C.wood}" ${S(1.8)}/>${goods}`;
}
const apples = (x, y, n = 7, fill = C.red) => Array.from({ length: n }, (_, i) => `<circle cx="${x + (i % 4) * 11 + (i >= 4 ? 5 : 0)}" cy="${y - (i >= 4 ? 9 : 0)}" r="5.5" fill="${fill}" ${S(1.2)}/>`).join('');
const cheese = (x, y) => `<path d="M${x} ${y} L${x + 34} ${y} L${x + 34} ${y - 16} L${x} ${y - 16} Z" fill="${C.yellow}" ${S(1.6)}/><ellipse cx="${x + 17}" cy="${y - 16}" rx="17" ry="4" fill="#f3d77e" ${S(1.3)}/>`;
const bunting = (y = 22, cols = [C.orange, C.white, C.blue, C.red]) => `<path d="M4 ${y} Q160 ${y + 16} 316 ${y}" fill="none" ${S(1.4)}/>${Array.from({ length: 14 }, (_, i) => { const x = 14 + i * 22; const yy = y + Math.sin((i / 13) * Math.PI) * 8; return `<path d="M${x} ${yy} L${x + 14} ${yy + 1} L${x + 7} ${yy + 14} Z" fill="${cols[i % cols.length]}" ${S(1.1)}/>`; }).join('')}`;
const rainbow = (x, y, r = 110) => [C.red, C.orange, C.yellow, C.green, C.blue].map((c, i) => `<path d="M${x - r + i * 7} ${y} A${r - i * 7} ${r - i * 7} 0 0 1 ${x + r - i * 7} ${y}" fill="none" stroke="${c}" stroke-width="7" opacity=".8"/>`).join('');
const bus = (x, gy) => `<rect x="${x}" y="${gy - 62}" width="120" height="50" rx="8" fill="${C.yellow}" ${S(1.8)}/>${[0, 1, 2, 3].map((i) => win(x + 10 + i * 27, gy - 54, 20, 18)).join('')}<circle cx="${x + 26}" cy="${gy - 10}" r="10" fill="${INK}"/><circle cx="${x + 94}" cy="${gy - 10}" r="10" fill="${INK}"/><rect x="${x + 4}" y="${gy - 30}" width="112" height="5" fill="${C.red}" ${S(1)}/>`;
const busStop = (x, gy) => `<path d="M${x} ${gy} V${gy - 84}" ${S(2.6)}/><circle cx="${x}" cy="${gy - 92}" r="11" fill="${C.yellow}" ${S(1.8)}/><text x="${x}" y="${gy - 88}" text-anchor="middle" font-family="sans-serif" font-size="10" font-weight="900" fill="${INK}">H</text>`;
const phone = (x, y) => `<rect x="${x}" y="${y}" width="7" height="12" rx="1.5" fill="${INK}"/>`;
const bed = (x, gy) => `<rect x="${x}" y="${gy - 26}" width="92" height="18" fill="${C.white}" ${S(1.6)}/><path d="M${x} ${gy} V${gy - 44} M${x + 92} ${gy} V${gy - 30}" ${S(2.6)}/><rect x="${x + 4}" y="${gy - 36}" width="24" height="10" rx="4" fill="${C.white}" ${S(1.3)}/><path d="M${x + 26} ${gy - 30} Q${x + 60} ${gy - 44} ${x + 92} ${gy - 28} V${gy - 12} H${x + 26} Z" fill="${C.teal}" ${S(1.5)}/>`;
const oven = (x, gy) => `<rect x="${x}" y="${gy - 80}" width="70" height="80" fill="${C.grey}" ${S(1.8)}/><rect x="${x + 8}" y="${gy - 64}" width="54" height="32" rx="3" fill="#e8a25a" ${S(1.6)}/><path d="M${x + 14} ${gy - 44} q10 -8 20 0 q10 -8 20 0" fill="#c98b4b" ${S(1.2)}/>`;
const breads = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="14" ry="7" fill="#d69a57" ${S(1.4)}/><ellipse cx="${x + 30}" cy="${y}" rx="14" ry="7" fill="#c98b4b" ${S(1.4)}/><path d="M${x - 6} ${y - 3} l4 4 M${x} ${y - 4} l4 4 M${x + 24} ${y - 3} l4 4" ${S(1)}/>`;
const shelf = (x, y, w = 110) => `<rect x="${x}" y="${y}" width="${w}" height="5" fill="${C.wood}" ${S(1.4)}/>`;
const blanket = (x, gy, w = 110, fill = C.blue) => `<path d="M${x} ${gy + 4} L${x + 10} ${gy - 12} H${x + w + 10} L${x + w} ${gy + 4} Z" fill="${fill}" ${S(1.6)}/><path d="M${x + 12} ${gy - 4} H${x + w} " ${S(1)} opacity=".4"/>`;
const books = (x, y) => `<rect x="${x}" y="${y - 8}" width="22" height="8" fill="${C.red}" ${S(1.2)}/><rect x="${x + 2}" y="${y - 15}" width="20" height="7" fill="${C.green}" ${S(1.2)}/><rect x="${x - 1}" y="${y - 21}" width="22" height="6" fill="${C.yellow}" ${S(1.2)}/>`;
const lamp = (x, y) => `<path d="M${x - 10} ${y - 26} H${x + 10} L${x + 6} ${y - 40} H${x - 6} Z" fill="${C.yellow}" ${S(1.4)}/><path d="M${x} ${y - 26} V${y - 3}" ${S(2)}/><path d="M${x - 8} ${y} H${x + 8}" ${S(2.6)}/>`;
const notes = (x, y) => `<path d="M${x} ${y} v-12 l8 -3 v12" fill="none" ${S(1.5)}/><circle cx="${x - 2}" cy="${y}" r="2.6" fill="${INK}"/><circle cx="${x + 6}" cy="${y - 3}" r="2.6" fill="${INK}"/>`;
const bikeRack = (x, gy, n = 5, cols = [C.navy, C.red, C.green, C.grey, C.plum]) => Array.from({ length: n }, (_, i) => bike(x + i * 30, gy, cols[i % cols.length], 0.62)).join('') + `<path d="M${x - 20} ${gy - 12} H${x + n * 30}" ${S(2)}/>`;
const tag = (x, y, t) => `<g transform="rotate(-8 ${x} ${y})"><rect x="${x}" y="${y}" width="${t.length * 6.4 + 10}" height="15" rx="3" fill="${C.white}" ${S(1.2)}/><text x="${x + 5}" y="${y + 11}" font-family="'Segoe Print','Comic Sans MS',cursive" font-size="10" font-weight="700" fill="${INK}">${t}</text></g>`;

// ── Personnages adultes ──
// o : { skin, hair, style: short|long|bun|curly|scarf|bald|wavy, top, bottom, dress, pose: down|wave|hold|point|hips|phone, flip, s, beard, glasses, apron, coat, mood: smile|calm|sad|laugh }
function arm(a, b, via, col, skin) {
  return `<path d="M${a} Q${via} ${b}" fill="none" stroke="${INK}" stroke-width="8.4" stroke-linecap="round"/><path d="M${a} Q${via} ${b}" fill="none" stroke="${col}" stroke-width="5.4" stroke-linecap="round"/><circle cx="${b.split(' ')[0]}" cy="${b.split(' ')[1]}" r="3.3" fill="${skin}" ${S(1.2)}/>`;
}
const POSES = {
  down: [['12 -65', '15 -37', '17 -50'], ['-12 -65', '-15 -37', '-17 -50']],
  wave: [['12 -65', '22 -95', '26 -78'], ['-12 -65', '-15 -37', '-17 -50']],
  hold: [['12 -65', '7 -46', '19 -52'], ['-12 -65', '-7 -46', '-19 -52']],
  point: [['12 -65', '34 -68', '24 -62'], ['-12 -65', '-15 -37', '-17 -50']],
  hips: [['12 -65', '11 -40', '24 -52'], ['-12 -65', '-11 -40', '-24 -52']],
  phone: [['12 -65', '9 -82', '22 -70'], ['-12 -65', '-15 -37', '-17 -50']],
  give: [['12 -65', '30 -55', '22 -54'], ['-12 -65', '-15 -37', '-17 -50']],
  up: [['12 -65', '20 -96', '25 -80'], ['-12 -65', '-20 -96', '-25 -80']],
};

export function person(x, gy, o = {}) {
  const { skin = SK.b, hair = '#3b2a20', style = 'short', top = C.blue, bottom = C.navy, dress = false, pose = 'down', flip = false, s = 1,
    beard = false, glasses = false, apron = false, coat = false, mood = 'smile', item = '' } = o;
  const hairBack = style === 'long' ? `<path d="M-11 -84 Q-13 -97 0 -96 Q13 -97 11 -84 L13 -62 Q0 -58 -13 -62 Z" fill="${hair}" ${S(1.5)}/>`
    : style === 'wavy' ? `<path d="M-11 -84 Q-14 -97 0 -96 Q14 -97 11 -84 q4 6 1 12 q3 5 0 10 Q0 -58 -12 -62 q-3 -5 0 -10 q-3 -6 1 -12 Z" fill="${hair}" ${S(1.5)}/>` : '';
  const hairFront = {
    short: `<path d="M-10.5 -83 Q-11.5 -96 0 -95 Q11.5 -96 10.5 -83 Q7 -90 0 -89 Q-7 -90 -10.5 -83 Z" fill="${hair}" ${S(1.4)}/>`,
    long: `<path d="M-10.5 -82 Q-11 -96 0 -95 Q11 -96 10.5 -82 Q9 -88 2 -89 Q-6 -86 -10.5 -82 Z" fill="${hair}" ${S(1.4)}/>`,
    wavy: `<path d="M-10.5 -82 Q-11 -96 0 -95 Q11 -96 10.5 -82 Q6 -89 -1 -88 Q-7 -86 -10.5 -82 Z" fill="${hair}" ${S(1.4)}/>`,
    bun: `<circle cx="0" cy="-97" r="5.5" fill="${hair}" ${S(1.3)}/><path d="M-10.5 -83 Q-11.5 -96 0 -95 Q11.5 -96 10.5 -83 Q7 -90 0 -90 Q-7 -90 -10.5 -83 Z" fill="${hair}" ${S(1.4)}/>`,
    curly: [[-9, -88], [-5, -94], [1, -96], [7, -93], [10, -87], [-11, -82], [11, -81]].map(([cx, cy]) => `<circle cx="${cx}" cy="${cy}" r="4.6" fill="${hair}" ${S(1.2)}/>`).join(''),
    bald: `<path d="M-10 -86 Q-11 -90 -8 -92 M10 -86 Q11 -90 8 -92" fill="none" stroke="${hair}" stroke-width="3" stroke-linecap="round"/>`,
    scarf: '',
  }[style] || '';
  const scarf = style === 'scarf' ? `<path d="M-14 -80 Q-15 -98 0 -98 Q15 -98 14 -80 L17 -63 Q0 -58 -17 -63 Z" fill="${hair}" ${S(1.6)}/><ellipse cx="0" cy="-81" rx="7.6" ry="9" fill="${skin}" ${S(1.3)}/>` : '';
  const mouth = { smile: 'M-3.2 -77 Q0 -74.6 3.2 -77', calm: 'M-2.4 -76.4 H2.4', sad: 'M-3 -75.4 Q0 -77.6 3 -75.4', laugh: 'M-3.6 -77.4 Q0 -72.6 3.6 -77.4 Z' }[mood];
  const [r, l] = POSES[pose] || POSES.down;
  const legs = dress
    ? `<path d="M-6 -16 V-2 M6 -16 V-2" stroke="${skin}" stroke-width="4.2" stroke-linecap="round"/><path d="M-6 -16 V-2 M6 -16 V-2" fill="none" ${S(0.8)} opacity=".6"/>`
    : `<path d="M-10 -38 L-9 -3 L-2 -3 L-0.5 -34 L0.5 -34 L2 -3 L9 -3 L10 -38 Z" fill="${bottom}" ${S(1.6)}/>`;
  const torso = dress
    ? `<path d="M-12 -68 Q0 -72 12 -68 L17 -14 Q0 -10 -17 -14 Z" fill="${top}" ${S(1.7)}/>`
    : `<path d="M-12.5 -68 Q0 -72 12.5 -68 L${coat ? 14 : 11.5} ${coat ? -24 : -35} L${coat ? -14 : -11.5} ${coat ? -24 : -35} Z" fill="${top}" ${S(1.7)}/>${coat ? `<path d="M0 -69 V-24" ${S(1.1)}/>` : ''}`;
  const apronP = apron ? `<path d="M-8 -62 H8 L10 -24 H-10 Z" fill="${C.white}" ${S(1.4)}/><path d="M-8 -62 Q0 -70 8 -62" fill="none" ${S(1)}/>` : '';
  const beardP = beard ? `<path d="M-9.5 -82 Q-10 -70 0 -69 Q10 -70 9.5 -82 Q6 -76 0 -76 Q-6 -76 -9.5 -82 Z" fill="${hair}" ${S(1.2)}/><path d="${mouth}" fill="none" stroke="${C.white}" stroke-width="1.2" stroke-linecap="round"/>` : '';
  const glassesP = glasses ? `<circle cx="-4" cy="-82.5" r="3.4" fill="none" ${S(1.2)}/><circle cx="4" cy="-82.5" r="3.4" fill="none" ${S(1.2)}/><path d="M-0.6 -82.5 H0.6" ${S(1.2)}/>` : '';
  return `<g transform="translate(${x} ${gy}) scale(${flip ? -s : s} ${s})">
    ${hairBack}
    ${legs}<ellipse cx="-5.5" cy="-1.5" rx="5.5" ry="3" fill="#2e2622"/><ellipse cx="5.5" cy="-1.5" rx="5.5" ry="3" fill="#2e2622"/>
    ${arm(l[0], l[1], l[2], top, skin)}
    ${torso}${apronP}
    <path d="M-3 -72 V-68 M3 -72 V-68" stroke="${skin}" stroke-width="5"/>
    <circle cx="0" cy="-82" r="10.5" fill="${skin}" ${S(1.6)}/>
    ${scarf}${hairFront}
    <circle cx="-3.6" cy="-82.5" r="1.25" fill="${INK}"/><circle cx="3.6" cy="-82.5" r="1.25" fill="${INK}"/>
    <circle cx="-6.5" cy="-78.5" r="2.2" fill="#e58f7a" opacity=".35"/><circle cx="6.5" cy="-78.5" r="2.2" fill="#e58f7a" opacity=".35"/>
    ${beardP || `<path d="${mouth}" fill="${mood === 'laugh' ? '#9b4a3c' : 'none'}" ${S(1.2)}/>`}${glassesP}
    ${arm(r[0], r[1], r[2], top, skin)}
    ${item}
  </g>`;
}

// ── Distribution des personnages ──
const P = {
  samir: { skin: SK.c, hair: '#2a1d16', style: 'short', top: C.green, bottom: C.navy },
  joost: { skin: SK.a, hair: '#c9a36b', style: 'short', top: C.orange, bottom: C.navy, apron: true, beard: true },
  amina: { skin: SK.c, hair: C.plum, style: 'scarf', top: C.teal, dress: true },
  lotte: { skin: SK.a, hair: '#b5793e', style: 'bun', top: C.rose, bottom: C.navy, apron: true },
  karim: { skin: SK.d, hair: '#1f1612', style: 'short', top: C.yellow, bottom: C.navy },
  devries: { skin: SK.a, hair: '#c9c6c0', style: 'bun', top: C.blue, dress: true, glasses: true },
  yusuf: { skin: SK.c, hair: '#1f1612', style: 'curly', top: C.navy, bottom: '#5b5f66', coat: true },
  fatima: { skin: SK.d, hair: '#1f1612', style: 'curly', top: C.orange, dress: true },
  priya: { skin: SK.c, hair: '#1f1612', style: 'long', top: C.plum, dress: true },
  daan: { skin: SK.a, hair: '#8b5a2b', style: 'short', top: C.blue, bottom: C.navy, glasses: true },
  ahmed: { skin: SK.b, hair: '#2a1d16', style: 'short', top: C.grey, bottom: C.navy, beard: true },
  arts: { skin: SK.e, hair: '#1f1612', style: 'long', top: C.white, bottom: C.navy, coat: true },
  sanne: { skin: SK.a, hair: '#d8a24a', style: 'wavy', top: C.orange, bottom: C.navy },
  man: { skin: SK.b, hair: '#6b4a32', style: 'bald', top: C.red, bottom: C.navy, apron: true, beard: true },
  vrouw: { skin: SK.a, hair: '#7a4a2a', style: 'bun', top: C.green, dress: true },
};
const who = (key, x, gy, extra = {}) => person(x, gy, { ...P[key], ...extra });

// ── Scènes par histoire ──
const SCENES = {
  fiets: [
    () => outdoor(C.sky, C.street) + cloud(30, 26, 0.9) + cloud(220, 18) + gable(120, 168, 110, 120, C.brick) + sign(137, 62, 'FIETSEN', C.yellow) + bike(70, 168, C.red, 0.8) + bike(270, 168, C.blue, 0.8) + who('samir', 60 + 150, 168, { pose: 'point' }),
    () => indoor(C.wall2, C.floor) + shelf(20, 60, 90) + shelf(210, 60, 90) + `<circle cx="40" cy="48" r="10" fill="none" ${S(1.6)}/><circle cx="240" cy="48" r="10" fill="none" ${S(1.6)}/>` + tag(200, 92, '€ 120') + bike(170, 160, C.blue, 1) + who('joost', 95, 160, { pose: 'give' }) + who('samir', 250, 160, { flip: true, mood: 'laugh' }),
    () => outdoor(C.sky, C.street, 150) + sun(270, 34) + cloud(40, 30, 0.8) + gable(10, 150, 60, 100, C.brick2) + gable(70, 150, 56, 110, C.brick) + gable(126, 150, 60, 95, '#c98e5e') + gable(186, 150, 54, 105, C.brick2) + gable(240, 150, 76, 90, C.brick) + canal(172) + who('samir', 160, 165, { pose: 'point', s: 0.9, mood: 'laugh' }) + bike(165, 172, C.blue, 0.95),
    () => outdoor(C.skyGrey, C.street) + `<rect x="30" y="40" width="260" height="86" fill="#d9cdb5" ${S(1.8)}/><path d="M30 40 Q160 -4 290 40" fill="#c3b598" ${S(1.8)}/>` + clock(160, 62, 8) + sign(126, 90, 'STATION', C.white, 68) + bikeRack(50, 168, 6) + who('samir', 260, 168, { item: `<rect x="4" y="-44" width="14" height="10" rx="3" fill="${C.yellow}" ${S(1.2)}/>`, pose: 'hold' }),
  ],
  werkdag: [
    () => indoor('#d9d4e6', C.floor) + `<rect x="200" y="24" width="80" height="70" fill="#2f3a5a" ${S(1.8)}/><circle cx="262" cy="42" r="7" fill="${C.white}" ${S(1)}/><path d="M240 24 V94 M200 59 H280" ${S(1.4)}/>` + clock(60, 40, 6) + table(30, 160, 90) + cup(60, 124) + who('amina', 150, 160, { mood: 'calm', pose: 'hold' }),
    () => outdoor(C.skyEve, C.street) + gable(60, 168, 170, 130, '#e0c49a') + sign(105, 56, 'BAKKERIJ', C.white) + `<rect x="80" y="80" width="60" height="44" fill="#f6dc8f" ${S(1.6)}/>` + breads(96, 110) + who('lotte', 195, 168, { pose: 'wave' }) + who('amina', 260, 168, { flip: true, pose: 'hold', item: `<path d="M-6 -60 H10 L12 -34 H-8 Z" fill="${C.white}" ${S(1.2)}/>` }),
    () => indoor('#f1dcc0', '#b99571') + oven(210, 160) + shelf(20, 70, 110) + breads(38, 64) + breads(90, 64) + table(20, 160, 150, 44, '#d9c3a0') + breads(50, 112) + breads(110, 112) + who('lotte', 90, 160, { pose: 'point', s: 0.95 }) + who('amina', 170, 160, { pose: 'hold', apron: true, flip: true, mood: 'laugh', s: 0.95 }),
    () => outdoor(C.sky, C.grass) + sun(40, 34) + tree(280, 168, 28) + table(110, 168, 100) + cup(135, 130) + cup(185, 130) + `<path d="M150 128 q10 -8 20 0 Z" fill="#d69a57" ${S(1.2)}/>` + who('amina', 95, 168, { flip: true, mood: 'laugh', apron: false }) + who('lotte', 228, 168, { flip: true, mood: 'laugh', pose: 'wave', apron: false }),
  ],
  soep: [
    () => outdoor(C.sky, C.street) + cloud(250, 22) + gable(40, 168, 120, 130, C.brick) + gable(170, 168, 110, 120, C.brick2) + `<rect x="58" y="60" width="40" height="36" fill="#f6dc8f" ${S(1.6)}/>` + `<g transform="translate(78 97) scale(.7)">${person(0, 0, { ...P.devries, mood: 'sad' })}</g>` + `<rect x="54" y="92" width="48" height="6" fill="${C.white}" ${S(1.3)}/>` + who('karim', 235, 168, { flip: true, mood: 'calm', pose: 'point' }),
    () => indoor('#e7eadf', '#b99571') + `<rect x="20" y="118" width="280" height="42" fill="${C.wood}" ${S(1.8)}/>` + pot(110, 118) + `<g>${[0, 1, 2].map((i) => `<path d="M${160 + i * 12} 116 l10 -2 l-10 -4 Z" fill="${C.orange}" ${S(1)}/>`).join('')}<circle cx="205" cy="111" r="6" fill="#d8b56f" ${S(1.1)}/><ellipse cx="222" cy="112" rx="6" ry="5" fill="#b98a55" ${S(1.1)}/></g>` + shelf(200, 50, 90) + `<rect x="210" y="34" width="14" height="16" fill="${C.red}" ${S(1.1)}/><rect x="232" y="30" width="12" height="20" fill="${C.green}" ${S(1.1)}/>` + who('karim', 60, 160, { apron: true, pose: 'hold', mood: 'smile' }),
    () => outdoor(C.sky, C.street) + facade(10, 168, 200, 140, C.brick) + win(40, 50, 40, 44) + door(120, 168, C.teal, 44, 90) + `<circle cx="176" cy="104" r="3.5" fill="${C.white}" ${S(1.1)}/>` + who('devries', 144, 168, { pose: 'hold', mood: 'laugh', s: 0.95 }) + who('karim', 235, 168, { flip: true, pose: 'give', item: `<g transform="translate(30 -52) scale(.45)">${pot(0, 30)}</g>` }),
    () => indoor('#f2e3cf', C.floor) + `<rect x="210" y="30" width="70" height="56" fill="#dfeaf0" ${S(1.8)}/><path d="M245 30 V86 M210 58 H280" ${S(1.3)}/>` + table(90, 160, 140) + cup(120, 124) + cup(200, 124) + cake(160, 124, '#d69a57') + chair(70, 160, C.wood) + chair(250, 160, C.wood, true) + who('devries', 60, 160, { mood: 'laugh', pose: 'hips' }) + who('karim', 262, 160, { flip: true, mood: 'laugh', pose: 'wave' }),
  ],
  regen: [
    () => outdoor(C.skyGrey, '#b8b0a0') + cloud(20, 24, 1.2, '#dfe3e6') + cloud(160, 16, 1.4, '#dfe3e6') + rain() + gable(220, 168, 90, 110, C.brick2) + umbrella(150, 70, C.red, true) + who('yusuf', 150, 168, { pose: 'up', mood: 'sad' }) + `<path d="M40 60 q20 -6 40 0 M50 80 q20 -6 40 0" fill="none" ${S(1.3)} opacity=".6"/>`,
    () => outdoor(C.skyGrey, '#b8b0a0') + cloud(60, 20, 1.3, '#dfe3e6') + rain() + busStop(70, 168) + `<rect x="100" y="80" width="80" height="88" fill="#dfeaf0" opacity=".6" ${S(1.6)}/><path d="M96 80 H184" ${S(2.4)}/>` + clock(250, 50, 9) + who('yusuf', 140, 168, { mood: 'sad', pose: 'hips' }) + `<path d="M130 70 q-2 -6 2 -8 M150 70 q2 -6 -2 -8" fill="none" stroke="${C.blue}" stroke-width="1.6"/>`,
    () => indoor('#ead8c0', '#9c7a58') + `<rect x="30" y="26" width="120" height="80" fill="#b9c3c9" ${S(1.8)}/><path d="M90 26 V106 M30 66 H150" ${S(1.3)}/>` + rain(34, 146, 30, 104) + sign(190, 36, 'CAFÉ', C.white, 60) + table(110, 160, 100) + cup(140, 124, '#8a5a3c') + cup(185, 124) + who('yusuf', 90, 160, { mood: 'laugh' }) + who('vrouw', 240, 160, { flip: true, mood: 'laugh', pose: 'hold', s: 0.97 }),
    () => outdoor('#d7e6e9', '#b8b0a0') + rainbow(170, 150, 120) + cloud(10, 30, 1, '#eef0f0') + sun(290, 30) + gable(8, 168, 60, 100, C.brick) + gable(68, 168, 54, 86, C.brick2) + gable(250, 168, 66, 104, '#c98e5e') + `<ellipse cx="170" cy="182" rx="40" ry="5" fill="#9dbbcb" ${S(1.2)}/>` + who('yusuf', 170, 176, { pose: 'wave', mood: 'laugh' }),
  ],
  markt: [
    () => outdoor(C.sky, '#d8c8a4') + cloud(130, 18) + stall(10, 168, 90, C.red, apples(20, 118) + apples(62, 118, 7, C.green)) + stall(120, 168, 80, C.blue, cheese(134, 122) + cheese(160, 118)) + stall(230, 168, 80, C.green, `<path d="M242 120 q10 -8 20 0 q-10 6 -20 0 Z M270 120 q10 -8 20 0 q-10 6 -20 0 Z" fill="#aac2cc" ${S(1.1)}/>`) + who('fatima', 210, 188, { s: 0.85, item: `<rect x="10" y="-44" width="14" height="18" rx="3" fill="${C.wood}" ${S(1.2)}/>` }),
    () => outdoor(C.sky, '#d8c8a4') + who('man', 115, 168, { s: 1, pose: 'wave', mood: 'laugh' }) + stall(30, 168, 170, C.red, apples(50, 118) + apples(100, 118, 8, C.green) + apples(150, 118, 6, C.yellow), 114) + tag(150, 96, '€ 2,50 / kilo') + who('fatima', 260, 168, { flip: true, pose: 'give' }),
    () => outdoor(C.sky, '#d8c8a4') + who('vrouw', 115, 168, { s: 1, pose: 'wave', apron: true, mood: 'smile' }) + stall(30, 168, 170, C.blue, cheese(46, 122) + cheese(92, 120) + cheese(138, 122), 114) + tag(40, 98, 'JONG · OUD') + who('fatima', 258, 168, { flip: true, mood: 'laugh', pose: 'phone' }),
    () => outdoor(C.skyEve, C.street) + sun(270, 40) + gable(10, 168, 70, 110, C.brick) + gable(80, 168, 60, 96, C.brick2) + tree(250, 168, 24) + who('fatima', 160, 168, { pose: 'hold', mood: 'laugh', item: flowers(-12, -50) + `<path d="M8 -46 h16 l-2 26 h-12 Z" fill="${C.wood}" ${S(1.3)}/>` }),
  ],
  verjaardag: [
    () => outdoor('#3c4a66', C.street) + `<circle cx="270" cy="34" r="12" fill="#f3ead2" ${S(1.4)}/>` + gable(40, 168, 140, 130, C.brick, true) + door(142, 168, C.red, 30, 62) + who('priya', 220, 168, { flip: true, pose: 'hold', item: flowers(0, -44) }),
    () => indoor('#efe2c8', C.floor) + [30, 80, 240, 290].map((x, i) => chair(x, 160, [C.red, C.teal, C.yellow, C.plum][i], i > 1)).join('') + who('daan', 70, 160, { pose: 'down', s: 0.92 }) + who('vrouw', 200, 160, { flip: true, pose: 'give', s: 0.92, style: 'short', hair: '#b9b3aa', glasses: true }) + who('priya', 150, 160, { pose: 'give', mood: 'laugh' }),
    () => indoor('#efe2c8', C.floor) + table(90, 160, 140, 34) + cake(160, 126) + cup(115, 126) + cup(205, 126) + [40, 280].map((x, i) => chair(x, 160, [C.teal, C.yellow][i], i > 0)).join('') + who('daan', 60, 160, { mood: 'laugh', pose: 'wave' }) + who('priya', 262, 160, { flip: true, mood: 'laugh' }),
    () => indoor('#efe2c8', C.floor) + bunting(18, [C.red, C.yellow, C.teal, C.plum]) + notes(40, 70) + notes(270, 60) + who('vrouw', 70, 160, { mood: 'laugh', pose: 'up', s: 0.9, style: 'short', hair: '#b9b3aa', glasses: true }) + who('daan', 160, 160, { mood: 'laugh', pose: 'up' }) + who('priya', 250, 160, { flip: true, mood: 'laugh', pose: 'up', s: 0.95 }),
  ],
  huisarts: [
    () => indoor('#dfe3e8', C.floor) + bed(190, 160) + clock(60, 40, 8) + who('ahmed', 110, 160, { pose: 'phone', mood: 'sad', item: phone(4, -92) }),
    () => indoor('#e2ece6', '#a9b8ae') + clock(250, 40, 10) + `<rect x="30" y="30" width="60" height="44" fill="${C.white}" ${S(1.6)}/><path d="M60 40 V64 M48 52 H72" stroke="${C.red}" stroke-width="5"/>` + [60, 110, 210, 260].map((x) => chair(x, 160, C.teal)).join('') + who('ahmed', 160, 160, { mood: 'calm', pose: 'hold', item: `<rect x="-6" y="-52" width="14" height="9" rx="2" fill="${C.blue}" ${S(1.1)}/>` }),
    () => indoor('#e9eef0', '#a9b8ae') + `<rect x="200" y="30" width="70" height="50" fill="#dfeaf0" ${S(1.6)}/>` + table(90, 160, 120, 40, C.white) + `<rect x="120" y="108" width="30" height="10" fill="${C.blue}" ${S(1.1)}/>` + who('arts', 80, 160, { pose: 'point', mood: 'smile', item: `<path d="M-8 -66 q0 16 8 18 q8 -2 8 -18" fill="none" ${S(1.4)}/>` }) + who('ahmed', 245, 160, { flip: true, mood: 'calm' }),
    () => outdoor(C.sky, C.street) + sun(40, 34) + facade(70, 168, 170, 120, '#e3d7c3') + door(180, 168, C.navy, 36, 70) + win(140, 100, 26, 34) + sign(110, 58, 'APOTHEEK', C.white) + `<rect x="100" y="80" width="20" height="20" fill="${C.green}" ${S(1.4)}/><path d="M110 84 V96 M104 90 H116" stroke="${C.white}" stroke-width="3.4"/>` + who('ahmed', 260, 168, { flip: true, mood: 'smile', pose: 'hold', item: `<rect x="-6" y="-54" width="14" height="16" rx="2" fill="${C.white}" ${S(1.2)}/>` }),
  ],
  koningsdag: [
    () => outdoor(C.sky, C.street) + bunting(26) + gable(10, 168, 80, 120, C.brick) + gable(230, 168, 80, 120, C.brick2) + `<path d="M150 34 V100" ${S(2)}/><path d="M150 36 h40 v8 h-40 Z" fill="${C.red}" ${S(1)}/><path d="M150 44 h40 v8 h-40 Z" fill="${C.white}" ${S(1)}/><path d="M150 52 h40 v8 h-40 Z" fill="${C.blue}" ${S(1)}/><path d="M150 60 h40 l-8 5 l8 5 h-40 Z" fill="${C.orange}" ${S(1)}/>` + who('sanne', 110, 168, { pose: 'wave', mood: 'laugh' }) + who('karim', 180, 168, { top: C.orange, mood: 'laugh', flip: true }),
    () => outdoor(C.sky, C.street) + bunting(18) + blanket(40, 170, 150, C.blue) + books(70, 162) + lamp(140, 164) + tag(100, 132, '€ 2') + who('sanne', 240, 168, { flip: true, pose: 'point', mood: 'laugh' }),
    () => outdoor(C.sky, C.street) + bunting(18) + notes(60, 60) + notes(250, 70) + notes(160, 44) + who('fatima', 80, 168, { top: C.orange, pose: 'up', mood: 'laugh', s: 0.95 }) + who('sanne', 160, 168, { pose: 'phone', mood: 'laugh', item: `<rect x="2" y="-96" width="16" height="7" rx="2" fill="${C.orange}" ${S(1.1)}/><rect x="2" y="-90" width="16" height="6" fill="#f3e6c6" ${S(1)}/>` }) + who('yusuf', 240, 168, { top: C.orange, coat: false, pose: 'up', flip: true, mood: 'laugh' }),
    () => outdoor('#e7b98f', C.street) + `<circle cx="260" cy="120" r="24" fill="${C.orange}" opacity=".85"/>` + gable(10, 168, 70, 110, C.brick, true) + gable(80, 168, 60, 96, C.brick2, true) + bunting(24, [C.orange]) + blanket(150, 172, 70, C.blue) + who('sanne', 200, 168, { mood: 'smile', pose: 'hold', flip: true, item: `<rect x="-6" y="-50" width="14" height="8" rx="2" fill="${C.green}" ${S(1)}/>` }),
  ],
};

export function scene(storyId, i, label = '') {
  const f = SCENES[storyId]?.[i];
  return f ? frame(f(), label) : '';
}
export const hasScenes = (storyId) => !!SCENES[storyId];
