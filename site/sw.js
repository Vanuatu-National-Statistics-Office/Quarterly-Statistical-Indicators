// Service worker: lets the installed app open offline with the data last seen.
// build.py replaces __VERSION__ on every build, so each data update gets a fresh cache.
const CACHE = 'vbos-dashboard-__VERSION__';
const SHELL = [
  './', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'data/dashboard.json', 'vendor/plotly.min.js',
  'assets/logo-mark.png', 'assets/logo-full.png',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/favicon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('vbos-dashboard-') && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Plotly is large and only changes with a new build: serve it from the cache.
  if (url.origin === location.origin && url.pathname.endsWith('/vendor/plotly.min.js')) {
    event.respondWith(caches.match(req).then(hit => hit || fetch(req)));
    return;
  }

  // Everything else: try the network first so new data shows straight away, fall back to the cache offline.
  event.respondWith(
    fetch(req)
      .then(res => {
        if (res.ok && (url.origin === location.origin || url.hostname.endsWith('gstatic.com') || url.hostname.endsWith('googleapis.com'))) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
