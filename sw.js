// Service Worker — আমার অ্যাপস
const CACHE = 'amar-apps-v1';
const CACHE_FILES = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(CACHE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Firebase/API calls — সরাসরি নেটওয়ার্ক থেকে নাও, cache করো না
  if (e.request.url.includes('firebase') ||
      e.request.url.includes('firestore') ||
      e.request.url.includes('googleapis') ||
      e.request.url.includes('open-meteo')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // বাকি সব — cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
