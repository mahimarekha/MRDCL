const CACHE = 'mrdcl-portal-v100';
const TILE_CACHE = 'mrdcl-esri-tiles-v1';
const APP_SHELL = ['/', '/index.html', '/styles.css', '/map-shell.css', '/app.js', '/manifest.webmanifest', '/icon.svg'];
const OPTIONAL_SHELL = ['https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(async cache => { await cache.addAll(APP_SHELL); await Promise.all(OPTIONAL_SHELL.map(url => cache.add(url).catch(() => {}))); })));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('mrdcl-portal-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.hostname === 'server.arcgisonline.com') {
    event.respondWith(caches.open(TILE_CACHE).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try { const response = await fetch(event.request); if (response && (response.ok || response.type === 'opaque')) cache.put(event.request, response.clone()); return response; }
      catch { return new Response('', { status:503, statusText:'Offline map tile not cached' }); }
    }));
    return;
  }
  if (url.origin !== self.location.origin && url.origin !== 'https://unpkg.com') return;
  event.respondWith(fetch(event.request).catch(async () => (await caches.match(event.request, { ignoreSearch:true })) || Response.error()));
});
