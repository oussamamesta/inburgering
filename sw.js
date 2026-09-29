// Service worker : garde une copie de l’application pour l’utiliser sans connexion.
// Pensez à changer VERSION à chaque mise à jour (voir README).

const VERSION = 'v1.3.0';
const CACHE = `inburgering-${VERSION}`;

const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/app.css',
  './vendor/fontawesome/css/fa.min.css',
  './vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './js/app.js',
  './js/core/util.js',
  './js/core/store.js',
  './js/core/learner.js',
  './js/core/audio.js',
  './js/core/ui.js',
  './js/core/theme.js',
  './js/core/engine.js',
  './js/content/index.js',
  './js/content/kns.js',
  './js/content/manuel.js',
  './js/content/vocab.js',
  './js/content/lessons.js',
  './js/content/kns_plus.js',
  './js/content/spreken.js',
  './js/core/micro.js',
  './js/views/parler.js',
  './js/views/accueil.js',
  './js/views/manuel.js',
  './js/views/kns.js',
  './js/views/mots.js',
  './js/views/pratique.js',
  './js/views/suivi.js',
  './js/views/reglages.js',
  './js/content/glossaire.js',
  './js/content/lezen.js',
  './js/content/pics.js',
  './js/content/vocab_plus.js',
  './js/core/plan.js',
  './js/core/game.js',
  './js/core/fx.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('inburgering-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Réseau d’abord (pour recevoir les mises à jour), copie locale si hors ligne.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))),
  );
});
