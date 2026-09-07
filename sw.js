/* Apps by Rishi Verma — offline service worker.
 * Cache-first: the whole app shell is precached, so it runs with no network.
 * Bump VERSION on every release so clients pick up new assets (see AGENTS.md). */
const VERSION = 'v1.1.0';
const CACHE = `apps-${VERSION}`;

const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-512-maskable.png",
  "apple-touch-icon.png",
  "tile-icons/adventures.png",
  "tile-icons/giraffy.png",
  "tile-icons/habits.png",
  "tile-icons/math.png",
  "tile-icons/mobility.png",
  "tile-icons/philosophy.png",
  "tile-icons/tabla.png",
  "previews/adventures.jpg",
  "previews/giraffy.jpg",
  "previews/habits.jpg",
  "previews/math.jpg",
  "previews/mobility.jpg",
  "previews/philosophy.jpg",
  "previews/tabla.jpg",
  "badges/android.svg",
  "badges/browser.svg",
  "badges/iphone.svg",
  "badges/license.svg",
  "badges/linux.svg",
  "badges/mac.svg",
  "badges/noads.svg",
  "badges/notracking.svg",
  "badges/opensource.svg",
  "badges/windows.svg",
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === self.location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
